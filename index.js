const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

async function runFiles() {
  try {
    // Ejecuta ingresos.js
    const { stdout: stdout1, stderr: stderr1 } = await execPromise('node ingresos.js');
    if (stderr1) {
      console.error(`stderr en ingresos.js: ${stderr1}`);
    }
    console.log(`stdout de ingresos.js: ${stdout1}`);

    // Después de que ingresos.js termine, ejecuta gastos.js
    const { stdout: stdout2, stderr: stderr2 } = await execPromise('node gastos.js');
    if (stderr2) {
      console.error(`stderr en gastos.js: ${stderr2}`);
    }
    console.log(`stdout de gastos.js: ${stdout2}`);

     // Después de que gastos.js termine, ejecuta gastosFromJSON.js
     const { stdout: stdout3, stderr: stderr3 } = await execPromise('node gastosFromJSON.js');
     if (stderr3) {
       console.error(`stderr en gastosFromJSON.js: ${stderr3}`);
     }
     console.log(`stdout de gastosFromJSON.js: ${stdout3}`)
  } catch (error) {
    console.error(`Error durante la ejecución de los archivos: ${error.message}`);
  }
}

runFiles();
