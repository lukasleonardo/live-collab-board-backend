import { server } from "./app";

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🚀 https://localhost:${PORT}`);
});
