const { log } = require('console');
const fs = require('fs');

// Leer el archivo JSON inicial
fs.readFile('C:/Users/Usuario/OneDrive/OCM/Informes OCM/2023.04.19 Evolucion poblacion secciones censales/diferencias2022-2019.json', 'utf8', (err, jsonString) => {
  if (err) {
    console.log("Error al leer el archivo:", err);
    return;
  }

  // Parsear el contenido del archivo
  const data = JSON.parse(jsonString);

  // Añadir la propiedad "ID" a cada objeto del array
  data.forEach(item => {
    console.log(item.seccionCensal);
    const seccionCensalString = item.seccionCensal.toString();
    const firstPart = seccionCensalString.slice(5, 7);
    const secondPart = "-";
    const thirdPart = seccionCensalString.slice(7, 10);

    item.ID = firstPart + secondPart + thirdPart;
  });

  // Convertir el objeto modificado a JSON
  const updatedJsonString = JSON.stringify(data, null, 2);
  console.log(updatedJsonString)

  // Guardar el resultado en un nuevo archivo JSON
  fs.writeFile('C:/Users/Usuario/OneDrive/OCM/Informes OCM/2023.04.19 Evolucion poblacion secciones censales/diferencias2022-2019ID.json', updatedJsonString, (err) => {
    if (err) {
      console.log("Error al guardar el archivo:", err);
      return;
    }
    console.log("Archivo guardado exitosamente.");
  });
});
