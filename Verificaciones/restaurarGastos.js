const config = require('../config');
const fs = require('fs');

function restaurarGastosOriginal() {
    console.log('=== RESTAURANDO ARCHIVO GASTOS.JS ORIGINAL ===');
    
    try {
        if (fs.existsSync('gastos.js.backup')) {
            const backupContent = fs.readFileSync('gastos.js.backup', 'utf8');
            fs.writeFileSync('gastos.js', backupContent);
            console.log('✅ Archivo gastos.js restaurado desde backup');
            
            // Opcional: eliminar el backup
            // fs.unlinkSync('gastos.js.backup');
            // console.log('✅ Archivo backup eliminado');
        } else {
            console.log('❌ No se encontró el archivo backup gastos.js.backup');
            console.log('   El archivo gastos.js no ha sido modificado o ya fue restaurado');
        }
    } catch (error) {
        console.error('❌ Error al restaurar archivo:', error);
    }
}

restaurarGastosOriginal();
