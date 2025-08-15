const fs = require('fs');

const pathDataJsonInitial = 'D:/presupuestos/src/assets/data/';
const pathDataJson = 'C:/Users/Usuario/OneDrive/Ayuntamiento/Presupuestos/Tablas/JsonNecesariosApp/';

const file = '2022LiqIng';

const ingresosEconomicaArticulos = require(pathDataJson + 'ingresosEconomicaArticulos.json');
const ingresosEconomicaConceptos = require(pathDataJson + 'ingresosEconomicaConceptos.json');

addKeysToJson();

function addKeysToJson() {
    let jsonData = require(pathDataJsonInitial + file + '.json');
    let newArticulos = [];
    let newConceptos = [];

    jsonData = jsonData.map((row) => {
        const newRow = { ...row };

        newRow['CodArt'] = parseInt(row['CodEco'].toString().substring(0, 2), 10);
        newRow['CodCon'] = parseInt(row['CodEco'].toString().substring(0, 3), 10);

        const articulo = ingresosEconomicaArticulos.find((art) => art.codigo === newRow['CodArt']);
        newRow['DesArt'] = articulo ? articulo.descripcion : '';
        if (!articulo) newArticulos.push(newRow['CodArt']);

        const concepto = ingresosEconomicaConceptos.find((con) => con.codigo === newRow['CodCon']);
        newRow['DesCon'] = concepto ? concepto.descripcion : '';
        if (!concepto) newConceptos.push(newRow['CodCon']);

        return newRow;
    });

    let newArticulosUnicos = [...new Set(newArticulos)];
    if (newArticulosUnicos.length > 0) {
        console.log("Articulos nuevos: ", newArticulosUnicos);
        const pathNewArticulos = pathDataJson + 'newArticulosIngresos.json';
        fs.writeFileSync(pathNewArticulos, JSON.stringify(newArticulosUnicos, null, 2));
    }

    let newConceptosUnicos = [...new Set(newConceptos)];
    if (newConceptosUnicos.length > 0) {
        console.log("Conceptos nuevos: ", newConceptosUnicos);
        const pathNewConceptos = pathDataJson + 'newConceptosIngresos.json';
        fs.writeFileSync(pathNewConceptos, JSON.stringify(newConceptosUnicos, null, 2));
    }

    const pathJson = pathDataJson + file + 'END.json';

    if (fs.existsSync(pathJson)) {
        fs.unlinkSync(pathJson);
    }

    fs.writeFileSync(pathJson, JSON.stringify(jsonData, null, 2));
    console.log('Archivo JSON generado exitosamente en ' + pathDataJson);
}
