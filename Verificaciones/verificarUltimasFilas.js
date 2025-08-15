const XLSX = require('xlsx');
const config = require('../config');

function verificarUltimasFilas() {
    console.log('=== VERIFICACIÓN DE LAS ÚLTIMAS FILAS DEL EXCEL ===');
    
    const excelFilePath = config.pathExcel + config.nameExcelGastos;
    console.log('Archivo Excel:', excelFilePath);
    
    try {
        const workbook = XLSX.readFile(excelFilePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        let jsonData = XLSX.utils.sheet_to_json(sheet);
        
        console.log('Total filas leídas:', jsonData.length);
        
        // Verificar las últimas 5 filas
        console.log('\n🔍 ÚLTIMAS 5 FILAS DEL EXCEL:');
        const ultimasFilas = jsonData.slice(-5);
        
        ultimasFilas.forEach((row, index) => {
            const filaReal = jsonData.length - 5 + index + 1;
            console.log(`\nFila ${filaReal}:`);
            console.log('- Org.:', row['Org.']);
            console.log('- Pro.:', row['Pro.']);
            console.log('- Eco.:', row['Eco.']);
            console.log('- Descripción:', row['Descripción']);
            console.log('- Total gastado:', row['Total gastado']);
            
            // Verificar si es una fila de totales
            const esTotal = row['Descripción'] && (
                row['Descripción'].toLowerCase().includes('total') ||
                row['Descripción'].toLowerCase().includes('suma') ||
                !row['Org.'] || !row['Pro.'] || !row['Eco.']
            );
            
            console.log('- ¿Es fila de totales?', esTotal ? 'SÍ' : 'NO');
            
            if (row['Eco.'] === 78900) {
                console.log('🎯 ¡ESTA ES LA FILA DEL CÓDIGO 78900!');
            }
        });
        
        // Verificar la primera fila también
        console.log('\n🔍 PRIMERA FILA DEL EXCEL:');
        console.log('Fila 1:');
        console.log('- Org.:', jsonData[0]['Org.']);
        console.log('- Pro.:', jsonData[0]['Pro.']);
        console.log('- Eco.:', jsonData[0]['Eco.']);
        console.log('- Descripción:', jsonData[0]['Descripción']);
        
        const esEncabezado = !jsonData[0]['Org.'] && !jsonData[0]['Pro.'] && !jsonData[0]['Eco.'];
        console.log('- ¿Es fila de encabezados?', esEncabezado ? 'SÍ' : 'NO');
        
        console.log('\n📊 ANÁLISIS:');
        console.log('- Primera fila parece encabezado:', esEncabezado);
        console.log('- Última fila contiene código 78900:', jsonData[jsonData.length - 1]['Eco.'] === 78900);
        console.log('- ⚠️  PROBLEMA: gastos.js elimina la última fila, pero contiene datos válidos!');
        
    } catch (error) {
        console.error('❌ Error al analizar el archivo Excel:', error);
    }
}

verificarUltimasFilas();
