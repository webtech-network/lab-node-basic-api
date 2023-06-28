# node-basic-app

# API RESTful com BD, Segurança e Docker

Neste roteiro vamos montar uma API RESTful para a realização das operações de um CRUD (Create, Read, Update e Delete) que oferece segurança integrada baseada no uso de tokens JWT (JSON Web Token) como formato identificação.

O passo a passo vai conduzir a criação dessa API de forma gradual.

## Passo 1 – Criar a aplicação de arquivos estáticos

Abra uma pasta para o novo projeto com o Visual Studio Code a e inicie o projeto com o npm **(npm init -y)** e instale os seguintes pacotes: express, dotenv, knex, pg, bcryptjs, jsonwebtoken e cors. Um comando direto para a instalação segue abaixo.

> ```bash
> $ npm install express dotenv knex pg bcryptjs jsonwebtoken cors –save
> ```

**OBSERVAÇÃO:** observe o parâmetro --save que informa ao npm para incluir tais módulos como dependências do projeto no arquivo `package.json`.

Em seguida, utilize o código apresentado no Quadro 1 para criar o arquivo `server.js` e estabelecer um servidor baseado no Express já preparado para aceitar requisições com o CORS e processar o corpo das requisições interpretando formatos json e urlencoded. Adicionalmente, nosso servidor já estabelecerá uma pasta `/public` para os arquivos estáticos da parte cliente da nossa aplicação. Esta pasta será acessada por meio da rota `/app` nas URLs.

### Quadro 1 - Código para o servidor server.js.

```javascript
require('dotenv').config()

const express = require ('express')
const cors = require('cors');
const path = require ('path')
const app = express ()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/app', express.static (path.join (__dirname, '/public')))

let port = process.env.PORT || 3000
app.listen (port)
```

Ao finalizar a instalação, inicialize o repositório local do git (**git init**). Crie, também, o arquivo `.gitignore` para ignorar arquivos desnecessários para subirmos para os repositórios remotos. Inclua a pasta `node_modules` e o arquivo `.env` que irá nos ajudar nas configurações locais.

Na sequência, crie uma pasta `public` e inclua os arquivos `index.html`, `app.js` e `style.css` colocando um conteúdo consistente, porém fictício em cada um deles, de tal forma que o navegador ao obter os arquivos exiba uma página de fundo amarelo e que ao terminar de ser carregada, exiba um alerta de boas-vindas via Javascript.

A estrutura do projeto deverá ficar tal como o seguinte quadro.

![arvore-de-arquivos](./documentation/img/arvore-de-arquivos.png)

Para nos ajudar no processo de testes da aplicação, vamos instalar o NodeMon que reinicia o servidor Node.js todas as vezes que um arquivo for alterado. Para isso execute o seguinte comando:

> $ npm install -g nodemon

**OBSERVAÇÃO:** observe o parâmetro -g para instalação do nodemon de forma global para utilizar em todos os seus projetos.

Execute o nodemon sobre o arquivo `server.js` **(nodemon server.js)** e faça um teste do site através do endereço **http://localhost:3000/app/**

Em seguida, faça o deploy do projeto para o ambiente do Heroku e teste novamente a aplicação no ambiente de nuvem. Para isso, utilize o comando a seguir, onde appnodeXYZ é o nome da aplicação no ambiente do Heroku. Substitua XYZ pelas iniciais do seu nome.

> heroku apps:create appnodeXYZ

Monte um snapshot com o git e faça o deploy da aplicação para o Heroku. Para isso execute os comandos a seguir, um de cada vez.

### adiciona os arquivos à stage do git

> git add .

### realiza commit criando novo snapshot

> git commit -m "Primeira versão"

### faz o deploy do branch master da aplicação para o heroku

> git push remote master

Faça um teste da sua aplicação no Heroku para verificar se está tudo ok. Para isso acesse a URL: **http://appnodexyz.herokuapp.com/app** (lembre-se que o xyz foi substituído pelas suas iniciais).

Se tudo foi seguido corretamente, você deverá ver a seguinte tela:

![hello-worl](./documentation/img/hello-worl.png)

Se tiver algum problema nesse teste, verifique os logs da sua aplicação no Heroku para identificar a causa do problema. Para isso, use o Heroku CLI para apresentar o final do arquivo de logs com o comando a seguir.

> heroku logs --tail

**OBSERVAÇÃO:** Esse comando irá conectar seu ambiente ao arquivo de logs e tudo que acontecer será apresentado para você. Se quiser cancelar isso, basta pressionar CTRL + C.

## Passo 2 – Criar a uma API para o CRUD de produtos

Nessa etapa, vamos criar uma API que vai oferecer a seguinte interface:

| Ação                       | Operação (CRUD) | Mapeamento da URL    |
| ---------------------------- | ----------------- | -------------------- |
| Incluir um produto           | CRETE             | POST /produtos/      |
| Obter a lista de Produtos    | RETRIEVE          | GET /produtos/       |
| Obter um produto específico | RETRIEVE          | GET /produtos/:id    |
| Alterar um produto           | UPDATE            | PUT /produtos/id:    |
| Excluir um produto           | DELETE            | DELETE /produtos/:id |

Inicialmente, vamos fazer uma prova de conceito com dados baseados em um array simples de objetos. Esse array é apresentado no quadro a seguir.

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

Agora, crie um router do Express para a API em um arquivo `/api/routes/apiRouter.js`, e complemente o código iniciado no quaro abaixo.

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

Pronto, inclua no seu arquivo `server.js` a referência ao API router na nossa aplicação do Express.

```javascript
const apiRouter = require('./api/routes/api_routes')

app.use ('/api', apiRouter)
```

Faça um teste da API que deve retornar os produtos definidos no array, conforme imagem a seguir.

![test-api-products](./documentation/img/test-api-products.png)

Agora vamos converter nossa API para acessar um banco de dados real ao invés do array de testes.

Para criar o Banco de Dados, acesse o painel do Heroku, acesse sua aplicação, escolha a ficha Resources e inclua um Add-on chamado Heroku Postgres, conforme mostrado na imagem a seguir.

![heroku-postgres](./documentation/img/heroku-postgres.png)

Em seguida, localize as credenciais de acesso, abrindo o add-on do Postgres e selecionando a opção Settings -> View Credentials. Nesta tela você vai encontrar os dados para conexão com o banco de dados (host, database, user, port, password). Utilize um cliente de bancos de dados de sua preferência para conectar ao ambiente e criar as tabelas necessárias e inserir dados preliminares.

Vamos precisar de uma tabela de produtos. A seguir você encontrará os scripts necessários para a configuração e carga inicial da tabela de **Produto.**

Script para criação da tabela **Produto**

```javascript
CREATE SEQUENCE produto_id_seq;
CREATE TABLE produto (
    id int4 NOT NULL DEFAULT nextval('produto_id_seq'),
    descricao varchar(200) NOT NULL,
    valor numeric NOT NULL DEFAULT 0,
    marca varchar(100) NULL,
    CONSTRAINT produto_pk PRIMARY KEY (id)
);
CREATE UNIQUE INDEX produto_id_idx ON public.produto USING btree (id);
```

Script para carga inicial da tabela de **Produto**

```javascript
INSERT INTO produto (descricao, valor, marca)
    VALUES('Arroz parboilizado 5Kg', 25, 'Tio João');
INSERT INTO produto (descricao, valor, marca)
    VALUES('Maionese 250gr', 7.2, 'Helmanns');
INSERT INTO produto (descricao, valor, marca)
    VALUES('Iogurte Natural 200ml', 2.5, 'Itambé');
INSERT INTO produto (descricao, valor, marca)
    VALUES('Nescau 400gr', 8, 'Nestlé');
INSERT INTO produto (descricao, valor, marca)
    VALUES('Batata Palha 180gr', 5.20, 'Chipps');
INSERT INTO produto (descricao, valor, marca)
    VALUES('Feijão Carioquinha', 5, 'Xap');
```

Agora que temos o banco de dados funcional, vamos utilizar o módulo Knex para realizar a conexão com o banco de dados. Para isso, inclua o código de configuração da conexão com o banco de dados no início do router, logo após a importação dos módulos necessários, conforme quadro a seguir.

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

Agora é sua vez de montar o código para realizar as demais operações do CRUD para a nossa API. Implemente os códigos para as requisições a seguir:

```javascript
apiRouter.get(endpoint + 'produtos/:id', (req, res) => { ... })
apiRouter.post(endpoint + 'produtos', (req, res) => { ... })
apiRouter.put(endpoint + 'produtos/:id', (req, res) => { ... })
apiRouter.delete(endpoint + 'produtos/:id', (req, res) => { ... })
```

Em seguida, teste cada um dos endpoints do CRUD da API.

## Passo 3 – Montar a parte de segurança da API

Nessa etapa, vamos criar os endpoints para permitir que sejam registrados novos usuários e que se possa realizar o login. Para a parte de segurança, a API terá a seguinte interface:

| Ação                    | Mapeamento da URL        |
| ------------------------- | ------------------------ |
| Incluir um produto        | POST /seguranca/register |
| Obter a lista de Produtos | POST /seguranca/login    |

Vamos precisar também de uma tabela usuários. A seguir, você encontrará os scripts necessários para a configuração e carga inicial dessa tabela.

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

Script para carga inicial da tabela de **Usuario**

```javascript
INSERT INTO usuario (nome, login, senha, email, roles)
    VALUES('user', 'user', '$2a$08$tprzZIs1OTKVMaVzZWrKfe8rX3toatWD6lsvp4u9AR54mrbSSLX7e', 'user@abc.com.br', 'USER');
INSERT INTO usuario (nome, login, senha, email, roles)
    VALUES('admin', 'admin', ' $2a$08$tprzZIs1OTKVMaVzZWrKfe8rX3toatWD6lsvp4u9AR54mrbSSLX7e', 'admini@abc.com.br', 'USER;ADMIN');
```

**OBSERVAÇÃO:** Perceba que a senha (1234) é armazenada no banco na forma de um hash e não no formato aberto. A representação acima é obtida por meio do módulo bcrypt, mencionado no início do roteiro.

No nosso Router da API, vamos incluir dois middlewares para tratar as rotas de registro e login de usuários.

O quadro a seguir, apresenta o código para o registro de novos usuários. Nesse código, invocamos o módulo knex para inserir o usuário e caso tudo corra bem, enviamos o código do usuário inserido de volta para o cliente. Perceba que será necessário importar o módulo bcrypt no início do Router.

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

Agora, precisamos do código para o middleware que verifica o login e a senha do usuário. Uma requisição de login para a API retornará uma token de acesso que deverá ser utilizada em todas as demais requisições.

O quadro a seguir apresenta o código de validação do login que, além de verificar se o usuário existe no banco de dados, compara a senha por meio do hash da senha informada com o hash da senha mantida no banco. Em seguida, se tudo estiver ok, é gerada uma token baseada no padrão JWT, utilizando o módulo JSONWebToken. Para isso será necessário importar este módulo no início do arquivo do Router.

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

Todas as vezes que um usuário

## Passo 4 – Configurar a segurança nos endpoints da API

Nessa etapa, vamos alterar a API da parte de produtos para controlar o acesso aos recursos disponíveis. Os usuários comuns que possuam a role USER podem fazer leitura dos produtos, porém, apenas usuários com a role ADMIN podem realizar as operações de CREATE, DELETE e UPDATE do CRUD.

Esse controle é realizado por meio da token que é fornecida quando é realizado o login da aplicação. Nesse ponto, precisamos de uma middleware que verifique se a token foi recebida e outro que verifique as roles que o usuário possui. Estes middlewares poderão ser incluídos nos middlewares da API de acordo com a necessidade da aplicação.

O quadro abaixo traz o código do middleware checkToken que executa a verificação de existência e consistência da token que não pode ser alterada no cliente.

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

No quadro a seguir, é apresentado o código do middleware que verifica se o usuário possui a role ADMIN a partir do id do usuário recebido via token repassada na requisição.

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
            }
        })
        .catch (err => {
        res.status(500).json({
        message: 'Erro ao verificar roles de usuário - ' + err.message })
        })
}
```

Agora que já temos os middlewares de verificação da token, podemos incluir estes middlewares nos endpoints da API de produtos, conforme mostrado no quadro a seguir.

```javascript
// rotinas permitidas para qualquer usuário
apiRouter.get(endpoint + 'produtos', checkToken, (req, res) => { ... })
apiRouter.get(endpoint + 'produtos/:id', checkToken, (req, res) => { ... })

// rotinas permitidas apenas para administradores
apiRouter.post(endpoint + 'produtos', checkToken, isAdmin, (req, res) => { ... }) apiRouter.put(endpoint + 'produtos/:id', checkToken, isAdmin, (req, res) => { ... }) apiRouter.delete(endpoint + 'produtos/:id', checkToken, isAdmin, (req, res) => { ... })
```

Esta é a implementação de um módulo servidor que dá sustentação à criação de diversas aplicações. Agora, exercite-se montando um cliente para consumir os dados disponibilizados com o devido controle de segurança.
