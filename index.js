// file1.js
const Common = require('./common');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

async function run() {
    const commonInstance = new Common();
    
    // Ejecuta el método run de la instancia de Common
    await commonInstance.run();

    // Después de que run termine, ejecuta file2.js
    try {
        const { stdout, stderr } = await execPromise('node file2.js');
        if (stderr) {
            console.error(`stderr en file2.js: ${stderr}`);
        }
        console.log(`stdout de file2.js: ${stdout}`);
    } catch (error) {
        console.error(`Error al ejecutar file2.js: ${error.message}`);
    }
}

run();
