const fs = require('fs');

// Leer el archivo JSON inicial
fs.readFile('D:/secciones-censales/src/assets/data/secionesCensales.json', 'utf8', (err, jsonString) => {
  if (err) {
    console.log("Error al leer el archivo:", err);
    return;
  }

  // Parsear el contenido del archivo
  const data = JSON.parse(jsonString);

  // Añadir las propiedades "long", "lat" y "backgroundColor" a cada objeto del array "features"
  data.features.forEach(feature => {
    if (!feature.properties.hasOwnProperty("long")) {
      feature.properties.long = feature.geometry.coordinates[0][0][0];
    }
    if (!feature.properties.hasOwnProperty("lat")) {
      feature.properties.lat = feature.geometry.coordinates[0][0][1];
    }
    if (!feature.properties.hasOwnProperty("backgroundColor")) {
      feature.properties.backgroundColor = "tooltipGreen";
    }
  });

  // Convertir el objeto modificado a JSON
  const updatedJsonString = JSON.stringify(data, null, 2);

  // Guardar el resultado en un nuevo archivo JSON
  fs.writeFile('D:/secciones-censales/src/assets/data/seccionesCensalesADD.json', updatedJsonString, (err) => {
    if (err) {
      console.log("Error al guardar el archivo:", err);
      return;
    }
    console.log("Archivo guardado exitosamente.");
  });
});
