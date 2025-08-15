const XLSX = require('xlsx');
const config = require('../config');

function verificarCodigo78900() {
    console.log('=== VERIFICACIÓN CÓDIGO 78900 ===');
    console.log('Configuración:');
    console.log('- Fecha:', config.dateFolder);
    console.log('- Año:', config.year);
    console.log('- Ruta Excel:', config.pathExcel);
    console.log('- Nombre archivo:', config.nameExcelGastos);
    
    const excelFilePath = config.pathExcel + config.nameExcelGastos;
    console.log('- Archivo completo:', excelFilePath);
    
    try {
        const excelFilePath = config.pathExcel + config.nameExcelGastos;
        const workbook = XLSX.readFile(excelFilePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        let jsonData = XLSX.utils.sheet_to_json(sheet);
        
        console.log('Total filas en Excel:', jsonData.length);
        
        // Buscar específicamente el código 78900
        const filas78900 = jsonData.filter(row => {
            const eco = row['Eco.'];
            return eco === 78900 || eco === '78900' || eco === '078900';
        });
        
        console.log('Filas con código 78900 encontradas:', filas78900.length);
        
        if (filas78900.length > 0) {
            console.log('DETALLES de filas con 78900:');
            filas78900.forEach((row, index) => {
                console.log(`Fila ${index + 1}:`, {
                    'Eco.': row['Eco.'],
                    'Descripción': row['Descripción'],
                    'Org.': row['Org.'],
                    'Pro.': row['Pro.']
                });
            });
        } else {
            console.log('❌ NO se encontró el código 78900 en el Excel');
            
            // Mostrar algunos códigos cercanos para comparar
            const codigosCercanos = jsonData
                .filter(row => {
                    const eco = parseInt(row['Eco.']);
                    return eco >= 78800 && eco <= 79000 && !isNaN(eco);
                })
                .map(row => ({
                    'Eco.': row['Eco.'],
                    'Descripción': row['Descripción']
                }))
                .slice(0, 10); // Limitar a 10 resultados
            
            console.log('Códigos cercanos encontrados (78800-79000):', codigosCercanos);
        }
        
        // Verificar si hay valores nulos o problemáticos
        const filasProblematicas = jsonData.filter(row => {
            const eco = row['Eco.'];
            return eco === null || eco === undefined || eco === '';
        });
        
        console.log('Filas con códigos económicos problemáticos:', filasProblematicas.length);
        
        // Mostrar todos los códigos que empiecen por 789
        const codigos789 = jsonData
            .filter(row => {
                const eco = row['Eco.'];
                return eco && eco.toString().startsWith('789');
            })
            .map(row => ({
                'Eco.': row['Eco.'],
                'Descripción': row['Descripción']
            }));
        
        console.log('Códigos que empiezan por 789:', codigos789);
        
    } catch (error) {
        console.error('Error al leer el archivo Excel:', error);
        console.log('Verifica que el archivo existe en:', excelFilePath);
    }
}

verificarCodigo78900();
