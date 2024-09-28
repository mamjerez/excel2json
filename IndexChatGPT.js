const { execFile } = require('child_process');
const util = require('util');
const execFilePromise = util.promisify(execFile); // Promisify para un código más limpio

async function runScript(scriptName) {
  console.log(`====   Iniciando ejecución de ${scriptName}  ====`);
  const start = Date.now(); // Inicio del tiempo de ejecución
  try {
    const { stdout, stderr } = await execFilePromise('node', [scriptName]);
   
    if (stdout) console.log(`${scriptName}: ${stdout}`);
    if (stderr) console.error(`stderr en ${scriptName}: ${stderr}`);
    
    const end = Date.now();
    console.log(`====   Finalizado ${scriptName} en ${(end - start) / 1000}s  ====\n`);
  } catch (error) {
    throw new Error(`Error durante la ejecución de ${scriptName}: ${error.message}`);
  }
}

async function runFiles() {
  const scripts = ['ingresos.js', 'gastos.js', 'gastosFromJSON.js'];

  
  for (const script of scripts) {
    try {
      await runScript(script); // Ejecuta el script en orden
    } catch (error) {
      console.error(`Error detectado: ${error.message}`);
      break; // Detiene la ejecución si un script falla
    }
  }
}

runFiles();
