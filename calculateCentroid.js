const fs = require("fs");
const turf = require("@turf/turf");

// Leer el archivo GeoJSON
const geojsonData = JSON.parse(fs.readFileSync("D:/secciones-censales/src/assets/data/secionesCensalesDomingo.json", "utf8"));

// Recorrer todas las features en el GeoJSON y calcular el centroide de cada polígono
geojsonData.features.forEach((feature) => {
    let centroid;
  
    if (feature.geometry.type === "Polygon") {
      const polygon = turf.polygon(feature.geometry.coordinates);
      centroid = turf.centroid(polygon);
    } else if (feature.geometry.type === "MultiPolygon") {
      const multiPolygon = turf.multiPolygon(feature.geometry.coordinates);
      centroid = turf.centroid(multiPolygon);
    } else {
      throw new Error(`Tipo de geometría no soportado: ${feature.geometry.type}`);
    }
  
    const [longitude, latitude] = centroid.geometry.coordinates;
  
    // Actualizar las propiedades 'long' y 'lat' con los valores del centroide
    feature.properties.long = longitude;
    feature.properties.lat = latitude;
  });

// Guardar el GeoJSON modificado en un nuevo archivo
fs.writeFileSync("D:/secciones-censales/src/assets/data/secionesCensalesDomingoCenter.json", JSON.stringify(geojsonData, null, 2));
