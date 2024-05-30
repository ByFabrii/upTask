<!-- Loader -->
<div id="loader" class="hidden">
    <div class="spinner"></div>
</div>


<style>
/* Estilos del loader */
#loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8); /* Color blanco semitransparente */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #4CAF50;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.hidden {
    display: none;
}

</style>
