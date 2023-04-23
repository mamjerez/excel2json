const fs = require('fs');

function updateTotal(geoJson) {
  geoJson.features.forEach((feature) => {
    const censo2022 = parseInt(feature.properties.censo2022, 10);
    const censo2004 = parseInt(feature.properties.censo2004, 10);
    feature.properties.TOTAL = (censo2022 - censo2004).toString();
  });
  return geoJson;
}

// Leer el archivo GeoJSON
fs.readFile('D:/secciones-censales/src/assets/data/secionesCensalesUpdateCenso2004-2022.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error al leer el archivo:', err);
    return;
  }

  // Parsear el contenido del archivo como JSON
  const geoJson = JSON.parse(data);

  // Actualizar el valor de la propiedad "TOTAL"
  const updatedGeoJson = updateTotal(geoJson);

  // Guardar el GeoJSON actualizado en un nuevo archivo
  fs.writeFile('D:/secciones-censales/src/assets/data/secionesCensalesUpdateCenso2004-2022UpdateTotal.json', JSON.stringify(updatedGeoJson), 'utf8', (err) => {
    if (err) {
      console.error('Error al guardar el archivo actualizado:', err);
      return;
    }
    console.log('El archivo actualizado se guardó correctamente.');
  });
});
