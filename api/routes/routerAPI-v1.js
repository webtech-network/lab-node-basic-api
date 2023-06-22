const express = require ('express')
const routerAPIv1 = express.Router()

routerAPIv1.use (express.urlencoded( { extended: true } ))
routerAPIv1.use (express.json())

const lista_produtos = {
  produtos: [
      { id: 1, descricao: "Arroz parboilizado 5Kg", valor: 25.00, marca: "Tio João"  },
      { id: 2, descricao: "Maionese 250gr", valor: 7.20, marca: "Helmans"  },
      { id: 3, descricao: "Iogurte Natural 200ml", valor: 2.50, marca: "Itambé"  },
      { id: 4, descricao: "Batata Maior Palha 300gr", valor: 15.20, marca: "Chipps"  },
      { id: 5, descricao: "Nescau 400gr", valor: 8.00, marca: "Nestlé"  },
  ]
}

// Cria um manipulador da rota padrão 
routerAPIv1.get('/produtos', function (req, res) {
  res.json(lista_produtos)
})
  
// Cria um manipulador da rota padrão 
routerAPIv1.post('/produtos', function (req, res) {
  req.body.id = lista_produtos.produtos.length + 1;
  lista_produtos.produtos.push (req.body);
  res.json (`{ message: "Produto inserido com sucesso" }`)
})


module.exports = routerAPIv1