document.addEventListener('DOMContentLoaded', () => {
  const inputPalabra = document.getElementById('nuevaPalabra');
  const btnAgregar = document.getElementById('btnAgregar');
  const listaBloqueos = document.getElementById('listaBloqueos');

  // Carga las palabras guardadas y las renderiza en el HTML
  async function cargarLista() {
    let data = await browser.storage.local.get("palabrasBloqueadas");
    let palabras = data.palabrasBloqueadas || [];
    
    // Limpiar el contenido actual para reescribirlo
    listaBloqueos.innerHTML = '';

    palabras.forEach((palabra) => {
      let li = document.createElement('li');
      li.textContent = palabra;

      let btnEliminar = document.createElement('button');
      btnEliminar.textContent = 'Eliminar';
      btnEliminar.className = 'btn-eliminar';
      // Asignar la función de eliminación a este botón específico
      btnEliminar.onclick = () => eliminarPalabra(palabra);

      li.appendChild(btnEliminar);
      listaBloqueos.appendChild(li);
    });
  }

  // Captura el texto, verifica duplicados y guarda en el almacenamiento
  async function agregarPalabra() {
    let nuevaPalabra = inputPalabra.value.trim().toLowerCase();
    
    if (!nuevaPalabra) return;

    let data = await browser.storage.local.get("palabrasBloqueadas");
    let palabras = data.palabrasBloqueadas || [];

    if (!palabras.includes(nuevaPalabra)) {
      palabras.push(nuevaPalabra);
      await browser.storage.local.set({ palabrasBloqueadas: palabras });
      
      inputPalabra.value = ''; 
      cargarLista(); 
    } else {
      alert('Esa palabra ya se encuentra en la lista de bloqueos.');
    }
  }

  // Filtra la palabra a eliminar y actualiza el almacenamiento
  async function eliminarPalabra(palabraAEliminar) {
    let data = await browser.storage.local.get("palabrasBloqueadas");
    let palabras = data.palabrasBloqueadas || [];

    let nuevasPalabras = palabras.filter(p => p !== palabraAEliminar);
    
    await browser.storage.local.set({ palabrasBloqueadas: nuevasPalabras });
    cargarLista();
  }

  // Escuchadores de eventos para la interfaz
  btnAgregar.addEventListener('click', agregarPalabra);

  // Permite agregar la palabra presionando la tecla "Enter"
  inputPalabra.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      agregarPalabra();
    }
  });

  // Ejecutar la carga inicial al abrir la página de configuración
  cargarLista();
});