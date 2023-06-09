// Importa las librerías necesarias
const XLSX = require('xlsx');
const fs = require('fs');

// Ruta del archivo Excel en tu disco
// Previamente hay que asegurarse que la primera fila es laa cabecera de las columnas
const excelFilePath = 'C:/Users/Usuario/OneDrive/OCM/Informes OCM/2023.04.19 Evolucion poblacion secciones censales/2004 INE-OCM.xlsx';

// Llama a la función para leer el archivo Excel y obtener los datos en formato JSON
const jsonData = excelToJson(excelFilePath);

// Guarda los datos en formato JSON en un nuevo archivo
fs.writeFileSync('C:/Users/Usuario/OneDrive/OCM/Informes OCM/2023.04.19 Evolucion poblacion secciones censales/2004 INE-OCM.json', JSON.stringify(jsonData, null, 2));
console.log('Archivo JSON generado exitosamente');

// Función para leer un archivo Excel y convertirlo a JSON
function excelToJson(filePath) {
    const columnsToExclude = [
                            ];

                            const keyMapping = {
                                // 'Org.': 'CodOrg',
                                // 'Pro.': 'CodPro',
                                // 'Eco.': 'CodEco',
                                // 'Créditos Iniciales': 'Iniciales',
                                // 'Modificaciones de Crédito': 'Modificaciones',
                                // 'Créditos Totales consignados': 'Definitivas',   
                                // 'Saldo de Gastos Compromet.': 'GastosComprometidos',
                                // 'Saldo de Obligaciones Reconocidas': 'ObligacionesReconocidasNetas',
                                // 'Pagos Realizados': 'Pagos',
                                // 'Saldo de Crédito Disponible Real': 'RemanenteCredito',
                                // 'Gasto Pendiente Aplicar a Presupuesto': 'ObligacionesPendientePago'
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

// Filtrar por seccionCensal que comienza con 11020
jsonData = jsonData.filter(row => row.seccionCensal.toString().startsWith("11020"));

// Toma unicamente el primer registro de cada seccionCensal
const uniqueByKey = {};
jsonData.forEach(row => {
  const keyValue = row.seccionCensal;
  if (!uniqueByKey[keyValue]) {
    uniqueByKey[keyValue] = row;
  }
});

jsonData = Object.values(uniqueByKey);
  return jsonData;
}

 // Si el valor es un string numérico, conviértelo a number
function tryParseNumber(value) {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? value : parsedValue;
  }


