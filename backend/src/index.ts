// backend/src/index.ts

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db';                   // Sua função de conexão com o MongoDB (Mongoose)
import employeeRoutes from './routes/employee.routes';
import certificateRoutes from './routes/certificate.routes';

// 1. Carrega as variáveis de ambiente (apenas uma vez)
dotenv.config();

// 2. Conecta ao MongoDB Atlas via Mongoose
connectDB();

// 3. Cria a aplicação Express
const app = express();

// 4. Middlewares globais

// 4.1 Habilita CORS (caso queira configurar origens específicas, edite as opções abaixo)
app.use(
  cors({
    origin: (origin, callback) => {
      // Permite qualquer origem (útil para desenvolvimento com ngrok)
      // Em produção, você deve restringir para domínios específicos
      callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  })
);

// 4.2 Faz o parse do JSON no corpo das requisições
app.use(express.json());

// 4.3 Faz o parse do URL-encoded (formulários simples)
app.use(express.urlencoded({ extended: true }));

// 4.4 (Opcional) Middleware de logging básico (descomente se quiser ver no console cada requisição)
// import morgan from 'morgan';
// app.use(morgan('dev'));

// 5. Rotas principais da API

// 5.1 Rotas de Employee (funcionários)
app.use('/api/employees', employeeRoutes);

// 5.2 Rotas de Certificate (certificados)
app.use('/api/certificates', certificateRoutes);

// 6. Health check (rota para monitoramento/uptime)
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// 7. Tratamento de rotas não encontradas (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// 8. Middleware global de tratamento de erros
interface ApiError extends Error {
  statusCode?: number;
}
app.use(
  (
    err: ApiError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) => {
    console.error('❌ Erro capturado no middleware global:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
      status: 'error',
      message,
    });
  }
);

// 9. Inicia o servidor na porta definida em .env (ou 5000 por padrão)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// 10. Captura rejeições de Promises não tratadas e encerra o processo com falha
process.on('unhandledRejection', (reason: any) => {
  console.error('💥 Unhandled Rejection:', reason);
  // Encerra o processo para evitar comportamentos estranhos
  process.exit(1);
});

// 11. Captura erros não tratados (não recomendável manter em produção, mas útil em dev)
// process.on('uncaughtException', (err: Error) => {
//   console.error('💥 Uncaught Exception:', err);
//   process.exit(1);
// });
