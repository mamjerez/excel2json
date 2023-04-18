// Importa las librerías necesarias
const XLSX = require('xlsx');
const fs = require('fs');

 
// Función para leer un archivo Excel y convertirlo a JSON
function excelToJson(filePath) {
    const columnsToExclude = [
                              'C.Gestor',
                              'Saldo de Créditos Retenidos pdtes de utilización',
                              'Saldo de Créditos Retenidos para Trans.',
                              'Saldo de Acuerd. Créd. para No Disponibil.',
                              'Saldo de Gastos Autorizados',
                              'Saldo de Pagos Ordenados',
                              'Total gastado',
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
                                'Pagos Realizados': 'Pagos',
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

    // Renombra las columnas
    const newRow = {};
    Object.keys(row).forEach((key) => {
      const newKey = keyMapping[key] || key;
      // Quita decimales y redondea
      const value = row[key];
      newRow[newKey] = (typeof value === 'number') ? Math.round(value) : value;

          // Si el valor es un string numérico, conviértelo a number
         newRow[newKey] = tryParseNumber(value);
  
   
      // Añade la nueva key "DesCap" y asigna la primera cifra del value de la key "CodEco"
    if (newRow.hasOwnProperty('CodEco')) {
        newRow['CodCap'] = parseInt(newRow['CodEco'].toString().charAt(0), 10);
    }

  
    });

    return newRow;
  });

  return jsonData;
}



// Ruta del archivo Excel en tu disco
const excelFilePath = 'C:/Users/Usuario/OneDrive/Ayuntamiento/Presupuestos/2023/Ejecucion/2023.04.03/Estado_Ejecucion_Gastos_2023_por_aplicaciones_a_03-04-2023.xls';

// Llama a la función para leer el archivo Excel y obtener los datos en formato JSON
const jsonData = excelToJson(excelFilePath);

// Guarda los datos en formato JSON en un nuevo archivo
fs.writeFileSync('C:/Users/Usuario/OneDrive/Ayuntamiento/Presupuestos/2023/Ejecucion/2023.04.03/2023LiqGas5.json', JSON.stringify(jsonData, null, 2));

function tryParseNumber(value) {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? value : parsedValue;
  }

console.log('Archivo JSON generado exitosamente');
