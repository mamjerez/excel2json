const fs = require('fs');
const config = require('./config');
const pathDataJsonNecesarios = config.pathDataJsonNecesarios;


// const pathDataJsonNecesarios = 'C:/Users/Usuario/OneDrive/Ayuntamiento/Presupuestos/Tablas/JsonNecesariosApp/';
const pathDataJson = 'D:/presupuestos/src/assets/data/';
const file = '2024LiqGas';

const loadDataNecesario = (filename) => require(`${pathDataJsonNecesarios}${filename}.json`);
const loadData = (filename) => require(`${pathDataJson}${filename}.json`);
const writeData = (filename, data) => fs.writeFileSync(`${pathDataJson}${filename}.json`, JSON.stringify(data, null, 2));

const gastosEconomicaArticulos = loadDataNecesario('gastosEconomicaArticulos');
const gastosEconomicaConceptos = loadDataNecesario('gastosEconomicaConceptos');
const gastosProgramaAreas = loadDataNecesario('gastosProgramaAreas');
const gastosProgramaGruposProgramas = loadDataNecesario('gastosProgramaGruposProgramas');
const gastosProgramaPoliticas = loadDataNecesario('gastosProgramaPoliticas');

const findDescription = (arr, code, newItems) => {
    const item = arr.find(el => el.codigo === code);
    if (!item) newItems.push(code);
    return item ? item.descripcion : '';
};

addKeysToJson();

function addKeysToJson() {
    let jsonData = loadData(file);

    const newAreas = [], newPoliticas = [], newGrupos = [], newArticulos = [], newConceptos = [];

    jsonData = jsonData.map(row => {
        const newRow = { ...row };
        const codeStrEco = row['CodEco'].toString();
        newRow['CodArt'] = newRow['CodPol'] = parseInt(codeStrEco.substring(0, 2), 10);
        newRow['CodCon'] = newRow['CodGru'] = parseInt(codeStrEco.substring(0, 3), 10);

        const codeStrPro = row['CodPro'].toString();
        newRow['CodAre'] = parseInt(codeStrPro.substring(0, 1), 10);
        newRow['CodPol'] = parseInt(codeStrPro.substring(0, 2), 10);
        newRow['CodGru'] = parseInt(codeStrPro.substring(0, 3), 10);

        newRow['DesAre'] = findDescription(gastosProgramaAreas, newRow['CodAre'], newAreas);
        newRow['DesPol'] = findDescription(gastosProgramaPoliticas, newRow['CodPol'], newPoliticas);
        newRow['DesGru'] = findDescription(gastosProgramaGruposProgramas, newRow['CodGru'], newGrupos);
        newRow['DesArt'] = findDescription(gastosEconomicaArticulos, newRow['CodArt'], newArticulos);
        newRow['DesCon'] = findDescription(gastosEconomicaConceptos, newRow['CodCon'], newConceptos);

        return newRow;
    });

    [
        { items: newAreas, name: 'newAreasGastos' },
        { items: newPoliticas, name: 'newPoliticasGastos' },
        { items: newGrupos, name: 'newGruposGastos' },
        { items: newArticulos, name: 'newArticulosGastos' },
        { items: newConceptos, name: 'newConceptosGastos' }
    ].forEach(({ items, name }) => {
        const uniqueItems = [...new Set(items)];
        if (uniqueItems.length > 0) {
            console.log(`${name.replace('Gastos', '')} nuevos: `, uniqueItems);
            writeData(name, uniqueItems);
        }
    });

    const newPath = `${pathDataJson}${file}NEW.json`;
    if (fs.existsSync(newPath)) fs.unlinkSync(newPath);

    writeData(`${file}NEW`, jsonData);
    console.log('Archivo JSON generado exitosamente en ' + pathDataJson);
}





