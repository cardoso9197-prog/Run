# 🚗 RUN-RUN GUINÉ-BISSAU - RELATÓRIO DO PROJETO

**Visão Geral Técnica e Comercial Completa**

**Data:** 6 de Janeiro de 2026  
**Versão:** 1.0 (PRODUÇÃO IMPLEMENTADA)  
**Status:** 🟢 AO VIVO - Todos os Sistemas Operacionais  
**Painel Admin:** https://runrungw.com  
**Localização:** Guiné-Bissau 🇬🇼

**Contactos:**
- **Email:** suporte@runrungb.com / admin@runrungb.com
- **Telefone:** +245 955 981 398 / +245 955 971 275

---

## 📋 RESUMO EXECUTIVO

Run-Run é uma plataforma completa de transporte construída para a Guiné-Bissau, com aplicações móveis duplas (Passageiro e Motorista), infraestrutura backend robusta e painel administrativo de nível empresarial.

### Métricas Principais:

| Métrica | Valor |
|---------|-------|
| **Tempo de Desenvolvimento** | 8 semanas (Nov 2025 - Jan 2026) |
| **Total de Código** | +20.000 linhas |
| **Ecrãs Mobile** | 25 (13 Passageiro + 12 Motorista) |
| **Módulos Admin** | 8 módulos de recursos |
| **Endpoints API** | +25 endpoints REST |
| **Métodos de Pagamento** | 4 (Visa, Mastercard, Orange Money, MTN) |
| **Idiomas** | 3 (Português, Inglês, Francês) |
| **Tipos de Veículos** | 3 (Moto, Carro Normal, Carro Premium) |
| **Rastreamento GPS** | ✅ Tempo real (atualizações de 15 segundos) |
| **Implementação** | ✅ Netlify + Railway |

---

## 🏗️ ARQUITETURA DO SISTEMA

```
┌─────────────────────────────────────────────────────────┐
│        PAINEL ADMINISTRATIVO (Netlify)                   │
│     https://runrungw.com/                    │
│     Next.js 14 + TypeScript + Tailwind CSS              │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────┐
│           APLICAÇÕES MÓVEIS (Expo/React Native)         │
│  ┌──────────────┐    ┌──────────────┐                   │
│  │App Passageiro│    │ App Motorista│                   │
│  │  13 Ecrãs    │    │  12 Ecrãs    │                   │
│  └──────┬───────┘    └──────┬───────┘                   │
└─────────┼───────────────────┼───────────────────────────┘
          │                   │
          └─────────┬─────────┘
                    │ REST API
┌───────────────────┴─────────────────────────────────────┐
│               BACKEND (Railway)                          │
│         Node.js + Express.js + PostgreSQL               │
└─────────────────────────────────────────────────────────┘
```

---

## 🖥️ FUNCIONALIDADES DO PAINEL ADMIN

### URL Ao Vivo: https://runrungw.com/

| Módulo | Funcionalidades |
|--------|-----------------|
| **Dashboard** | Estatísticas em tempo real, receitas, gráficos |
| **Gestão de Motoristas** | Listar, verificar, ativar/rejeitar motoristas |
| **Gestão de Passageiros** | Diretório completo, pesquisa, detalhes |
| **Histórico de Viagens** | Filtragem, pesquisa, exportar CSV |
| **Relatórios Financeiros** | Rastreamento de receitas, comissão (20%) |
| **Centro de Notificações** | Push, SMS (Orange/MTN), Email |
| **Bilhetes de Suporte** | Gestão de tickets, prioridades |
| **Gestão de Documentos** | Ver/baixar documentos de motoristas |



---

## 📱 APLICAÇÕES MÓVEIS

### App Passageiro (13 Ecrãs):
- Boas-vindas & Seleção de Idioma
- Registo & Verificação OTP
- Reserva de Viagem Baseada em Mapa
- Rastreamento de Viagem Ativa
- Gestão de Métodos de Pagamento
- Perfil & Configurações
- Histórico de Viagens & Recibos

### App Motorista (12 Ecrãs):
- Registo & Upload de Documentos
- Rastreamento de Status de Ativação
- Toggle Online/Offline
- Gestão de Pedidos de Viagem
- Navegação & Progresso da Viagem
- Painel de Ganhos
- Gestão de Perfil

---

## 💰 SISTEMA DE PREÇOS

| Tipo de Veículo | Taxa Base | Taxa por KM |
|-----------------|-----------|-------------|
| Moto | 500 CFA | 150 CFA/km |
| Normal | 1.000 CFA | 200 CFA/km |
| Premium | 1.500 CFA | 300 CFA/km |

**Fórmula:** `Total = Taxa Base + (Distância × Taxa por KM)`

**Exemplo (viagem Normal de 5km):**  
`1000 + (5 × 200) = 2000 CFA (~$3.33 USD)`

**Comissão:** 20% para Run-Run | 80% para o Motorista

---

## 🔐 SEGURANÇA

| Recurso | Implementação |
|---------|---------------|
| Hash de Senha | bcrypt (10 rounds) |
| Autenticação | Tokens JWT |
| Segurança API | Validação de chave admin |
| Validação de Input | Middleware de validação |
| CORS | Origens permitidas configuradas |

---

## 📊 ENDPOINTS DA API

### Autenticação:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/verify-otp`

### Admin:
- `GET /api/admin/dashboard`
- `GET /api/admin/drivers`
- `GET /api/admin/passengers`
- `GET /api/admin/rides`
- `PUT /api/admin/drivers/:id/activate`

### Viagens:
- `POST /api/rides/request`
- `GET /api/rides/:id`
- `PUT /api/rides/:id/status`

---

## 🚀 STATUS DE IMPLEMENTAÇÃO

| Componente | Plataforma | Status | URL |
|------------|------------|--------|-----|
| Frontend | Netlify | ✅ Ao Vivo | https://runrungw.com/|
| Backend | Railway | ✅ Ao Vivo | Railway Cloud |
| Base de Dados | Railway | ✅ Ao Vivo | PostgreSQL 14 |

---

## 📈 MARCOS

### Completo ✅
- Nov 2025: Início do Projeto
- Nov 2025: Arquitetura Backend
- Dez 2025: Desenvolvimento de Apps Móveis
- Dez 2025: Migração PostgreSQL
- Jan 2026: Painel Administrativo
- Jan 2026: Implementação em Produção

### Próximos 📅
- T1 2026: Testes Beta (20 Utilizadores)
- T2 2026: Lançamento Público (100 Utilizadores)
- T3 2026: 20 Motoristas Ativos
- 2027: Expansão para Senegal

---

## 📞 CONTACTO

- **Web:**   https://kcdigitals.com/
- **Email:** suporte@runrungb.com / admin@runrungb.com
- **Telefone:** +245 955 981 398 / +245 955 971 275  
**Localização:** Bissau, Guiné-Bissau 🇬🇼

---

**© 2026 KCDIGITALS. Todos os Direitos Reservados.**

*Última Atualização: 5 de Janeiro de 2026*
