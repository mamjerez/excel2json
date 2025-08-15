const year = '2025';
const month = '08';
const day = '11';

const dateFolder = `${year}.${month}.${day}`;
const dateFile = `${day}-${month}-${year}`;

module.exports = {
    // Exporta también month, day, dateFolder y dateFile por si se necesitan en otros módulos.
    year,
    month,
    day,
    dateFolder,
    dateFile,
    pathExcel: `C:/Users/Usuario/OneDrive/Ayuntamiento/Presupuestos/${year}/Ejecucion/${dateFolder}/`,
    pathApp: 'D:/ocm/src/assets/data/',
    pathDataJsonNecesarios: 'C:/Users/Usuario/OneDrive/Ayuntamiento/Presupuestos/Tablas/JsonNecesariosApp/',

    nameExcelIngresos: `Estado_Ejecucion_Ingresos_${year}_por_aplicaciones_a_${dateFile}.xlsx`,
    nameExcelGastos: `Estado_Ejecucion_Gastos_${year}_por_aplicaciones_a_${dateFile}.xlsx`,
};


// module.exports = {
//     year: '2024',
//     pathExcel: 'C:/Users/Usuario/OneDrive/Ayuntamiento/Presupuestos/2024/Ejecucion/2024.12.31/',
//     //    pathExcel: 'C:/Users/Usuario/OneDrive/Ayuntamiento/Presupuestos/2024/Ejecucion/pruebas/',
//     pathApp: 'D:/ocm/src/assets/data/',
//     // pathApp: 'C:/Users/Usuario/OneDrive/Ayuntamiento/Presupuestos/2024/Ejecucion/pruebasApp/',
//     pathDataJsonNecesarios: 'C:/Users/Usuario/OneDrive/Ayuntamiento/Presupuestos/Tablas/JsonNecesariosApp/',

//     nameExcelIngresos: 'Estado_Ejecucion_Ingresos_2024_por_aplicaciones_a_31-12-2024.xlsx',
//     nameExcelGastos: 'Estado_Ejecucion_Gastos_2024_por_aplicaciones_a_31-12-2024.xlsx',
// };
