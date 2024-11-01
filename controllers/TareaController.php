<?php

namespace Controllers;

use Model\Proyecto;
use Model\Tarea;

class TareaController {
    public static function index() {
        $proyectoId = $_GET['id'];

        if(!$proyectoId) header('Location: /dashboard');

        $proyecto = Proyecto::where('url', $proyectoId);

        session_start();

        if(!$proyecto || $proyecto->propietarioId !== $_SESSION['id']) header('Location: /404');

        // Obtiene todas las tareas relacionadas con el proyecto
        $tareas = Tarea::belongsTo('proyectoId', $proyecto->id);

        // Organiza tareas y subtareas en un array
        $tareasOrganizadas = [];
        foreach($tareas as $tarea) {
            // Si `tareaPadreId` es null, es una tarea principal
            if(is_null($tarea->tareaPadreId)) {
                $tareasOrganizadas[$tarea->id] = [
                    'id' => $tarea->id,
                    'nombre' => $tarea->nombre,
                    'descripcion' => $tarea->descripcion,
                    'estado' => $tarea->estado,
                    'proyectoId' => $tarea->proyectoId,
                    'subtareas' => [] // Array para almacenar subtareas
                ];
            } else {
                // Es una subtarea, la añadimos a su tarea padre si existe
                if (isset($tareasOrganizadas[$tarea->tareaPadreId])) {
                    $tareasOrganizadas[$tarea->tareaPadreId]['subtareas'][] = [
                        'id' => $tarea->id,
                        'nombre' => $tarea->nombre,
                        'estado' => $tarea->estado,
                        'proyectoId' => $tarea->proyectoId,
                        'tareaPadreId' => $tarea->tareaPadreId
                    ];
                }
            }
        }

        // Convertimos la estructura a JSON
        echo json_encode(['tareas' => array_values($tareasOrganizadas)]);
    }

    public static function crear() {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {

            session_start();

            $proyectoId = $_POST['proyectoId'];

            $proyecto = Proyecto::where('url', $proyectoId);

            if(!$proyecto || $proyecto->propietarioId !== $_SESSION['id']) {
                $respuesta = [
                    'tipo' => 'error',
                    'mensaje' => 'Hubo un Error al agregar la tarea'
                ];
                echo json_encode($respuesta);
                return;
            } 
            
            // Todo bien, instanciar y crear la tarea
            $tarea = new Tarea($_POST);
            $tarea->proyectoId = $proyecto->id;
            $resultado = $tarea->guardar();
            $respuesta = [
                'tipo' => 'exito',
                'id' => $resultado['id'],
                'mensaje' => 'Tarea Creada Correctamente',
                'proyectoId' => $proyecto->id
            ];
            echo json_encode($respuesta);
        }
    }

    public static function actualizar() {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            session_start();
    
            $id = $_POST['id'];
            $nombre = $_POST['nombre'];
            $estado = $_POST['estado'];
            $proyectoId = $_POST['proyectoId'];
            
            // Find the task first
            $tarea = Tarea::find($id);
            if (!$tarea) {
                echo json_encode(['exito' => false, 'mensaje' => 'Tarea no encontrada']);
                return;
            }
    
            // Only update the fields that were sent
            $tarea->nombre = $nombre;
            $tarea->estado = $estado;
            $tarea->proyectoId = $proyectoId;
            
            // Only update tareaPadreId if it was explicitly sent
            if (isset($_POST['tareaPadreId'])) {
                $tarea->tareaPadreId = $_POST['tareaPadreId'];
            }
            // Otherwise keep existing value
            
            $resultado = $tarea->guardar();
    
            echo json_encode([
                'exito' => $resultado, 
                'mensaje' => $resultado ? 'Tarea actualizada correctamente' : 'Error al actualizar la tarea'
            ]);
        }
    }

    public static function eliminar() {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {

            // Validar que el proyecto exista
            $proyecto = Proyecto::where('url', $_POST['proyectoId']);

            session_start();

            if(!$proyecto || $proyecto->propietarioId !== $_SESSION['id']) {
                $respuesta = [
                    'tipo' => 'error',
                    'mensaje' => 'Hubo un Error al actualizar la tarea'
                ];
                echo json_encode($respuesta);
                return;
            } 

            $tarea = new Tarea($_POST);
            $resultado = $tarea->eliminar();


            $resultado = [
                'resultado' => $resultado,
                'mensaje' => 'Eliminado Correctamente',
                'tipo' => 'exito'
            ];
            
            echo json_encode($resultado);
        }
    }
}