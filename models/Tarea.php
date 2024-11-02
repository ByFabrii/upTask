<?php

namespace Model;

use Model\ActiveRecord;

class Tarea extends ActiveRecord {
    protected static $tabla = 'tareas';
    protected static $columnasDB = ['id', 'nombre', 'descripcion', 'estado', 'proyectoId', 'tareaPadreId'];

    public $id;
    public $nombre;
    public $descripcion;
    public $estado;
    public $proyectoId;
    public $tareaPadreId;

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->descripcion = $args['descripcion'] ?? '';
        $this->estado = $args['estado'] ?? '';
        $this->proyectoId = $args['proyectoId'] ?? '';
        $this->tareaPadreId = $args['tareaPadreId'] ?? null;
    }

    public function validarTarea() {
        if (!$this->nombre) {
            self::$alertas['error'][] = 'El nombre de la tarea es obligatorio';
        }
        return self::$alertas;
    }

    public function guardar() {
        return parent::guardar();
    }

    public static function where($column, $value) {
        return parent::where($column, $value);
    }

    public function eliminar() {
        return parent::eliminar();
    }
}
