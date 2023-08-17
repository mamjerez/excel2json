const fs = require('fs');
const pathDataJsonNecesarios = 'C:/Users/Usuario/OneDrive/Ayuntamiento/Presupuestos/Tablas/JsonNecesariosApp/';
const pathDataJson = 'D:/presupuestos/src/assets/data/';
const file = '2015LiqGas';

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








// const fs = require('fs');

// const pathDataJson = 'D:/presupuestos/src/assets/data/';
// const file = '2023LiqGas';

// const gastosEconomicaArticulos = require(pathDataJson + 'gastosEconomicaArticulos.json');
// const gastosEconomicaConceptos = require(pathDataJson + 'gastosEconomicaConceptos.json');
// const gastosProgramaAreas = require(pathDataJson + 'gastosProgramaAreas.json');
// const gastosProgramaGruposProgramas = require(pathDataJson + 'gastosProgramaGruposProgramas.json');
// const gastosProgramaPoliticas = require(pathDataJson + 'gastosProgramaPoliticas.json');

// addKeysToJson();

// function addKeysToJson() {
//     let jsonData = require(pathDataJson + file + '.json');
//     let newArticulos = [];
//     let newConceptos = [];
//     let newAreas = [];
//     let newPoliticas = [];
//     let newGrupos = [];
    
//     jsonData = jsonData.map((row) => {
//         const newRow = { ...row };

//         newRow['CodAre'] = parseInt(row['CodEco'].toString().substring(0, 1), 10);
//         newRow['CodArt'] = parseInt(row['CodEco'].toString().substring(0, 2), 10);
//         newRow['CodPol'] = parseInt(row['CodEco'].toString().substring(0, 2), 10);
//         newRow['CodCon'] = parseInt(row['CodEco'].toString().substring(0, 3), 10);
//         newRow['CodGru'] = parseInt(row['CodEco'].toString().substring(0, 3), 10);

//         const area = gastosProgramaAreas.find((are) => are.codigo === newRow['CodAre']);
//         newRow['DesAre'] = area ? area.descripcion : '';
//         if (!area) newAreas.push(newRow['CodAre']);

//         const politica = gastosProgramaPoliticas.find((pol) => pol.codigo === newRow['CodPol']);
//         newRow['DesPol'] = politica ? politica.descripcion : '';
//         if (!politica) newPoliticas.push(newRow['CodPol']);

//         const grupo = gastosProgramaGruposProgramas.find((gru) => gru.codigo === newRow['CodGru']);
//         newRow['DesGru'] = grupo ? grupo.descripcion : '';
//         if (!grupo) newGrupos.push(newRow['CodGru']);
        
//         const articulo = gastosEconomicaArticulos.find((art) => art.codigo === newRow['CodArt']);
//         newRow['DesArt'] = articulo ? articulo.descripcion : '';
//         if (!articulo) newArticulos.push(newRow['CodArt']);

//         const concepto = gastosEconomicaConceptos.find((con) => con.codigo === newRow['CodCon']);
//         newRow['DesCon'] = concepto ? concepto.descripcion : '';
//         if (!concepto) newConceptos.push(newRow['CodCon']);

//         return newRow;
//     });

//     let newAreasUnicas = [...new Set(newAreas)];
//     if (newAreasUnicas.length > 0) {
//         console.log("Areas nuevas: ", newAreasUnicas);
//         const pathNewAreas = pathDataJson + 'newAreasGastos.json';
//         fs.writeFileSync(pathNewAreas, JSON.stringify(newAreasUnicas, null, 2));
//     }

//     let newPoliticasUnicas = [...new Set(newPoliticas)];
//     if (newPoliticasUnicas.length > 0) {
//         console.log("Politicas nuevas: ", newPoliticasUnicas);
//         const pathNewPoliticas = pathDataJson + 'newPoliticasGastos.json';
//         fs.writeFileSync(pathNewPoliticas, JSON.stringify(newPoliticasUnicas, null, 2));
//     }

//     let newGruposUnicos = [...new Set(newGrupos)];
//     if (newGruposUnicos.length > 0) {
//         console.log("Grupos nuevos: ", newGruposUnicos);
//         const pathNewGrupos = pathDataJson + 'newGruposGastos.json';
//         fs.writeFileSync(pathNewGrupos, JSON.stringify(newGruposUnicos, null, 2));
//     }

//     let newArticulosUnicos = [...new Set(newArticulos)];
//     if (newArticulosUnicos.length > 0) {
//         console.log("Articulos nuevos: ", newArticulosUnicos);
//         const pathNewArticulos = pathDataJson + 'newArticulosGastos.json';
//         fs.writeFileSync(pathNewArticulos, JSON.stringify(newArticulosUnicos, null, 2));
//     }

//     let newConceptosUnicos = [...new Set(newConceptos)];
//     if (newConceptosUnicos.length > 0) {
//         console.log("Conceptos nuevos: ", newConceptosUnicos);
//         const pathNewConceptos = pathDataJson + 'newConceptosGastos.json';
//         fs.writeFileSync(pathNewConceptos, JSON.stringify(newConceptosUnicos, null, 2));
//     }

//     const pathJsonNew = pathDataJson + file + 'NEW.json';

//     if (fs.existsSync(pathJsonNew)) {
//         fs.unlinkSync(pathJsonNew);
//     }

//     fs.writeFileSync(pathJsonNew, JSON.stringify(jsonData, null, 2));
//     console.log('Archivo JSON generado exitosamente en ' + pathDataJson);
// }