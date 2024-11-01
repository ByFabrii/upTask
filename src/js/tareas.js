document.addEventListener('DOMContentLoaded', function() {

    obtenerTareas();
    let tareas = [];
    let filtradas = [];

    // Botón para mostrar el Modal de Agregar tarea
    const nuevaTareaBtn = document.querySelector('#agregar-tarea');
    nuevaTareaBtn.addEventListener('click', function() {
        mostrarFormulario();
    });

   // Atajo de teclado para abrir el modal de agregar tarea
    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key.toLowerCase() === 'n') {
            event.preventDefault();
            mostrarFormulario();
        }
    });

    // Atajo de teclado para cerrar la modal de agregar
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modal = document.querySelector('.modal');
            if (modal) {
                modal.remove(); // Cambia esto a:
                //modal.style.display = "none";
            }
        }
    });



    // Filtros de búsqueda
    const filtros = document.querySelectorAll('#filtros input[type="radio');
    filtros.forEach(radio => {
        radio.addEventListener('input', filtrarTareas);
    });

    function filtrarTareas(e) {
        const filtro = e.target.value;
        console.log('Filtro seleccionado:', filtro);

        if(filtro !== '') {
            filtradas = tareas.filter(tarea => tarea.estado === filtro);
        } else {
            filtradas = [];
        }
        console.log('Tareas filtradas:', filtradas);
        mostrarTareas();
    }

    async function obtenerTareas() {
        mostrarLoader();
        try {
            const id = obtenerProyecto();
            const url = `/api/tareas?id=${id}`;
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();

            console.log('Resultado de obtenerTareas:', resultado);

            tareas = resultado.tareas;
            mostrarTareas();
        
        } catch (error) {
            console.log('Error al obtener tareas:', error);
        } finally {
            ocultarLoader();
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        // Obtener todos los enlaces de duplicar proyecto
        const duplicarProyectoLinks = document.querySelectorAll('.duplicar-proyecto');
    
        duplicarProyectoLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const proyectoId = e.target.dataset.id;
    
                duplicarProyecto(proyectoId);
            });
        });
    
        async function duplicarProyecto(proyectoId) {
            try {
                const datos = new FormData();
                datos.append('id', proyectoId);
    
                const url = '/duplicar-proyecto';
                const respuesta = await fetch(url, {
                    method: 'POST',
                    body: datos
                });
    
                const resultado = await respuesta.json();
                if (resultado.resultado) {
                    Swal.fire('Duplicado!', resultado.mensaje, 'success');
                    // Actualizar la lista de proyectos o realizar alguna acción adicional si es necesario
                    location.reload();
                } else {
                    Swal.fire('Error!', 'No se pudo duplicar el proyecto', 'error');
                }
            } catch (error) {
                console.error('Error al duplicar el proyecto:', error);
                Swal.fire('Error!', 'No se pudo duplicar el proyecto', 'error');
            }
        }
    });


    function crearTareaItem(tarea, esSubtarea = false) {
        const contenedorTarea = document.createElement('LI');
        contenedorTarea.dataset.tareaId = tarea.id;
        contenedorTarea.classList.add('tarea');
    
        // Crear un nuevo contenedor para el nombre y las opciones
        const contenedorNombreYOpciones = document.createElement('DIV');
        contenedorNombreYOpciones.classList.add('nombre-y-opciones');
    
        const nombreTarea = document.createElement('P');
        nombreTarea.textContent = tarea.nombre;
    
        const opcionesDiv = document.createElement('DIV');
        opcionesDiv.classList.add('opciones');
    
        const estados = { 0: 'Pendiente', 1: 'Completa' };
    
        // Botón de estado
        const btnEstadoTarea = document.createElement('BUTTON');
        btnEstadoTarea.classList.add('estado-tarea');
    
        // Comprobamos que el estado esté definido y sea válido
        if (tarea.estado !== undefined && estados[tarea.estado]) {
            btnEstadoTarea.classList.add(estados[tarea.estado].toLowerCase());
            btnEstadoTarea.textContent = estados[tarea.estado];
        } else {
            btnEstadoTarea.classList.add('pendiente'); // Clase por defecto si el estado no es válido
            btnEstadoTarea.textContent = 'Pendiente'; // Texto por defecto si el estado no es válido
        }
    
        // Tareas y Subtareas
        btnEstadoTarea.dataset.estadoTarea = tarea.estado ?? 0; // Estado predeterminado a 0 (Pendiente)
        btnEstadoTarea.onclick = function() {
            if (esSubtarea) {
                cambiarEstadoSubtarea({ ...tarea });
            } else {
                cambiarEstadoTarea({
                    ...tarea,
                    tareaPadreId: null  // Force null for main tasks
                });
            }
        };
    
        // Botón de editar
        const btnEditarTarea = document.createElement('BUTTON');
        btnEditarTarea.classList.add('editar-tarea');
        btnEditarTarea.dataset.idTarea = tarea.id;
    
        const iconoEditar = document.createElement('I');
        iconoEditar.classList.add('fas', 'fa-pencil-alt');
        btnEditarTarea.appendChild(iconoEditar);
    
        btnEditarTarea.onclick = function () {
            if (!esSubtarea) {
                // For main tasks, ensure tareaPadreId is null
                mostrarFormulario(true, { 
                    ...tarea,
                    tareaPadreId: null 
                });
            } else {
                mostrarFormulario(true, { ...tarea });
            }
        };
    
        // Botón de eliminar
        const btnEliminarTarea = document.createElement('BUTTON');
        btnEliminarTarea.classList.add('eliminar-tarea');
        btnEliminarTarea.dataset.idTarea = tarea.id;
    
        const iconoEliminar = document.createElement('I');
        iconoEliminar.classList.add('fas', 'fa-trash-alt');
        btnEliminarTarea.appendChild(iconoEliminar);
    
        btnEliminarTarea.onclick = function () {
            confirmarEliminarTarea({ ...tarea });
        };
    
        opcionesDiv.appendChild(btnEstadoTarea);
        opcionesDiv.appendChild(btnEditarTarea);
        opcionesDiv.appendChild(btnEliminarTarea);
    
        contenedorNombreYOpciones.appendChild(nombreTarea);
        contenedorNombreYOpciones.appendChild(opcionesDiv);
    
        contenedorTarea.appendChild(contenedorNombreYOpciones);
    
        if (!esSubtarea) {
            const btnDropdown = document.createElement('BUTTON');
            btnDropdown.classList.add("desplegar-tarea");
            btnDropdown.dataset.idTarea = tarea.id;
    
            const arrowIcon = document.createElement('I');
            arrowIcon.classList.add('fas', 'fa-chevron-down');
            btnDropdown.appendChild(arrowIcon);
    
            const contenedorSubtareas = document.createElement('DIV');
            contenedorSubtareas.classList.add('subtareas');
            contenedorSubtareas.style.display = 'none';
    
            const subtareasList = document.createElement('UL');
            contenedorSubtareas.appendChild(subtareasList);

            btnDropdown.onclick = function() {
                const taskId = this.dataset.idTarea;
                if (contenedorSubtareas.style.display === 'none') {
                    mostrarSubtareas(tarea.subtareas, subtareasList);
                    contenedorSubtareas.style.display = 'block';
                    openDropdowns.add(taskId);
                } else {
                    contenedorSubtareas.style.display = 'none';
                    openDropdowns.delete(taskId);
                }
            };

            const btnAgregarSubtarea = document.createElement('BUTTON');
            btnAgregarSubtarea.classList.add('agregar-subtarea');
            btnAgregarSubtarea.dataset.idTarea = tarea.id;

            const iconoSubtarea = document.createElement('I');
            iconoSubtarea.classList.add('fas', 'fa-plus');
            btnAgregarSubtarea.appendChild(iconoSubtarea);

            btnAgregarSubtarea.onclick = function() {
                mostrarFormulario(false, { tareaPadreId: tarea.id });
            };
    
            opcionesDiv.appendChild(btnAgregarSubtarea);
            opcionesDiv.appendChild(btnDropdown);
            contenedorTarea.appendChild(contenedorSubtareas);
        }
    
        return contenedorTarea;
    }
    
    const openDropdowns = new Set();
    
    function mostrarTareas() {
        limpiarTareas();
        totalPendientes();
        totalCompletas();

        const arrayTareas = filtradas.length ? filtradas : tareas;
        const listadoTareas = document.querySelector('#listado-tareas');

        if (arrayTareas.length === 0) {
            const textoNoTareas = document.createElement('LI');
            textoNoTareas.textContent = 'No Hay Tareas';
            textoNoTareas.classList.add('no-tareas');
            listadoTareas.appendChild(textoNoTareas);
            return;
        }

        // Remember which tasks had open subtasks
        const openStates = new Set(openDropdowns);

        arrayTareas.forEach(tarea => {
            const tareaElement = crearTareaItem(tarea, false);
            listadoTareas.appendChild(tareaElement);
            
            if (openStates.has(tarea.id.toString())) {
                const contenedorSubtareas = tareaElement.querySelector('.subtareas');
                const subtareasList = contenedorSubtareas.querySelector('ul');
                mostrarSubtareas(tarea.subtareas, subtareasList);
                contenedorSubtareas.style.display = 'block';
            }
        });
    }
    
    function mostrarSubtareas(subtareas, contenedorSubtareas) {
        contenedorSubtareas.innerHTML = '';
    
        if (subtareas.length === 0) {
            const noSubtareas = document.createElement('LI');
            noSubtareas.textContent = 'No hay subtareas relacionadas';
            contenedorSubtareas.appendChild(noSubtareas);
        } else {
            subtareas.forEach(subtarea => {
                const subtareaItem = crearTareaItem(subtarea, true);
                contenedorSubtareas.appendChild(subtareaItem);
            });
        }
    }
    
    

    function totalPendientes() {
        const totalPendientes = tareas.filter(tarea => tarea.estado === "0");
        const pendientesRadio = document.querySelector('#pendientes');

        if(totalPendientes.length === 0) {
            pendientesRadio.disabled = true;
        } else {
            pendientesRadio.disabled = false;
        }   
    }

    function totalCompletas() {
        const totalCompletas = tareas.filter(tarea => tarea.estado === "1");
        const completasRadio = document.querySelector('#completadas');

        if(totalCompletas.length === 0) {
            completasRadio.disabled = true;
        } else {
            completasRadio.disabled = false;
        }   
    }

    function mostrarFormulario(editar = false, tarea = {}) {
        console.log(tarea);
        const modal = document.createElement('DIV');
        modal.classList.add('modal');
        modal.innerHTML = `
            <form class="formulario nueva-tarea">
                <legend>${editar ? 'Editar Tarea' : 'Añade una nueva tarea'}</legend>
                <div class="campo">
                    <label>Tarea</label>
                    <input 
                        type="text"
                        name="tarea"
                        placeholder="${tarea.nombre ? 'Edita la Tarea' : 'Añadir Tarea al Proyecto Actual'}"
                        id="tarea"
                        value="${tarea.nombre ? tarea.nombre : ''}"
                        autofocus
                    />
                </div>
                <div class="campo">
                    <label>Descripción</label>
                    <textarea 
                        type="text"
                        name="descripcion"
                        placeholder="${tarea.descripcion ? 'Edita la descripcion' : 'Añadir descripcion a la tarea Actual'}"
                        id="descripcion"
                        value="${tarea.descripcion ? tarea.descripcion : ''}"
                        autofocus
                    /></textarea>
                </div>
                <div class="opciones">
                    <input 
                        type="submit" 
                        class="submit-nueva-tarea" 
                        value="${tarea.nombre ? 'Guardar Cambios' : 'Añadir Tarea'} " 
                    />
                    <button type="button" class="cerrar-modal">Cancelar</button>
                </div>
            </form>
        `;
    
        setTimeout(() => {
            const formulario = document.querySelector('.formulario');
            formulario.classList.add('animar');
            document.querySelector('#tarea').focus();  // Auto-focus en el campo de tarea
        }, 150);
    
        modal.addEventListener('click', function(e) {
            e.preventDefault();
            if(e.target.classList.contains('cerrar-modal')) {
                const formulario = document.querySelector('.formulario');
                formulario.classList.add('cerrar');
                setTimeout(() => {
                    modal.remove();
                }, 500);
            } 
            if(e.target.classList.contains('submit-nueva-tarea')) {
                const nombreTarea = document.querySelector('#tarea').value.trim();
            
                if(nombreTarea === '') {
                    mostrarAlerta('El Nombre de la tarea es Obligatorio', 'error');
                    return;
                } 
            
                if(editar) {
                    tarea.nombre = nombreTarea;
                    actualizarSubtarea(tarea).then(() => {
                        // Close the form after successful update
                        const formulario = document.querySelector('.formulario');
                        formulario.classList.add('cerrar');
                        
                        // Remove the modal after animation
                        setTimeout(() => {
                            const modal = document.querySelector('.modal');
                            if (modal) {
                                modal.remove();
                            }
                        }, 500);
                    });
                } else {

                    if(tarea.tareaPadreId) {
                        agregarTarea(nombreTarea, tarea.tareaPadreId);
                    } else {
                        agregarTarea(nombreTarea);
                    }
                }
            }
        });
    
        document.querySelector('.dashboard').appendChild(modal);
    }
    

    // Muestra un mensaje en la interfaz
    function mostrarAlerta(mensaje, tipo, referencia) {
        console.log(`Mostrando alerta: ${mensaje} de tipo ${tipo}`);
        // Previene la creación de multiples alertas
        const alertaPrevia = document.querySelector('.alerta');
        if(alertaPrevia) {
            alertaPrevia.remove();
        }

        const alerta = document.createElement('DIV');
        alerta.classList.add('alerta', tipo);
        alerta.textContent = mensaje;

        // Inserta la alerta antes del legend
        referencia.parentElement.insertBefore(alerta, referencia.nextElementSibling);

        // Eliminar la alerta después de 5 segundos
        setTimeout(() => {
            alerta.remove();
        }, 5000);
    }

    // Funciones para mostrar y ocultar el loader
    function mostrarLoader() {
        const loader = document.getElementById('loader');
        if(loader) {
            loader.style.display = 'flex';
        }
    }

    function ocultarLoader() {
        const loader = document.getElementById('loader');
        if(loader) {
            loader.style.display = 'none';
        }
    }

    // Consultar el Servidor para añadir una nueva tarea al proyecto actual
    async function agregarTarea(tarea, tareaPadreId) {
        mostrarLoader();
        // Construir la petición
        const datos = new FormData();
        datos.append('nombre', tarea);
        datos.append('proyectoId', obtenerProyecto());
        if (tareaPadreId) {
            datos.append('tareaPadreId', tareaPadreId);
        }


        try {
            const url = '/api/tarea';
            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            });
            
            const resultado = await respuesta.json();
            
            mostrarAlerta(
                resultado.mensaje, 
                resultado.tipo, 
                document.querySelector('.formulario legend')
            );

            if(resultado.tipo === 'exito') {
                const modal = document.querySelector('.modal');
                setTimeout(() => {
                    modal.remove();
                }, 500);

                // Agregar el objeto de tarea al global de tareas
                const tareaObj = {
                    id: String(resultado.id),
                    nombre: tarea,
                    estado: "0",
                    proyectoId: resultado.proyectoId,
                    tareaPadreId: tareaPadreId
                }

                if (tareaPadreId) {
                    // Encontrar la tarea padre y actualizar sus subtareas
                    const tareaPadre = tareas.find(t => t.id === tareaPadreId);
                    if (tareaPadre) {
                        if (!tareaPadre.subtareas) {
                            tareaPadre.subtareas = [];
                        }
                        tareaPadre.subtareas.push(tareaObj);
                        
                        // Actualizar el DOM de las subtareas
                        const contenedorSubtareas = document.querySelector(`li[data-tarea-id="${tareaPadreId}"] .subtareas ul`);
                        if (contenedorSubtareas) {
                            mostrarSubtareas(tareaPadre.subtareas, contenedorSubtareas);
                        }
                    }
                } else {
                    // Es una tarea principal
                    tareas = [...tareas, tareaObj];
                }
                
                mostrarTareas();

            }
        } catch (error) {
            console.log(error);
        } finally {
            ocultarLoader();
        }
    }

    // // Consultar el Servidor para añadir una nueva subtarea al proyecto actual
    // async function agregarSubtarea(tarea, tareaPadreId) {
    //     mostrarLoader();
    //     // Construir la petición
    //     const datos = new FormData();
    //     datos.append('nombre', tarea);
    //     datos.append('proyectoId', obtenerProyecto());
    //     datos.append('tareaPadreId', tareaPadreId);

    //     try {
    //         const url = '/api/tarea';
    //         const respuesta = await fetch(url, {
    //             method: 'POST',
    //             body: datos
    //         });
            
    //         const resultado = await respuesta.json();
            
    //         mostrarAlerta(
    //             resultado.mensaje, 
    //             resultado.tipo, 
    //             document.querySelector('.formulario legend')
    //         );

    //         if(resultado.tipo === 'exito') {
    //             const modal = document.querySelector('.modal');
    //             setTimeout(() => {
    //                 modal.remove();
    //             }, 500);

    //             // Agregar el objeto de tarea al global de tareas
    //             const tareaObj = {
    //                 id: String(resultado.id),
    //                 nombre: tarea,
    //                 estado: "0",
    //                 proyectoId: resultado.proyectoId,
    //                 tareaPadreId: tareaPadreId
    //             }

    //             tareas = [...tareas, tareaObj];
    //             mostrarSubtareas();

    //         }
    //     } catch (error) {
    //         console.log(error);
    //     } finally {
    //         ocultarLoader();
    //     }
    // }

    function cambiarEstadoTarea(tarea) {
        const nuevoEstado = tarea.estado === "1" ? "0" : "1";
        console.log(`Cambiando estado de la tarea ID ${tarea.id} de ${tarea.estado} a ${nuevoEstado}`);
        
        // Create a new object without tareaPadreId
        const { tareaPadreId, ...restTarea } = tarea;
        actualizarSubtarea({
            ...restTarea,
            estado: nuevoEstado
        });
    }

    function cambiarEstadoSubtarea(subtarea) {
        const nuevoEstado = subtarea.estado === "1" ? "0" : "1";
        console.log(`Cambiando estado de la subtarea ID ${subtarea.id} de ${subtarea.estado} a ${nuevoEstado}`);
        subtarea.estado = nuevoEstado;
        actualizarSubtarea(subtarea);
    }

    async function actualizarSubtarea(subtarea) {
        mostrarLoader();
    
        const { estado, id, nombre, proyectoId, tareaPadreId } = subtarea;
    
        const datos = new FormData();
        datos.append('id', id);
        datos.append('nombre', nombre);
        datos.append('estado', estado);
        datos.append('proyectoId', proyectoId);
    
        if (tareaPadreId) {
            datos.append('tareaPadreId', tareaPadreId);
        }
    
        try {
            const url = '/api/tarea/actualizar';
            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            });
    
            const resultado = await respuesta.json();
            if (resultado.exito) {
                let itemIndex;
                if (tareaPadreId) {
                    const tareaPadre = tareas.find(t => t.id === tareaPadreId);
                    if (tareaPadre && tareaPadre.subtareas) {
                        itemIndex = tareaPadre.subtareas.findIndex(st => st.id === id);
                        if (itemIndex !== -1) {
                            tareaPadre.subtareas[itemIndex] = {
                                ...tareaPadre.subtareas[itemIndex],
                                estado,
                                nombre,
                                proyectoId
                            };
                        }
                    }
                } else {
                    itemIndex = tareas.findIndex(t => t.id === id);
                    if (itemIndex !== -1) {
                        tareas[itemIndex] = {
                            ...tareas[itemIndex],
                            estado,
                            nombre,
                            proyectoId
                        };
                    }
                }
    
                mostrarTareas();
                Swal.fire({
                    title: 'Estado actualizado',
                    text: `El estado de la ${tareaPadreId ? 'subtarea' : 'tarea'} "${nombre}" ha sido actualizado.`,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            ocultarLoader();
        }
    }
    

    function confirmarEliminarTarea(tarea) {
        Swal.fire({
            title: '¿Eliminar Tarea?',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarTarea(tarea);
            } 
        });
    }

    async function eliminarTarea(tarea) {
        mostrarLoader();

        const {estado, id, nombre} = tarea;
        
        const datos = new FormData();
        datos.append('id', id);
        datos.append('nombre', nombre);
        datos.append('estado', estado);
        datos.append('proyectoId', obtenerProyecto());

        try {
            const url = '/api/tarea/eliminar';
            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            });

            const resultado = await respuesta.json();
            if(resultado.resultado) {
                Swal.fire('Eliminado!', resultado.mensaje, 'success');

                tareas = tareas.filter(tareaMemoria => tareaMemoria.id !== tarea.id);
                mostrarTareas();
            }
        } catch (error) {
            console.log(error);
        } finally {
            ocultarLoader();
        }
    }

    function obtenerProyecto() {
        const proyectoParams = new URLSearchParams(window.location.search);
        const proyecto = Object.fromEntries(proyectoParams.entries());
        return proyecto.id;
    }



    function limpiarTareas() {
        const listadoTareas = document.querySelector('#listado-tareas');
        while(listadoTareas.firstChild) {
            listadoTareas.removeChild(listadoTareas.firstChild);
        }
    }

});
