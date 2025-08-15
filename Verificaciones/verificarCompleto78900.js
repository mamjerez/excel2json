const { execSync } = require('child_process');
const config = require('../config');

function ejecutarVerificacion(archivo, descripcion) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`${descripcion}`);
    console.log(`${'='.repeat(60)}`);
    
    try {
        const resultado = execSync(`node ${archivo}`, { encoding: 'utf8', cwd: __dirname });
        console.log(resultado);
    } catch (error) {
        console.error(`Error ejecutando ${archivo}:`, error.message);
    }
}

function verificacionCompleta() {
    console.log('=== VERIFICACIÓN COMPLETA CÓDIGO 78900 ===');
    console.log('Fecha configurada:', config.dateFolder);
    console.log('Año:', config.year);
    console.log('Archivo Excel gastos:', config.nameExcelGastos);
    
    // Ejecutar todas las verificaciones
    ejecutarVerificacion('verificarExcel78900.js', '1. VERIFICANDO EXCEL ORIGINAL');
    ejecutarVerificacion('verificarCodigosReferencia.js', '2. VERIFICANDO CÓDIGOS DE REFERENCIA');
    
    console.log('\n' + '='.repeat(60));
    console.log('3. INTERPRETACIÓN DE RESULTADOS');
    console.log('='.repeat(60));
    console.log('✅ Si 78900 está en Excel Y NO está en referencia → Debería aparecer como nuevo');
    console.log('❌ Si 78900 está en Excel Y SÍ está en referencia → Normal que no aparezca como nuevo');
    console.log('❌ Si 78900 NO está en Excel → Verificar fecha/archivo correcto');
    console.log('🔧 Si 78900 está en Excel pero no se detecta → Problema en lógica de detección');
}

verificacionCompleta();
