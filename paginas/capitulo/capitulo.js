import { loginComGoogle, obterUsuarioAtual, criarDocumento, buscarDocumento, atualizarDocumento, verificarAuth } from '../../firebase.js';

// Elementos do DOM
const btnLike = document.getElementById('btn-like');
const likeCount = document.querySelector('.like-count');
const likeIcon = document.querySelector('.like-icon');

// Estado
let capituloId = window.location.pathname.split('/').pop().replace('.html', '');
let usuarioAtual = null;
let curtidas = 0;
let usuarioCurtiu = false;

// Inicialização
async function inicializar() {
    try {
        // Verificar usuário atual
        usuarioAtual = await obterUsuarioAtual();
        
        // Carregar curtidas do capítulo
        await carregarCurtidas();
        
        // Atualizar estado do botão
        atualizarEstadoBotao();
    } catch (erro) {
        console.error('Erro na inicialização:', erro);
    }
}

// Carregar curtidas do capítulo
async function carregarCurtidas() {
    try {
        // Verificar se o documento do capítulo existe
        let docCapitulo;
        try {
            docCapitulo = await buscarDocumento('capitulos', capituloId);
        } catch {
            // Se o documento não existe, criar com valores iniciais
            docCapitulo = await criarDocumento('capitulos', {
                id: capituloId,
                curtidas: 0,
                dataCriacao: new Date().toISOString()
            });
        }
        
        curtidas = docCapitulo.curtidas || 0;
        likeCount.textContent = curtidas;
        
        if (usuarioAtual) {
            // Verificar se o documento do usuário existe
            let docUsuario;
            try {
                docUsuario = await buscarDocumento('usuarios', usuarioAtual.uid);
            } catch {
                // Se não existe, criar o documento do usuário
                docUsuario = await criarDocumento('usuarios', {
                    uid: usuarioAtual.uid,
                    email: usuarioAtual.email,
                    nome: usuarioAtual.nome,
                    foto: usuarioAtual.foto,
                    capitulosCurtidos: []
                });
            }
            
            usuarioCurtiu = docUsuario.capitulosCurtidos?.includes(capituloId) || false;
            atualizarEstadoBotao();
        }
    } catch (erro) {
        console.error('Erro ao carregar curtidas:', erro);
    }
}

// Atualizar estado visual do botão
function atualizarEstadoBotao() {
    if (usuarioCurtiu) {
        likeIcon.style.color = '#ff4444';
        btnLike.classList.add('curtido');
    } else {
        likeIcon.style.color = '#666';
        btnLike.classList.remove('curtido');
    }
}

// Manipular clique no botão de curtir
btnLike.addEventListener('click', async () => {
    if (!usuarioAtual) {
        try {
            // Login com Google
            const resultado = await loginComGoogle();
            usuarioAtual = resultado;
            
            // Criar documento do usuário se não existir
            try {
                await buscarDocumento('usuarios', usuarioAtual.uid);
            } catch {
                await criarDocumento('usuarios', {
                    uid: usuarioAtual.uid,
                    email: usuarioAtual.email,
                    nome: usuarioAtual.nome,
                    foto: usuarioAtual.foto,
                    capitulosCurtidos: []
                });
            }
            
            // Recarregar curtidas após login
            await carregarCurtidas();
        } catch (erro) {
            console.error('Erro ao fazer login:', erro);
            return;
        }
    }
    
    // Atualizar curtidas
    try {
        const docUsuario = await buscarDocumento('usuarios', usuarioAtual.uid);
        const docCapitulo = await buscarDocumento('capitulos', capituloId);
        
        if (usuarioCurtiu) {
            // Remover curtida
            curtidas--;
            await atualizarDocumento('capitulos', capituloId, { curtidas });
            await atualizarDocumento('usuarios', usuarioAtual.uid, {
                capitulosCurtidos: docUsuario.capitulosCurtidos.filter(id => id !== capituloId)
            });
        } else {
            // Adicionar curtida
            curtidas++;
            await atualizarDocumento('capitulos', capituloId, { curtidas });
            await atualizarDocumento('usuarios', usuarioAtual.uid, {
                capitulosCurtidos: [...(docUsuario.capitulosCurtidos || []), capituloId]
            });
        }
        
        usuarioCurtiu = !usuarioCurtiu;
        likeCount.textContent = curtidas;
        atualizarEstadoBotao();
    } catch (erro) {
        console.error('Erro ao atualizar curtidas:', erro);
    }
});

// Inicializar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', inicializar); 