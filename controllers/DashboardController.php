<?php

namespace Controllers;

use MVC\Router;
use Model\Usuario;
use Model\Tarea;
use Model\Proyecto;


class DashboardController {
    public static function index(Router $router) {

        session_start();
        isAuth();

        $id = $_SESSION['id'];
        $proyectos = Proyecto::belongsTo('propietarioId', $id);

        $router->render('dashboard/index', [
            'titulo' => 'Proyectos',
            'proyectos' => $proyectos
        ]);
    }

    public static function crear_proyecto(Router $router) {
        session_start();
        isAuth();
        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $proyecto = new Proyecto($_POST);

            // validación
            $alertas = $proyecto->validarProyecto();

            if(empty($alertas)) {
                // Generar una URL única 
                $hash = md5(uniqid());
                $proyecto->url = $hash;

                // Almacenar el creador del proyecto
                $proyecto->propietarioId = $_SESSION['id'];

                // Guardar el Proyecto
                $proyecto->guardar();

                // Redireccionar
                header('Location: /proyecto?id=' . $proyecto->url);

            }
        }

        $router->render('dashboard/crear-proyecto', [
            'alertas' => $alertas,
            'titulo' => 'Crear Proyecto'
        ]);
    }

    public static function editar_proyecto(Router $router) {
        session_start();
        isAuth();
        $alertas = [];

        // Obtener el ID del proyecto desde la URL
        $id = $_GET['id'];

        // Verificar que el proyecto exista y pertenezca al usuario autenticado
        $proyecto = Proyecto::find($id);

        if (!$proyecto || $proyecto->propietarioId !== $_SESSION['id']) {
            // Redirigir o mostrar un mensaje de error si el proyecto no existe o no pertenece al usuario
            header('Location: /dashboard');
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Sincronizar los datos del proyecto con los datos del formulario
            $proyecto->sincronizar($_POST);

            // Validar el proyecto
            $alertas = $proyecto->validarProyecto();

            if (empty($alertas)) {
                // Guardar los cambios
                $proyecto->guardar();

                // Redireccionar
                header('Location: /proyecto?id=' . $proyecto->url);
            }
        }

        $router->render('dashboard/editar-proyecto', [
            'alertas' => $alertas,
            'titulo' => 'Editar Proyecto',
            'proyecto' => $proyecto
        ]);
    }

    public static function eliminar_proyecto(Router $router) {
        session_start();
        isAuth();

        // Verificar si se envió el ID del proyecto mediante POST
        $id = $_POST['id'];

        // Verificar que el proyecto exista y pertenezca al usuario autenticado
        $proyecto = Proyecto::find($id);

        if (!$proyecto || $proyecto->propietarioId !== $_SESSION['id']) {
            // Redirigir o mostrar un mensaje de error si el proyecto no existe o no pertenece al usuario
            header('Location: /dashboard');
            return;
        }

        // Eliminar el proyecto
        $proyecto->eliminar();

        // Redirigir a la lista de proyectos
        header('Location: /dashboard');
    }    
    
    // DashboardController.php
public static function duplicar_proyecto(Router $router) {
    session_start();
    isAuth();

    $id = $_POST['id'];
    $proyecto = Proyecto::find($id);

    if (!$proyecto || $proyecto->propietarioId !== $_SESSION['id']) {
        header('Location: /dashboard');
        return;
    }

    $nuevoProyecto = new Proyecto([
        'proyecto' => $proyecto->proyecto . ' (Duplicado)',
        'url' => md5(uniqid()),
        'propietarioId' => $proyecto->propietarioId
    ]);
    $nuevoProyecto->guardar();

    if (!$nuevoProyecto->id) {
        error_log("Error: No se pudo guardar el nuevo proyecto.");
        header('Location: /dashboard');
        return;
    }

    // Obtener las tareas del proyecto original
    $tareas = Tarea::where('proyectoId', $proyecto->id);
    
    // Agregar depuración para verificar las tareas obtenidas
    error_log("Tareas obtenidas: " . print_r($tareas, true));

    foreach ($tareas as $tarea) {
        $nuevaTarea = new Tarea([
            'nombre' => $tarea->nombre,
            'estado' => $tarea->estado,
            'proyectoId' => $nuevoProyecto->id
        ]);
        $nuevaTarea->guardar();

        // Agregar depuración para verificar cada tarea duplicada
        error_log("Nueva tarea duplicada: " . print_r($nuevaTarea, true));
    }

    header('Location: /dashboard');
}


    public static function proyecto(Router $router) {
        session_start();
        isAuth();

        $token = $_GET['id'];
        if(!$token) header('Location: /dashboard');
        // Revisar que la persona que visita el proyecto, es quien lo creo
        $proyecto = Proyecto::where('url', $token);
        if($proyecto->propietarioId !== $_SESSION['id']) {
            header('Location: /dashboard');
        }

        $router->render('dashboard/proyecto', [
            'titulo' => $proyecto->proyecto
        ]);
    }

    public static function perfil(Router $router) {
        session_start();
        isAuth();
        $alertas = [];

        $usuario = Usuario::find($_SESSION['id']);

        if($_SERVER['REQUEST_METHOD'] === 'POST') {

            $usuario->sincronizar($_POST);

            $alertas = $usuario->validar_perfil();

            if(empty($alertas)) {

                $existeUsuario = Usuario::where('email', $usuario->email);

                if($existeUsuario && $existeUsuario->id !== $usuario->id ) {
                    // Mensaje de error
                    Usuario::setAlerta('error', 'Email no válido, ya pertenece a otra cuenta');
                    $alertas = $usuario->getAlertas();
                } else {
                    // Guardar el registro
                    $usuario->guardar();

                    Usuario::setAlerta('exito', 'Guardado Correctamente');
                    $alertas = $usuario->getAlertas();

                    // Asignar el nombre nuevo a la barra
                    $_SESSION['nombre'] = $usuario->nombre;
                }
            }
        }
        
        $router->render('dashboard/perfil', [
            'titulo' => 'Perfil',
            'usuario' => $usuario,
            'alertas' => $alertas
        ]);
    }

    public static function cambiar_password(Router $router) {
        session_start();
        isAuth();

        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario = Usuario::find($_SESSION['id']);

            // Sincronizar con los datos del usuario
            $usuario->sincronizar($_POST);

            $alertas = $usuario->nuevo_password();

            if(empty($alertas)) {
                $resultado = $usuario->comprobar_password();

                if($resultado) {
                    $usuario->password = $usuario->password_nuevo;

                    // Eliminar propiedades No necesarias
                    unset($usuario->password_actual);
                    unset($usuario->password_nuevo);

                    // Hashear el nuevo password
                    $usuario->hashPassword();

                    // Actualizar
                    $resultado = $usuario->guardar();

                    if($resultado) {
                        Usuario::setAlerta('exito', 'Password Guardado Correctamente');
                        $alertas = $usuario->getAlertas();
                    }
                } else {
                    Usuario::setAlerta('error', 'Password Incorrecto');
                    $alertas = $usuario->getAlertas();
                }
            }
        }

        $router->render('dashboard/cambiar-password', [
            'titulo' => 'Cambiar Password',
            'alertas' => $alertas
         ]);
    }
}