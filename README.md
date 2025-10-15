# node-basic-app

# API RESTful com Node, PostgreSQL e JWT.
<<<<<<< HEAD

=======
>>>>>>> main

A partir desse roteiro de etapas vamos desenvolver uma API RESTful para a execução de operações CRUD (Create, Read, Update, Delete) sob uma base de dados, parâmetrizando a segurança e acesso a esses dados com uso de tokens JWT( Json Web Token). 

No passo a passo implementaremos isso de forma gradual.

## Passo 1 – Criar a aplicação de arquivos estáticos
Abra uma nova pasta para esse projeto, e no diretório dessa pasta, pelo terminal execute o comando de inicialização do projeto Node: 

> ```bash
> $ npm init -y   #Comando de incialização de um projeto em Node
> ```

Em seguida, devemos instalar os pacotes e dependências que utilizaremos em nosso projeto:

> ```bash
> $ npm install express dotenv knex pg bcryptjs jsonwebtoken cors –save
> ```

**OBS:** O parâmetro “—save” informa que todas esses pacotes serão inseridos como dependência no arquivo “package.json”.

Em seguida, devemos criar um arquivo chamado “server.js” com o conteúdo apresentado no Quadro 1. Esse arquivo será utilizado para estabelecer um servidor baseado em Express que já esteja pronto para aceitar requisições com o CORS e processar o corpo das requisições, interpretando formatos “json’ e “urlencoded”. Os arquivos estáticos do nosso projeto serão acessados por uma pasta “/public” que estão dentro da pasta “/app”. dentro de outra pasta chamada “/app”.

### Quadro 1 - Código para o servidor server.js.

```javascript
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/app', express.static(path.join(__dirname, '/public')))

let port = process.env.PORT || 3000
app.listen(port)

```
Em seguida, vamos desenvolver o restante dos arquivos e pastas relacionados ao projeto. Devemos criar o arquivo ‘.gitignore’ para ignorar arquivos desnecessários quando inicializarmos o projeto como repositório no GitHub. Adicione também o arquivo ‘node_modules’ e ‘.env’Agora devemos desenvolver o restantes dos arquivos e pastas necessários para a manutenção do projeto. Vamos criar o arquivo “.gitignore” para ignorar a presença de arquivos desncessários para quando incializarmos o projeto como repositório no GitHub. Crie também o arquivo ‘.env’ para configurações locais. Em seguida, adicione os conteúdos de respectivos arquivos:

### Arquivo ‘.gitignore’ :

```bash
node_modules/
.env
*.log
.DS_Store
dist/
build/
```

### Arquivo ‘.env’ :

```bash
SECRET_KEY=minha_chave_super_secreta_jwt_123456789
NODE_ENV=development
PORT=3000
DATABASE_URL= #Preencheremos depois
```


Em sequência, crie a pasta chamada ‘public’ e dentro da mesma, insira os arquivos : ‘index.html’, ‘style.css’ e ‘script.js’. Dentro delas, insira um conteúdo consistente, porém fictício em cada uma delas, de forma que o navegador ao obter os arquivos exiba o conteúdo dos arquivos.

Essa deve ser a estrutura do projeto:


![arvore-de-arquivos](./documentation/img/tree.png)

Agora, para ajudar na manutenção e nos testes da aplicação, vamos instalar um pacote chamado NodeMon, que reinicia o servidor toda vez que identifica uma mudança na estrutura do projeto ou na versão de um arquivo. Execute o seguinte comando: 

>```bash
> $ npm install -g nodemon
>```

OBS: O parâmetro ‘-g’ é utilizado para instalar o pacote em todos os projetos de Node de maneira global.

Para teste execute o nodemon sobre o arquivo ‘server.js’, da seguinte maneira:

>```bash
>nodemon server.js
>```

Verifique o funcionamento, acessando o endereço: [**http://localhost:3000/app/**](http://localhost:3000/app/)

### Deploy no servidor RailWay:

Antes de tudo, devemos inicializar o projeto como um repositório no GitHub e adicionar as mudanças. Para isso, execute os seguintes comandos: 

```bash
git init          #Inicializa o projeto como repositório
git add .         #Adiciona mudanças previamente realizadas.
git commit -m "Primeiro Commit do Projeto" #Especifica mensagem de commit
```

Em seguida, executaremos alguns comandos para gerar um repositório no site do GitHub que será utilizado para gerar o projeto no RailWay: 

```bash
git remote add origin https://github.com/SEU_USUARIO/seu-repositorio.git
git branch -M main
git push -u origin main
```

Para o Deploy, acesse o site https://railway.com/  e faça login com o GitHub:

![imagerailway](./documentation/img/login_railway.png)

No DashBoard, clique em “New Project”, selecione a opção “Deploy from GitHub Repo” e autorize o RailWay a acessar seus repositórios. Selecione então o repositório do seu projeto. Assim o RailWay vai identificar o projeto automaticamente como Node e iniciar o deploy.

![dashboard-railway](documentation/img/dashboard_railway.png)
Para testar a aplicação acesse o link disponibilizado pelo próprio RailWay do seu projeto.

## Passo 2 – Criar a uma API para o CRUD de produtos

Nessa etapa, vamos criar uma API que vai oferecer a seguinte interface:

| Ação                       | Operação (CRUD) | Mapeamento da URL    |
| ---------------------------- | ----------------- | -------------------- |
| Incluir um produto           | CRETE             | POST /produtos/      |
| Obter a lista de Produtos    | RETRIEVE          | GET /produtos/       |
| Obter um produto específico | RETRIEVE          | GET /produtos/:id    |
| Alterar um produto           | UPDATE            | PUT /produtos/id:    |
| Excluir um produto           | DELETE            | DELETE /produtos/:id |

Inicialmente para proṕositos de teste, vamos criar um array para armazenar objetos. Esse array é apresentado nesse quadro: 

```javascript
const db_produtos = {
    produtos: [
        { id: 1, descricao: "Arroz parboilizado 5Kg", valor: 25.00, marca: "Tio João" },
        { id: 2, descricao: "Maionese 250gr", valor: 7.20, marca: "Helmans" },
        { id: 3, descricao: "Iogurte Natural 200ml", valor: 2.50, marca: "Itambé" },
        { id: 4, descricao: "Batata Maior Palha 300gr", valor: 15.20, marca: "Chipps" },
        { id: 5, descricao: "Nescau 400gr", valor: 8.00, marca: "Nestlé" },
    ]
}
```

Agora para consumir os dados provinientes do JSON, vamos criar um router do Express para a API, em um arquivo **‘/api/routes/apiRouter.js’** e complementar com o código abaixo: 

```javascript
const express = require ('express')
let apiRouter = express.Router()

const endpoint = '/'
const lista_produtos = {
    produtos: [
        { id: 1, descricao: "Produto 1", valor: 5.00, marca: "marca " },
        { id: 2, descricao: "Produto 2", valor: 5.00, marca: "marca " },
        { id: 3, descricao: "Produto 3", valor: 5.00, marca: "marca " },
    ]
}
apiRouter.get (endpoint + 'produtos', function (req, res) {
res.status(200).json (lista_produtos)
})

...

module.exports = apiRouter;
```

Depois disso, inclua no arquivo ‘server.js’ a referência à rota da API da nossa aplicação do Express:

```javascript
const apiRouter = require('./api/routes/api_routes')

app.use ('/api', apiRouter)
```

Agora, faça um teste da API, que deve retornar os produtos estabelecidos no JSON, coforme a imagem a seguir:

![test-api-products](./documentation/img/json_data.png)

Para dar continuidade ao projeto, agora vamos converter nossa API para receber dados de um banco de dados real, ao invés de um conjunto fictício.

Para criar o banco de dados, acesso o site do RailWay novamente e no dashboard do mesmo projeto crie um serviço de "Database" e clique em PostgreSQL.

Após o banco de dados ter sido criado, clique no card da aplicação Node, e navegue até a página “Variables”, clique em “New Variable”, então adicione :

```bash
 Variable name:SECRET_KEY
 Value:minha_chave_super_secreta_jwt_123456789
 ```

 ```bash
 Variable name:DATABASE_URL
 Value: #Cole a URL do banco de dados presente no serviço do Railway.
 ```

Além disso, altere o valor do parâmetro “DATABASE_URL” no arquivo ‘.env’ para o valor presente na área de mesmo nome na página “Variables” do banco de dados no RailWay.

Agora que temos o banco de dados criado e conectado ao nosso projeto, devemos criar as tabelas e inserir conteúdos que serão disponibilizado.

Vamos utilizar de scritps ‘Knex” e da interface de comandos do Railway, a fim de gerar as tabelas de ‘Produtos” e ‘’Usuários’.

Como primeiro passo, devemos criar um arquivo JavaScript chamado ‘knexfile’, que servirá como arquivo modulador das operações de migração do banco de dados. Insira o conteúdo do quadro abaixo no arquivo criado:


```javascript
require("dotenv").config();
module.exports = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || "produtos_db",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
    },
    migrations: { directory: "./database/migrations" },
    seeds: { directory: "./database/seeds" },
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: { directory: "./database/migrations" },
    seeds: { directory: "./database/seeds" },
    ssl: { rejectUnauthorized: false },
  },
};
```

Após isso, crie um diretório chamado de “database” e dentro do mesmo crie duas pastas, uma chamada “migrations” e outra com nome de “seeds”. A pasta migrations, servirá para a manutenção dos arquivos de criação das tabelas necessárias e a pasta “seeds” servirá para gerir os arquivos de inserção e carregamento do conteúdo do nosso banco de dados. Dentro de migrations, insira o código abaixo em um arquivo para criar a tabela de produtos:

```javascript
exports.up = function (knex) {
  return knex.schema.createTable("produto", (table) => {
    table.increments("id").primary();
    table.string("descricao").notNullable();
    table.decimal("valor", 10, 2).notNullable();
    table.string("marca").notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("produto");
};
```

Agora, dentro da pasta seeds, crie o arquivo para o script de carga do banco de dados e insira o conteúdo do quadro abaixo:

```javascript
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
```

Agora, devemos criar o script que estabelecerá  a conexão com o banco de dados, para isso, dentro da pasta database, crie um arquivo avulso chamado “connection.js” e insira o conteúdo abaixo:
```javascript
const knex = require('knex')
const knexConfig = require('../knexfile')

const environment = process.env.NODE_ENV || 'development'
const config = knexConfig[environment]

const db = knex(config)

module.exports = db

```
Com o banco de dados inicializado e configurado, utilizaremos agora o módulo “Knex” para executar a conexão entre o projeto Node e o banco de dados propriamente dito. Adicione o código abaixo logo depois da importação dos módulos necessário

```javascript
const knex = require('knex')({
    client: 'pg',
    debug: true,
    connection: {
        connectionString : process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    }
});
```


Agora, altere o código do middleware que atende às requisições de GET /api/produtos, colocando o código que segue no quadro a seguir

```javascript
apiRouter.get(endpoint + 'produtos', (req, res) => {
    knex.select('*').from('produto')
    .then( produtos => res.status(200).json(produtos) )
    .catch(err => {
        res.status(500).json({
            message: 'Erro ao recuperar produtos - ' + err.message })
    })
})
```

Agora, é sua vez de desenvolver o código para as operações restantes e por em prática o que foi visto até agora, leve em conta as seguintes operações:

```javascript
apiRouter.get(endpoint + 'produtos/:id', (req, res) => { ... })
apiRouter.post(endpoint + 'produtos', (req, res) => { ... })
apiRouter.put(endpoint + 'produtos/:id', (req, res) => { ... })
apiRouter.delete(endpoint + 'produtos/:id', (req, res) => { ... })
```

Em seguida, teste cada um dos endpoints do CRUD da API.

## Passo 3 – Configurações de segurança da API

Nessa etapa, vamos criar os endpoints para permitir que sejam registrados novos usuários e que se possa realizar o login. Para a parte de segurança, a API terá a seguinte interface:

| Ação                    | Mapeamento da URL        |
| ------------------------- | ------------------------ |
| Incluir um produto        | POST /seguranca/register |
| Obter a lista de Produtos | POST /seguranca/login    |

Para determinada interface devemos criar uma tabela chamda ‘usuários’. No quadro abaixo constam os scripts que deverão ser inseridos no cliente do banco de dados, como já foi feito anteriormente:

Script para criação da tabela **Usuário**

```javascript
CREATE SEQUENCE usuario_id_seq;
CREATE TABLE public.usuario (
    id int NOT NULL DEFAULT nextval('usuario_id_seq'),
    nome varchar(200) NOT NULL,
    email varchar(100) NOT NULL,
    login varchar(100) NOT NULL,
    senha varchar(100) NOT NULL,
    roles varchar (200) NOT NULL DEFAULT 'USER',
    CONSTRAINT usuario_pk PRIMARY KEY (id)
);
```

Em seguida, insira o scrpit para gerar o conteúdo inicial da tabela de usuários

```javascript
INSERT INTO usuario (nome, login, senha, email, roles)
    VALUES('user', 'user', '$2a$08$tprzZIs1OTKVMaVzZWrKfe8rX3toatWD6lsvp4u9AR54mrbSSLX7e', 'user@abc.com.br', 'USER');
INSERT INTO usuario (nome, login, senha, email, roles)
    VALUES('admin', 'admin', ' $2a$08$tprzZIs1OTKVMaVzZWrKfe8rX3toatWD6lsvp4u9AR54mrbSSLX7e', 'admini@abc.com.br', 'USER;ADMIN');
```

**OBSERVAÇÃO:**  A senha utilizada para o conteúdo de teste (1234) é armazenada no banco de dados na forma de um hash e não no formato disponível, de maneira a garantir a segurança e criptografia de tal parâmetro. Esse método é possível por meio do módulo “bycrypt”

Agora devemos inserir no código do router da api, dois middlewares relativos aos endpoints de cadastro e login.

No quadro a seguir, desenvolvemos o endpoint do registro, por meio da utilização do módulo ‘knex’. Para isso é necessário importar o módulo ‘bycrypt’ no início do código:

```javascript
const bcrypt = require('bcryptjs')
...
apiRouter.post (endpoint + 'seguranca/register', (req, res) => {
    knex ('usuario')
        .insert({
        nome: req.body.nome,
        login: req.body.login,
        senha: bcrypt.hashSync(req.body.senha, 8),
        email: req.body.email
        }, ['id'])
        .then((result) => {
        let usuario = result[0]
        res.status(200).json({e"id": usuario.id })
        return
        })
        .catch(err => {
        res.status(500).json({
        message: 'Erro ao registrar usuario - ' + err.message })
        })
})
```

Em sequência precisamos desenvolver o middleware relativo ao login, esse método deverá gerar uma requisição de login para a API que deverá retornar um token que será utilizado para as demais aplicações.

O próximo quadro apresenta o código de validação, que verifica se o usuário existe dentro do banco de dados e além disso compara o hash da senha informada com a senha presente no banco de dados. Se todas as informações forem validadas é gerado um token padrão JWT, com base no módulo JsonWebToken, e para isso, devemos importar o mesmo no início do código do router.

```javascript
const jwt = require('jsonwebtoken')
...
apiRouter.post(endpoint + 'seguranca/login', (req, res) => {
    knex
        .select('*').from('usuario').where( { login: req.body.login })
        .then( usuarios => {
            if(usuarios.length){
                let usuario = usuarios[0]
                let checkSenha = bcrypt.compareSync (req.body.senha, usuario.senha)
                if (checkSenha) {
                var tokenJWT = jwt.sign({ id: usuario.id },
                    process.env.SECRET_KEY, {
                    expiresIn: 3600
                    })
                res.status(200).json ({
                    id: usuario.id,
                    login: usuario.login,
                    nome: usuario.nome,
                    roles: usuario.roles,
                    token: tokenJWT
                    })
                    return
                }
            }
            res.status(200).json({ message: 'Login ou senha incorretos' })
    })
    .catch (err => {
        res.status(500).json({
            message: 'Erro ao verificar login - ' + err.message })
    })
})
```

## Passo 4 - Execução da migração do banco de dados

Nessa etapa, devemos executar os scripts de migração do banco de dados, tendo em vista as mudanças que fizemos. Para isso, se certifique de que o arquivo “package.json” esteja confgurado como o quadro abaixo:

```javascript
{
  "name": "nome-da-sua-aplicacao
   "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "migrate": "npx knex migrate:latest",
    "seed": "npx knex seed:run",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "bcryptjs": "^3.0.2",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "knex": "^3.1.0",
    "pg": "^8.16.3"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
```
Em seguida, no diretório do projeto, instale o RailWay CLI, por meio do comando a seguir:
>```bash
>$ npm i -g @railway/cli
>```

Faça o login com a sua conta do Railway:
>```bash
>$ railway login
>```
Vincule ao projeto que estamos fazendo:
>```bash
>$ railway link
>```

E então, devemos executar o script de migração do banco, para isso, cole o comando abaixo no terminal: 

>```
>$ railway run npx knex migrate:latest --env production
>```
Em seguida, preencheremos as tabelas que foram criadas pelo script anterior com o conteúdo das seeds, para isso execute o comando abaixo: 

>```bash
>$ railway run npx knex seed:run --env production
>```

Após esses passos, o banco de dados deve estar completamente funcional e pronto para o consumo da API.
## Passo 5 – Configurar a segurança nos endpoints

Nesse passo, devemos configurar a parte de segurança dos endpoints da Api, de forma a controlar o acesso aos recursos disponíveis. O controle de acesso deve funcionar garantindo que usários comuns possam apenas visualizar os dados (READ), e apenas administradores tenham acesso às outras operações (CREATE, DELETE, UPDATE).

O controle é realizado pelo token que foi gerado no login da aplicação. Dessa maneira, precisamos de um middleware que verifique se o token foi recebido e outro que interprete o role desse usário.

Utilize o código abaixo para implementar os novos middlewares no router da API:

```javascript
let checkToken = (req, res, next) => {
    let authToken = req.headers["authorization"]
    if (!authToken) {
        res.status(401).json({ message: 'Token de acesso requerida' })
    }
    else {
        let token = authToken.split(' ')[1]
        req.token = token
    }

    jwt.verify(req.token, process.env.SECRET_KEY, (err, decodeToken) => {
        if (err) {
            res.status(401).json({ message: 'Acesso negado'})
            return
        }
        req.usuarioId = decodeToken.id
        next()
    })
}
```

Perceba que a token é transmitida através do cabeçalho authorization da requisição. Um exemplo desse cabeçalho é apresentado a seguir:

> Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6....

No próximo quadro é apresentado o middleware que detecta se o usário possui o role de ADMIN e a partir disso, autoriza ou não o uso das demais operações, a partir do token recebido:

```javascript
let isAdmin = (req, res, next) => {
    knex
        .select ('*').from ('usuario').where({ id: req.usuarioId })
        .then ((usuarios) => {
            if (usuarios.length) {
                let usuario = usuarios[0]
                let roles = usuario.roles.split(';')
                let adminRole = roles.find(i => i === 'ADMIN')
                if (adminRole === 'ADMIN') {
                    next()
                    return
                }
                else {
                    res.status(403).json({ message: 'Role de ADMIN requerida' })
                    return
                }
            } else {
                res.status(404).json({message: "Usuário não encontrado"})
            }
        })
        .catch (err => {
        res.status(500).json({
        message: 'Erro ao verificar roles de usuário - ' + err.message })
        })
}
```

Agora que já temos os middlewares de verificação da token, basta adicioná-los nos endpoints respectivos a cada operação:
```javascript
 //Operações permitidas para qualquer usuário
apiRouter.get(endpoint + 'produtos', checkToken, (req, res) => { ... })
apiRouter.get(endpoint + 'produtos/:id', checkToken, (req, res) => { ... })

 //Operações permitidas apenas para admin
apiRouter.post(endpoint + 'produtos', checkToken, isAdmin, (req, res) => { ... }) apiRouter.put(endpoint + 'produtos/:id', checkToken, isAdmin, (req, res) => { ... }) apiRouter.delete(endpoint + 'produtos/:id', checkToken, isAdmin, (req, res) => { ... })
 ```   


Esta é a implementação de um módulo servidor que dá sustentação à criação de diversas aplicações. Agora, exercite-se montando um cliente para consumir os dados disponibilizados com o devido controle de segurança.

