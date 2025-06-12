// Data de início do relacionamento
const startDate = new Date('2017-07-02T23:00:00');

// Função para calcular e atualizar o contador
function updateCounter() {
    const now = new Date();
    const diff = now - startDate;
    
    // Calcular anos, meses, dias, horas, minutos e segundos
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // Atualizar elementos na página
    document.getElementById('years').textContent = years;
    document.getElementById('months').textContent = months;
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Carrossel de fotos
class PhotoCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.carousel-slide');
        this.totalSlides = this.slides.length;
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dotsContainer = document.getElementById('carouselDots');
        
        this.init();
    }
    
    init() {
        this.createDots();
        this.bindEvents();
        this.updateCarousel();
        this.startAutoSlide();
    }
    
    createDots() {
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }
    
    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Touch events para mobile
        let startX = 0;
        let endX = 0;
        
        const carousel = document.getElementById('carousel');
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) {
                this.nextSlide();
            } else if (endX - startX > 50) {
                this.prevSlide();
            }
        });
    }
    
    updateCarousel() {
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === this.currentSlide) {
                slide.classList.add('active');
            }
        });
        
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === this.currentSlide) {
                dot.classList.add('active');
            }
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }
    
    startAutoSlide() {
        setInterval(() => {
            this.nextSlide();
        }, 5000); // Muda slide a cada 5 segundos
    }
}

class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('backgroundMusic');
        this.toggleBtn = document.getElementById('musicToggle');
        this.icon = document.getElementById('musicIcon');
        this.isPlaying = false;
        this.usuarioParou = false;
        this.usuarioInteragiu = false;

        this.init();
    }

    init() {
        this.audio.volume = 0.5;

        // Tenta autoplay ao carregar
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updateIcon();
        }).catch(() => {
            // Autoplay falhou, aguarda primeira interação
            this.aguardarInteracao();
        });

        // Botão manual
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggleMusic(true));
        }
    }

    aguardarInteracao() {
        const tocarAoInteragir = () => {
            if (!this.usuarioInteragiu && !this.isPlaying && !this.usuarioParou) {
                this.audio.play().then(() => {
                    this.isPlaying = true;
                    this.updateIcon();
                }).catch(err => console.log("Erro ao tocar música após interação:", err));
                this.usuarioInteragiu = true;
            }
        };

        // Primeiro clique, toque ou rolagem
        window.addEventListener('click', tocarAoInteragir, { once: true });
        window.addEventListener('touchstart', tocarAoInteragir, { once: true });
        window.addEventListener('scroll', tocarAoInteragir, { once: true });
    }

    toggleMusic(manual = false) {
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
            this.usuarioParou = manual;
        } else {
            this.audio.play().then(() => {
                this.isPlaying = true;
                this.usuarioParou = false;
            }).catch(e => console.log('Erro ao reproduzir música:', e));
        }
        this.updateIcon();
    }

    updateIcon() {
        if (!this.icon) return;
        this.icon.classList.remove('fa-volume-up', 'fa-volume-mute');
        this.icon.classList.add(this.isPlaying ? 'fa-volume-up' : 'fa-volume-mute');
    }
}


// Animação de corações caindo
class FallingHearts {
    constructor() {
        this.container = document.getElementById('heartsContainer');
        this.hearts = [];
        this.init();
    }
    
    init() {
        this.createHeart();
        setInterval(() => this.createHeart(), 2000); // Novo coração a cada 2 segundos
    }
    
    createHeart() {
        const heart = document.createElement('div');
        heart.className = 'falling-heart';
        heart.innerHTML = '♥';
        
        // Posição aleatória horizontal
        heart.style.left = Math.random() * 100 + '%';
        
        // Tamanho aleatório
        const size = Math.random() * 20 + 15;
        heart.style.fontSize = size + 'px';
        
        // Cor aleatória entre tons de rosa e vermelho
        const colors = ['#ff69b4', '#ff1493', '#dc143c', '#ff6b9d', '#ffc0cb'];
        heart.style.color = colors[Math.floor(Math.random() * colors.length)];
        
        // Duração da animação aleatória
        const duration = Math.random() * 3 + 4; // Entre 4 e 7 segundos
        heart.style.animationDuration = duration + 's';
        
        this.container.appendChild(heart);
        
        // Remover coração após a animação
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, duration * 1000);
    }
}

// Efeitos de scroll suave
function smoothScrollEffects() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    // Iniciar contador
    updateCounter();
    setInterval(updateCounter, 1000);
    
    // Inicializar carrossel
    new PhotoCarousel();
    
    // Inicializar player de música
    new MusicPlayer();
    
    // Inicializar corações caindo
    new FallingHearts();
    
    // Efeitos de scroll
    smoothScrollEffects();
    
    // Adicionar classe para animações iniciais
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// Função para adicionar efeito de partículas no clique
document.addEventListener('click', function(e) {
    createClickEffect(e.clientX, e.clientY);
});

function createClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    }, 600);
}

