const fs = require('fs');

// // Leer y parsear los archivos JSON
const readJsonFile = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
};

const firstJsonFile = 'D:/secciones-censales/src/assets/data/secionesCensalesUpdateCenso2004-2022.json'; // Reemplaza con el nombre del archivo que contiene el primer JSON
const secondJsonFile = 'C:/Users/Usuario/OneDrive/OCM/Informes OCM/2023.04.19 Evolucion poblacion secciones censales/2022 INE-OCM-ID.json'; // Reemplaza con el nombre del archivo que contiene el segundo JSON

const firstJson = readJsonFile(firstJsonFile);
const secondJson = readJsonFile(secondJsonFile);

// Actualizar el valor de 'TOTAL' en el primer JSON
firstJson.features.forEach((feature) => {
  const id = feature.properties.ID;
  const match = secondJson.find((item) => item.ID === id);
  console.log(id,match)

  if (match) {
    feature.properties.censo2022= match.Total.toString();
  }
});

// Guardar el JSON actualizado en un nuevo archivo
const updatedJsonFile = 'D:/secciones-censales/src/assets/data/secionesCensalesUpdateCenso2004-2022.json'; // Reemplaza con el nombre del archivo donde deseas guardar el JSON actualizado
fs.writeFileSync(updatedJsonFile, JSON.stringify(firstJson, null, 2), 'utf-8');

console.log(`Archivo actualizado guardado en ${updatedJsonFile}`);
