require('dotenv').config()

const express = require ('express')
const morgan = require ('morgan')
const helmet = require ('helmet')

const app = express ()

app.use (morgan("tiny"))
app.use (helmet())

const routerClient = require ('./routes/routerClient')
app.use ('/public', routerClient)

const routerAPIv1 = require ('./routes/routerAPI-v1')
app.use ('/api/v1', routerAPIv1)

const routerAPIv2 = require ('./routes/routerAPI-v2')
app.use ('/api/v2', routerAPIv2)

const routerSeg = require ('./routes/routerSeg')
app.use ('/seg', routerSeg)

app.use (function (req, res) {
  res.status(404).send ('Recurso não encontrado.')
})

// Inicializa o servidor HTTP
const PORT = process.env.PORT || 3000
app.listen (PORT, function () {
  console.log (`Servidor rodando na porta: ${PORT}`)
})
