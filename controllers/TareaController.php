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
        
        if(!$proyecto || $proyecto->propietarioId !== $_SESSION['id']) 
            header('Location: /404');
    
        $tareas = Tarea::belongsTo('proyectoId', $proyecto->id);
        $tareasOrganizadas = [];
        
        // Primero organizamos las tareas principales
        foreach($tareas as $tarea) {
            if(is_null($tarea->tareaPadreId)) {
                $tareasOrganizadas[$tarea->id] = [
                    'id' => $tarea->id,
                    'nombre' => $tarea->nombre,
                    'descripcion' => $tarea->descripcion,
                    'estado' => $tarea->estado,
                    'proyectoId' => $tarea->proyectoId,
                    'subtareas' => []
                ];
            }
        }
        
        // Luego organizamos las subtareas
        foreach($tareas as $tarea) {
            if(!is_null($tarea->tareaPadreId) && isset($tareasOrganizadas[$tarea->tareaPadreId])) {
                $tareasOrganizadas[$tarea->tareaPadreId]['subtareas'][] = [
                    'id' => $tarea->id,
                    'nombre' => $tarea->nombre,
                    'descripcion' => $tarea->descripcion,
                    'estado' => $tarea->estado,
                    'proyectoId' => $tarea->proyectoId,
                    'tareaPadreId' => $tarea->tareaPadreId
                ];
            }
        }
        
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
    
            // Simplificar manejo de tareaPadreId
            $tareaPadreId = $_POST['tareaPadreId'] ?? NULL;
    
            // Todo bien, instanciar y crear la tarea
            $tarea = new Tarea([
                'nombre' => $_POST['nombre'],
                'estado' => '0',
                'tareaPadreId' => $tareaPadreId,
                'descripcion' => $_POST['descripcion'] ?? ''
            ]);
            
            $tarea->proyectoId = $proyecto->id;
            $resultado = $tarea->guardar();
    
            if($resultado) {
                $respuesta = [
                    'tipo' => 'exito',
                    'id' => $resultado['id'],
                    'mensaje' => 'Tarea Creada Correctamente',
                    'proyectoId' => $proyecto->id
                ];
            } else {
                $respuesta = [
                    'tipo' => 'error',
                    'mensaje' => 'Hubo un error al crear la tarea'
                ];
            }
    
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
        if($_SERVER['REQUEST_METHOD'] === 'DELETE') {
            session_start();
            
            // Obtener el ID y el flag de eliminarSubtareas
            $id = $_GET['id'];
            $eliminarSubtareas = isset($_GET['eliminarSubtareas']) && $_GET['eliminarSubtareas'] === 'true';
            
            $tarea = Tarea::find($id);
            if(!$tarea) {
                $respuesta = [
                    'tipo' => 'error',
                    'mensaje' => 'La tarea no existe'
                ];
                echo json_encode($respuesta);
                return;
            }
    
            $resultado = true; // Para rastrear si todas las eliminaciones fueron exitosas
    
            // Si se solicita eliminar subtareas
            if($eliminarSubtareas) {
                // Primero eliminar todas las subtareas
                $subtareas = Tarea::whereAll('tareaPadreId', $id);
                foreach($subtareas as $subtarea) {
                    if(!$subtarea->eliminar()) {
                        $resultado = false;
                        break;
                    }
                }
            }
    
            // Solo eliminar la tarea principal si las subtareas se eliminaron correctamente
            if($resultado) {
                $resultado = $tarea->eliminar();
            }
    
            $respuesta = [
                'resultado' => $resultado,
                'mensaje' => $resultado ? 
                    ($eliminarSubtareas ? 'Tarea y subtareas eliminadas correctamente' : 'Tarea eliminada correctamente') : 
                    'Error al eliminar la tarea'
            ];
            
            echo json_encode($respuesta);
        }
    }
}