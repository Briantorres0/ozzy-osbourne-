document.addEventListener('DOMContentLoaded', () => {
  const dataForm = document.getElementById('data-form');
  const itemTitulo = document.getElementById('item-titulo');
  const itemAño = document.getElementById('item-año');
  const itemMejorCancion = document.getElementById('item-mejor-cancion');
  const tableBody = document.getElementById('table-body');
  const addItemBtn = document.getElementById('add-item-btn');
  const updateItemBtn = document.getElementById('update-item-btn');
  const statusMessage = document.getElementById('status-message');

  // Modal de confirmación
  const confirmationModal = document.getElementById('confirmation-modal');
  const confirmDeleteBtn = confirmationModal.querySelector('.confirm-btn');
  const cancelDeleteBtn = confirmationModal.querySelector('.cancel-btn');
  let itemToDeleteId = null;
    // Para almacenar el ID del elemento a eliminar

  let editingItemId = null;
    // Para almacenar el ID del elemento que se está editando

  const items = [] ;

  // Función para mostrar mensajes de estado (error/éxito)
  function showMessage(element, message, type = 'error') {
    element.textContent = message;
    element.classList.remove('hidden', 'error', 'success');
    element.classList.add(type); // Añadir la clase de tipo
    setTimeout(() => {
      element.classList.add('hidden');
    }, 5000); // Ocultar mensaje después de 5 segundos
  }

  function setEditingItem( id ) {
    itemToDeleteId = null;
    editingItemId = id;
    addItemBtn.style.display = 'none';
    updateItemBtn.style.display = 'inline-block';
  }

  function resetEditingItem() {
    editingItemId = null;
    addItemBtn.style.display = 'inline-block';
    updateItemBtn.style.display = 'none';
  }

  // Función para renderizar la tabla con los datos
  function renderTable(data) {
    tableBody.innerHTML = ''; // Limpiar tabla
    if (data.length === 0) {
      const row = document.createElement( 'tr' ) ;
      const empty = document.createElement( 'td' ) ;
      empty.setAttribute( 'colspan' , 5 ) ;
      empty.classList.add( 'empty' ) ;
      empty.textContent = 'No hay albums para mostrar.' ;
      row.appendChild( empty ) ;
      tableBody.appendChild( row ) ;
      return;
    }
    data.forEach( ( item , index ) => {
      const row = document.createElement('tr') ;
      item.id = index + 1 ;
      [ 'id', 'titulo', 'año', 'mejorCancion'  ].forEach( attr => {
        const td = document.createElement('td') ;
        td.textContent=item[attr] ;
        row.appendChild( td ) ;
      } ) ;

      const actions = document.createElement('td') ;
      actions.classList.add( 'table-actions' ) ;
      const edit = document.createElement('button') ;
      edit.classList.add( 'edit-btn' ) ;
      edit.textContent = 'Editar' ;
      edit.addEventListener( 'click' , (e) => {
        setEditingItem( item.id ) ;
        itemTitulo.value = item.titulo;
        itemAño.value = item.año;
        itemMejorCancion.value = item.mejorCancion;
      } ) ;
      actions.appendChild( edit ) ;

      const del = document.createElement('button') ;
      del.classList.add( 'delete-btn' ) ;
      del.textContent = 'Eliminar' ;
      del.addEventListener( 'click' , (e) => {
        itemToDeleteId = item.id;
        resetEditingItem();
        dataForm.reset();
        confirmationModal.style.display = 'flex'; // Muestra el modal
      } ) ;
      actions.appendChild( del ) ;
      row.appendChild( actions ) ;
      tableBody.appendChild(row);
    });
  }

  // Función para cargar datos al DOM desde el arreglo de items.
  function loadData() {
    renderTable( items ) ;
  }

  // Manejar el envío del formulario (Agregar/Actualizar)
  dataForm.addEventListener( 'submit', (event) => {
    event.preventDefault() ;
    const titulo = itemTitulo.value.trim() ;
    const año = parseFloat( itemAño.value ) ;
    const mejorCancion = itemMejorCancion.value.trim() ;

    if( !titulo || isNaN( año ) || !mejorCancion ) {
      showMessage( statusMessage,
        'Por favor completa todos los campos correctamente.' ) ;
      return;
    }

    const itemData = { titulo, año, mejorCancion } ;

    if( editingItemId ) {
      items[editingItemId-1] = itemData ;
      
      showMessage( statusMessage,
        'Album actualizado con éxito.', 'success' ) ;
    } else {
      items.push( itemData ) ;
      showMessage( statusMessage, 'Album agregado con éxito.', 'success' ) ;
    }
    resetEditingItem() ;
    dataForm.reset() ;
    loadData() ; // Recargar datos después de la operación
  } ) ;

  dataForm.addEventListener( 'reset' , resetEditingItem ) ;

  // Lógica del modal de confirmación
  confirmDeleteBtn.addEventListener('click', () => {
    confirmationModal.style.display = 'none'; // Oculta el modal

    if(itemToDeleteId) {
      items.splice( itemToDeleteId - 1 , 1 ) ; // Elimina el elemento de items
      showMessage( statusMessage,
        'Album eliminado con éxito.', 'success' ) ;
      loadData() ; // Recargar datos después de eliminar
      itemToDeleteId = null; // Limpiar el ID después de la operación
    }
  } ) ;

  cancelDeleteBtn.addEventListener('click', () => {
    confirmationModal.style.display = 'none'; // Oculta el modal
    itemToDeleteId = null; // Limpiar el ID
  } ) ;

  // Cargar los datos iniciales al cargar la página
  loadData() ;
} ) ;
