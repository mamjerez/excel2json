# Resumen Esquemático: Excel2JSON - Procesador de Liquidación Presupuestaria

## 📋 **PROPÓSITO GENERAL**
Aplicación Node.js que convierte archivos Excel de liquidación presupuestaria municipal (Ingresos y Gastos) a formato JSON, añadiendo descripciones y códigos jerárquicos para su uso en una aplicación web (OCM).

---

## 🏗️ **ARQUITECTURA DE COMPONENTES**

### **1. CONTROLADOR PRINCIPAL**
```
Index.js
├── Ejecuta secuencialmente:
│   ├── ingresos.js
│   ├── gastos.js  
│   └── gastosFromJSON.js
└── Manejo de errores y tiempo de ejecución
```

### **2. CONFIGURACIÓN CENTRAL**
```
config.js
├── Fechas dinámicas (año/mes/día)
├── Rutas de archivos:
│   ├── pathExcel: Origen de datos Excel
│   ├── pathApp: Destino aplicación web
│   └── pathDataJsonNecesarios: Tablas de referencia
└── Nombres de archivos Excel generados automáticamente
```

### **3. PROCESADORES DE DATOS**

#### **A) PROCESADOR DE INGRESOS** 📥
```
ingresos.js
├── Lee: Estado_Ejecucion_Ingresos_[año]_por_aplicaciones_a_[fecha].xlsx
├── Transforma:
│   ├── Mapea columnas Excel → Campos JSON
│   ├── Convierte strings numéricos → números
│   ├── Genera códigos jerárquicos:
│   │   ├── CodCap (1er dígito de CodEco)
│   │   ├── CodArt (2 primeros dígitos)
│   │   └── CodCon (3 primeros dígitos)
├── Enriquece con descripciones desde:
│   ├── ingresosEconomicaCapitulos.json
│   ├── ingresosEconomicaEconomicos.json
│   ├── ingresosEconomicaArticulos.json
│   └── ingresosEconomicaConceptos.json
├── Detecta elementos nuevos no catalogados
└── Genera: [año]LiqIng.json
```

#### **B) PROCESADOR DE GASTOS INICIAL** 📤
```
gastos.js
├── Lee: Estado_Ejecucion_Gastos_[año]_por_aplicaciones_a_[fecha].xlsx
├── Transforma:
│   ├── Mapea columnas complejas de ejecución presupuestaria
│   ├── Genera CodCap desde CodEco
│   ├── Maneja caso especial: CodPro 1110 = "Deuda pública"
├── Enriquece con descripciones desde:
│   ├── gastosEconomicaCapitulos.json
│   ├── gastosOrganicaOrganicos.json
│   ├── gastosProgramaProgramas.json
│   └── gastosEconomicaEconomicos.json
├── Detecta elementos nuevos
└── Genera: [año]LiqGasINICIAL.json
```

#### **C) ENRIQUECEDOR DE GASTOS** 🔄
```
gastosFromJSON.js
├── Lee: [año]LiqGasINICIAL.json
├── Genera códigos adicionales:
│   ├── Económicos: CodArt, CodCon (desde CodEco)
│   ├── Programáticos: CodAre, CodPol, CodGru (desde CodPro)
├── Añade descripciones desde:
│   ├── gastosEconomicaArticulos.json
│   ├── gastosEconomicaConceptos.json
│   ├── gastosProgramaAreas.json
│   ├── gastosProgramaPoliticas.json
│   └── gastosProgramaGruposProgramas.json
├── Detecta elementos nuevos por categoría
└── Genera: [año]LiqGas.json (versión final)
```

---

## 🔄 **FLUJO DE EJECUCIÓN**

### **SECUENCIA OPERATIVA**
1. **INICIO** → `node index.js`
2. **CONFIGURACIÓN** → Carga parámetros desde `config.js`
3. **PROCESAMIENTO INGRESOS** → Excel → JSON enriquecido
4. **PROCESAMIENTO GASTOS INICIAL** → Excel → JSON básico
5. **ENRIQUECIMIENTO GASTOS** → JSON básico → JSON final completo
6. **FINALIZACIÓN** → Archivos listos en destinos

### **TRANSFORMACIÓN DE DATOS**

#### **MAPEO DE COLUMNAS (Ejemplo Ingresos)**
```
Excel                           →  JSON
'Eco.'                         →  'CodEco'
'Previsiones Iniciales'        →  'Iniciales'  
'Derechos Reconocidos Netos'   →  'DerechosReconocidosNetos'
'Recaudación Líquida'          →  'RecaudacionNeta'
```

#### **ENRIQUECIMIENTO JERÁRQUICO**
```
CodEco: 39900 →
├── CodCap: 3 → DesCap: "Tasas, precios públicos y otros ingresos"
├── CodArt: 39 → DesArt: "Otros ingresos"
└── CodCon: 399 → DesCon: "Otros ingresos diversos"
```

---

## 📂 **ARCHIVOS GENERADOS**

### **ARCHIVOS PRINCIPALES**
- `[año]LiqIng.json` → Datos de ingresos (2 copias)
- `[año]LiqGas.json` → Datos de gastos finales (2 copias)

### **ARCHIVOS DE DETECCIÓN**
- `newCapitulos[Tipo].json` → Códigos de capítulos no catalogados
- `newEconomicos[Tipo].json` → Códigos económicos nuevos
- `newArticulos[Tipo].json` → Artículos no catalogados
- `newConceptos[Tipo].json` → Conceptos nuevos
- `newProgramas.json` → Programas presupuestarios nuevos
- `newAreas.json` → Áreas funcionales nuevas

### **UBICACIONES DE DESTINO**
1. **Carpeta Excel** (`pathExcel`) → Copia de trabajo
2. **Carpeta App** (`pathApp`) → Para aplicación web OCM

---

## 🔍 **FUNCIONALIDADES CLAVE**

### **VALIDACIONES Y CONTROLES**
- ✅ Detección de códigos presupuestarios nuevos
- ✅ Conversión automática de tipos de datos
- ✅ Eliminación de filas de cabecera y totales
- ✅ Manejo de casos especiales (ej: Deuda pública)
- ✅ Control de errores en procesamiento secuencial

### **INTEGRACIÓN CON SISTEMA OCM**
- 🔄 Sincronización con aplicación Angular
- 📊 Datos listos para visualización presupuestaria
- 🎯 Estructura optimizada para consultas jerárquicas

### **MANTENIMIENTO**
- 🔧 Configuración centralizada por fechas
- 📝 Generación de logs de elementos nuevos
- 🗃️ Respaldo automático en múltiples ubicaciones

---

## ⚡ **PUNTOS CRÍTICOS DE OPERACIÓN**

1. **Antes de ejecutar**: Actualizar fechas en `config.js`
2. **Verificar**: Extensión de archivos Excel (`.xls` vs `.xlsx`)
3. **Controlar**: Filas vacías al final de Excel (causan errores)
4. **Validar**: Totales entre Excel original y JSON generado
5. **Actualizar**: Versión en aplicación OCM tras procesamiento

---

*Esta aplicación automatiza la transformación de datos contables municipales desde formato Excel a JSON estructurado, facilitando su integración en sistemas web de consulta presupuestaria.*