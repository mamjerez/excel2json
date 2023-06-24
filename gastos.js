// Importa las librerías necesarias
const XLSX = require('xlsx');
const fs = require('fs');

// Ruta del archivo Excel en disco
const pathExcel = 'C:/Users/Usuario/OneDrive/Ayuntamiento/Presupuestos/2023/Ejecucion/2023.06.05/pruebasNode/';
const excelFilePath = pathExcel + 'Estado_Ejecucion_Gastos_2023_por_aplicaciones_a_05-06-2023.xls';

const pathDataJson = 'D:/presupuestos/src/assets/data/';
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
         newRow['DesCap'] = capitulo ? capitulo.descripcion : '';

        // Añade descripcion de organicos
        const organico = gastosOrganicaOrganicos.find((org) => org.codigo === newRow['CodOrg']);
        newRow['DesOrg'] = organico ? organico.descripcion : '';

         // Añade descripcion de programas
         const programa = gastosProgramaProgramas.find((pro) => pro.codigo === newRow['CodPro']);
         newRow['DesPro'] = programa ? programa.descripcion : '';

        // Añade descripcion de económicos
        const economico = gastosEconomicaEconomicos.find((eco) => eco.CodEco === newRow['CodEco']);
        newRow['DesEco'] = economico ? economico.DesEco : '';
      }
    });

    return newRow;
  });

  jsonData.shift(); // Remueve el primer objeto (títulos de las columnas)
  jsonData.pop(); // Remueve el último objeto (totales)

  return jsonData;
}

// Guarda los datos en formato JSON en un nuevo archivo
pathJson = pathExcel + '2023LiqGas.json';

// Si el archivo existe, borra el archivo existente
fs.unlink(pathJson, (err) => {
  if (err) {
    console.error("Hubo un error al intentar borrar el archivo: ", err);
    return;
  }
  // Grabar el nuevo archivo
  fs.writeFileSync(pathJson, JSON.stringify(jsonData, null, 2));
  console.log('Archivo JSON generado exitosamente en ' + pathJson);
});

