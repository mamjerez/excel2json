const XLSX = require('xlsx');
const config = require('../config');

function analizarImporteExcel() {
    console.log('=== ANÁLISIS DETALLADO DEL IMPORTE EN EXCEL ===');
    
    const excelFilePath = config.pathExcel + config.nameExcelGastos;
    console.log('Archivo Excel:', excelFilePath);
    
    try {
        const workbook = XLSX.readFile(excelFilePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Obtener el rango de datos
        console.log('\n📊 Información del archivo Excel:');
        console.log('- Nombre de la hoja:', sheetName);
        console.log('- Rango de datos:', sheet['!ref']);
        
        // Convertir a JSON con diferentes opciones
        let jsonData = XLSX.utils.sheet_to_json(sheet);
        console.log('- Total filas:', jsonData.length);
        
        // Analizar las primeras filas para entender la estructura
        console.log('\n🔍 ESTRUCTURA DE LAS PRIMERAS 3 FILAS:');
        for (let i = 0; i < Math.min(3, jsonData.length); i++) {
            console.log(`\nFila ${i + 1}:`);
            console.log('- Org.:', jsonData[i]['Org.'], '(tipo:', typeof jsonData[i]['Org.'], ')');
            console.log('- Pro.:', jsonData[i]['Pro.'], '(tipo:', typeof jsonData[i]['Pro.'], ')');
            console.log('- Eco.:', jsonData[i]['Eco.'], '(tipo:', typeof jsonData[i]['Eco.'], ')');
            console.log('- Importe:', jsonData[i]['Importe'], '(tipo:', typeof jsonData[i]['Importe'], ')');
            console.log('- Descripción:', jsonData[i]['Descripción']);
            
            // Mostrar todas las columnas disponibles
            console.log('- Todas las columnas:', Object.keys(jsonData[i]));
        }
        
        // Buscar específicamente la fila con código 78900
        console.log('\n🎯 BÚSQUEDA ESPECÍFICA DEL CÓDIGO 78900:');
        const fila78900 = jsonData.find((row, index) => {
            const eco = row['Eco.'];
            if (eco === 78900 || eco === '78900' || eco === '078900') {
                console.log(`\nEncontrado en fila ${index + 1}:`);
                console.log('DATOS COMPLETOS DE LA FILA:');
                Object.keys(row).forEach(key => {
                    console.log(`  ${key}: ${row[key]} (tipo: ${typeof row[key]})`);
                });
                return true;
            }
            return false;
        });
        
        if (!fila78900) {
            console.log('❌ No se encontró la fila con código 78900');
        }
        
        // Analizar patrones de importes problemáticos
        console.log('\n📈 ANÁLISIS DE IMPORTES:');
        const importesUndefined = jsonData.filter(row => row['Importe'] === undefined);
        const importesNull = jsonData.filter(row => row['Importe'] === null);
        const importesVacio = jsonData.filter(row => row['Importe'] === '');
        const importesNaN = jsonData.filter(row => isNaN(row['Importe']) && row['Importe'] !== undefined && row['Importe'] !== null && row['Importe'] !== '');
        const importesValidos = jsonData.filter(row => !isNaN(parseFloat(row['Importe'])) && isFinite(row['Importe']));
        
        console.log(`- Importes undefined: ${importesUndefined.length}`);
        console.log(`- Importes null: ${importesNull.length}`);
        console.log(`- Importes vacíos (''): ${importesVacio.length}`);
        console.log(`- Importes NaN: ${importesNaN.length}`);
        console.log(`- Importes válidos: ${importesValidos.length}`);
        console.log(`- Total filas: ${jsonData.length}`);
        
        // Mostrar algunas filas con importes problemáticos para análisis
        if (importesUndefined.length > 0) {
            console.log('\n⚠️  EJEMPLOS DE FILAS CON IMPORTE UNDEFINED:');
            importesUndefined.slice(0, 3).forEach((row, index) => {
                console.log(`\nEjemplo ${index + 1}:`);
                console.log('- Org.:', row['Org.']);
                console.log('- Pro.:', row['Pro.']);
                console.log('- Eco.:', row['Eco.']);
                console.log('- Importe:', row['Importe'], '(tipo:', typeof row['Importe'], ')');
                console.log('- Descripción:', row['Descripción']);
                console.log('- Todas las columnas:', Object.keys(row));
            });
        }
        
        // Verificar si existe una columna de importe con nombre diferente
        console.log('\n🔍 VERIFICACIÓN DE NOMBRES DE COLUMNAS:');
        if (jsonData.length > 0) {
            const primeraFila = jsonData[0];
            const columnasConImporte = Object.keys(primeraFila).filter(key => 
                key.toLowerCase().includes('import') || 
                key.toLowerCase().includes('amount') ||
                key.toLowerCase().includes('valor') ||
                key.toLowerCase().includes('cantidad')
            );
            console.log('Columnas que podrían contener importes:', columnasConImporte);
            
            // Mostrar todas las columnas para verificar
            console.log('Todas las columnas en el Excel:', Object.keys(primeraFila));
        }
        
        // Analizar directamente las celdas del Excel para la fila 78900
        console.log('\n🔬 ANÁLISIS DIRECTO DE CELDAS EXCEL:');
        
        // Buscar la fila en el Excel original
        const range = XLSX.utils.decode_range(sheet['!ref']);
        console.log('Rango completo:', range);
        
        // Buscar en qué fila está el código 78900 en el Excel
        for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
            const cellEco = sheet[XLSX.utils.encode_cell({r: rowNum, c: 2})]; // Columna C (Eco.)
            if (cellEco && (cellEco.v === 78900 || cellEco.v === '78900')) {
                console.log(`\n🎯 Código 78900 encontrado en fila Excel ${rowNum + 1}:`);
                
                // Analizar todas las celdas de esta fila
                for (let col = range.s.c; col <= range.e.c; col++) {
                    const cellAddr = XLSX.utils.encode_cell({r: rowNum, c: col});
                    const cell = sheet[cellAddr];
                    if (cell) {
                        console.log(`  Celda ${cellAddr}: valor="${cell.v}" tipo="${cell.t}" formula="${cell.f || 'N/A'}"`);
                    } else {
                        console.log(`  Celda ${cellAddr}: [VACÍA]`);
                    }
                }
                break;
            }
        }
        
    } catch (error) {
        console.error('❌ Error al analizar el archivo Excel:', error);
    }
}

analizarImporteExcel();
