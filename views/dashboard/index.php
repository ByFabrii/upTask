<?php include_once __DIR__ . '/header-dashboard.php'; ?>

<div class="container">
    <?php if(count($proyectos) === 0 ) { ?>
        <p class="no-proyectos">No Hay Proyectos Aún <a href="/crear-proyecto">Comienza creando uno</a></p>
    <?php } else { ?>
        <ul class="listado-proyectos">
            <?php foreach($proyectos as $proyecto) { ?>
                <li class="proyecto d-flex justify-content-between align-items-center">
                    <a href="/proyecto?id=<?php echo $proyecto->url; ?>">
                        <?php echo $proyecto->proyecto; ?>
                    </a>
                    <!-- Botón con menú desplegable -->
                    <div class="dropdown">
                        <button class="dropbtn"><i class="fas fa-ellipsis-v"></i></button>
                        <div class="dropdown-content">
                            <a href="/editar-proyecto?id=<?php echo $proyecto->id; ?>">Editar</a>
                            <!-- Formulario para duplicar proyecto -->
                            <form method="POST" action="/duplicar-proyecto" style="display:inline;">
                                <input type="hidden" name="id" value="<?php echo $proyecto->id; ?>">
                                <button type="submit" class="link-button">Duplicar</button>
                            </form>
                            <form method="POST" action="/eliminar-proyecto">
                                <input type="hidden" name="id" value="<?php echo $proyecto->id; ?>">
                                <button type="submit" class="link-button">Eliminar</button>
                            </form>
                        </div>
                    </div>

                </li>
            <?php } ?>
        </ul>
    <?php } ?>
</div>

<?php include_once __DIR__ . '/footer-dashboard.php'; ?>

<!-- Incluye Font Awesome para los íconos -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

<!-- Añade tus estilos CSS -->
<style>
/* styles.css */

body {
    font-family: 'Open Sans', sans-serif;
    background-color: #1F2937; /* Cambiado a un color de fondo oscuro */
    color: #D1D5DB; /* Cambiado a un color de texto claro */
    margin: 0;
    padding: 0;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

header {
    background-color: #2563EB;
    color: white;
    padding: 20px 0;
    text-align: center;
}

header h1 {
    margin: 0;
}

nav ul {
    list-style: none;
    padding: 0;
}

nav ul li {
    display: inline;
    margin-right: 15px;
}

nav ul li a {
    color: white;
    text-decoration: none;
}

.no-proyectos {
    background-color: #4B5563; /* Cambiado a un color de fondo oscuro */
    border: 1px solid #F59E0B;
    padding: 20px;
    text-align: center;
    border-radius: 8px;
}

.no-proyectos a {
    color: #2563EB;
    text-decoration: none;
}

.listado-proyectos {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
}

.proyecto {
    background-color: #374151; /* Cambiado a un color de fondo oscuro */
    border: 1px solid #4B5563;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    transition: transform 0.3s;
    position: relative; /* Asegura que los elementos posicionados dentro de .proyecto se posicionen relativos a este */
}

.proyecto:hover {
    /* transform: translateY(-5px); */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Aumentado el sombreado */
}

a {
    color: #F59E0B; /* Cambiado a un color azul claro */
    text-decoration: none;
    font-weight: bold;
}

/* Estilos para el menú desplegable */
.dropdown {
    position: absolute;
    top: 10px;
    right: 10px;
    display: inline-block;
}

.dropbtn {
    background: none;
    border: none;
    color: #F59E0B; /* Cambiado a un color azul claro */
    font-size: 17px;
    cursor: pointer;
    outline: none;
}

.dropdown-content {
    display: none;
    position: absolute;
    right: 0;
    background-color: #374151; /* Cambiado a un color de fondo oscuro */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.7); /* Aumentado el sombreado */
    z-index: 1;
    min-width: 100px;
    border-radius: 8px;
    overflow: hidden;
}

.dropdown-content a {
    color: #D1D5DB; /* Cambiado a un color de texto claro */
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    font-size: 13px;
}

.dropdown-content a:hover {
    background-color: #1F2937; /* Cambiado a un color de fondo más oscuro al pasar el mouse */
}

.dropdown.show .dropdown-content {
    display: block;
}

/* Estilos para el botón en el formulario */
.link-button {
    background: none;
    border: none;
    color: #D1D5DB; /* Mismo color que los enlaces */
    text-decoration: none;
    font-weight: bold;
    cursor: pointer;
    padding: 12px 16px; /* Ajustado para coincidir con el padding de los enlaces */
    font-size: 13px; /* Tamaño de fuente ajustado */
    width: 100%;
    text-align: center;
}

.link-button:hover {
    background-color: #1F2937; /* Cambiado a un color de fondo más oscuro al pasar el mouse */
    text-decoration: none;
}
</style>


<!-- Incluye SweetAlert -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Obtener todos los botones de eliminar
    var eliminarButtons = document.querySelectorAll('.link-button');

    // Agregar evento de click a cada botón de eliminar
    eliminarButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // Prevenir el envío del formulario

            // Mostrar la alerta de confirmación
            Swal.fire({
                title: '¿Eliminar Proyecto?',
                text: "Esta acción no se puede deshacer.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Enviar el formulario
                    button.closest('form').submit();
                }
            });
        });
    });
});
</script>


<!-- Añade tu script JS -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Obtener todos los botones de dropdown
    var dropdownButtons = document.querySelectorAll('.dropbtn');

    // Agregar evento de click a cada botón de dropdown
    dropdownButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            // Evitar que el click se propague
            event.stopPropagation();

            // Cerrar cualquier otro menú abierto
            var openDropdowns = document.querySelectorAll('.dropdown.show');
            openDropdowns.forEach(function(openDropdown) {
                if (openDropdown !== button.parentElement) {
                    openDropdown.classList.remove('show');
                }
            });

            // Alternar el menú desplegable actual
            button.parentElement.classList.toggle('show');
        });
    });

    // Cerrar el menú desplegable si se hace click fuera de él
    document.addEventListener('click', function() {
        var openDropdowns = document.querySelectorAll('.dropdown.show');
        openDropdowns.forEach(function(openDropdown) {
            openDropdown.classList.remove('show');
        });
    });
});
</script>
