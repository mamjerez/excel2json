const fs = require('fs');

function addKeysToGeoJson(geoJson, keysToAdd) {
  geoJson.features.forEach((feature) => {
    keysToAdd.forEach((keyValuePair) => {
      feature.properties[keyValuePair.key] = keyValuePair.value;
    });
  });
  return geoJson;
}

// Leer el archivo GeoJSON
fs.readFile('D:/secciones-censales/src/assets/data/secionesCensales.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error al leer el archivo:', err);
    return;
  }

  // Parsear el contenido del archivo como JSON
  const geoJson = JSON.parse(data);

  // Definir las claves y valores que deseas añadir
  const keysToAdd = [
    { key: 'censo2022', value: 'newValue1' },
    { key: 'censo2004', value: 'newValue2' },
  ];

  // Añadir las claves al GeoJSON
  const updatedGeoJson = addKeysToGeoJson(geoJson, keysToAdd);

  // Guardar el GeoJSON actualizado en un nuevo archivo
  fs.writeFile('D:/secciones-censales/src/assets/data/secionesCensalesDomingo.json', JSON.stringify(updatedGeoJson), 'utf8', (err) => {
    if (err) {
      console.error('Error al guardar el archivo actualizado:', err);
      return;
    }
    console.log('El archivo actualizado se guardó correctamente.');
  });
});
