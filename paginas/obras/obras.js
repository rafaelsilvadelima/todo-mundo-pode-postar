// Dados mockados expandidos
const livrosMock = [
    {
        id: 1,
        titulo: "O Senhor dos Anéis",
        autor: "J.R.R. Tolkien",
        genero: "fantasia",
        avaliacao: 4.9,
        imagem: "https://placeholder.com/200x300",
        data: "2024-01-15",
        link: "../lista/lista.html"
    },
    {
        id: 2,
        titulo: "Duna",
        autor: "Frank Herbert",
        genero: "ficcao",
        avaliacao: 4.8,
        imagem: "https://placeholder.com/200x300",
        data: "2024-02-01",
        link: "obras/ler/duna.html"
    },
    {
        id: 3,
        titulo: "It: A Coisa",
        autor: "Stephen King",
        genero: "terror",
        avaliacao: 4.7,
        imagem: "https://placeholder.com/200x300",
        data: "2024-01-20",
        link: "obras/ler/it-a-coisa.html"
    },
    {
        id: 4,
        titulo: "O Nome do Vento",
        autor: "Patrick Rothfuss",
        genero: "fantasia",
        avaliacao: 4.9,
        imagem: "https://placeholder.com/200x300",
        data: "2024-02-10",
        link: "obras/ler/nome-do-vento.html"
    },
    {
        id: 5,
        titulo: "Neuromancer",
        autor: "William Gibson",
        genero: "ficcao",
        avaliacao: 4.5,
        imagem: "https://placeholder.com/200x300",
        data: "2024-01-25",
        link: "obras/ler/neuromancer.html"
    },
    {
        id: 6,
        titulo: "O Iluminado",
        autor: "Stephen King",
        genero: "terror",
        avaliacao: 4.6,
        imagem: "https://placeholder.com/200x300",
        data: "2024-02-05",
        link: "obras/ler/iluminado.html"
    },
    {
        id: 7,
        titulo: "Fundação",
        autor: "Isaac Asimov",
        genero: "ficcao",
        avaliacao: 4.7,
        imagem: "https://placeholder.com/200x300",
        data: "2024-01-30",
        link: "obras/ler/fundacao.html"
    },
    {
        id: 8,
        titulo: "A Cor que Caiu do Espaço",
        autor: "H.P. Lovecraft",
        genero: "terror",
        avaliacao: 4.4,
        imagem: "https://placeholder.com/200x300",
        data: "2024-02-15",
        link: "obras/ler/cor-que-caiu-do-espaco.html"
    },
    {
        id: 9,
        titulo: "O Hobbit",
        autor: "J.R.R. Tolkien",
        genero: "fantasia",
        avaliacao: 4.8,
        imagem: "https://placeholder.com/200x300",
        data: "2024-01-10",
        link: "obras/ler/hobbit.html"
    },
    {
        id: 10,
        titulo: "1984",
        autor: "George Orwell",
        genero: "ficcao",
        avaliacao: 4.9,
        imagem: "https://placeholder.com/200x300",
        data: "2024-02-20",
        link: "obras/ler/1984.html"
    },
    {
        id: 11,
        titulo: "O Silmarillion",
        autor: "J.R.R. Tolkien",
        genero: "fantasia",
        avaliacao: 4.7,
        imagem: "https://placeholder.com/200x300",
        data: "2024-01-05",
        link: "obras/ler/silmarillion.html"
    },
    {
        id: 12,
        titulo: "Dracula",
        autor: "Bram Stoker",
        genero: "terror",
        avaliacao: 4.6,
        imagem: "https://placeholder.com/200x300",
        data: "2024-02-25",
        link: "obras/ler/dracula.html"
    }
];

// Configurações de paginação
const ITEMS_POR_PAGINA = 8;
let paginaAtual = 1;
let livrosFiltrados = [...livrosMock];

// Adicionar variável para controlar o estado de loading
let isLoading = false;

// Função para criar card de livro
function criarCardLivro(livro) {
    return `
        <div class="book-card">
            <img src="${livro.imagem}" alt="${livro.titulo}">
            <div class="book-card-content">
                <h3 title="${livro.titulo}">${livro.titulo}</h3>
                <p class="author">${livro.autor}</p>
                <div class="book-info">
                    <span class="genre">${livro.genero}</span>
                    <span class="rating">${livro.avaliacao} ★</span>
                </div>
                <a href="${livro.link}" class="btn-ler">Ler Agora</a>
            </div>
        </div>
    `;
}

// Função para atualizar paginação
function atualizarPaginacao() {
    const totalPaginas = Math.ceil(livrosFiltrados.length / ITEMS_POR_PAGINA);
    const paginasContainer = document.getElementById('paginas-container');
    let html = '';

    // Mostrar no máximo 5 números de página
    const maxPaginas = 5;
    let inicio = Math.max(1, paginaAtual - Math.floor(maxPaginas / 2));
    let fim = Math.min(totalPaginas, inicio + maxPaginas - 1);

    if (fim - inicio + 1 < maxPaginas) {
        inicio = Math.max(1, fim - maxPaginas + 1);
    }

    if (inicio > 1) {
        html += `<span class="pagina-numero">1</span>`;
        if (inicio > 2) html += `<span class="pagina-ellipsis">...</span>`;
    }

    for (let i = inicio; i <= fim; i++) {
        html += `<span class="pagina-numero ${i === paginaAtual ? 'ativo' : ''}">${i}</span>`;
    }

    if (fim < totalPaginas) {
        if (fim < totalPaginas - 1) html += `<span class="pagina-ellipsis">...</span>`;
        html += `<span class="pagina-numero">${totalPaginas}</span>`;
    }

    paginasContainer.innerHTML = html;
    
    document.getElementById('prev-page').disabled = paginaAtual === 1;
    document.getElementById('next-page').disabled = paginaAtual === totalPaginas;

    // Adicionar eventos aos números de página
    document.querySelectorAll('.pagina-numero').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!btn.classList.contains('ativo')) {
                paginaAtual = parseInt(btn.textContent);
                renderizarLivros();
            }
        });
    });
}

// Função para simular carregamento assíncrono dos livros
async function carregarLivros(inicio, fim) {
    // Simula uma chamada à API
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(livrosFiltrados.slice(inicio, fim));
        }, 800); // Simula delay de 800ms
    });
}

// Função para renderizar livros atualizada
async function renderizarLivros() {
    if (isLoading) return; // Evita múltiplas chamadas durante o loading
    isLoading = true;
    
    const inicio = (paginaAtual - 1) * ITEMS_POR_PAGINA;
    const fim = inicio + ITEMS_POR_PAGINA;
    
    window.utils.mostrarLoading('livros-container', 'Carregando obras...');

    try {
        // Carregar livros da "página" atual
        const livrosPagina = await carregarLivros(inicio, fim);
        
        const container = document.getElementById('livros-container');
        
        // Se não houver livros, mostrar mensagem
        if (livrosFiltrados.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <p>Nenhum livro encontrado para sua busca.</p>
                    <p class="suggestion">Tente usar termos diferentes ou remover alguns filtros.</p>
                </div>
            `;
            return;
        }

        // Renderizar os livros carregados
        container.innerHTML = livrosPagina
            .map(livro => criarCardLivro(livro))
            .join('');
        
        document.getElementById('total-resultados').textContent = livrosFiltrados.length;
        atualizarPaginacao();

    } catch (error) {
        console.error('Erro ao carregar livros:', error);
        window.utils.mostrarErro('livros-container', 'Erro ao carregar os livros. Por favor, tente novamente.');
    } finally {
        isLoading = false;
    }
}

// Função para aplicar filtros atualizada
async function aplicarFiltros() {
    const generoAtivo = document.querySelector('.tag-filtro.ativo')?.dataset.genero;
    const avaliacaoMinima = document.getElementById('rating-filter').value;
    const ordenacao = document.getElementById('ordenacao').value;

    livrosFiltrados = [...livrosMock];

    // Filtrar por gênero
    if (generoAtivo && generoAtivo !== 'todos') {
        livrosFiltrados = livrosFiltrados.filter(livro => 
            livro.genero === generoAtivo
        );
    }

    // Filtrar por avaliação
    if (avaliacaoMinima !== 'todos') {
        livrosFiltrados = livrosFiltrados.filter(livro => 
            livro.avaliacao >= Number(avaliacaoMinima)
        );
    }

    // Aplicar ordenação
    switch(ordenacao) {
        case 'avaliacoes':
            livrosFiltrados.sort((a, b) => b.avaliacao - a.avaliacao);
            break;
        case 'recentes':
            livrosFiltrados.sort((a, b) => new Date(b.data) - new Date(a.data));
            break;
        case 'alfabetica':
            livrosFiltrados.sort((a, b) => a.titulo.localeCompare(b.titulo));
            break;
    }

    paginaAtual = 1; // Resetar para primeira página
    await renderizarLivros();
}

// Função para buscar livros
async function buscarLivros(termo) {
    if (!termo) {
        livrosFiltrados = [...livrosMock];
    } else {
        termo = termo.toLowerCase().trim();
        livrosFiltrados = livrosMock.filter(livro => 
            livro.titulo.toLowerCase().includes(termo) ||
            livro.autor.toLowerCase().includes(termo) ||
            livro.genero.toLowerCase().includes(termo)
        );
    }
    paginaAtual = 1; // Resetar para primeira página
    await renderizarLivros();
}

// Event Listeners atualizados
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar
    renderizarLivros();

    // Eventos dos filtros de gênero
    document.querySelectorAll('.tag-filtro').forEach(tag => {
        tag.addEventListener('click', async (e) => {
            if (isLoading) return; // Evita múltiplos cliques durante o loading
            document.querySelectorAll('.tag-filtro').forEach(t => t.classList.remove('ativo'));
            e.target.classList.add('ativo');
            await aplicarFiltros();
        });
    });

    // Eventos dos selects
    document.getElementById('rating-filter').addEventListener('change', async () => {
        if (!isLoading) await aplicarFiltros();
    });
    
    document.getElementById('ordenacao').addEventListener('change', async () => {
        if (!isLoading) await aplicarFiltros();
    });

    // Eventos de paginação
    document.getElementById('prev-page').addEventListener('click', async () => {
        if (isLoading || paginaAtual <= 1) return;
        paginaAtual--;
        await renderizarLivros();
    });

    document.getElementById('next-page').addEventListener('click', async () => {
        const totalPaginas = Math.ceil(livrosFiltrados.length / ITEMS_POR_PAGINA);
        if (isLoading || paginaAtual >= totalPaginas) return;
        paginaAtual++;
        await renderizarLivros();
    });

    // Inicializar busca
    window.utils.inicializarBusca('livros-container', buscarLivros);
});
