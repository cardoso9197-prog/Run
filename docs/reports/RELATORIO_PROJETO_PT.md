# 🚗 RUN-RUN GUINÉ-BISSAU - RELATÓRIO DO PROJETO

**Visão Geral Técnica e Empresarial Completa**  
**Data:** 6 de Janeiro de 2026  
**Versão:** 3.1 (IMPLANTADO EM PRODUÇÃO)  
**Estado:** 🟢 ONLINE - Todos os Sistemas Operacionais  
**Painel Admin:** https://runrunwebapp.netlify.app  
**Localização:** Guiné-Bissau 🇬🇼

**Contacto:**
- **Desenvolvedor:** Edivaldo Cardoso
- **Email:** suporte@runrungb.com
- **Telefone:** +245 955 971 275

---

## 📋 RESUMO EXECUTIVO

Run-Run é uma plataforma completa de transporte por aplicativo desenvolvida para a Guiné-Bissau, com aplicações móveis duplas (Passageiro e Motorista), infraestrutura backend robusta e painel de administração de nível empresarial.

### Métricas Principais:

| Métrica | Valor |
|---------|-------|
| **Tempo de Desenvolvimento** | 8 semanas (Nov 2025 - Jan 2026) |
| **Total de Código** | 20.000+ linhas |
| **Ecrãs Mobile** | 25 (13 Passageiro + 12 Motorista) |
| **Módulos Admin** | 8 módulos de funcionalidades |
| **Endpoints API** | 25+ endpoints REST |
| **Métodos de Pagamento** | 4 (Visa, Mastercard, Orange Money, MTN) |
| **Idiomas** | 3 (Português, Inglês, Francês) |
| **Tipos de Veículo** | 3 (Moto, Carro Normal, Carro Premium) |
| **Rastreamento GPS** | ✅ Tempo real (atualizações de 15 segundos) |
| **Implantação** | ✅ Netlify + Railway |

---

## 🏗️ ARQUITETURA DO SISTEMA

```
┌─────────────────────────────────────────────────────────┐
│           PAINEL DE ADMINISTRAÇÃO (Netlify)             │
│     https://runrunwebapp.netlify.app                    │
│     Next.js 14 + TypeScript + Tailwind CSS              │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────┐
│              APPS MÓVEIS (Expo/React Native)            │
│  ┌──────────────┐    ┌──────────────┐                   │
│  │App Passageiro│    │ App Motorista│                   │
│  │  13 Ecrãs    │    │  12 Ecrãs    │                   │
│  └──────┬───────┘    └──────┬───────┘                   │
└─────────┼───────────────────┼───────────────────────────┘
          │                   │
          └─────────┬─────────┘
                    │ API REST
┌───────────────────┴─────────────────────────────────────┐
│               BACKEND (Railway)                          │
│         Node.js + Express.js + PostgreSQL               │
└─────────────────────────────────────────────────────────┘
```

---

## 🖥️ FUNCIONALIDADES DO PAINEL DE ADMINISTRAÇÃO

### URL Online: https://runrunwebapp.netlify.app

| Módulo | Funcionalidades |
|--------|-----------------|
| **Dashboard** | Estatísticas em tempo real, receitas, gráficos |
| **Gestão de Motoristas** | Listar, verificar, ativar/rejeitar motoristas |
| **Gestão de Passageiros** | Diretório completo, pesquisa, detalhes |
| **Histórico de Viagens** | Filtragem, pesquisa, exportar CSV |
| **Relatórios Financeiros** | Rastreamento de receitas, comissão (20%) |
| **Centro de Notificações** | Push, SMS (Orange/MTN), Email |
| **Tickets de Suporte** | Gestão de tickets, prioridades |
| **Gestão de Documentos** | Ver/descarregar documentos de motoristas |

### Credenciais de Administrador:
- **Email:** cardoso9197@gmail.com
- **Palavra-passe:** Inside9791@
- **Chave Admin:** runrun-admin-2025

---

## 📱 APLICAÇÕES MÓVEIS

### App Passageiro (13 Ecrãs):
- Boas-vindas e Seleção de Idioma
- Registo e Verificação OTP
- Reserva de Viagem baseada em Mapa
- Rastreamento de Viagem Ativa
- Gestão de Métodos de Pagamento
- Perfil e Definições
- Histórico de Viagens e Recibos

### App Motorista (12 Ecrãs):
- Registo e Upload de Documentos
- Rastreamento do Estado de Ativação
- Alternância Online/Offline
- Gestão de Pedidos de Viagem
- Navegação e Progresso da Viagem
- Dashboard de Ganhos
- Gestão de Perfil

---

## 💰 SISTEMA DE PREÇOS

| Tipo de Veículo | Tarifa Base | Taxa por KM |
|-----------------|-------------|-------------|
| Moto | 500 CFA | 150 CFA/km |
| Normal | 1.000 CFA | 200 CFA/km |
| Premium | 1.500 CFA | 300 CFA/km |

**Fórmula:** `Total = Tarifa Base + (Distância × Taxa por KM)`

**Exemplo (viagem Normal de 5km):**  
`1000 + (5 × 200) = 2000 CFA (~$3,33 USD)`

**Comissão:** 20% para Run-Run | 80% para o Motorista

---

## 🔐 SEGURANÇA

| Funcionalidade | Implementação |
|----------------|---------------|
| Hash de Palavra-passe | bcrypt (10 rounds) |
| Autenticação | Tokens JWT |
| Segurança API | Validação de Chave Admin |
| Validação de Input | Middleware de validação |
| CORS | Origens permitidas configuradas |

---

## 📊 ENDPOINTS DA API

### Autenticação:
- `POST /api/auth/register` - Registo de utilizador
- `POST /api/auth/login` - Login de utilizador
- `POST /api/auth/verify-otp` - Verificação OTP

### Administração:
- `GET /api/admin/dashboard` - Estatísticas do dashboard
- `GET /api/admin/drivers` - Lista de motoristas
- `GET /api/admin/passengers` - Lista de passageiros
- `GET /api/admin/rides` - Lista de viagens
- `PUT /api/admin/drivers/:id/activate` - Ativar motorista

### Viagens:
- `POST /api/rides/request` - Solicitar viagem
- `GET /api/rides/:id` - Detalhes da viagem
- `PUT /api/rides/:id/status` - Atualizar estado

---

## 🚀 ESTADO DA IMPLANTAÇÃO

| Componente | Plataforma | Estado | URL |
|------------|------------|--------|-----|
| Frontend | Netlify | ✅ Online | https://runrunwebapp.netlify.app |
| Backend | Railway | ✅ Online | Railway Cloud |
| Base de Dados | Railway | ✅ Online | PostgreSQL 14 |

---

## 📈 MARCOS DO PROJETO

### Concluídos ✅
- Nov 2025: Início do Projeto
- Nov 2025: Arquitetura Backend
- Dez 2025: Desenvolvimento de Apps Móveis
- Dez 2025: Migração PostgreSQL
- Jan 2026: Painel de Administração
- Jan 2026: Implantação em Produção

### Próximos 📅
- T1 2026: Teste Beta (50 Utilizadores)
- T2 2026: Lançamento Público (500 Utilizadores)
- T3 2026: 30 Motoristas Ativos
- 2027: Expansão para o Senegal

---

## 📁 ESTRUTURA DO PROJETO

```
Run-Run GW/
├── backend/                    # Servidor Backend
│   ├── server.js              # Servidor Express principal
│   ├── database/              # Conexão e esquema da BD
│   ├── routes/                # Endpoints da API
│   │   ├── admin.js           # Rotas de administração
│   │   ├── auth.js            # Autenticação
│   │   ├── drivers.js         # Gestão de motoristas
│   │   ├── passengers.js      # Gestão de passageiros
│   │   └── rides.js           # Gestão de viagens
│   └── middleware/            # Validação e auth
│
├── runrun-web/                 # Painel de Administração
│   ├── app/                   # Páginas Next.js
│   │   ├── admin/             # Dashboard admin
│   │   └── components/        # Componentes React
│   └── package.json
│
├── passenger-app/              # App Móvel Passageiro
│   └── src/screens/           # 13 ecrãs
│
├── driver-app/                 # App Móvel Motorista
│   └── src/screens/           # 12 ecrãs
│
└── docs/reports/               # Relatórios
    ├── INVESTOR_REPORT.md
    ├── PROJECT_REPORT.md
    ├── RELATORIO_INVESTIDOR_PT.md
    └── RELATORIO_PROJETO_PT.md
```

---

## 🛠️ TECNOLOGIAS UTILIZADAS

### Frontend (Painel Admin):
- **Framework:** Next.js 14.2.35
- **Linguagem:** TypeScript
- **Estilos:** Tailwind CSS
- **Autenticação:** bcryptjs
- **Hospedagem:** Netlify

### Apps Móveis:
- **Framework:** React Native (Expo SDK)
- **Navegação:** React Navigation v6
- **Armazenamento:** AsyncStorage
- **HTTP:** Axios
- **i18n:** i18next

### Backend:
- **Runtime:** Node.js v18+
- **Framework:** Express.js v4.18
- **Base de Dados:** PostgreSQL 14
- **Autenticação:** JWT + bcrypt
- **Hospedagem:** Railway

---

## 📞 CONTACTO E SUPORTE

**Projeto:** Run-Run Guiné-Bissau  
**Email:** cardoso9197@gmail.com  
**Painel Admin:** https://runrunwebapp.netlify.app  
**Localização:** Bissau, Guiné-Bissau 🇬🇼

---

## 📄 HISTÓRICO DE VERSÕES

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Nov 2025 | Configuração inicial do projeto |
| 2.0 | Dez 2025 | Apps móveis concluídos |
| 2.5 | Dez 2025 | Migração PostgreSQL |
| 3.0 | Jan 2026 | Painel admin + Implantação em produção |

---

**© 2026 Run-Run Guiné-Bissau. Todos os Direitos Reservados.**

*Última Atualização: 5 de Janeiro de 2026*
