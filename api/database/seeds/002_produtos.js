exports.seed = async function(knex) {
  // Limpar tabela
  await knex('produtos').del()
  
  // Inserir produtos
  await knex('produtos').insert([
    {
      descricao: 'Notebook Dell Inspiron 15',
      valor: 3500.00,
      marca: 'Dell'
    },
    {
      descricao: 'Mouse Logitech MX Master 3',
      valor: 450.00,
      marca: 'Logitech'
    },
    {
      descricao: 'Teclado Mecânico Keychron K2',
      valor: 650.00,
      marca: 'Keychron'
    },
    {
      descricao: 'Monitor LG UltraWide 29"',
      valor: 1200.00,
      marca: 'LG'
    },
    {
      descricao: 'Webcam Logitech C920',
      valor: 380.00,
      marca: 'Logitech'
    },
    {
      descricao: 'Headset HyperX Cloud II',
      valor: 550.00,
      marca: 'HyperX'
    },
    {
      descricao: 'SSD Samsung 1TB',
      valor: 520.00,
      marca: 'Samsung'
    },
    {
      descricao: 'Memória RAM Corsair 16GB',
      valor: 350.00,
      marca: 'Corsair'
    },
    {
      descricao: 'Placa de Vídeo RTX 3060',
      valor: 2800.00,
      marca: 'NVIDIA'
    },
    {
      descricao: 'Cadeira Gamer DXRacer',
      valor: 1800.00,
      marca: 'DXRacer'
    }
  ])
  
  console.log('✅ Produtos criados com sucesso!')
}