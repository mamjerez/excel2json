const config = require('../config');
const fs = require('fs');

function analizarArchivosGenerados() {
    console.log('=== ANÁLISIS ARCHIVOS GENERADOS ===');
    console.log('Configuración:');
    console.log('- Fecha:', config.dateFolder);
    console.log('- Ruta salida:', config.pathOutputs);
    
    const outputPath = config.pathOutputs + config.dateFolder + '/';
    console.log('- Directorio completo salida:', outputPath);
    
    // Verificar archivo de nuevos económicos
    const rutaNuevosEconomicos = outputPath + 'newEconomicosGastos.json';
    
    try {
        if (fs.existsSync(rutaNuevosEconomicos)) {
            console.log('✅ Archivo newEconomicosGastos.json encontrado');
            const nuevosEconomicos = JSON.parse(fs.readFileSync(rutaNuevosEconomicos, 'utf8'));
            
            console.log('Total códigos económicos nuevos detectados:', nuevosEconomicos.length);
            
            // Buscar el código 78900
            const codigo78900 = nuevosEconomicos.find(eco => eco.CodEco === 78900 || eco.CodEco === '78900');
            
            if (codigo78900) {
                console.log('✅ Código 78900 ENCONTRADO en nuevos económicos:');
                console.log(codigo78900);
            } else {
                console.log('❌ Código 78900 NO encontrado en nuevos económicos');
                
                // Mostrar todos los códigos nuevos para comparar
                console.log('Códigos nuevos detectados:');
                nuevosEconomicos.forEach((eco, index) => {
                    console.log(`${index + 1}. CodEco: ${eco.CodEco}, DesEco: ${eco.DesEco}`);
                });
                
                // Buscar códigos cercanos a 78900
                const codigosCercanos = nuevosEconomicos.filter(eco => {
                    const codigo = parseInt(eco.CodEco);
                    return codigo >= 78800 && codigo <= 79000;
                });
                
                if (codigosCercanos.length > 0) {
                    console.log('Códigos nuevos cercanos a 78900 (78800-79000):');
                    codigosCercanos.forEach(eco => {
                        console.log(`- CodEco: ${eco.CodEco}, DesEco: ${eco.DesEco}`);
                    });
                }
            }
            
        } else {
            console.log('❌ Archivo newEconomicosGastos.json NO encontrado en:', rutaNuevosEconomicos);
            console.log('Esto indica que no se ha ejecutado el proceso de gastos o hay un error en la ruta');
        }
        
    } catch (error) {
        console.error('Error al leer archivo de nuevos económicos:', error);
    }
    
    // Verificar archivo principal de gastos generado
    const rutaGastosJson = outputPath + 'gastosFromExcelToJSON.json';
    
    try {
        if (fs.existsSync(rutaGastosJson)) {
            console.log('\n✅ Archivo gastosFromExcelToJSON.json encontrado');
            const gastosJson = JSON.parse(fs.readFileSync(rutaGastosJson, 'utf8'));
            
            console.log('Total registros en gastos JSON:', gastosJson.length);
            
            // Buscar registros con código 78900
            const registros78900 = gastosJson.filter(gasto => gasto.CodEco === 78900 || gasto.CodEco === '78900');
            
            if (registros78900.length > 0) {
                console.log(`✅ Encontrados ${registros78900.length} registros con código 78900 en el JSON final`);
                console.log('Primer registro con 78900:');
                console.log(registros78900[0]);
            } else {
                console.log('❌ NO se encontraron registros con código 78900 en el JSON final');
            }
            
        } else {
            console.log('\n❌ Archivo gastosFromExcelToJSON.json NO encontrado en:', rutaGastosJson);
        }
        
    } catch (error) {
        console.error('Error al leer archivo de gastos JSON:', error);
    }
}

analizarArchivosGenerados();
