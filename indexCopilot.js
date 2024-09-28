const { execFile } = require('child_process');

function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    execFile('node', [scriptName], (error, stdout, stderr) => {
      if (stdout) {
        console.log(`stdout de ${scriptName}: ${stdout}`);
      }
      if (stderr) {
        console.error(`stderr en ${scriptName}: ${stderr}`);
      }
      if (error) {
        reject(new Error(`Error durante la ejecución de ${scriptName}: ${error.message}`));
      } else {
        resolve();
      }
    });
  });
}

async function runFiles() {
  const scripts = ['ingresos.js', 'gastos.js', 'gastosFromJSON.js'];
  for (const script of scripts) {
    try {
      await runScript(script);
    } catch (error) {
      console.error(error.message);
      break;
    }
  }
}

runFiles();