
# Live Board — Backend

Este é o backend do **Live Board**, uma aplicação estilo Kanban com suporte a múltiplos usuários e colaboração em tempo real. Desenvolvido com Node.js e Express, utiliza MongoDB e WebSockets para sincronização instantânea entre clientes.

## 🚀 Tecnologias utilizadas

- **Node.js**

- **Express**

- **Mongoose**

- **Socket.IO**

- **bcryptjs / JWT**

- **CORS / Helmet**

- **dotenv**

  

## 📦 Instalação

  

```bash

git clone https://github.com/seu-usuario/liveboard-backend.git

cd liveboard-backend

npm install
```
  

▶️ Execução local
  
```bash

npm run dev

```
  
Certifique-se de ter um MongoDB rodando localmente ou configure um URI na variável de ambiente.

🌐 Variáveis de ambiente

Crie um .env:

```.env
PORT=5000

MONGODB_URI=mongodb://localhost:27017/liveboard

JWT_SECRET=sua_chave_secreta

CLIENT_URL=http://localhost:5173

```
  

🧩 Estrutura principal


    controllers/: lógica dos boards, tasks, auth


    models/: schemas de usuário, board, task


    routes/: rotas protegidas por autenticação


    sockets/: handlers dos eventos WebSocket (como board:created, task:updated)


    middlewares/: autenticação JWT


    utils/: funções auxiliares

  

🔐 Funcionalidades principais
  

    Registro e login de usuários (JWT)


    CRUD de quadros e tarefas
 

    População de membros e dono nos boards


    Verificação de permissões (somente o owner pode deletar um board)


    Eventos WebSocket:


        board:created


        task:created, task:updated, task:moved, etc.


    Contagem de tarefas por board (taskCount)


📦 API Endpoints

Método  Rota    Descrição

POST    /api/auth/login Login

POST    /api/auth/register  Registro

GET /api/boards Listar boards do usuário

POST    /api/boards Criar novo board

DELETE  /api/boards/:id Deletar board (somente owner)

... /api/tasks/...  Operações com tarefas


🔗 Frontend

  

O código do frontend está disponível aqui: [https://github.com/lukasleonardo/live-collab-board-frontend]