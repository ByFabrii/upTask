<?php include_once __DIR__ . '/header-dashboard.php'; ?>

<div class="contenedor-sm">
    <?php include_once __DIR__ . '/../templates/alertas.php'; ?>

    <<form method="POST" action="/eliminar-proyecto">
    <input type="hidden" name="id" value="<?php echo $proyecto->id; ?>">
    <button type="submit" onclick="return confirm('¿Estás seguro de que deseas eliminar este proyecto?');">Eliminar</button>
</form>

</div>

<?php include_once __DIR__ . '/footer-dashboard.php'; ?>
