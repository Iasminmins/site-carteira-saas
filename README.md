# Certifi Industrial Hub

[![Status do Build](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/seu-usuario/certifi-industrial-hub)
[![Licença](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Versão Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D4.4-green.svg)](https://www.mongodb.com/)

## 💳 Carteiras Digitais para Certificados Industriais

Plataforma inovadora que **digitaliza e moderniza o acesso aos certificados industriais**, substituindo as tradicionais carteirinhas físicas por **carteiras digitais inteligentes com QR Code**. 

O sistema resolve a principal dor do setor industrial brasileiro: **dificuldade de acesso, validação e controle de certificados de segurança do trabalho** como NRs, ISO e CIPA.

### 🎯 **Problema Resolvido**
- ❌ **Antes**: Carteirinhas físicas perdidas, danificadas ou falsificadas
- ❌ **Antes**: Dificuldade para validar autenticidade dos certificados  
- ❌ **Antes**: Controle manual e descentralizado das certificações
- ❌ **Antes**: Renovações esquecidas e multas por não conformidade

### ✅ **Solução Digital**
- ✅ **Carteiras digitais** sempre acessíveis via smartphone
- ✅ **QR Codes únicos** para validação instantânea e offline
- ✅ **Controle centralizado** de todas as certificações da empresa
- ✅ **Alertas automáticos** de vencimento e renovação obrigatória

### 🚀 **Principais Benefícios**
- **📱 Acesso Imediato**: Certificados sempre na palma da mão
- **🔒 Validação Segura**: QR Codes criptografados impossíveis de falsificar  
- **⚡ Velocidade**: Verificação de certificados em segundos
- **💰 Redução de Custos**: Elimina impressão e reimpressão de carteiras físicas
- **📊 Gestão Inteligente**: Dashboard completo para acompanhamento em tempo real

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



### Infraestrutura Frontend  
| Componente | Tecnologia | Versão | Propósito |
|------------|------------|--------|-----------|
| Framework | React | ^18.0.0 | Desenvolvimento de UI baseada em componentes |
| Linguagem | TypeScript | ^5.0.0 | JavaScript com tipagem segura |
| Estilização | Tailwind CSS | ^3.3.0 | Framework CSS utility-first |
| Roteamento | React Router | ^6.8.0 | Roteamento client-side |
| Gerenciamento de Estado | Context API | Nativo | Gerenciamento de estado global |


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

### Endpoints de Gestão de Certificados e Carteiras Digitais

```http
GET    /api/v1/certificates           # Listar todos os certificados
POST   /api/v1/certificates           # Criar novo certificado
GET    /api/v1/certificates/:id       # Obter detalhes do certificado
PUT    /api/v1/certificates/:id       # Atualizar certificado
DELETE /api/v1/certificates/:id       # Excluir certificado

# Endpoints específicos para carteiras digitais e QR Codes
GET    /api/v1/certificates/:id/qrcode      # Gerar QR Code do certificado
GET    /api/v1/certificates/:id/digital-card # Obter carteira digital
GET    /api/v1/certificates/validate/:hash  # Validar certificado via QR Code
POST   /api/v1/certificates/:id/share       # Compartilhar carteira digital
```

### Endpoints de Carteiras Digitais por Funcionário

```http
GET    /api/v1/employees/:id/wallet         # Carteira digital do funcionário
GET    /api/v1/employees/:id/certificates   # Certificados do funcionário
GET    /api/v1/employees/:id/qr-cards       # Todas as carteiras com QR Code
POST   /api/v1/employees/:id/generate-card  # Gerar nova carteira digital
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

## Funcionalidades Principais

### 💳 Carteiras Digitais Inteligentes
- **Geração automática** de carteirinhas digitais personalizadas
- **QR Codes únicos e criptografados** para cada certificado
- **Acesso offline** através de QR Code - funciona sem internet
- **Design responsivo** otimizado para dispositivos móveis
- **Compartilhamento seguro** via link ou QR Code

### 🔍 Validação por QR Code
- **Leitura instantânea** com qualquer leitor de QR Code
- **Verificação offline** da autenticidade do certificado
- **Dados criptografados** no próprio QR Code
- **Histórico de validações** para auditoria
- **Integração** com sistemas terceiros via API

### 👥 Gestão de Usuários Multi-Empresa
- **Sistema multi-tenant** com separação completa por empresa
- **Controle de acesso baseado em roles** (Admin, Funcionário, Super Admin)
- **Perfis de usuário** com foto e dados pessoais/profissionais
- **Carteira digital personalizada** para cada funcionário
- **Histórico completo** de atividades e certificações

### 📊 Dashboard e Relatórios Avançados
- **Métricas em tempo real** de certificações ativas/vencidas
- **Mapa de calor** de conformidade por setor/funcionário
- **Relatórios de conformidade** regulatória personalizáveis
- **Alertas inteligentes** de vencimento via email/SMS/push
- **Exportação de dados** em PDF, Excel e formatos digitais


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

### Integridade de Certificados e QR Codes
- **QR Codes criptografados** com algoritmos seguros (AES-256)
- **Assinaturas digitais** incorporadas no QR Code para autenticidade
- **Validação offline** através de dados embutidos no QR Code
- **Timestamping** para rastreabilidade temporal das validações
- **Integração Blockchain** (roadmap) para registros imutáveis


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
