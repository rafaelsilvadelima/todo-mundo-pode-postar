// Importar as funções necessárias do SDK do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBVw4KhYgdl_laKwYmB7Vvzs5VBDBlHKx8",
    authDomain: "todo-mundo-por-criar.firebaseapp.com",
    projectId: "todo-mundo-por-criar",
    storageBucket: "todo-mundo-por-criar.firebasestorage.app",
    messagingSenderId: "575219419265",
    appId: "1:575219419265:web:ea156bfb5a26e55885a580"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);

// Inicializar o Firestore
const db = getFirestore(app);

// Inicializar o Authentication
const auth = getAuth(app);

// Inicializar o Storage
const storage = getStorage(app);

// Funções CRUD para Firestore

// Criar documento
export const criarDocumento = async (colecao, dados) => {
    try {
        const docRef = await addDoc(collection(db, colecao), dados);
        return { id: docRef.id, ...dados };
    } catch (erro) {
        console.error("Erro ao criar documento:", erro);
        throw erro;
    }
};

// Buscar todos os documentos de uma coleção
export const buscarDocumentos = async (colecao) => {
    try {
        const querySnapshot = await getDocs(collection(db, colecao));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (erro) {
        console.error("Erro ao buscar documentos:", erro);
        throw erro;
    }
};

// Buscar um documento específico
export const buscarDocumento = async (colecao, id) => {
    try {
        const docRef = doc(db, colecao, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error("Documento não encontrado");
        }
    } catch (erro) {
        console.error("Erro ao buscar documento:", erro);
        throw erro;
    }
};

// Atualizar documento
export const atualizarDocumento = async (colecao, id, dados) => {
    try {
        const docRef = doc(db, colecao, id);
        await updateDoc(docRef, dados);
        return { id, ...dados };
    } catch (erro) {
        console.error("Erro ao atualizar documento:", erro);
        throw erro;
    }
};

// Deletar documento
export const deletarDocumento = async (colecao, id) => {
    try {
        const docRef = doc(db, colecao, id);
        await deleteDoc(docRef);
        return true;
    } catch (erro) {
        console.error("Erro ao deletar documento:", erro);
        throw erro;
    }
};

// Funções para Storage

// Upload de arquivo
export const uploadArquivo = async (caminho, arquivo) => {
    try {
        const storageRef = ref(storage, caminho);
        const snapshot = await uploadBytes(storageRef, arquivo);
        const url = await getDownloadURL(snapshot.ref);
        return url;
    } catch (erro) {
        console.error("Erro ao fazer upload do arquivo:", erro);
        throw erro;
    }
};

// Deletar arquivo
export const deletarArquivo = async (caminho) => {
    try {
        const storageRef = ref(storage, caminho);
        await deleteObject(storageRef);
        return true;
    } catch (erro) {
        console.error("Erro ao deletar arquivo:", erro);
        throw erro;
    }
};

// Funções de Autenticação

// Login com Google
export const loginComGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const resultado = await signInWithPopup(auth, provider);
        return resultado.user;
    } catch (erro) {
        console.error("Erro ao fazer login com Google:", erro);
        throw erro;
    }
};

// Logout
export const logout = async () => {
    try {
        await signOut(auth);
        return true;
    } catch (erro) {
        console.error("Erro ao fazer logout:", erro);
        throw erro;
    }
};

// Verificar estado de autenticação
export const verificarAuth = (callback) => {
    return onAuthStateChanged(auth, (usuario) => {
        if (usuario) {
            // Usuário está logado
            callback({
                logado: true,
                usuario: {
                    uid: usuario.uid,
                    email: usuario.email,
                    nome: usuario.displayName,
                    foto: usuario.photoURL
                }
            });
        } else {
            // Usuário está deslogado
            callback({
                logado: false,
                usuario: null
            });
        }
    });
};

// Obter usuário atual
export const obterUsuarioAtual = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (usuario) => {
            unsubscribe();
            if (usuario) {
                resolve({
                    uid: usuario.uid,
                    email: usuario.email,
                    nome: usuario.displayName,
                    foto: usuario.photoURL
                });
            } else {
                resolve(null);
            }
        }, reject);
    });
};

// Exportar as instâncias e funções para uso em outros arquivos
export { app, db, auth, storage }; 

