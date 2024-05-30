<?php include_once __DIR__ . '/header-dashboard.php'; ?>

<div class="container">
    <?php if(count($proyectos) === 0 ) { ?>
        <p class="no-proyectos">No Hay Proyectos Aún <a href="/crear-proyecto">Comienza creando uno</a></p>
    <?php } else { ?>
        <ul class="listado-proyectos">
            <?php foreach($proyectos as $proyecto) { ?>
                <li class="proyecto">
                    <a href="/proyecto?id=<?php echo $proyecto->url; ?>">
                        <?php echo $proyecto->proyecto; ?>
                    </a>
                </li>
            <?php } ?>
        </ul>
    <?php } ?>
</div>

<?php include_once __DIR__ . '/footer-dashboard.php'; ?>


<style>

    /* styles.css */

body {
    font-family: 'Open Sans', sans-serif;
    background-color: #f3f4f6;
    color: #4B5563;
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
    background-color: #FFFBEB;
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
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    transition: transform 0.3s;
}
a {
    color: #ffffff;
    text-decoration: none;
    font-weight: bold;
}

.proyecto:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

</style>