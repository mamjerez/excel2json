const XLSX = require('xlsx');
const fs = require('fs').promises; // Uso de fs.promises para operaciones asíncronas
const config = require('./config');

const pathExcel = config.pathExcel;
const pathApp = config.pathApp;
const nameExcel = config.nameExcelIngresos;
const excelFilePath = `${pathExcel}${nameExcel}`;
const pathDataJsonNecesarios = config.pathDataJsonNecesarios;
const year = config.year;

const ingresosEconomicaCapitulos = require(`${pathDataJsonNecesarios}ingresosEconomicaCapitulos.json`);
const ingresosEconomicaEconomicos = require(`${pathDataJsonNecesarios}ingresosEconomicaEconomicos.json`);
const ingresosEconomicaArticulos = require(`${pathDataJsonNecesarios}ingresosEconomicaArticulos.json`);
const ingresosEconomicaConceptos = require(`${pathDataJsonNecesarios}ingresosEconomicaConceptos.json`);

async function excelToJson(filePath) {
  const columnsToExclude = [
    '% de Realizacion del Presupuesto',
    '% Rec/Der',
  ];

  const keyMapping = {
    'Eco.': 'CodEco',
    'Descripción': 'DescripcionAyto',
    'Previsiones Iniciales': 'Iniciales',
    'Total Modificaciones': 'Modificaciones',
    'Previsiones totales': 'Definitivas',
    'Derechos Reconocidos Netos': 'DerechosReconocidosNetos',
    'Derechos Recaudados': 'DerechosReconocidos',
    'Devoluciones de ingreso': 'DerechosCancelados',
    'Recaudación Líquida': 'DerecaudacionNeta',
    'Derechos Pendientes de Cobro': 'DerechosPendienteCobro',
    'Estado de Ejecución': 'DiferenciaPrevision',
  };

  const workbook = XLSX.readFile(filePath);
  // Obtiene el nombre de la primera hoja
  const sheetName = workbook.SheetNames[0];
  // Obtiene la hoja de cálculo por su nombre
  const sheet = workbook.Sheets[sheetName];
  // Convierte la hoja de cálculo a JSON
  let jsonData = XLSX.utils.sheet_to_json(sheet);

  // Define los conjuntos para almacenar los elementos nuevos
  const newCapitulos = new Set();
  const newEconomicos = new Set();
  const newArticulos = new Set();
  const newConceptos = new Set();

  // Crea mapas para acceder rápidamente a las descripciones
  const capitulosMap = new Map(
    ingresosEconomicaCapitulos.map((item) => [item.codigo, item.descripcion])
  );
  const economicosMap = new Map(
    ingresosEconomicaEconomicos.map((item) => [item.codigo, item.descripcion])
  );
  const articulosMap = new Map(
    ingresosEconomicaArticulos.map((item) => [item.codigo, item.descripcion])
  );
  const conceptosMap = new Map(
    ingresosEconomicaConceptos.map((item) => [item.codigo, item.descripcion])
  );

  // Elimina las columnas excluidas y procesa cada fila
  jsonData = jsonData.map((row) => {
    columnsToExclude.forEach((column) => {
      delete row[column];
    });

    const newRow = {};
    Object.entries(row).forEach(([key, value]) => {
      // Renombra las columnas
      const newKey = keyMapping[key] || key;

      // Si el valor es una cadena numérica, lo convierte a número
      if (typeof value === 'string' && !isNaN(Number(value))) {
        value = Number(value);
      }

      // Quita decimales y redondea
      newRow[newKey] = typeof value === 'number' ? Math.round(value) : value;
    });

    if (newRow.hasOwnProperty('CodEco')) {
      const codEcoStr = newRow['CodEco'].toString();

      // Añade la nueva key "CodCap" y asigna la primera cifra del valor de "CodEco"
      newRow['CodCap'] = parseInt(codEcoStr.charAt(0), 10);

      // Añade la nueva key "CodArt" y asigna las 2 primeras cifras de "CodEco"
      newRow['CodArt'] = parseInt(codEcoStr.substring(0, 2), 10);

      // Añade la nueva key "CodCon" y asigna las 3 primeras cifras de "CodEco"
      newRow['CodCon'] = parseInt(codEcoStr.substring(0, 3), 10);

      const { CodCap, CodEco, CodArt, CodCon } = newRow;

      // Añade descripción de capítulos
      newRow['DesCap'] = capitulosMap.get(CodCap) || '';
      if (!newRow['DesCap']) newCapitulos.add(CodCap);

      // Añade descripción de económicos
      newRow['DesEco'] = economicosMap.get(CodEco) || '';
      if (!newRow['DesEco']) newEconomicos.add(CodEco);

      // Añade descripción de artículos
      newRow['DesArt'] = articulosMap.get(CodArt) || '';
      if (!newRow['DesArt']) newArticulos.add(CodArt);

      // Añade descripción de conceptos
      newRow['DesCon'] = conceptosMap.get(CodCon) || '';
      if (!newRow['DesCon']) newConceptos.add(CodCon);
    }

    return newRow;
  });

  // Función para escribir nuevos códigos encontrados
  async function writeNewCodes(fileName, codesSet, codeType) {
    if (codesSet.size > 0) {
      const codesArray = Array.from(codesSet);
      console.log(`${codeType} nuevos: `, codesArray);
      const filePath = `${pathExcel}${fileName}`;
      await fs.writeFile(filePath, JSON.stringify(codesArray, null, 2));
    }
  }

  await writeNewCodes('newCapitulosIngresos.json', newCapitulos, 'Capítulos');
  await writeNewCodes('newEconomicosIngresos.json', newEconomicos, 'Económicos');
  await writeNewCodes('newArticulosIngresos.json', newArticulos, 'Artículos');
  await writeNewCodes('newConceptosUnicos.json', newConceptos, 'Conceptos');

  // Remueve el primer objeto (títulos de las columnas) y el último objeto (totales)
  if (jsonData.length > 2) {
    jsonData = jsonData.slice(1, -1);
  } else {
    jsonData = [];
  }

  return jsonData;
}

async function writeJsonFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log('Archivo JSON generado exitosamente en ' + filePath);
  } catch (error) {
    console.error('Error durante la operación de archivo en ' + filePath + ': ', error);
  }
}

async function main() {
  const jsonData = await excelToJson(excelFilePath);

  // Guarda los datos en formato JSON en un nuevo archivo
  const pathExcelJson = `${pathExcel}${year}LiqIng.json`;
  const pathAppJson = `${pathApp}${year}LiqIng.json`;

  await writeJsonFile(pathExcelJson, jsonData);
  await writeJsonFile(pathAppJson, jsonData);
}

main()
  .then(() => {
    console.log('Ingresos terminado');
  })
  .catch((error) => {
    console.error('Error en el proceso: ', error);
  });
