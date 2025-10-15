const bcrypt = require('bcryptjs')

exports.seed = async function(knex) {
  // Limpar tabela
  await knex('usuarios').del()
  
  // Hash das senhas
  const senhaAdmin = await bcrypt.hash('admin123', 10)
  const senhaUser = await bcrypt.hash('user123', 10)
  const senhaGerente = await bcrypt.hash('gerente123', 10)
  
  // Inserir usuários
  await knex('usuarios').insert([
    {
      login: 'admin',
      senha: senhaAdmin,
      nome: 'Administrador do Sistema',
      roles: ['ADMIN', 'USER']
    },
    {
      login: 'user',
      senha: senhaUser,
      nome: 'Usuário Comum',
      roles: ['USER']
    },
    {
      login: 'gerente',
      senha: senhaGerente,
      nome: 'Gerente de Produtos',
      roles: ['GERENTE', 'USER']
    }
  ])
  
  console.log('✅ Usuários criados com sucesso!')
}