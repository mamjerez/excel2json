const config = require('../config');

function verificarConfiguracion() {
    console.log('=== VERIFICACIÓN CONFIGURACIÓN ===');
    
    console.log('Configuración actual:');
    console.log('- dateFolder:', config.dateFolder);
    console.log('- year:', config.year);
    console.log('- pathExcel:', config.pathExcel);
    console.log('- nameExcelGastos:', config.nameExcelGastos);
    console.log('- pathOutputs:', config.pathOutputs);
    console.log('- pathDataJsonNecesarios:', config.pathDataJsonNecesarios);
    
    console.log('\nRutas completas:');
    console.log('- Excel gastos:', config.pathExcel + config.nameExcelGastos);
    console.log('- Salida JSON:', config.pathOutputs + config.dateFolder + '/');
    console.log('- Códigos referencia:', config.pathDataJsonNecesarios + 'gastosEconomicaEconomicos.json');
    
    // Verificar existencia de archivos
    const fs = require('fs');
    
    console.log('\nVerificación existencia archivos:');
    
    const rutaExcel = config.pathExcel + config.nameExcelGastos;
    if (fs.existsSync(rutaExcel)) {
        console.log('✅ Excel gastos existe');
        const stats = fs.statSync(rutaExcel);
        console.log('  - Tamaño:', Math.round(stats.size / 1024), 'KB');
        console.log('  - Modificado:', stats.mtime.toLocaleString());
    } else {
        console.log('❌ Excel gastos NO existe:', rutaExcel);
    }
    
    const rutaReferencia = config.pathDataJsonNecesarios + 'gastosEconomicaEconomicos.json';
    if (fs.existsSync(rutaReferencia)) {
        console.log('✅ Archivo de referencia existe');
        const referencia = JSON.parse(fs.readFileSync(rutaReferencia, 'utf8'));
        console.log('  - Total códigos:', referencia.length);
    } else {
        console.log('❌ Archivo de referencia NO existe:', rutaReferencia);
    }
    
    const rutaSalida = config.pathOutputs + config.dateFolder;
    if (fs.existsSync(rutaSalida)) {
        console.log('✅ Directorio de salida existe');
        const archivos = fs.readdirSync(rutaSalida);
        console.log('  - Archivos en directorio:', archivos);
    } else {
        console.log('❌ Directorio de salida NO existe:', rutaSalida);
    }
}

verificarConfiguracion();
