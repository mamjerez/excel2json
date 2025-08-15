// const fs = require('fs');

// const file = 'ingresosEconomicaEconomicos';
// const pathDataJson = 'D:/presupuestos/src/assets/data/';
// const pathFileSource = pathDataJson + file + '.json';
// const pathFileEnd = pathDataJson +  file + 'NEW.json';
// const fileSource = require(pathFileSource);

// newJson = fileSource.map((row) => {
//     row.Observaciones = ''; 
//     return row;
// });

// fs.writeFileSync(pathFileEnd, JSON.stringify(newJson, null, 2));
// console.log('Archivo JSON generado exitosamente en ' + pathFileEnd);


const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const fileName = 'ingresosEconomicaEconomicos';
const directoryPath = 'D:/presupuestos/src/assets/data/';
const sourceFilePath = path.join(directoryPath, `${fileName}.json`);
const targetFilePath = path.join(directoryPath, `${fileName}NEW.json`);

// Comprobar si targetFilePath ya existe
if (fs.existsSync(targetFilePath)) {
    console.error(chalk.bgRed(`El archivo ${targetFilePath} ya existe.`));
    return; // Termina la ejecución del script si el archivo ya existe
}

// Intentar leer el archivo
let fileContent;
try {
    fileContent = fs.readFileSync(sourceFilePath, 'utf8');
} catch (readError) {
    console.error(chalk.bgRed(`Error al leer el archivo desde ${sourceFilePath}:`, readError));
    return;
}

const fileSource = JSON.parse(fileContent);

const newJson = fileSource.map(row => {
    row.Observaciones = '';
    return row;
});

// Intentar escribir el archivo
try {
    fs.writeFileSync(targetFilePath, JSON.stringify(newJson, null, 2));
    console.log(chalk.bgGreen.bold(`Archivo JSON generado exitosamente en ${targetFilePath}`));
} catch (writeError) {
    console.error(chalk.bgRed(`Error al escribir el archivo en ${targetFilePath}:`, writeError));
}
