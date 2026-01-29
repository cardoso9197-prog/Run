# 🚗 RUN-RUN GUINÉ-BISSAU - RELATÓRIO COMPLETO PARA PARCERIAS

**Relatório Executivo e de Negócios para Potenciais Parceiros**

**Data:** 28 de Janeiro de 2026  
**Versão:** 1.0 (PARCERIAS)  
**Status:** 🟢 AO VIVO - Sistema Operacional  
**Painel Admin:** https://runrungw.com  
**Localização:** Guiné-Bissau 🇬🇼

**Contactos:**
- **Email:** suporte@runrungb.com / admin@runrungb.com
- **Telefone:** +245 955 981 398 / +245 955 971 275
- **Website:** https://kcdigitals.com/

---

## 📋 RESUMO EXECUTIVO

Run-Run é uma plataforma inovadora de transporte por aplicativo desenvolvida especificamente para o mercado da Guiné-Bissau, oferecendo uma solução completa e integrada para passageiros e motoristas. Com mais de 20.000 linhas de código, 25 telas móveis e uma arquitetura robusta, o Run-Run representa uma oportunidade única de investimento em um mercado emergente com alto potencial de crescimento.

### Métricas Principais:

| Métrica | Valor |
|---------|-------|
| **Tempo de Desenvolvimento** | 8 semanas (Nov 2025 - Jan 2026) |
| **Total de Código** | +20.000 linhas |
| **Telas Mobile** | 25 (13 Passageiro + 12 Motorista) |
| **Módulos Admin** | 8 módulos de recursos |
| **Endpoints API** | +25 endpoints REST |
| **Métodos de Pagamento** | 4 (Visa, Mastercard, Orange Money, MTN) |
| **Idiomas Suportados** | 3 (Português, Inglês, Francês) |
| **Tipos de Veículos** | 3 (Moto, Carro Normal, Carro Premium) |
| **Rastreamento GPS** | ✅ Tempo real (atualizações de 15 segundos) |
| **Implementação** | ✅ Netlify + Railway |

---

## 🏢 VISÃO GERAL DA EMPRESA

### Missão
Revolucionar o transporte urbano na Guiné-Bissau através de uma plataforma tecnológica segura, acessível e eficiente, conectando passageiros e motoristas de forma inteligente.

### Visão
Ser a principal plataforma de mobilidade urbana na África Ocidental, expandindo para países vizinhos e estabelecendo padrões de qualidade no setor de transporte por aplicativo.

### Valores
- **Inovação:** Tecnologia de ponta para soluções modernas
- **Segurança:** Prioridade máxima na proteção de usuários
- **Acessibilidade:** Serviços disponíveis para todos os segmentos
- **Transparência:** Operações claras e rastreáveis
- **Sustentabilidade:** Contribuição para mobilidade urbana sustentável

---

## 📊 ANÁLISE DE MERCADO

### Mercado-Alvo
- **População da Guiné-Bissau:** ~2 milhões de habitantes
- **População Urbana (Bissau):** ~600.000 habitantes
- **Penetração de Smartphones:** 70% da população urbana
- **Taxa de Crescimento do Setor:** 25% ao ano (estimativa)

### Oportunidades de Mercado
- **Ausência de Concorrentes Locais:** Primeiro aplicativo nativo do país
- **Demanda Não Atendida:** Transporte público limitado e inseguro
- **Crescimento Econômico:** Aumento do poder aquisitivo da classe média
- **Digitalização:** Tendência global de adoção de serviços digitais

### Concorrência
- **Internacional:** Uber, Bolt (presença limitada)
- **Local:** Serviços informais de transporte
- **Vantagem Competitiva:** Conhecimento local, integração com métodos de pagamento regionais, suporte multilíngue

---

## 🏗️ ARQUITETURA TÉCNICA E PRODUTO

```
┌─────────────────────────────────────────────────────────┐
│        PAINEL ADMINISTRATIVO (Netlify)                   │
│     https://runrungw.com/                                │
│     Next.js 14 + TypeScript + Tailwind CSS              │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────┐
│           APLICAÇÕES MÓVEIS (Expo/React Native)         │
│  ┌──────────────┐    ┌──────────────┐                   │
│  │App Passageiro│    │ App Motorista│                   │
│  │  13 Telas    │    │  12 Telas    │                   │
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

### Funcionalidades do Painel Admin
- **Dashboard em Tempo Real:** Métricas de performance, receita, usuários ativos
- **Gestão de Motoristas:** Verificação, ativação, monitoramento
- **Gestão de Passageiros:** Base de dados completa, histórico
- **Relatórios Financeiros:** Rastreamento de comissões (20%)
- **Sistema de Notificações:** Push, SMS, Email
- **Suporte ao Cliente:** Sistema de tickets
- **Análise de Dados:** Exportação CSV, gráficos interativos

### Aplicações Móveis

#### App Passageiro (13 Telas):
- Boas-vindas & Seleção de Idioma
- Registo & Verificação OTP
- Reserva de Viagem Baseada em Mapa
- Rastreamento de Viagem Ativa
- Gestão de Métodos de Pagamento
- Perfil & Configurações
- Histórico de Viagens & Recibos

#### App Motorista (12 Telas):
- Registo & Upload de Documentos
- Rastreamento de Status de Ativação
- Toggle Online/Offline
- Gestão de Pedidos de Viagem
- Navegação & Progresso da Viagem
- Painel de Ganhos
- Gestão de Perfil

---

## 💼 MODELO DE NEGÓCIOS

### Fontes de Receita
1. **Comissão por Viagem:** 20% sobre o valor total da corrida
2. **Taxas de Serviço:** Tarifas fixas por tipo de veículo
3. **Parcerias com Pagamentos:** Comissões de provedores (Orange Money, MTN)
4. **Publicidade:** Anúncios no app e painel admin
5. **Premium Services:** Funcionalidades avançadas para motoristas

### Estrutura de Custos
- **Desenvolvimento:** Manutenção e atualizações (20%)
- **Infraestrutura:** Hosting Railway + Netlify (15%)
- **Marketing:** Aquisição de usuários (25%)
- **Operações:** Suporte e administração (20%)
- **Comissões de Pagamento:** Taxas de transação (10%)
- **Outros:** Impostos, legais (10%)

### Projeções Financeiras (Ano 1)

| Métrica | Q1 2026 | Q2 2026 | Q3 2026 | Q4 2026 | Total Anual |
|---------|---------|---------|---------|-----------|-------------|
| **Viagens Projetadas** | 2.000 | 5.000 | 10.000 | 15.000 | 32.000 |
| **Receita Estimada** | $3.000 | $7.500 | $15.000 | $22.500 | $48.000 |
| **Custos Operacionais** | $2.000 | $4.000 | $6.000 | $8.000 | $20.000 |
| **Lucro Líquido** | $1.000 | $3.500 | $9.000 | $14.500 | $28.000 |

---

## 💰 SISTEMA DE PREÇOS

| Tipo de Veículo | Taxa Base | Taxa por KM | Exemplo (5km) |
|-----------------|-----------|-------------|----------------|
| Moto | 500 CFA | 150 CFA/km | 1.250 CFA |
| Normal | 1.000 CFA | 200 CFA/km | 2.000 CFA |
| Premium | 1.500 CFA | 300 CFA/km | 3.000 CFA |

**Fórmula de Cálculo:** `Total = Taxa Base + (Distância × Taxa por KM)`

**Distribuição de Receitas:**
- **Run-Run:** 20% (comissão)
- **Motorista:** 80% (ganhos)

---

## 🤝 OPORTUNIDADES DE PARCERIA

### Tipos de Parcerias
1. **Investimento Financeiro:** Capital para expansão e marketing
2. **Parcerias Tecnológicas:** Integração de APIs, melhorias de plataforma
3. **Parcerias de Pagamento:** Expansão de métodos de pagamento
4. **Parcerias Governamentais:** Licenciamento e regulamentação
5. **Parcerias de Marketing:** Campanhas conjuntas, publicidade
6. **Parcerias Internacionais:** Expansão para países vizinhos

### Benefícios para Parceiros
- **Retorno sobre Investimento:** Alto potencial de crescimento
- **Mercado Emergente:** Entrada pioneira em mercado africano
- **Tecnologia Própria:** Propriedade intelectual exclusiva
- **Equipe Local:** Conhecimento profundo do mercado
- **Escalabilidade:** Arquitetura preparada para crescimento

### Estruturas de Parceria Sugeridas
- **Equity Partnership:** Participação acionária
- **Revenue Sharing:** Compartilhamento de receitas
- **Strategic Alliance:** Parcerias estratégicas não-financeiras
- **Joint Venture:** Empresa conjunta para expansão

---

## 👥 EQUIPE E DESENVOLVIMENTO

### Fundador e Desenvolvedor Principal
- **Edivaldo Cardoso:** Desenvolvedor Full-Stack com 8+ anos de experiência
- **Especialidades:** React Native, Node.js, PostgreSQL, DevOps
- **Experiência Prévia:** Projetos de e-commerce e fintech

### Equipe Técnica
- **Desenvolvimento:** 1 Desenvolvedor Principal (Edivaldo Cardoso)
- **Design:** Colaboração com designers freelancers
- **QA/Testes:** Testes manuais e automatizados
- **Suporte:** Equipe de suporte local

### Marcos de Desenvolvimento
- ✅ Arquitetura Backend (Nov 2025)
- ✅ Apps Móveis (Dez 2025)
- ✅ Migração PostgreSQL (Dez 2025)
- ✅ Painel Admin (Jan 2026)
- ✅ Produção Deploy (Jan 2026)

---

## 🔐 SEGURANÇA E CONFORMIDADE

| Aspecto | Implementação |
|---------|---------------|
| **Criptografia de Senhas** | bcrypt (10 rounds) |
| **Autenticação** | Tokens JWT |
| **Segurança API** | Validação de chave admin |
| **Validação de Dados** | Middleware de validação |
| **CORS** | Origens permitidas configuradas |
| **Conformidade** | LGPD/GDPR compliance |
| **Privacidade** | Política de dados implementada |

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

## 🚀 STATUS DE IMPLEMENTAÇÃO E PRÓXIMOS PASSOS

| Componente | Plataforma | Status | URL |
|------------|------------|--------|-----|
| Frontend | Netlify | ✅ Ao Vivo | https://runrungw.com/ |
| Backend | Railway | ✅ Ao Vivo | Railway Cloud |
| Base de Dados | Railway | ✅ Ao Vivo | PostgreSQL 14 |

### Roadmap 2026
- **T1 2026:** Testes Beta (20 usuários), Otimização de Performance
- **T2 2026:** Lançamento Público (100 usuários), Marketing Local
- **T3 2026:** 20 Motoristas Ativos, Expansão Regional
- **T4 2026:** 500 Usuários, Parcerias Estratégicas
- **2027:** Expansão para Senegal e outros países

---

## 📞 CONTACTO PARA PARCERIAS

**Empresa:** KCDIGITALS  
**Projeto:** Run-Run Guiné-Bissau  
**Website:** https://kcdigitals.com/  
**Email:** suporte@runrungb.com / admin@runrungb.com  
**Telefone:** +245 955 981 398 / +245 955 971 275  
**Localização:** Bissau, Guiné-Bissau 🇬🇼

**Documentos Disponíveis:**
- Apresentação Executiva (PPT)
- Demonstração do App
- Relatórios Técnicos Detalhados
- Projeções Financeiras Completas

---

**© 2026 KCDIGITALS. Todos os Direitos Reservados.**

*Relatório Preparado para Fins de Parceria - 28 de Janeiro de 2026*
