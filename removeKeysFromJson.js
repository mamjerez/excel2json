const fs = require('fs');

// Leer archivo JSON
fs.readFile('D:/secciones-censales/src/assets/data/secionesCensalesUpdateDiferenciaUpdateColor.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log('Error al leer el archivo:', err);
        return;
    }

    // Parsear JSON
    const data = JSON.parse(jsonString);

    // Claves a eliminar
    const keysToRemove = ['Abstencion', '%abtencion', 'nulos', 'blancos',"FCJ", "GANEMOS", "IPJ", "IU", "PA", "PCPE", "PP", "PSOE", "UPyD", "CIUDADANOS", "PartidoGanador"];
   
    // Eliminar claves especificadas en el array "keysToRemove"
    data.features.forEach((feature) => {
        keysToRemove.forEach((key) => {
            delete feature.properties[key];
        });
    });

    // Convertir el objeto JSON actualizado a una cadena
    const updatedJsonString = JSON.stringify(data, null, 2);

    // Guardar el resultado en un nuevo archivo JSON
    fs.writeFile('D:/secciones-censales/src/assets/data/secionesCensalesDomingo.json', updatedJsonString, (err) => {
        if (err) {
            console.log('Error al escribir el archivo:', err);
        } else {
            console.log('Archivo guardado con éxito.');
        }
    });
});
