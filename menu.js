document.addEventListener('DOMContentLoaded', function() {
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
}); 