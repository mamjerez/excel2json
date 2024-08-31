const XLSX = import('xlsx');
const fs = import('fs');
import { log } from 'console';
import { config } from './config.js';


// Ruta del archivo Excel en disco
// Usar path
// https://youtu.be/yB4n_K7dZV8?t=4581
const pathExcel1 = config.pathExcel;
const nameExcel = config.nameExcel;
log('path: ' , pathExcel1);
log('name: ' , nameExcel);
