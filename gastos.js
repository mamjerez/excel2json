// Importa las librerías necesarias
const XLSX = require('xlsx');
const fs = require('fs');

// Ruta del archivo Excel en disco
const pathExcel = 'C:/Users/Usuario/OneDrive/Ayuntamiento/Presupuestos/2022/Ejecucion/2022.12.31/';
const excelFilePath = pathExcel + 'Estado_Ejecucion_Gastos_2022_por_aplicaciones_a_31-12-2022.xlsx';

// const pathDataJson = 'D:/presupuestos/src/assets/data/';
const pathDataJson = 'C:/Users/Usuario/OneDrive/Ayuntamiento/Presupuestos/Tablas/JsonNecesariosApp/';

const gastosEconomicaCapitulos = require(pathDataJson + 'gastosEconomicaCapitulos.json');
const gastosOrganicaOrganicos = require(pathDataJson + 'gastosOrganicaOrganicos.json');
const gastosProgramaProgramas = require(pathDataJson + 'gastosProgramaProgramas.json');
const gastosEconomicaEconomicos = require(pathDataJson + 'gastosEconomicaEconomicos.json');

const jsonData = excelToJson(excelFilePath);

// Función para leer un archivo Excel y convertirlo a JSON
function excelToJson(filePath) {
  const columnsToExclude = [
    'C.Gestor',
    'Saldo de Créditos Retenidos pdtes de utilización',
    'Saldo de Créditos Retenidos para Trans.',
    'Saldo de Acuerd. Créd. para No Disponibil.',
    'Saldo de Gastos Autorizados',
    'Saldo de Pagos Ordenados',
    'Pagos Realizados',
    'Saldo de Créditos disponibles',
    'Saldo de Créditos disp. a nivel de Vinculación',
    '% de Realizacion del Presupuesto',
    'Facturas consumen disp. Pend. Contabilizar',
    'Gastado en Fase Definitiva'
  ];

  const keyMapping = {
    'Org.': 'CodOrg',
    'Pro.': 'CodPro',
    'Eco.': 'CodEco',
    'Créditos Iniciales': 'Iniciales',
    'Modificaciones de Crédito': 'Modificaciones',
    'Créditos Totales consignados': 'Definitivas',
    'Saldo de Gastos Compromet.': 'GastosComprometidos',
    'Saldo de Obligaciones Reconocidas': 'ObligacionesReconocidasNetas',
    'Total gastado': 'Pagos',
    'Saldo de Crédito Disponible Real': 'RemanenteCredito',
    'Gasto Pendiente Aplicar a Presupuesto': 'ObligacionesPendientePago'
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
  let newOrganicos = [];
  let newProgramas = [];
  let newEconomicos = [];


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

      // If value is numeric string convert to number
      // el caso especial '01110' lo convierte en 1110 que es deuda pública
      if (typeof value === 'string' && !isNaN(Number(value))) {
        value = Number(value);
      }

      // Quita decimales y redondea
      newRow[newKey] = (typeof value === 'number') ? Math.round(value) : value;

      // Añade la nueva key "DesCap" y asigna la primera cifra del value de la key "CodEco"
      if (newRow.hasOwnProperty('CodEco')) {
        newRow['CodCap'] = parseInt(newRow['CodEco'].toString().charAt(0), 10);

        // Añade descripcion de capítulos
        const capitulo = gastosEconomicaCapitulos.find((cap) => cap.codigo === newRow['CodCap']);
        if (capitulo) {
          newRow['DesCap'] = capitulo.descripcion;
        } else {
          newRow['DesCap'] = '';
          newCapitulos.push(newRow['CodCap']);
        }

        // Añade descripcion de organicos
        const organico = gastosOrganicaOrganicos.find((org) => org.codigo === newRow['CodOrg']);
        if (organico) {
          newRow['DesOrg'] = organico.descripcion;
        } else {
          newRow['DesOrg'] = '';
          newOrganicos.push(newRow['CodOrg']);
        }

        // Añade descripcion de programas
        const programa = gastosProgramaProgramas.find((pro) => pro.codigo === newRow['CodPro']);
        if (programa) {
          newRow['DesPro'] = programa.descripcion;
        } else {
          if (newRow['CodPro'] === 1110) {
            newRow['DesPro'] = 'Deuda pública';
          } else {
            newRow['DesPro'] = '';
            newProgramas.push(newRow['CodPro']);
          }
        }

        // Añade descripcion de económicos
        const economico = gastosEconomicaEconomicos.find((eco) => eco.CodEco === newRow['CodEco']);
        if (economico) {
          newRow['DesEco'] = economico.DesEco;
        } else {
          newRow['DesEco'] = '';
          newEconomicos.push(newRow['CodEco']);
        }

      }
    });

    return newRow;
  });

  // Imprime capitulos nuevos
  let newCapitulosUnicos = [...new Set(newCapitulos)];
  if (newCapitulosUnicos.length > 0) {
    console.log("Capitulos nuevos: ", newCapitulosUnicos);
    pathNewCapitulos = pathExcel + 'newCapitulosGastos.json';
    fs.writeFileSync(pathNewCapitulos, JSON.stringify(newCapitulosUnicos, null, 2));
  }

  // Imprime organicos nuevos
  let newOrganicosUnicos = [...new Set(newOrganicos)];
  if (newOrganicosUnicos.length > 0) {
    console.log("Organicos nuevos: ", newOrganicosUnicos);
    pathNewOrganicos = pathExcel + 'newOrganicos.json';
    fs.writeFileSync(pathNewOrganicos, JSON.stringify(newOrganicosUnicos, null, 2));
  }

  // Imprime programas nuevos
  let newProgramasUnicos = [...new Set(newProgramas)];
  if (newProgramasUnicos.length > 0) {
    console.log("Programas nuevos: ", newProgramasUnicos);
    pathNewProgramas = pathExcel + 'newProgramas.json';
    fs.writeFileSync(pathNewProgramas, JSON.stringify(newProgramasUnicos, null, 2));
  }

  // Imprime economicos nuevos
  let newEconomicosUnicos = [...new Set(newEconomicos)];
  if (newEconomicosUnicos.length > 0) {
    console.log("Económicos nuevos: ", newEconomicosUnicos);
    pathNewEconomicos = pathExcel + 'newEconomicosGastos.json';
    fs.writeFileSync(pathNewEconomicos, JSON.stringify(newEconomicosUnicos, null, 2));
  }

  // jsonData.shift(); // Remueve el primer objeto (títulos de las columnas)
  // jsonData.pop(); // Remueve el último objeto (totales)
  jsonData = jsonData.slice(1, -1);

  return jsonData;
}



// Guarda los datos en formato JSON en un nuevo archivo
pathJson = pathExcel + '2023LiqGas.json';
pathProgramasNuevos = pathExcel + 'newProgramasUnicos.json';

// Si el archivo existe, borra el archivo existente
fs.unlink(pathJson, (err) => {
  // if (err) {
  //   console.error("Hubo un error al intentar borrar el archivo: ", err);
  //   return;
  // }
  // Grabar el nuevo archivo
  fs.writeFileSync(pathJson, JSON.stringify(jsonData, null, 2));
  console.log('Archivo JSON generado exitosamente en ' + pathJson);
});

