const XLSX = require('xlsx');
const fs = require('fs').promises; // Uso de fs.promises para operaciones asíncronas
const config = require('./config');

const pathExcel = config.pathExcel;
const pathApp = config.pathApp;
const nameExcel = config.nameExcelIngresos;
const excelFilePath = pathExcel + nameExcel;
const pathDataJsonNecesarios = config.pathDataJsonNecesarios;
const year = config.year;

const ingresosEconomicaCapitulos = require(pathDataJsonNecesarios + 'ingresosEconomicaCapitulos.json');
const ingresosEconomicaEconomicos = require(pathDataJsonNecesarios + 'ingresosEconomicaEconomicos.json');
const ingresosEconomicaArticulos = require(pathDataJsonNecesarios + 'ingresosEconomicaArticulos.json');
const ingresosEconomicaConceptos = require(pathDataJsonNecesarios + 'ingresosEconomicaConceptos.json');

function excelToJson(filePath) {
  const columnsToExclude = [
    '% de Realizacion del Presupuesto',
    '% Rec/Der'
  ];

  const keyMapping = {
    'Eco.': 'CodEco',
    'Descripción': 'DescripcionAyto',
    'Previsiones Iniciales': 'Iniciales',
    'Total Modificaciones': 'Modificaciones',
    'Previsiones totales': 'Definitivas',
    'Derechos Reconocidos Netos': 'DerechosReconocidosNetos',
    'Derechos Recaudados': 'DerechosReconocidos',
    'Devoluciones de ingreso': 'DerechosCancelados',
    'Recaudación Líquida': 'RecaudacionNeta',
    'Derechos Pendientes de Cobro': 'DerechosPendienteCobro',
    'Estado de Ejecución': 'DiferenciaPrevision'
  };

  // Lee el archivo Excel
  const workbook = XLSX.readFile(filePath);

  // Obtiene el nombre de la primera hoja
  const sheetName = workbook.SheetNames[0];

  // Obtiene la hoja de cálculo por su nombre
  const sheet = workbook.Sheets[sheetName];

  // Convierte la hoja de cálculo a JSON
  let jsonData = XLSX.utils.sheet_to_json(sheet);

  // Define el array para almacenar los elementos nuevos
  let newCapitulos = [];
  let newEconomicos = [];
  let newArticulos = [];
  let newConceptos = [];

  // Elimina las columnas excluidas
  jsonData = jsonData.map((row) => {
    columnsToExclude.forEach((column) => {
      delete row[column];
    });

    const newRow = {};
    Object.keys(row).forEach((key) => {
      // Renombra las columnas
      const newKey = keyMapping[key] || key;
      let value = row[key];

      // Si el valor es una cadena numérica, lo convierte a número
      if (typeof value === 'string' && !isNaN(Number(value))) {
        value = Number(value);
      }

      // Quita decimales y redondea
      newRow[newKey] = (typeof value === 'number') ? Math.round(value) : value;

      // Añade la nueva key "CodCap" y asigna la primera cifra del valor de "CodEco"
      if (newRow.hasOwnProperty('CodEco')) {
        newRow['CodCap'] = parseInt(newRow['CodEco'].toString().charAt(0), 10);

        // Añade la nueva key "CodArt" y asigna las 2 primeras cifras de "CodEco"
        newRow['CodArt'] = parseInt(newRow['CodEco'].toString().substring(0, 2), 10);

        // Añade la nueva key "CodCon" y asigna las 3 primeras cifras de "CodEco"
        newRow['CodCon'] = parseInt(newRow['CodEco'].toString().substring(0, 3), 10);

        // Añade descripción de capítulos
        const capitulo = ingresosEconomicaCapitulos.find((cap) => cap.codigo === newRow['CodCap']);
        if (capitulo) {
          newRow['DesCap'] = capitulo.descripcion;
        } else {
          newRow['DesCap'] = '';
          newCapitulos.push(newRow['CodCap']);
        }

        // Añade descripción de económicos
        const economico = ingresosEconomicaEconomicos.find((eco) => eco.codigo === newRow['CodEco']);
        if (economico) {
          newRow['DesEco'] = economico.descripcion;
        } else {
          newRow['DesEco'] = '';
          newEconomicos.push(newRow['CodEco']);
        }

        // Añade descripción de artículos
        const articulo = ingresosEconomicaArticulos.find((art) => art.codigo === newRow['CodArt']);
        if (articulo) {
          newRow['DesArt'] = articulo.descripcion;
        } else {
          newRow['DesArt'] = '';
          newArticulos.push(newRow['CodArt']);
        }

        // Añade descripción de conceptos
        const concepto = ingresosEconomicaConceptos.find((con) => con.codigo === newRow['CodCon']);
        if (concepto) {
          newRow['DesCon'] = concepto.descripcion;
        } else {
          newRow['DesCon'] = '';
          newConceptos.push(newRow['CodCon']);
        }
      }
    });

    return newRow;
  });

  // Imprime capítulos nuevos
  let newCapitulosUnicos = [...new Set(newCapitulos)];
  if (newCapitulosUnicos.length > 0) {
    console.log("Capitulos nuevos: ", newCapitulosUnicos);
    const pathNewCapitulos = pathExcel + 'newCapitulosIngresos.json';
    fs.writeFileSync(pathNewCapitulos, JSON.stringify(newCapitulosUnicos, null, 2));
  }

  // Imprime económicos nuevos
  let newEconomicosUnicos = [...new Set(newEconomicos)];
  if (newEconomicosUnicos.length > 0) {
    console.log("Económicos nuevos: ", newEconomicosUnicos);
    const pathNewEconomicos = pathExcel + 'newEconomicosIngresos.json';
    fs.writeFileSync(pathNewEconomicos, JSON.stringify(newEconomicosUnicos, null, 2));
  }

  // Imprime artículos nuevos
  let newArticulosUnicos = [...new Set(newArticulos)];
  if (newArticulosUnicos.length > 0) {
    console.log("Articulos nuevos: ", newArticulosUnicos);
    const pathNewArticulos = pathExcel + 'newArticulosIngresos.json';
    fs.writeFileSync(pathNewArticulos, JSON.stringify(newArticulosUnicos, null, 2));
  }

  // Imprime conceptos nuevos
  let newConceptosUnicos = [...new Set(newConceptos)];
  if (newConceptosUnicos.length > 0) {
    console.log("Conceptos nuevos: ", newConceptosUnicos);
    const pathNewConceptos = pathExcel + 'newConceptosUnicos.json';
    fs.writeFileSync(pathNewConceptos, JSON.stringify(newConceptosUnicos, null, 2));
  }

  // Remueve el primer objeto (títulos de las columnas) y el último objeto (totales)
  jsonData = jsonData.slice(1, -1);

  return jsonData;
}

async function manejarArchivo(ruta, datos, year) {
  try {
    await fs.writeFile(ruta, JSON.stringify(datos, null, 2));
    console.log(`Archivo ${year}LiqIng generado exitosamente en ${ruta}`);
  } catch (error) {
    console.error(`Error durante la operación de archivo en ${ruta}: `, error);
  }
}

async function main() {
  const jsonData = excelToJson(excelFilePath);
  const pathExcelJson = `${pathExcel}${year}LiqIng.json`;
  const pathAppJson = `${pathApp}${year}LiqIng.json`;

  await Promise.all([
    manejarArchivo(pathExcelJson, jsonData, year),
    manejarArchivo(pathAppJson, jsonData, year)
  ]);
}

main()

// main().then(() => {
//   // console.log('Ingresos terminado');
// });
