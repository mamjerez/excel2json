// Importa las librerías necesarias
const XLSX = require('xlsx');
const fs = require('fs');


// Función para leer un archivo Excel y convertirlo a JSON
function excelToJson(filePath) {
    const columnsToExclude = ['% de Realizacion del Presupuesto', '% Rec/Der'];
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
    return row;
  });

  return jsonData;
}

// Ruta del archivo Excel en tu disco
const excelFilePath = 'C:/Users/Usuario/OneDrive/Ayuntamiento/Presupuestos/2023/Ejecucion/2023.04.03/Estado_Ejecucion_Ingresos_2023_por_aplicaciones_a_03-04-2023.xls';

// Llama a la función para leer el archivo Excel y obtener los datos en formato JSON
const jsonData = excelToJson(excelFilePath);

// Guarda los datos en formato JSON en un nuevo archivo
fs.writeFileSync('C:/Users/Usuario/OneDrive/Ayuntamiento/Presupuestos/2023/Ejecucion/2023.04.03/datos.json', JSON.stringify(jsonData, null, 2));

console.log('Archivo JSON generado exitosamente');
