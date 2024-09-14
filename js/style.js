    const cuerpo = document.body;
    const alternarModoOscuro = document.getElementById('alternarModoOscuro');
    const alternarNavbar = document.querySelector('.navbar-toggler');
    const colapsoBarraNavegacion = document.getElementById('navbarNav');
    const canvas = document.getElementById('canvas');
    const contextoDibujo = canvas.getContext('2d');

    alternarModoOscuro.addEventListener('click', () => {
        cuerpo.classList.toggle('modo-oscuro');
        actualizarColorParticulas();
    });

    // Solución actualizada para el problema del menú en dispositivos móviles
    let menuAbierto = false;

    alternarNavbar.addEventListener('click', (e) => {
        e.stopPropagation();
        menuAbierto = !menuAbierto;
        colapsoBarraNavegacion.classList.toggle('show', menuAbierto);
    });

    document.addEventListener('click', (e) => {
        if (menuAbierto && !colapsoBarraNavegacion.contains(e.target) && !alternarNavbar.contains(e.target)) {
            menuAbierto = false;
            colapsoBarraNavegacion.classList.remove('show');
        }
    });

    // Cerrar el menú cuando se hace clic en un enlace del menú
    colapsoBarraNavegacion.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) {  // Solo en dispositivos móviles
                menuAbierto = false;
                colapsoBarraNavegacion.classList.remove('show');
            }
        });
    });

    function ajustarTamañoLienzo() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function generarColorVerdeClaro(esOscuro) {
        const verdeBase = esOscuro ? 100 : 155;
        const verdeAleatorio = Math.floor(Math.random() * 100) + verdeBase;
        return `rgba(0, ${verdeAleatorio}, 0, 0.5)`;
    }

    const particulas = [];
    const numeroParticulas = 20;
    const velocidadConstante = 1;

    function inicializarParticulas() {
        const esOscuro = cuerpo.classList.contains('modo-oscuro');
        for (let i = 0; i < numeroParticulas; i++) {
            const color = generarColorVerdeClaro(esOscuro);
            particulas.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                tamaño: Math.random() * 10 + 5,
                velocidadX: (Math.random() - 0.5) * velocidadConstante,
                velocidadY: (Math.random() - 0.5) * velocidadConstante,
                color: color
            });
        }
    }

    function actualizarColorParticulas() {
        const esOscuro = cuerpo.classList.contains('modo-oscuro');
        particulas.forEach(particula => {
            particula.color = generarColorVerdeClaro(esOscuro);
        });
    }

    function actualizarParticulas() {
        particulas.forEach(particula => {
            particula.x += particula.velocidadX;
            particula.y += particula.velocidadY;

            if (particula.x < 0 || particula.x > canvas.width) particula.velocidadX *= -1;
            if (particula.y < 0 || particula.y > canvas.height) particula.velocidadY *= -1;
        });
    }

    function dibujarTriangulo(x, y, tamaño, color) {
        contextoDibujo.beginPath();
        contextoDibujo.moveTo(x, y - tamaño);
        contextoDibujo.lineTo(x - tamaño, y + tamaño);
        contextoDibujo.lineTo(x + tamaño, y + tamaño);
        contextoDibujo.closePath();
        contextoDibujo.fillStyle = color;
        contextoDibujo.fill();
    }

    function dibujarParticulas() {
        contextoDibujo.clearRect(0, 0, canvas.width, canvas.height);
        
        particulas.forEach(particula => {
            dibujarTriangulo(particula.x, particula.y, particula.tamaño, particula.color);
        });
    }

    function animar() {
        actualizarParticulas();
        dibujarParticulas();
        requestAnimationFrame(animar);
    }

    window.addEventListener('resize', ajustarTamañoLienzo);
    ajustarTamañoLienzo();
    inicializarParticulas();
    animar();