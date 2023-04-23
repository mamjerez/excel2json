const fs = require('fs');

// Leer los archivos JSON
const jsonData1 = JSON.parse(fs.readFileSync('C:/Users/Usuario/OneDrive/OCM/Informes OCM/2023.04.19 Evolucion poblacion secciones censales/2022 INE-OCM.json', 'utf8'));
const jsonData2 = JSON.parse(fs.readFileSync('C:/Users/Usuario/OneDrive/OCM/Informes OCM/2023.04.19 Evolucion poblacion secciones censales/2019 INE-OCM.json', 'utf8'));

// Crear un objeto para almacenar las diferencias
const differences = [];

// Iterar a través del primer JSON
jsonData1.forEach((row1) => {
  // Buscar el objeto con la misma "seccionCensal" en el segundo JSON
  const row2 = jsonData2.find((row) => row.seccionCensal === row1.seccionCensal);

  // Si se encuentra el objeto en el segundo JSON, calcular la diferencia y almacenarla en un nuevo objeto
  if (row2) {
    const difference = {
      seccionCensal: row1.seccionCensal,
      diferencia: row1.Total - row2.Total,
    };

    // Añadir el objeto de diferencia al array "differences"
    differences.push(difference);
  }
});

// Guarda los datos en formato JSON en un nuevo archivo
fs.writeFileSync('C:/Users/Usuario/OneDrive/OCM/Informes OCM/2023.04.19 Evolucion poblacion secciones censales/diferencias2022-2019.json', JSON.stringify(differences, null, 2));

console.log('Archivo JSON de diferencias generado exitosamente');
