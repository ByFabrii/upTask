<?php
$nombre = $proyecto->proyecto ?? '';
$descripcion = $proyecto->descripcion ?? '';
?>

<div class="campo">
    <label for="proyecto">Nombre del Proyecto</label>
    <input type="text" id="proyecto" name="proyecto" value="<?php echo htmlspecialchars($nombre); ?>" maxlength="60" placeholder = "<?php echo htmlspecialchars($nombre) ? 'Edita nombre del proyecto' : 'Agrega nombre del proyecto'; ?>" autofocus>
</div>
<div class="campo">
    <label for="descripcion">Descripción del Proyecto</label>
    <input type="text" id="descripcion" name="descripcion" value="<?php echo htmlspecialchars($descripcion); ?>" maxlength="500" placeholder = "<?php echo htmlspecialchars($nombre) ? 'Edita la descripcion del proyecto' : 'Agrega descripcion del proyecto'; ?>" autofocus>
</div>