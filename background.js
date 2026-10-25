async function actualizarReglas() {
  // 1. Obtener la lista de palabras desde el almacenamiento
  let data = await browser.storage.local.get("palabrasBloqueadas");
  let palabras = data.palabrasBloqueadas || [];

  // 2. Mapear las palabras a un formato de regla "regexFilter"
  let nuevasReglas = palabras.map((palabra, index) => {
    return {
      "id": index + 1, // El ID debe ser un número entero único
      "priority": 1,
      "action": { "type": "block" },
      "condition": {
        // Verifica si la palabra clave existe en cualquier parte de la URL
        "regexFilter": `.*${palabra}.*`,
        // Solo bloquea la navegación principal, permitiendo sub-recursos inofensivos
        "resourceTypes": ["main_frame"] 
      }
    };
  });

  // 3. Obtener las reglas existentes para reemplazarlas
  let reglasActuales = await browser.declarativeNetRequest.getDynamicRules();
  let idsABorrar = reglasActuales.map(regla => regla.id);

  // 4. Actualizar el motor del navegador
  await browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: idsABorrar,
    addRules: nuevasReglas
  });
}

// Ejecutar la actualización si el usuario añade palabras en la página de opciones
browser.storage.onChanged.addListener(actualizarReglas);