// Sistema de Produtos - Frontend
let currentUser = null;
let authToken = null;

console.log('🎯 Sistema de Produtos carregado!')

// Inicialização
window.addEventListener('load', function() {
    console.log('✅ Página carregada')
    
    // Verificar se já está logado
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
        authToken = savedToken;
        currentUser = JSON.parse(savedUser);
        showDashboard();
    }
})

// Login Form
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }
});

// Função de Login
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        showMessage('🔄 Fazendo login...', 'loading');
        
        const response = await fetch('/api/seguranca/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login: username,
                senha: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.token) {
            authToken = data.token;
            currentUser = data;
            
            // Salvar no localStorage
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showMessage('✅ Login realizado com sucesso!', 'success');
            
            setTimeout(() => {
                showDashboard();
            }, 1000);
            
        } else {
            showMessage('❌ Login falhou: ' + (data.message || 'Erro desconhecido'), 'error');
        }
        
    } catch (error) {
        console.error('Erro no login:', error);
        showMessage('❌ Erro de conexão: ' + error.message, 'error');
    }
}

// Mostrar Dashboard
function showDashboard() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    
    // Mostrar informações do usuário
    const userInfo = document.getElementById('userInfo');
    userInfo.textContent = `👤 ${currentUser.nome} (${currentUser.roles})`;
    
    // Mostrar formulário de produto se for admin
    if (currentUser.roles.includes('ADMIN')) {
        document.getElementById('productForm').style.display = 'block';
    }
    
    // Carregar dados
    loadAPIStatus();
    loadProducts();
}

// Logout
function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
    
    showMessage('👋 Logout realizado com sucesso!', 'success');
}

// Carregar Status da API
async function loadAPIStatus() {
    const statusDiv = document.getElementById('status');
    
    try {
        const response = await fetch('/');
        const data = await response.json();
        
        statusDiv.innerHTML = `
            <h3>✅ API Status: Online</h3>
            <p><strong>Mensagem:</strong> ${data.message}</p>
            <p><strong>Timestamp:</strong> ${new Date(data.timestamp).toLocaleString('pt-BR')}</p>
            <p><strong>Versão:</strong> ${data.version}</p>
        `;
        
        statusDiv.className = 'status';
        
    } catch (error) {
        statusDiv.innerHTML = `
            <h3>❌ Erro na API</h3>
            <p>${error.message}</p>
        `;
        statusDiv.className = 'status error';
    }
}

// Carregar Produtos
async function loadProducts() {
    const productsList = document.getElementById('productsList');
    
    try {
        productsList.innerHTML = '<p class="loading">🔄 Carregando produtos...</p>';
        
        const response = await fetch('/api/produtos', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const produtos = await response.json();
        
        if (produtos.length === 0) {
            productsList.innerHTML = '<p>📭 Nenhum produto cadastrado</p>';
            return;
        }
        
        productsList.innerHTML = produtos.map(produto => `
            <div class="product-card fade-in">
                <h4>${produto.descricao}</h4>
                <div class="price">R$ ${parseFloat(produto.valor).toFixed(2)}</div>
                <div class="brand">Marca: ${produto.marca}</div>
                <small>ID: ${produto.id}</small>
                ${currentUser.roles.includes('ADMIN') ? `
                    <div class="product-actions">
                        <button onclick="editProduct(${produto.id})" class="edit-btn">✏️ Editar</button>
                        <button onclick="deleteProduct(${produto.id})" class="delete-btn">🗑️ Excluir</button>
                    </div>
                ` : ''}
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        productsList.innerHTML = `
            <div class="error">
                <h4>❌ Erro ao carregar produtos</h4>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Adicionar Produto
async function handleAddProduct(event) {
    event.preventDefault();
    
    if (!currentUser.roles.includes('ADMIN')) {
        showMessage('❌ Apenas administradores podem adicionar produtos', 'error');
        return;
    }
    
    const descricao = document.getElementById('produtoDesc').value;
    const valor = document.getElementById('produtoValor').value;
    const marca = document.getElementById('produtoMarca').value;
    
    try {
        const response = await fetch('/api/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                descricao,
                valor: parseFloat(valor),
                marca
            })
        });
        
        if (response.ok) {
            showMessage('✅ Produto adicionado com sucesso!', 'success');
            document.getElementById('addProductForm').reset();
            loadProducts();
        } else {
            const error = await response.json();
            showMessage('❌ Erro ao adicionar produto: ' + error.message, 'error');
        }
        
    } catch (error) {
        showMessage('❌ Erro de conexão: ' + error.message, 'error');
    }
}

// Excluir Produto
async function deleteProduct(id) {
    if (!currentUser.roles.includes('ADMIN')) {
        alert('❌ Apenas administradores podem excluir produtos');
        return;
    }
    
    if (!confirm('🗑️ Tem certeza que deseja excluir este produto?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/produtos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            showMessage('✅ Produto excluído com sucesso!', 'success');
            loadProducts();
        } else {
            const error = await response.json();
            showMessage('❌ Erro ao excluir produto: ' + error.message, 'error');
        }
        
    } catch (error) {
        showMessage('❌ Erro de conexão: ' + error.message, 'error');
    }
}

// Editar Produto (função básica)
function editProduct(id) {
    const newDesc = prompt('Nova descrição:');
    const newValor = prompt('Novo valor:');
    const newMarca = prompt('Nova marca:');
    
    if (newDesc && newValor && newMarca) {
        updateProduct(id, {
            descricao: newDesc,
            valor: parseFloat(newValor),
            marca: newMarca
        });
    }
}

// Atualizar Produto
async function updateProduct(id, data) {
    try {
        const response = await fetch(`/api/produtos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showMessage('✅ Produto atualizado com sucesso!', 'success');
            loadProducts();
        } else {
            const error = await response.json();
            showMessage('❌ Erro ao atualizar produto: ' + error.message, 'error');
        }
        
    } catch (error) {
        showMessage('❌ Erro de conexão: ' + error.message, 'error');
    }
}

// Mostrar Mensagens
function showMessage(message, type) {
    // Remove mensagens existentes
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Criar nova mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Adicionar no topo do dashboard ou login
    const container = document.getElementById('dashboard').style.display === 'none' 
        ? document.getElementById('loginSection')
        : document.getElementById('dashboard');
    
    container.insertBefore(messageDiv, container.firstChild);
    
    // Remover após 5 segundos
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

console.log('✅ Sistema de Produtos carregado com sucesso!')
