// Dados mockados dos capítulos
const capitulosMock = [
    {
        id: 1,
        numero: 1,
        titulo: "O Início da Jornada",
        data: "2024-01-15",
        status: "publicado"
    },
    {
        id: 2,
        numero: 2,
        titulo: "Encontros e Desencontros",
        data: "2024-01-22",
        status: "publicado"
    },
    {
        id: 3,
        numero: 3,
        titulo: "O Caminho das Sombras",
        data: "2024-01-29",
        status: "publicado"
    },
    {
        id: 4,
        numero: 4,
        titulo: "Segredos Revelados",
        data: "2024-02-05",
        status: "publicado"
    },
    {
        id: 5,
        numero: 5,
        titulo: "A Primeira Batalha",
        data: "2024-02-12",
        status: "publicado"
    },
    {
        id: 6,
        numero: 6,
        titulo: "Aliados Inesperados",
        data: "2024-02-19",
        status: "publicado"
    },
    {
        id: 7,
        numero: 7,
        titulo: "O Teste de Coragem",
        data: "2024-02-26",
        status: "publicado"
    },
    {
        id: 8,
        numero: 8,
        titulo: "Confronto no Vale",
        data: "2024-03-04",
        status: "publicado"
    },
    {
        id: 9,
        numero: 9,
        titulo: "A Descoberta",
        data: "2024-03-11",
        status: "publicado"
    },
    {
        id: 10,
        numero: 10,
        titulo: "O Plano Perfeito",
        data: "2024-03-18",
        status: "publicado"
    },
    {
        id: 11,
        numero: 11,
        titulo: "Preparativos Finais",
        data: "2024-03-25",
        status: "publicado"
    },
    {
        id: 12,
        numero: 12,
        titulo: "O Grande Dia",
        data: "2024-03-28",
        status: "publicado"
    }
];

// Configurações de paginação
const ITEMS_POR_PAGINA = 8;
let paginaAtual = 1;
let totalCapitulos = 12; // Em um sistema real, isso viria da API

// Simulação de API
class CapitulosAPI {
    constructor() {
        // Cache para armazenar páginas já carregadas
        this.cache = new Map();
    }

    async getCapitulos(pagina, itensPorPagina) {
        // Simula delay de rede
        await new Promise(resolve => setTimeout(resolve, 300));

        // Verifica se a página já está em cache
        if (this.cache.has(pagina)) {
            console.log('Retornando dados do cache para página:', pagina);
            return this.cache.get(pagina);
        }

        // Calcula índices
        const inicio = (pagina - 1) * itensPorPagina;
        const fim = Math.min(inicio + itensPorPagina, totalCapitulos);

        // Gera dados para a página solicitada
        const capitulos = [];
        for (let i = inicio; i < fim; i++) {
            capitulos.push({
                id: i + 1,
                numero: i + 1,
                titulo: `Capítulo ${i + 1}: Título do Capítulo`,
                data: new Date(2024, 0, 15 + i).toISOString(),
                status: "publicado"
            });
        }

        // Armazena em cache
        this.cache.set(pagina, {
            capitulos,
            total: totalCapitulos,
            pagina,
            totalPaginas: Math.ceil(totalCapitulos / itensPorPagina)
        });

        console.log('Carregando dados da API para página:', pagina);
        return this.cache.get(pagina);
    }
}

// Instância da API
const capitulosAPI = new CapitulosAPI();

// Estado de carregamento
let isLoading = false;

// Função para criar card de capítulo
function criarCardCapitulo(capitulo) {
    return `
        <a href="../capitulo/capitulo.html?id=${capitulo.id}" class="capitulo-card">
            <div class="capitulo-header">
                <h3 class="capitulo-titulo">Capítulo ${capitulo.numero}: ${capitulo.titulo}</h3>
                <span class="capitulo-data">${window.utils.formatarData(capitulo.data)}</span>
            </div>
            <div class="capitulo-info">
                <span class="status">${capitulo.status}</span>
                <span class="numero-cap">Cap. ${capitulo.numero}/12</span>
            </div>
        </a>
    `;
}

// Função para carregar capítulos
async function carregarCapitulos(pagina) {
    if (isLoading) return;
    
    try {
        isLoading = true;
        window.utils.mostrarLoading('capitulos-container', 'Carregando capítulos...');

        const data = await capitulosAPI.getCapitulos(pagina, ITEMS_POR_PAGINA);
        
        const container = document.getElementById('capitulos-container');
        container.innerHTML = data.capitulos.map(capitulo => criarCardCapitulo(capitulo)).join('');
        
        atualizarPaginacao(data.pagina, data.totalPaginas);
        document.getElementById('total-capitulos').textContent = data.total;

    } catch (error) {
        console.error('Erro ao carregar capítulos:', error);
        window.utils.mostrarErro('capitulos-container', 'Erro ao carregar capítulos. Tente novamente.');
    } finally {
        isLoading = false;
    }
}

// Função atualizada de paginação
function atualizarPaginacao(paginaAtual, totalPaginas) {
    const paginasContainer = document.getElementById('paginas-container');
    let html = '';

    for (let i = 1; i <= totalPaginas; i++) {
        html += `
            <span class="pagina-numero ${i === paginaAtual ? 'ativo' : ''}" 
                  onclick="irParaPagina(${i})">${i}</span>
        `;
    }

    paginasContainer.innerHTML = html;

    // Atualiza estado dos botões
    document.getElementById('prev-page').disabled = paginaAtual === 1;
    document.getElementById('next-page').disabled = paginaAtual === totalPaginas;
}

// Função para navegar entre páginas
async function irParaPagina(numeroPagina) {
    if (numeroPagina === paginaAtual || isLoading) return;
    paginaAtual = numeroPagina;
    await carregarCapitulos(paginaAtual);
}

// Função para aplicar ordenação
function aplicarOrdenacao() {
    const ordenacao = document.getElementById('ordenacao').value;
    
    switch(ordenacao) {
        case 'recentes':
            capitulosMock.sort((a, b) => new Date(b.data) - new Date(a.data));
            break;
        case 'antigos':
            capitulosMock.sort((a, b) => new Date(a.data) - new Date(b.data));
            break;
        case 'numeracao':
            capitulosMock.sort((a, b) => a.numero - b.numero);
            break;
    }

    renderizarCapitulos();
}

// Função para abrir capítulo
function abrirCapitulo(id) {
    window.location.href = `./ler.html?capitulo=${id}`;
}

// Função para ler capítulos específicos
function lerCapitulo(tipo) {
    const capitulos = capitulosMock;
    let capituloId;
    
    if (tipo === 'primeiro') {
        capituloId = capitulos[0].id;
    } else if (tipo === 'recente') {
        capituloId = capitulos[capitulos.length - 1].id;
    }
    
    if (capituloId) {
        window.location.href = `../capitulo/capitulo.html?id=${capituloId}`;
    }
}

// Função para buscar capítulos
async function buscarCapitulos(termo) {
    if (!termo) {
        await carregarCapitulos(1);
        return;
    }

    termo = termo.toLowerCase().trim();
    
    // Filtrar capítulos pelo título ou número
    const capitulosFiltrados = capitulosMock.filter(capitulo => 
        capitulo.titulo.toLowerCase().includes(termo) ||
        capitulo.numero.toString() === termo // Busca exata por número
    );

    const container = document.getElementById('capitulos-container');
    
    if (capitulosFiltrados.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <p>Nenhum capítulo encontrado para sua busca.</p>
                <p class="suggestion">Tente buscar pelo número do capítulo ou palavras do título.</p>
            </div>
        `;
    } else {
        // Renderizar capítulos filtrados
        container.innerHTML = capitulosFiltrados
            .map(capitulo => criarCardCapitulo(capitulo))
            .join('');
    }

    // Atualizar contador de resultados
    document.getElementById('total-capitulos').textContent = capitulosFiltrados.length;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Carrega primeira página
    carregarCapitulos(1);

    // Eventos de paginação
    document.getElementById('prev-page').addEventListener('click', async () => {
        if (paginaAtual > 1 && !isLoading) {
            await irParaPagina(paginaAtual - 1);
        }
    });

    document.getElementById('next-page').addEventListener('click', async () => {
        const totalPaginas = Math.ceil(totalCapitulos / ITEMS_POR_PAGINA);
        if (paginaAtual < totalPaginas && !isLoading) {
            await irParaPagina(paginaAtual + 1);
        }
    });

    // Evento de ordenação
    document.getElementById('ordenacao').addEventListener('change', aplicarOrdenacao);

    // Inicializar busca
    window.utils.inicializarBusca('capitulos-container', buscarCapitulos);
});
