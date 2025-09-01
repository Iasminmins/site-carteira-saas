# Certifi Industrial Hub

[![Status do Build](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/seu-usuario/certifi-industrial-hub)
[![Licença](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Versão Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D4.4-green.svg)](https://www.mongodb.com/)

Sistema de gestão de certificados digitais de nível empresarial para conformidade industrial, especializado em normas regulamentadoras brasileiras (NRs), certificações ISO e registros de treinamentos de segurança ocupacional.

## Visão Geral da Arquitetura

O sistema segue uma arquitetura orientada a microserviços com clara separação entre serviços frontend e backend, implementando práticas de segurança padrão da indústria e gerenciamento escalável de dados.

### Arquitetura do Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │────│   Express API   │────│   MongoDB       │
│   (TypeScript)  │    │   (Node.js)     │    │   (Atlas)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────│   JWT Auth      │──────────────┘
                        │   Middleware    │
                        └─────────────────┘
```

## Stack Tecnológico

### Infraestrutura Backend
| Componente | Tecnologia | Versão | Propósito |
|------------|------------|--------|-----------|
| Runtime | Node.js | ≥16.0.0 | Execução JavaScript server-side |
| Framework | Express.js | ^4.18.0 | Desenvolvimento de API RESTful |
| Banco de Dados | MongoDB | ≥4.4.0 | Armazenamento orientado a documentos |
| ODM | Mongoose | ^7.0.0 | Modelagem de objetos MongoDB |
| Autenticação | JWT | ^9.0.0 | Autenticação stateless |
| Validação | Joi/Yup | ^17.0.0 | Validação de payload de requisições |

### Infraestrutura Frontend  
| Componente | Tecnologia | Versão | Propósito |
|------------|------------|--------|-----------|
| Framework | React | ^18.0.0 | Desenvolvimento de UI baseada em componentes |
| Linguagem | TypeScript | ^5.0.0 | JavaScript com tipagem segura |
| Estilização | Tailwind CSS | ^3.3.0 | Framework CSS utility-first |
| Roteamento | React Router | ^6.8.0 | Roteamento client-side |
| Gerenciamento de Estado | Context API | Nativo | Gerenciamento de estado global |
| Cliente HTTP | Axios | ^1.3.0 | Manipulação de requisições HTTP |

## Instalação e Configuração

### Pré-requisitos

Certifique-se de que as seguintes dependências estão instaladas:

```bash
node --version  # ≥16.0.0
npm --version   # ≥8.0.0
git --version   # Última versão estável
```

### Configuração do Ambiente

1. **Clonar Repositório**
   ```bash
   git clone https://github.com/seu-usuario/certifi-industrial-hub.git
   cd certifi-industrial-hub
   ```

2. **Configuração do Backend**
   ```bash
   cd backend
   npm ci --only=production
   ```

3. **Variáveis de Ambiente**
   
   Criar arquivo `.env` com a seguinte configuração:
   
   ```env
   # Configuração do Banco de Dados
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/certificate-management?retryWrites=true&w=majority
   
   # Configuração do Servidor
   NODE_ENV=production
   PORT=5000
   
   # Configuração de Segurança
   JWT_SECRET=sua-chave-secreta-256-bits-aqui
   JWT_EXPIRES_IN=7d
   BCRYPT_SALT_ROUNDS=12
   
   # Configuração CORS
   CORS_ORIGIN=https://seu-dominio.com,https://seu-staging.com
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   # Configuração de Upload de Arquivos
   MAX_FILE_SIZE=5242880
   ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png
   ```

4. **Inicialização do Banco de Dados**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Configuração do Frontend**
   ```bash
   cd ../src
   npm ci --only=production
   ```

6. **Inicialização da Aplicação**
   ```bash
   # Backend (Terminal 1)
   cd backend && npm run start:prod
   
   # Frontend (Terminal 2)  
   cd src && npm run build && npm run preview
   ```

## Documentação da API

### Endpoints de Autenticação

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "usuario@empresa.com",
  "password": "senhaSegura123",
  "role": "admin|employee|superadmin"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f123...",
      "email": "usuario@empresa.com",
      "role": "admin",
      "companyId": "64f456..."
    }
  }
}
```

### Endpoints de Gestão de Certificados

```http
GET    /api/v1/certificates           # Listar todos os certificados
POST   /api/v1/certificates           # Criar novo certificado
GET    /api/v1/certificates/:id       # Obter detalhes do certificado
PUT    /api/v1/certificates/:id       # Atualizar certificado
DELETE /api/v1/certificates/:id       # Excluir certificado
GET    /api/v1/certificates/validate/:hash  # Validar certificado
```

### Endpoints de Gestão de Funcionários

```http
GET    /api/v1/employees              # Listar funcionários
POST   /api/v1/employees              # Criar funcionário
GET    /api/v1/employees/:id          # Obter detalhes do funcionário
PUT    /api/v1/employees/:id          # Atualizar funcionário
DELETE /api/v1/employees/:id          # Excluir funcionário
GET    /api/v1/employees/:id/certificates # Obter certificados do funcionário
```

## Schema do Banco de Dados

### Coleções Principais

#### Coleção Users
```javascript
{
  _id: ObjectId,
  email: String (único, obrigatório),
  password: String (hasheada, obrigatório),
  role: String (enum: ['admin', 'employee', 'superadmin']),
  companyId: ObjectId (ref: 'Company'),
  profile: {
    firstName: String,
    lastName: String,
    cpf: String,
    phone: String
  },
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

#### Coleção Certificates
```javascript
{
  _id: ObjectId,
  certificateNumber: String (único, obrigatório),
  employeeId: ObjectId (ref: 'User'),
  companyId: ObjectId (ref: 'Company'),
  courseType: String (obrigatório), // NR-10, NR-35, ISO-9001, etc.
  courseName: String (obrigatório),
  issueDate: Date (obrigatório),
  expirationDate: Date (obrigatório),
  issuer: String (obrigatório),
  status: String (enum: ['valid', 'expired', 'revoked']),
  digitalHash: String (único),
  metadata: {
    workload: Number,
    instructor: String,
    location: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Coleção Companies
```javascript
{
  _id: ObjectId,
  name: String (obrigatório),
  cnpj: String (único, obrigatório),
  industry: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  settings: {
    notificationDays: Number (padrão: 30),
    allowSelfRegistration: Boolean (padrão: false)
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Estrutura do Projeto

```
certifi-industrial-hub/
├── backend/                         # Aplicação backend
│   ├── src/
│   │   ├── controllers/            # Manipuladores de requisições
│   │   │   ├── authController.js
│   │   │   ├── certificateController.js
│   │   │   ├── employeeController.js
│   │   │   └── companyController.js
│   │   ├── middleware/             # Middleware personalizado
│   │   │   ├── auth.js
│   │   │   ├── validation.js
│   │   │   └── rateLimiter.js
│   │   ├── models/                # Modelos do banco de dados
│   │   │   ├── User.js
│   │   │   ├── Certificate.js
│   │   │   └── Company.js
│   │   ├── routes/                # Rotas da API
│   │   │   ├── auth.js
│   │   │   ├── certificates.js
│   │   │   ├── employees.js
│   │   │   └── companies.js
│   │   ├── services/              # Lógica de negócio
│   │   │   ├── authService.js
│   │   │   ├── certificateService.js
│   │   │   └── notificationService.js
│   │   └── utils/                 # Funções utilitárias
│   │       ├── logger.js
│   │       ├── encryption.js
│   │       └── validators.js
│   ├── tests/                     # Testes do backend
│   ├── docs/                      # Documentação da API
│   ├── package.json
│   └── server.js                  # Ponto de entrada da aplicação
├── src/                           # Aplicação frontend
│   ├── components/                # Componentes reutilizáveis
│   │   ├── ui/                   # Componentes de UI base
│   │   ├── forms/                # Componentes de formulário
│   │   └── layout/               # Componentes de layout
│   ├── pages/                    # Componentes de página
│   │   ├── admin/               # Interface do administrador
│   │   ├── employee/            # Interface do funcionário
│   │   └── superadmin/          # Interface do super administrador
│   ├── hooks/                   # Custom React hooks
│   ├── services/               # Camada de serviços da API
│   ├── utils/                  # Utilitários do frontend
│   ├── types/                  # Definições de tipos TypeScript
│   └── __tests__/             # Testes do frontend
├── docs/                       # Documentação do projeto
├── scripts/                   # Scripts de deployment e utilitários
├── .github/                  # Workflows e templates do GitHub
├── docker-compose.yml       # Orquestração de containers
├── Dockerfile              # Definição do container
└── README.md
```

## Implementação de Segurança

### Autenticação e Autorização
- **Autenticação baseada em Token JWT** com expiração configurável
- **Controle de Acesso Baseado em Funções (RBAC)** com permissões granulares
- **Hash de Senhas** usando bcrypt com rounds de salt configuráveis
- **Rate Limiting** para prevenir ataques de força bruta

### Proteção de Dados
- **Validação de Entrada** usando schemas Joi em todos os endpoints
- **Prevenção de SQL Injection** através do ODM Mongoose
- **Proteção XSS** com cabeçalhos Content Security Policy
- **Configuração CORS** com origens específicas por ambiente

### Integridade de Certificados
- **Assinaturas Digitais** para autenticidade de certificados
- **Validação baseada em Hash** para detecção de alterações
- **Integração Blockchain** (roadmap) para registros imutáveis

## Estratégia de Testes

### Testes do Backend
```bash
# Testes Unitários
npm run test:unit

# Testes de Integração  
npm run test:integration

# Testes E2E
npm run test:e2e

# Relatório de Cobertura
npm run test:coverage
```

### Testes do Frontend
```bash
# Testes de Componentes
npm run test:components

# Testes de Integração
npm run test:integration

# Testes de Regressão Visual
npm run test:visual
```

## Otimização de Performance

### Otimização do Banco de Dados
- **Índices Compostos** em campos consultados frequentemente
- **Pool de Conexões** para utilização otimizada de recursos
- **Otimização de Consultas** com pipelines de agregação
- **Arquivamento de Dados** para certificados expirados

### Otimização da Aplicação
- **Code Splitting** para redução do tamanho do bundle
- **Lazy Loading** para melhoria dos tempos de carregamento inicial
- **Estratégias de Cache** com Redis (roadmap)
- **Integração CDN** para assets estáticos

## Deployment

### Deploy de Produção

1. **Build do Container**
   ```bash
   docker build -t certifi-hub:latest .
   ```

2. **Configuração do Ambiente**
   ```bash
   # Definir variáveis de ambiente de produção
   export NODE_ENV=production
   export MONGODB_URI=mongodb+srv://prod-cluster...
   ```

3. **Inicialização da Aplicação**
   ```bash
   docker-compose up -d
   ```

### Pipeline CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy para Produção
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Executar Testes
        run: npm test
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy para AWS ECS
        run: aws ecs update-service...
```

## Monitoramento e Logging

### Monitoramento da Aplicação
- **Endpoints de Health Check** para disponibilidade do serviço
- **Coleta e análise de métricas** de performance
- **Rastreamento de Erros** com logging estruturado
- **Monitoramento de Uptime** com alertas

### Trilha de Auditoria
- **Log de Atividades do Usuário** para requisitos de conformidade
- **Rastreamento do Ciclo de Vida dos Certificados** para auditorias regulatórias
- **Log de Eventos do Sistema** para depuração e análise

## Padrões de Conformidade

### Framework Regulatório Brasileiro
| Padrão | Implementação | Nível de Conformidade |
|--------|---------------|----------------------|
| NR-01 a NR-37 | Templates de certificados e regras de validação | ✅ Completo |
| CLT (Código Trabalhista) | Proteção e privacidade de dados de funcionários | ✅ Completo |
| LGPD | Tratamento de dados pessoais e consentimento | ✅ Completo |

### Padrões Internacionais
| Padrão | Implementação | Nível de Conformidade |
|--------|---------------|----------------------|
| ISO 27001 | Gestão de segurança da informação | 🔄 Em Progresso |
| ISO 9001 | Sistema de gestão da qualidade | ✅ Completo |
| SOC 2 Type II | Controles de segurança e disponibilidade | 📋 Planejado |

## Contribuição

### Fluxo de Desenvolvimento
1. Fazer fork do repositório
2. Criar branch de feature (`git checkout -b feature/nova-funcionalidade`)
3. Implementar mudanças seguindo padrões de codificação
4. Adicionar testes abrangentes
5. Atualizar documentação
6. Submeter pull request com descrição detalhada

### Padrões de Código
- **ESLint + Prettier** para formatação de código
- **Conventional Commits** para mensagens de commit
- **JSDoc** para documentação de funções
- **Cobertura de Testes** mínima de 80%

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Suporte e Manutenção

### Suporte Técnico
- **Rastreamento de Issues**: [GitHub Issues](https://github.com/seu-usuario/certifi-industrial-hub/issues)
- **Documentação**: [Wiki](https://github.com/seu-usuario/certifi-industrial-hub/wiki)
- **Vulnerabilidades de Segurança**: security@certifi.com.br

### Cronograma de Manutenção
- **Atualizações de Segurança**: Semanal
- **Releases de Funcionalidades**: Mensal
- **Releases de Versão Major**: Trimestral

---

**Gestão Empresarial de Certificados Industriais** | Construído com ❤️ para a Indústria Brasileira
