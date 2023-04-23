const fs = require('fs');

// Leer y parsear los archivos JSON
const readJsonFile = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
};

const jsonFile = 'D:/secciones-censales/src/assets/data/secionesCensalesUpdateDiferencia.json'; // Reemplaza con el nombre del archivo que contiene el JSON

const jsonObject = readJsonFile(jsonFile);

// Actualizar el valor de 'backgroundColor' en el JSON
jsonObject.features.forEach((feature) => {
  if (parseInt(feature.properties.TOTAL) >= 1) {
    feature.properties.backgroundColor = 'tooltipGreen';
  } else {
    feature.properties.backgroundColor = 'tooltipRed';
  }
});

// Guardar el JSON actualizado en un nuevo archivo
const updatedJsonFile = 'D:/secciones-censales/src/assets/data/secionesCensalesUpdateDiferenciaUpdateColor.json'; // Reemplaza con el nombre del archivo donde deseas guardar el JSON actualizado
fs.writeFileSync(updatedJsonFile, JSON.stringify(jsonObject, null, 2), 'utf-8');

console.log(`Archivo actualizado guardado en ${updatedJsonFile}`);
