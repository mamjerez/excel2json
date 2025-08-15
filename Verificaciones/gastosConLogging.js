const XLSX = require('xlsx');
const config = require('../config');
const fs = require('fs');

// Configuración de rutas desde config.js
const excelFilePath = config.pathExcel + config.nameExcelGastos;
const outputPath = config.pathOutputs + config.dateFolder + '/';

console.log('=== PROCESO GASTOS CON LOGGING DETALLADO ===');
console.log('Configuración:');
console.log('- Fecha:', config.dateFolder);
console.log('- Año:', config.year);
console.log('- Archivo Excel:', excelFilePath);
console.log('- Directorio salida:', outputPath);
console.log('- Ruta datos referencia:', config.pathDataJsonNecesarios);

// Crear directorio de salida si no existe
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

// Cargar archivos de referencia
console.log('\n📂 Cargando archivos de referencia...');

let gastosOrganicaOrganicos = [];
let gastosEconomicaEconomicos = [];
let gastosProgramaProgramas = [];

try {
    gastosOrganicaOrganicos = require(config.pathDataJsonNecesarios + 'gastosOrganicaOrganicos.json');
    console.log('✅ Orgánicos cargados:', gastosOrganicaOrganicos.length);
} catch (error) {
    console.log('❌ No se pudo cargar gastosOrganicaOrganicos.json:', error.message);
}

try {
    gastosEconomicaEconomicos = require(config.pathDataJsonNecesarios + 'gastosEconomicaEconomicos.json');
    console.log('✅ Económicos cargados:', gastosEconomicaEconomicos.length);
} catch (error) {
    console.log('❌ No se pudo cargar gastosEconomicaEconomicos.json:', error.message);
}

try {
    gastosProgramaProgramas = require(config.pathDataJsonNecesarios + 'gastosProgramaProgramas.json');
    console.log('✅ Programas cargados:', gastosProgramaProgramas.length);
} catch (error) {
    console.log('❌ No se pudo cargar gastosProgramaProgramas.json:', error.message);
}

// Leer Excel
console.log('\n📊 Leyendo archivo Excel...');
const workbook = XLSX.readFile(excelFilePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
let jsonData = XLSX.utils.sheet_to_json(sheet);

console.log('Total filas leídas:', jsonData.length);

// Arrays para nuevos elementos
const newOrganicos = [];
const newProgramas = [];
const newEconomicos = [];

console.log('\n🔍 Procesando filas...');
let filasProcesadas = 0;
let codigo78900Encontrado = false;

const processedData = jsonData.map((row, index) => {
  filasProcesadas++;
  
  if (filasProcesadas % 1000 === 0) {
    console.log(`Procesadas ${filasProcesadas} filas...`);
  }
  
  const newRow = {
    'CodOrg': parseInt(row['Org.']),
    'CodPro': parseInt(row['Pro.']),
    'CodEco': parseInt(row['Eco.']),
    'Importe': parseFloat(row['Importe']),
    'Año': config.year
  };

  // LOGGING ESPECÍFICO PARA CÓDIGO 78900
  if (newRow['CodEco'] === 78900) {
    codigo78900Encontrado = true;
    console.log(`\n🎯 CÓDIGO 78900 ENCONTRADO EN FILA ${index + 1}:`);
    console.log('  - Datos originales del Excel:');
    console.log('    * Org.:', row['Org.']);
    console.log('    * Pro.:', row['Pro.']);
    console.log('    * Eco.:', row['Eco.'], '(tipo:', typeof row['Eco.'], ')');
    console.log('    * Descripción:', row['Descripción']);
    console.log('    * Importe:', row['Importe']);
    
    console.log('  - Datos procesados:');
    console.log('    * CodOrg:', newRow['CodOrg']);
    console.log('    * CodPro:', newRow['CodPro']);
    console.log('    * CodEco:', newRow['CodEco'], '(tipo:', typeof newRow['CodEco'], ')');
    console.log('    * Importe:', newRow['Importe']);
  }

  // Solo procesar filas válidas
  if (!isNaN(newRow['CodOrg']) && !isNaN(newRow['CodPro']) && !isNaN(newRow['CodEco']) && !isNaN(newRow['Importe'])) {
    
    // Buscar orgánico
    const organico = gastosOrganicaOrganicos.find((org) => org.CodOrg === newRow['CodOrg']);
    if (organico) {
      newRow['DesOrg'] = organico.DesOrg;
    } else {
      newRow['DesOrg'] = row['Descripción'];
      newOrganicos.push({ CodOrg: newRow['CodOrg'], DesOrg: row['Descripción'] });
      
      if (newRow['CodEco'] === 78900) {
        console.log('    * Orgánico NO encontrado en referencia - se añadirá como nuevo');
      }
    }

    // Buscar programa
    const programa = gastosProgramaProgramas.find((pro) => pro.CodPro === newRow['CodPro']);
    if (programa) {
      newRow['DesPro'] = programa.DesPro;
    } else {
      newRow['DesPro'] = row['Descripción'];
      newProgramas.push({ CodPro: newRow['CodPro'], DesPro: row['Descripción'] });
      
      if (newRow['CodEco'] === 78900) {
        console.log('    * Programa NO encontrado en referencia - se añadirá como nuevo');
      }
    }

    // Buscar económico (PARTE CRÍTICA PARA 78900)
    const economico = gastosEconomicaEconomicos.find((eco) => eco.CodEco === newRow['CodEco']);
    
    if (newRow['CodEco'] === 78900) {
      console.log('  - Búsqueda en códigos económicos de referencia:');
      console.log('    * Buscando CodEco:', newRow['CodEco']);
      console.log('    * Económico encontrado:', economico ? 'SÍ' : 'NO');
      if (economico) {
        console.log('    * Descripción del económico:', economico.DesEco);
      }
    }
    
    if (economico) {
      newRow['DesEco'] = economico.DesEco;
      
      if (newRow['CodEco'] === 78900) {
        console.log('    * ❌ NO se añadirá a nuevos económicos (ya existe en referencia)');
      }
    } else {
      newRow['DesEco'] = row['Descripción'];
      newEconomicos.push({ CodEco: newRow['CodEco'], DesEco: row['Descripción'] });
      
      if (newRow['CodEco'] === 78900) {
        console.log('    * ✅ SE AÑADIRÁ a nuevos económicos');
        console.log('    * Descripción que se usará:', row['Descripción']);
      }
    }
  }

  return newRow;
});

console.log(`\n📈 Procesamiento completado:`);
console.log(`- Filas procesadas: ${filasProcesadas}`);
console.log(`- Filas válidas: ${processedData.length}`);
console.log(`- Código 78900 encontrado: ${codigo78900Encontrado ? 'SÍ' : 'NO'}`);

console.log(`\n📊 Nuevos elementos detectados:`);
console.log(`- Nuevos orgánicos: ${newOrganicos.length}`);
console.log(`- Nuevos programas: ${newProgramas.length}`);
console.log(`- Nuevos económicos: ${newEconomicos.length}`);

if (newEconomicos.length > 0) {
  console.log('\n💰 NUEVOS CÓDIGOS ECONÓMICOS DETECTADOS:');
  newEconomicos.forEach((eco, index) => {
    const esEl78900 = eco.CodEco === 78900;
    console.log(`${index + 1}. CodEco: ${eco.CodEco}${esEl78900 ? ' ⭐ (ESTE ES EL 78900!)' : ''}, DesEco: ${eco.DesEco}`);
  });
}

// Guardar archivos
console.log('\n💾 Guardando archivos...');

fs.writeFileSync(outputPath + 'gastosFromExcelToJSON.json', JSON.stringify(processedData, null, 2));
console.log('✅ gastosFromExcelToJSON.json guardado');

if (newOrganicos.length > 0) {
  fs.writeFileSync(outputPath + 'newOrganicosGastos.json', JSON.stringify(newOrganicos, null, 2));
  console.log('✅ newOrganicosGastos.json guardado');
}

if (newProgramas.length > 0) {
  fs.writeFileSync(outputPath + 'newProgramasGastos.json', JSON.stringify(newProgramas, null, 2));
  console.log('✅ newProgramasGastos.json guardado');
}

if (newEconomicos.length > 0) {
  fs.writeFileSync(outputPath + 'newEconomicosGastos.json', JSON.stringify(newEconomicos, null, 2));
  console.log('✅ newEconomicosGastos.json guardado');
}

console.log('\n🎯 RESULTADO ESPECÍFICO PARA CÓDIGO 78900:');
if (codigo78900Encontrado) {
  const esta78900EnNuevos = newEconomicos.some(eco => eco.CodEco === 78900);
  if (esta78900EnNuevos) {
    console.log('✅ El código 78900 FUE DETECTADO y añadido a nuevos económicos');
  } else {
    console.log('❌ El código 78900 fue encontrado en Excel pero NO se añadió a nuevos económicos');
    console.log('   (Probablemente ya existe en el archivo de referencia)');
  }
} else {
  console.log('❌ El código 78900 NO fue encontrado en el archivo Excel');
  console.log('   Verifica que el archivo y la fecha sean correctos');
}

console.log('\n✅ Proceso completado con logging detallado');
