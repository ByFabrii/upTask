(function() {

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

        if(filtro !== '') {
            filtradas = tareas.filter(tarea => tarea.estado === filtro);
        } else {
            filtradas = [];
        }

        mostrarTareas();
    }

    async function obtenerTareas() {
        mostrarLoader();
        try {
            const id = obtenerProyecto();
            const url = `/api/tareas?id=${id}`;
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();

            tareas = resultado.tareas;
            mostrarTareas();
        
        } catch (error) {
            console.log(error);
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
    

    function mostrarTareas() {
        limpiarTareas();
        totalPendientes();
        totalCompletas();
    
        const arrayTareas = filtradas.length ? filtradas : tareas;
    
        if (arrayTareas.length === 0) {
            const contenedorTareas = document.querySelector('#listado-tareas');
    
            const textoNoTareas = document.createElement('LI');
            textoNoTareas.textContent = 'No Hay Tareas';
            textoNoTareas.classList.add('no-tareas');
    
            contenedorTareas.appendChild(textoNoTareas);
            return;
        }
    
        const estados = {
            0: 'Pendiente',
            1: 'Completa'
        }
    
        arrayTareas.forEach(tarea => {
            const contenedorTarea = document.createElement('LI');
            contenedorTarea.dataset.tareaId = tarea.id;
            contenedorTarea.classList.add('tarea');
    
            const nombreTarea = document.createElement('P');
            nombreTarea.textContent = tarea.nombre;
    
            const opcionesDiv = document.createElement('DIV');
            opcionesDiv.classList.add('opciones');
    
            // Botones
            const btnEstadoTarea = document.createElement('BUTTON');
            btnEstadoTarea.classList.add('estado-tarea');
            btnEstadoTarea.classList.add(`${estados[tarea.estado].toLowerCase()}`);
            btnEstadoTarea.textContent = estados[tarea.estado];
            btnEstadoTarea.dataset.estadoTarea = tarea.estado;
            btnEstadoTarea.onclick = function () {
                cambiarEstadoTarea({ ...tarea });
            }
    
            // Botón de editar tarea con ícono de lápiz
            const btnEditarTarea = document.createElement('BUTTON');
            btnEditarTarea.classList.add('editar-tarea');
            btnEditarTarea.dataset.idTarea = tarea.id;
    
            // Crear el ícono de lápiz usando Font Awesome
            const iconoEditar = document.createElement('I');
            iconoEditar.classList.add('fas', 'fa-pencil-alt'); // Clases de Font Awesome para el ícono de lápiz
    
            // Añadir el ícono al botón
            btnEditarTarea.appendChild(iconoEditar);
    
            btnEditarTarea.onclick = function () {
                mostrarFormulario(true, { ...tarea });
            }
    
            const btnEliminarTarea = document.createElement('BUTTON');
            btnEliminarTarea.classList.add('eliminar-tarea');
            btnEliminarTarea.dataset.idTarea = tarea.id;
    
            // Crear el ícono de bote de basura usando Font Awesome
            const iconoEliminar = document.createElement('I');
            iconoEliminar.classList.add('fas', 'fa-trash-alt'); // Clases de Font Awesome para el ícono de bote de basura
    
            // Añadir el ícono al botón
            btnEliminarTarea.appendChild(iconoEliminar);
    
            btnEliminarTarea.onclick = function () {
                confirmarEliminarTarea({ ...tarea });
            }
    
            opcionesDiv.appendChild(btnEstadoTarea);
            opcionesDiv.appendChild(btnEditarTarea);
            opcionesDiv.appendChild(btnEliminarTarea);
    
            contenedorTarea.appendChild(nombreTarea);
            contenedorTarea.appendChild(opcionesDiv);
    
            const listadoTareas = document.querySelector('#listado-tareas');
            listadoTareas.appendChild(contenedorTarea);
        });
    
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
                    // Mostrar una alerta de error
                    mostrarAlerta('El Nombre de la tarea es Obligatorio', 'error');
                    return;
                } 
    
                if(editar) {
                    tarea.nombre = nombreTarea;
                    actualizarTarea(tarea);
                } else {
                    agregarTarea(nombreTarea);
                }
            }
        });
    
        document.querySelector('.dashboard').appendChild(modal);
    }
    

    // Muestra un mensaje en la interfaz
    function mostrarAlerta(mensaje, tipo, referencia) {
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
    async function agregarTarea(tarea) {
        mostrarLoader();
        // Construir la petición
        const datos = new FormData();
        datos.append('nombre', tarea);
        datos.append('proyectoId', obtenerProyecto());

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
                    proyectoId: resultado.proyectoId
                }

                tareas = [...tareas, tareaObj];
                mostrarTareas();

            }
        } catch (error) {
            console.log(error);
        } finally {
            ocultarLoader();
        }
    }

    function cambiarEstadoTarea(tarea) {
        const nuevoEstado = tarea.estado === "1" ? "0" : "1";
        tarea.estado = nuevoEstado;
        actualizarTarea(tarea);
    }

    async function actualizarTarea(tarea) {
        mostrarLoader();

        const {estado, id, nombre, proyectoId} = tarea;
        
        const datos = new FormData();
        datos.append('id', id);
        datos.append('nombre', nombre);
        datos.append('estado', estado);
        datos.append('proyectoId', obtenerProyecto());

        try {
            const url = '/api/tarea/actualizar';

            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            });
            const resultado = await respuesta.json();

            if(resultado.respuesta.tipo === 'exito') {
                Swal.fire(
                    resultado.respuesta.mensaje,
                    resultado.respuesta.mensaje,
                    'success'
                );

                const modal = document.querySelector('.modal');
                if(modal) {
                    modal.remove();
                }

                tareas = tareas.map(tareaMemoria => {
                    if(tareaMemoria.id === id) {
                        tareaMemoria.estado = estado;
                        tareaMemoria.nombre = nombre;
                    } 

                    return tareaMemoria;
                });

                mostrarTareas();
            }
        } catch (error) {
            console.log(error);
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

})();
