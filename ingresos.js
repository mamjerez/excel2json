// Importa las librerías necesarias
const XLSX = require('xlsx');
const fs = require('fs');

// Ruta del archivo Excel en disco
const path = 'C:/Users/Usuario/OneDrive/Ayuntamiento/Presupuestos/2023/Ejecucion/2023.06.05/pruebasNode/';
const excelFilePath = path + 'Estado_Ejecucion_Ingresos_2023_por_aplicaciones_a_05-06-2023.xls';

const jsonData = excelToJson(excelFilePath);

// Función para leer un archivo Excel y convertirlo a JSON
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
    'Estado de Ejecución': 'DiferenciaPrevision',


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
      }
    });

    return newRow;
  });

  jsonData.shift(); // Remueve el primer objeto (títulos de las columnas)
  jsonData.pop(); // Remueve el último objeto (totales)

  return jsonData;
}

// Guarda los datos en formato JSON en un nuevo archivo
pathJson = path + '2023LiqIng.json';

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

