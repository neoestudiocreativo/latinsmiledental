// Latin Smile Dental - Interacciones básicas

// Funcionalidad para el comparador de imágenes antes/después
function initBeforeAfterComparison() {
    try {
        const comparisons = document.querySelectorAll('.image-compare');
        if (!comparisons.length) return;

        comparisons.forEach(comparison => {
            const slider = comparison.querySelector('.slider-handle');
            const afterImage = comparison.querySelector('.after-image');

            if (!slider || !afterImage) {
                console.warn('Elementos del comparador no encontrados');
                return;
            }

            const moveSlider = (x) => {
                try {
                    const rect = comparison.getBoundingClientRect();
                    let position = (x - rect.left) / rect.width;
                    position = Math.max(0, Math.min(1, position));
                    requestAnimationFrame(() => {
                        slider.style.left = `${position * 100}%`;
                        afterImage.style.clipPath = `polygon(${position * 100}% 0, 100% 0, 100% 100%, ${position * 100}% 100%)`;
                    });
                } catch (error) {
                    console.error('Error al mover el slider:', error);
                }
            };

            const onMouseMove = (e) => moveSlider(e.clientX);
            const onTouchMove = (e) => {
                if (e.touches && e.touches[0]) {
                    moveSlider(e.touches[0].clientX);
                }
            };

            const onMouseUp = () => {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            };

            const onTouchEnd = () => {
                window.removeEventListener('touchmove', onTouchMove);
                window.removeEventListener('touchend', onTouchEnd);
            };

            slider.addEventListener('mousedown', (e) => {
                e.preventDefault();
                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('mouseup', onMouseUp);
            });

            slider.addEventListener('touchstart', (e) => {
                e.preventDefault();
                window.addEventListener('touchmove', onTouchMove);
                window.addEventListener('touchend', onTouchEnd);
            });

            // Establecer posición inicial
            moveSlider(comparison.getBoundingClientRect().left + comparison.getBoundingClientRect().width / 2);
        });
    } catch (error) {
        console.error('Error al inicializar el comparador:', error);
    }
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Navegación móvil
        const navToggle = document.querySelector('.nav-toggle');
        const siteNav = document.querySelector('.site-nav');
        const navOverlay = document.querySelector('.nav-overlay');
        const body = document.body;
        
        function closeMenu() {
            siteNav.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            body.classList.remove('menu-open');
            if (navOverlay) {
                navOverlay.classList.remove('active');
            }
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }

        function openMenu() {
            siteNav.classList.add('active');
            navToggle.classList.add('active');
            navToggle.setAttribute('aria-expanded', 'true');
            body.classList.add('menu-open');
            if (navOverlay) {
                navOverlay.classList.add('active');
            }
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        }
        
        if (navToggle && siteNav) {
            navToggle.addEventListener('click', function() {
                if (siteNav.classList.contains('active')) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });
            
            // Cerrar menú al hacer clic en el overlay
            if (navOverlay) {
                navOverlay.addEventListener('click', closeMenu);
            }
            
            // Cerrar menú al hacer clic en un enlace
            const navLinks = siteNav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    if (window.innerWidth <= 992) {
                        closeMenu();
                    }
                });
            });
            
            // Cerrar menú cuando la ventana se redimensiona
            window.addEventListener('resize', function() {
                if (window.innerWidth > 992) {
                    closeMenu();
                }
            });
        }
        
        // Desplazamiento suave para enlaces de anclaje
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Animación para los puntos del slider
        const dots = document.querySelectorAll('.dot');
        if (dots.length > 0) {
            dots.forEach(dot => {
                dot.addEventListener('click', function() {
                    dots.forEach(d => d.classList.remove('active'));
                    this.classList.add('active');
                });
            });
        }
        
        // Validación simple del formulario de contacto
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let isValid = true;
                const requiredFields = this.querySelectorAll('[required]');
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('error');
                    } else {
                        field.classList.remove('error');
                    }
                });
                
                if (isValid) {
                    alert('¡Gracias por contactarnos! Te responderemos a la brevedad.');
                    this.reset();
                } else {
                    alert('Por favor completa todos los campos requeridos.');
                }
            });
        }

        // Inicializar la funcionalidad de comparación antes/después
        // Esperar a que las imágenes estén cargadas
        window.addEventListener('load', () => {
            setTimeout(initBeforeAfterComparison, 100);
        });
    } catch (error) {
        console.error('Error en la inicialización:', error);
    }
});