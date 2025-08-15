const config = require('../config');

function verificarCodigosReferencia() {
    console.log('=== VERIFICACIÓN CÓDIGOS DE REFERENCIA ===');
    console.log('Configuración:');
    console.log('- Ruta datos JSON:', config.pathDataJsonNecesarios);
    
    const rutaArchivoReferencia = config.pathDataJsonNecesarios + 'gastosEconomicaEconomicos.json';
    console.log('- Archivo referencia completo:', rutaArchivoReferencia);
    
    try {
        const rutaArchivoReferencia = config.pathDataJsonNecesarios + 'gastosEconomicaEconomicos.json';
        const gastosEconomicaEconomicos = require(rutaArchivoReferencia);
        
        console.log('Total códigos económicos de referencia:', gastosEconomicaEconomicos.length);
        
        // Buscar el código 78900
        const codigo78900 = gastosEconomicaEconomicos.find(eco => eco.CodEco === 78900);
        
        if (codigo78900) {
            console.log('✅ Código 78900 EXISTE en códigos de referencia:');
            console.log(codigo78900);
            console.log('🔍 RAZÓN: Como ya existe en referencia, NO aparecerá como código nuevo');
        } else {
            console.log('❌ Código 78900 NO EXISTE en códigos de referencia');
            console.log('🔍 ESTO SIGNIFICA: Si está en Excel, SÍ debería aparecer como código nuevo');
        }
        
        // Mostrar códigos cercanos para comparar
        const codigosCercanos = gastosEconomicaEconomicos
            .filter(eco => eco.CodEco >= 78800 && eco.CodEco <= 79000)
            .sort((a, b) => a.CodEco - b.CodEco);
        
        console.log('Códigos cercanos en referencia (78800-79000):', codigosCercanos.length, 'encontrados');
        if (codigosCercanos.length > 0) {
            console.log('Primeros 5:', codigosCercanos.slice(0, 5));
        }
        
        // Mostrar estructura del primer elemento
        if (gastosEconomicaEconomicos.length > 0) {
            console.log('Estructura de referencia (primer elemento):', gastosEconomicaEconomicos[0]);
        }
        
        // Buscar todos los códigos que empiecen por 789
        const codigos789 = gastosEconomicaEconomicos
            .filter(eco => eco.CodEco && eco.CodEco.toString().startsWith('789'))
            .sort((a, b) => a.CodEco - b.CodEco);
        
        console.log('Códigos de referencia que empiezan por 789:', codigos789);
        
    } catch (error) {
        console.error('Error al leer archivo de códigos de referencia:', error);
        console.log('Verifica que existe el archivo:', config.pathDataJsonNecesarios + 'gastosEconomicaEconomicos.json');
    }
}

verificarCodigosReferencia();
