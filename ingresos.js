// Importa las librerías necesarias
const XLSX = require('xlsx');
const fs = require('fs');

// Ruta del archivo Excel en disco
// Usar path
// https://youtu.be/yB4n_K7dZV8?t=4581
const pathExcel = 'C:/Users/Usuario/OneDrive/Ayuntamiento/Presupuestos/2024/Ejecucion/2024.05.17/';
const excelFilePath = pathExcel + 'Estado_Ejecucion_Ingresos_2024_por_aplicaciones_a_17-05-2024.xls';

// const pathDataJson = 'D:/presupuestos/src/assets/data/';
const pathDataJson = 'C:/Users/Usuario/OneDrive/Ayuntamiento/Presupuestos/Tablas/JsonNecesariosApp/';

const ingresosEconomicaCapitulos = require(pathDataJson + 'ingresosEconomicaCapitulos.json');
const ingresosEconomicaEconomicos = require(pathDataJson + 'ingresosEconomicaEconomicos.json');
const ingresosEconomicaArticulos = require(pathDataJson + 'ingresosEconomicaArticulos.json');
const ingresosEconomicaConceptos = require(pathDataJson + 'ingresosEconomicaConceptos.json');

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

      // If value is numeric string convert to number
      if (typeof value === 'string' && !isNaN(Number(value))) {
        value = Number(value);
      }

      // Quita decimales y redondea
      newRow[newKey] = (typeof value === 'number') ? Math.round(value) : value;

      

      // Añade la nueva key "CodCap" y asigna la primera cifra del value de la key "CodEco"
      if (newRow.hasOwnProperty('CodEco')) {
        newRow['CodCap'] = parseInt(newRow['CodEco'].toString().charAt(0), 10);

        // Añade la nueva key "CodArt" y asigna ls 2 primeras cifras del value de la key "CodEco"
        newRow['CodArt'] = parseInt(newRow['CodEco'].toString().substring(0, 2), 10);

        // Añade la nueva key "CodCon" y asigna ls 2 primeras cifras del value de la key "CodEco"
        newRow['CodCon'] = parseInt(newRow['CodEco'].toString().substring(0, 3), 10);

        // Añade descripcion de capítulos
        const capitulo = ingresosEconomicaCapitulos.find((cap) => cap.codigo === newRow['CodCap']);
        if (capitulo) {
          newRow['DesCap'] = capitulo.descripcion;
        } else {
          newRow['DesCap'] = '';
          newCapitulos.push(newRow['CodCap']);
        }

        // Añade descripcion de económicos
        const economico = ingresosEconomicaEconomicos.find((eco) => eco.codigo === newRow['CodEco']);
        if (economico) {
          newRow['DesEco'] = economico.descripcion;
        } else {
          newRow['DesEco'] = '';
          newEconomicos.push(newRow['CodEco']);
        }

        // Añade descripcion de articulos
        const articulo = ingresosEconomicaArticulos.find((art) => art.codigo === newRow['CodArt']);
        if (articulo) {
          newRow['DesArt'] = articulo.descripcion;
        } else {
          newRow['DesArt'] = '';
          newArticulos.push(newRow['CodArt']);
        }

         // Añade descripcion de conceptos
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

  // Imprime capitulos nuevos
  let newCapitulosUnicos = [...new Set(newCapitulos)];
  if (newCapitulosUnicos.length > 0) {
    console.log("Capitulos nuevos: ", newCapitulosUnicos);
    pathNewCapitulos = pathExcel + 'newCapitulosIngresos.json';
    fs.writeFileSync(pathNewCapitulos, JSON.stringify(newCapitulosUnicos, null, 2));
  }

  // Imprime economicos nuevos
  let newEconomicosUnicos = [...new Set(newEconomicos)];
  if (newEconomicosUnicos.length > 0) {
    console.log("Económicos nuevos: ", newEconomicosUnicos);
    pathNewEconomicos = pathExcel + 'newEconomicosIngresos.json';
    fs.writeFileSync(pathNewEconomicos, JSON.stringify(newEconomicosUnicos, null, 2));
  }

  // Imprime articulos nuevos
  let newArticulosUnicos = [...new Set(newArticulos)];
  if (newArticulosUnicos.length > 0) {
    console.log("Articulos nuevos: ", newArticulosUnicos);
    pathNewArticulos = pathExcel + 'newArticulosIngresos.json';
    fs.writeFileSync(pathNewArticulos, JSON.stringify(newArticulosUnicos, null, 2));
  }

   // Imprime conceptos nuevos
   let newConceptosUnicos = [...new Set(newConceptos)];
   if (newConceptosUnicos.length > 0) {
     console.log("Conceptos nuevos: ", newConceptosUnicos);
     pathNewConceptos = pathExcel + 'newConceptosUnicos.json';
     fs.writeFileSync(pathNewConceptos, JSON.stringify(newConceptosUnicos, null, 2));
   }

  // jsonData.shift(); // Remueve el primer objeto (títulos de las columnas)
  // jsonData.pop(); // Remueve el último objeto (totales)
  jsonData = jsonData.slice(1, -1);

 
    return jsonData;
}

// Guarda los datos en formato JSON en un nuevo archivo
pathJson = pathExcel + '2024LiqIng.json';

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

