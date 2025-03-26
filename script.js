// Funções comuns para todo o projeto
document.addEventListener('DOMContentLoaded', () => {
    // Menu mobile
    const menuBtn = document.querySelector('.user-btn');
    const nav = document.querySelector('.main-nav');
    const headerActions = document.querySelector('.header-actions');
    
    // Adiciona classe para controle do menu mobile
    document.body.classList.add('menu-closed');
    
    menuBtn.addEventListener('click', function() {
        document.body.classList.toggle('menu-open');
        document.body.classList.toggle('menu-closed');
    });

    // Fecha o menu ao clicar fora
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.header-container') && document.body.classList.contains('menu-open')) {
            document.body.classList.remove('menu-open');
            document.body.classList.add('menu-closed');
        }
    });

    // Animação suave ao scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Função de debounce para evitar múltiplas chamadas
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função para formatar data
function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

// Função para mostrar loading
function mostrarLoading(containerId, mensagem = 'Carregando...') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>${mensagem}</p>
            </div>
        `;
    }
}

// Função para mostrar erro
function mostrarErro(containerId, mensagem = 'Erro ao carregar. Tente novamente.') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="error-state">
                <p>${mensagem}</p>
            </div>
        `;
    }
}

// Função para gerenciar estado de loading na busca
const estadoBusca = {
    anterior: '',
    loading: false
};

// Função para realizar busca com loading
async function realizarBusca(termo, funcaoBusca) {
    if (estadoBusca.loading) return;
    if (termo === estadoBusca.anterior) return;

    estadoBusca.loading = true;
    estadoBusca.anterior = termo;

    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.classList.add('searching');
    }

    try {
        await funcaoBusca(termo);
    } catch (error) {
        console.error('Erro na busca:', error);
        mostrarErro('resultados-container', 'Erro ao realizar a busca. Tente novamente.');
    } finally {
        estadoBusca.loading = false;
        if (searchBar) {
            searchBar.classList.remove('searching');
        }
    }
}

// Função para inicializar busca com debounce
function inicializarBusca(containerId, funcaoBusca) {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-btn');

    if (!searchInput || !searchButton) return;

    const debouncedSearch = debounce((value) => {
        realizarBusca(value, funcaoBusca);
    }, 500);

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        debouncedSearch(searchTerm);
    });

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value;
        realizarBusca(searchTerm, funcaoBusca);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = e.target.value;
            realizarBusca(searchTerm, funcaoBusca);
        }
    });
}

// Exportar funções para uso em outros arquivos
window.utils = {
    debounce,
    formatarData,
    mostrarLoading,
    mostrarErro,
    realizarBusca,
    inicializarBusca
};

document.addEventListener('DOMContentLoaded', () => {
    // Carrossel
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    let currentSlide = 0;
    const totalSlides = slides.length;

    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentSlide * 33.333}%)`;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    // Eventos dos botões do carrossel
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Autoplay do carrossel
    setInterval(nextSlide, 5000);
}); 