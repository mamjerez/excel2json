const { execSync } = require('child_process');
const config = require('../config');

function ejecutarTodosLosScripts() {
    console.log('=== DIAGNÓSTICO COMPLETO CÓDIGO 78900 ===');
    console.log('Iniciando diagnóstico completo...\n');
    
    const scripts = [
        {
            archivo: 'verificarConfiguracion.js',
            descripcion: '1. VERIFICACIÓN DE CONFIGURACIÓN'
        },
        {
            archivo: 'verificarExcel78900.js', 
            descripcion: '2. VERIFICACIÓN EXCEL ORIGINAL'
        },
        {
            archivo: 'verificarCodigosReferencia.js',
            descripcion: '3. VERIFICACIÓN CÓDIGOS DE REFERENCIA'
        },
        {
            archivo: 'analizarArchivosGenerados.js',
            descripcion: '4. ANÁLISIS ARCHIVOS GENERADOS'
        }
    ];
    
    scripts.forEach(script => {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`${script.descripcion}`);
        console.log(`${'='.repeat(80)}`);
        
        try {
            const resultado = execSync(`node ${script.archivo}`, { 
                encoding: 'utf8', 
                cwd: __dirname,
                timeout: 30000 // 30 segundos timeout
            });
            console.log(resultado);
        } catch (error) {
            console.error(`❌ Error ejecutando ${script.archivo}:`);
            console.error(error.message);
            if (error.stdout) {
                console.log('Salida parcial:', error.stdout);
            }
        }
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('5. RESUMEN Y RECOMENDACIONES');
    console.log('='.repeat(80));
    console.log('📋 POSIBLES CAUSAS:');
    console.log('1. El código 78900 no existe en el archivo Excel para la fecha configurada');
    console.log('2. El código 78900 ya existe en gastosEconomicaEconomicos.json (normal que no aparezca como nuevo)');
    console.log('3. Problema de formato en los datos (string vs number)');
    console.log('4. Error en la lógica de detección de códigos nuevos');
    console.log('5. Configuración incorrecta de fechas o rutas de archivos');
    
    console.log('\n🔧 SIGUIENTES PASOS:');
    console.log('1. Si 78900 NO está en Excel → Verificar fecha y archivo correcto');
    console.log('2. Si 78900 está en Excel Y en referencia → Comportamiento normal');
    console.log('3. Si 78900 está en Excel pero NO en referencia Y no aparece como nuevo → Revisar gastos.js');
    console.log('4. Ejecutar "node gastosConLogging.js" para ver el proceso de detección en tiempo real');
    
    console.log('\n✅ Diagnóstico completo finalizado');
}

ejecutarTodosLosScripts();
