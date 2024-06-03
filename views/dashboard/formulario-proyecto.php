<?php
$nombre = $proyecto->proyecto ?? '';
?>

<div class="campo">
    <label for="proyecto">Nombre del Proyecto</label>
    <input type="text" id="proyecto" name="proyecto" value="<?php echo htmlspecialchars($nombre); ?>">
</div>
