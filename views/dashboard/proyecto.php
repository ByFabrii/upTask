<?php include_once __DIR__  . '/header-dashboard.php'; ?>

<div class="contenedor-md">
    <div class="contenedor-nueva-tarea">
        <button type="button" class="agregar-tarea" id="agregar-tarea">&#43; Nueva Tarea</button>
    </div> 
    <div id="filtros" class="filtros">
        <div class="filtros-inputs">
            <h2>Filtros:</h2>
            <div class="campo">
                <label for="todas">Todas</label>
                <input type="radio" id="todas" name="filtro" value="" checked />
            </div>

            <div class="campo">
                <label for="completadas">Completadas</label>
                <input type="radio" id="completadas" name="filtro" value="1" />
            </div>

            <div class="campo">
                <label for="pendientes">Pendientes</label>
                <input type="radio" id="pendientes" name="filtro" value="0" />
            </div>
        </div>
    </div>

    <ul id="listado-tareas" class="listado-tareas">
        <!-- Ejemplo de tarea estática -->
        <li class="tarea" data-tarea-id="1">
            <p>Tarea de Ejemplo</p>
            <div class="opciones">
                <button class="estado-tarea">Pendiente</button>
                <button class="editar-tarea" data-id-tarea="1">
                    <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="eliminar-tarea" data-id-tarea="1">
                    <i class="fas fa-trash-alt"></i>
                </button>
                <button class="desplegar-tarea" data-id-tarea="1">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            <div class="subtareas" style="display: none;"></div>
        </li>
        <!-- Fin de ejemplo -->
    </ul>
    
</div>

<?php include_once __DIR__ . '/../templates/loader.php'; ?>
<?php include_once __DIR__  . '/footer-dashboard.php'; ?>

<?php
$script .= '
    <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="build/js/tareas.js"></script>
';
?>