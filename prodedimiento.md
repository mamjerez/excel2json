En ficheros Excel originales eliminar fila totales y columnas por abajo.

Error detectado: Error durante la ejecución de gastosFromJSON.js: Command failed: node gastosFromJSON.js
D:\excel2json\gastosFromJSON.js:37
        const codeStrEco = row['CodEco'].toString();

Da este error si tiene filas sin datos al final porque crea un array con object vacios al final.


En config.js
Cambiar nombres en limeas 2,8 y 9
COMPROBAR EXTENSION puede ser xls o xlsx
Comprobar año
GRABAR

node index

Los resultados se graban en 
C:/Users/Usuario/OneDrive/Ayuntamiento/Presupuestos/2024/Ejecucion/NUEVA LIQUIDACIÓN
D:\ocm\src\assets\data


En la app ocm:
  cambiar fecha ejecucion en environment
  Cambiar version en package.json 

  Si es cambio año comprobar procedimiento.md en OCM

COMPROBAR TOTALES ENTRE los Excel y la app

