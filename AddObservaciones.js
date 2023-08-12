const fs = require('fs');

const pathDataJson = 'D:/presupuestos/src/assets/data/';
const file = require(pathDataJson + 'ingresosEconomicaEconomicos.json');

newJson = file.map((row) => {
    row.Observaciones = ''; 
    return row;
});



fs.writeFileSync(pathDataJson + 'ingresosEconomicaEconomicosNEW.json', JSON.stringify(newJson, null, 2));
console.log('Archivo JSON generado exitosamente en ' + pathDataJson + '2023LiqIngNEW.json');