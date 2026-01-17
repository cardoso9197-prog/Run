# 💳 RUN-RUN - RELATÓRIO DE PRONTIDÃO DOS MÉTODOS DE PAGAMENTO PARA PRODUÇÃO

**Data:** 6 de Janeiro de 2026  
**Projeto:** Run-Run Guiné-Bissau  
**Estado:** ⚠️ MODO DE DESENVOLVIMENTO - NÃO PRONTO PARA PRODUÇÃO  
**Prioridade:** 🔴 CRÍTICO - Necessário para o Lançamento

---

## 🎯 RESUMO EXECUTIVO

A plataforma Run-Run atualmente possui **implementações de pagamento simuladas** que simulam o processamento de pagamentos mas **NÃO processam dinheiro real**. Para lançar em produção, devemos integrar com APIs reais de gateways de pagamento para os quatro métodos de pagamento:

1. **Cartões de Crédito/Débito** (Visa, Mastercard)
2. **Orange Money** (mobile money principal da Guiné-Bissau)
3. **MTN Mobile Money** (mobile money secundário da Guiné-Bissau)
4. ~~**Dinheiro**~~ (Removido - Plataforma apenas digital)

---

## 📊 ANÁLISE DO ESTADO ATUAL

### Estado da App Passageiro:

| Componente | Estado | Pronto para Produção? |
|-----------|--------|----------------------|
| UI/UX de Pagamento | ✅ Completo | ✅ Sim |
| Ecrã Adicionar Pagamento | ✅ Completo | ✅ Sim |
| Lista de Métodos de Pagamento | ✅ Completo | ✅ Sim |
| Validação de Cartão | ✅ Completo | ✅ Sim |
| Validação de Número de Telefone | ✅ Completo | ✅ Sim |
| **Processamento de Pagamento** | ❌ Simulado | ❌ **NÃO** |
| **Integração Gateway** | ❌ Ausente | ❌ **NÃO** |

### Estado do Backend API:

| Componente | Estado | Pronto para Produção? |
|-----------|--------|----------------------|
| Rotas de Pagamento | ✅ Estruturado | ⚠️ Parcial |
| Schema da Base de Dados | ✅ Completo | ✅ Sim |
| Middleware de Validação | ✅ Completo | ✅ Sim |
| **Gateway de Cartões** | ❌ Comentários TODO | ❌ **NÃO** |
| **API Orange Money** | ❌ Comentários TODO | ❌ **NÃO** |
| **API MTN Mobile Money** | ❌ Comentários TODO | ❌ **NÃO** |
| Gestão de Erros | ✅ Completo | ✅ Sim |

---

## 🚨 PROBLEMAS CRÍTICOS

### Problema #1: Pagamentos Simulados
**Localização:** `backend/routes/payments.js`

```javascript
// CÓDIGO ATUAL (Linha 117-132):
async function processCardPayment(ride, amount, platformCommission, driverEarnings, cardToken) {
  // TODO: Integrate with Stripe or PayStack
  // This is a placeholder implementation
  
  // ❌ PROBLEMA: Pagamentos são marcados como "completos" sem processamento real!
```

**Impacto:** 🔴 **CRÍTICO**
- Nenhum dinheiro é realmente cobrado
- Utilizadores fraudulentos podem reservar viagens ilimitadas
- Motoristas esperam pagamento mas o dinheiro nunca é transferido
- Plataforma não pode coletar comissão de 20%

---

### Problema #2: SDKs de Gateway de Pagamento Ausentes
**Localização:** `backend/package.json`

```json
// ❌ DEPENDÊNCIAS AUSENTES:
{
  "dependencies": {
    // NENHUM PACOTE DE GATEWAY DE PAGAMENTO INSTALADO
    // "stripe": "^14.0.0",           // Ausente
    // "paystack": "^2.0.1",          // Ausente
  }
}
```

---

## 📋 ROTEIRO DE PRONTIDÃO PARA PRODUÇÃO

### FASE 1: PESQUISA DE GATEWAYS DE PAGAMENTO (Semana 1)

#### Passo 1.1: Pesquisar Gateways Disponíveis para Guiné-Bissau

**Opções de Processamento de Cartões:**
| Gateway | Disponibilidade na GB | Taxas | Dificuldade |
|---------|----------------------|-------|-------------|
| **PayStack** | ✅ Disponível (África Ocidental) | 1.5% - 3.5% | Fácil |
| **Cinetpay** | ✅ Disponível (África Ocidental) | 2.5% - 3.5% | Fácil |
| **Flutterwave** | ✅ Disponível (África) | 3.8% | Médio |

**Recomendação:** **PayStack** ou **Cinetpay** (melhor para África Ocidental)

**Opções de Mobile Money:**
| Provedor | Disponibilidade API | Documentação | Integração |
|----------|-------------------|--------------|------------|
| **Orange Money GB** | ⚠️ API pública limitada | Contactar Orange GB | Complexo |
| **MTN Mobile Money** | ⚠️ API MTN MoMo | Contactar MTN GB | Complexo |

**Ações Críticas:**
1. ✅ **Contactar Orange Money Guiné-Bissau** - Solicitar conta de comerciante e acesso API
2. ✅ **Contactar MTN Guiné-Bissau** - Solicitar credenciais API MoMo
3. ✅ **Inscrever-se no PayStack** - Processamento de cartões africanos
4. ✅ **Pesquisar Cinetpay** - Alternativa para África Ocidental

---

### FASE 2: CONFIGURAÇÃO E TESTE DE GATEWAY (Semana 2-3)

#### Passo 2.1: Inscrever-se nos Gateways de Pagamento

**Configuração PayStack:**
```bash
# 1. Ir para https://paystack.com
# 2. Clicar em "Get Started"
# 3. Completar Verificação do Negócio:
#    - Nome do negócio: Run-Run Guiné-Bissau
#    - Tipo de negócio: Transporte/Ride-hailing
#    - País: Guiné-Bissau (se disponível, senão Senegal)
#    - NIF / Número de Registo Comercial
#    - Dados bancários para recebimentos
# 4. Ativar Modo de Teste
# 5. Obter Chaves API:
#    - Chave Pública de Teste: pk_test_...
#    - Chave Secreta de Teste: sk_test_...
```

**Configuração Orange Money:**
```bash
# 1. Contactar: Orange Money Business Guiné-Bissau
#    Email: business@orange-bissau.com (verificar contacto real)
#    Telefone: +245 XXX XXX XXX
# 2. Solicitar:
#    - Conta de Comerciante
#    - Documentação API
#    - Acesso ao Ambiente de Teste/Sandbox
#    - Credenciais API de Produção
# 3. Documentos necessários:
#    - Registo comercial
#    - NIF
#    - Conta bancária (para liquidações)
#    - BI do proprietário do negócio
# 4. Tipo de integração:
#    - Web Payment API (para integração app)
#    - URL de Callback para confirmação de pagamento
```

**Configuração MTN Mobile Money:**
```bash
# 1. Contactar: MTN Mobile Money Guiné-Bissau
#    Visitar: Escritório MTN em Bissau
#    Email: business@mtn-bissau.com (verificar)
# 2. Solicitar acesso à API MTN MoMo
# 3. Completar onboarding de comerciante
# 4. Obter:
#    - ID de Utilizador API
#    - Chave API
#    - Chave de Subscrição (Primária e Secundária)
#    - Acesso à API de Coleção
# 5. Testar primeiro no ambiente Sandbox
```

---

#### Passo 2.3: Configurar Variáveis de Ambiente

**Criar/Atualizar ficheiro `.env`:**
```bash
# Configuração de Gateways de Pagamento

# PayStack (Cartões - Visa/Mastercard)
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
PAYSTACK_CALLBACK_URL=https://SEU-BACKEND-RAILWAY.up.railway.app/api/payments/paystack/callback

# Orange Money (Guiné-Bissau)
ORANGE_MONEY_API_URL=https://api.orange.com/orange-money-webpay/gw/1.0.0
ORANGE_MONEY_MERCHANT_ID=seu_id_comerciante
ORANGE_MONEY_API_KEY=sua_chave_api
ORANGE_MONEY_API_SECRET=seu_secret_api
ORANGE_MONEY_CALLBACK_URL=https://SEU-BACKEND-RAILWAY.up.railway.app/api/payments/orange/callback

# MTN Mobile Money (Guiné-Bissau)
MTN_MOMO_API_URL=https://sandbox.momodeveloper.mtn.com
MTN_MOMO_SUBSCRIPTION_KEY=sua_chave_subscricao
MTN_MOMO_API_USER=seu_id_usuario_api
MTN_MOMO_API_KEY=sua_chave_api
MTN_MOMO_CALLBACK_URL=https://SEU-BACKEND-RAILWAY.up.railway.app/api/payments/mtn/callback

# Configurações da Plataforma
PLATFORM_COMMISSION=20
CURRENCY=XOF
```

---

### FASE 5: TESTE E VALIDAÇÃO (Semana 5-6)

#### Passo 5.1: Lista de Verificação Modo Teste

**Pagamentos com Cartão (Teste PayStack):**
```bash
✅ Cartão de Teste: 4084084084084081
✅ Validade: 12/2030
✅ CVV: 408
✅ PIN: 0000
✅ OTP: 123456

Cenários de Teste:
[ ] Pagamento bem-sucedido
[ ] Pagamento recusado
[ ] Fundos insuficientes
[ ] Cartão inválido
[ ] Timeout de rede
[ ] Callbacks webhook
```

---

### FASE 6: PREPARAÇÃO PARA GO-LIVE (Semana 6-7)

#### Passo 6.1: Mudar para Credenciais de Produção

**Atualizar `.env` para produção:**
```bash
# Mudar de chaves de teste para produção:
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxx  # ⚠️ CHAVE REAL
PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx  # ⚠️ CHAVE REAL

ORANGE_MONEY_API_URL=https://api.orange.com/...  # ⚠️ URL DE PRODUÇÃO
ORANGE_MONEY_MERCHANT_ID=id_comerciante_producao
ORANGE_MONEY_API_KEY=chave_api_producao

MTN_MOMO_API_URL=https://momodeveloper.mtn.com  # ⚠️ URL DE PRODUÇÃO
# ... credenciais MTN de produção
```

---

## 📝 CRONOGRAMA ESTIMADO

| Fase | Duração | Dependências |
|------|---------|--------------|
| **Fase 1: Pesquisa** | 1 semana | Nenhuma |
| **Fase 2: Configuração Gateway** | 1-2 semanas | Aprovações de conta |
| **Fase 3: Integração Backend** | 1 semana | Fase 2 completa |
| **Fase 4: Atualizações App Mobile** | 1 semana | Fase 3 completa |
| **Fase 5: Testes** | 1-2 semanas | Fase 4 completa |
| **Fase 6: Go-Live** | 1 semana | Todas fases completas |
| **Total** | **6-8 semanas** | |

---

## 💰 CUSTOS ESTIMADOS

### Taxas de Gateway (Por Transação):
| Serviço | Taxa de Configuração | Taxa de Transação | Taxa Mensal |
|---------|---------------------|-------------------|-------------|
| PayStack | GRÁTIS | 1.5% + 100 XOF | GRÁTIS |
| Cinetpay | GRÁTIS | 2.5% | GRÁTIS |
| Orange Money | A definir | ~2-3% | A definir |
| MTN MoMo | A definir | ~2-3% | A definir |

### Custos de Desenvolvimento:
| Item | Custo |
|------|-------|
| Integração Gateway Pagamento | 2-3 semanas tempo dev |
| Testes e QA | 1 semana |
| Legal/Conformidade | $500-2000 |
| **Total Integração** | **~$2.000-5.000** |

---

## 🎯 CRITÉRIOS DE SUCESSO

**Definição de Pronto para Produção:**
```bash
✅ Todos os 3 métodos de pagamento processam transações reais
✅ Webhooks confirmam estado do pagamento
✅ Pagamentos falhados tratados graciosamente
✅ Auditoria de segurança aprovada
✅ Transações de teste completadas com sucesso
✅ Capacidade de reembolso implementada
✅ Relatórios financeiros precisos
✅ Requisitos de conformidade cumpridos
✅ Monitorização de erros em funcionamento
✅ Plano de suporte de pagamentos 24/7
```

---

## 📞 CONTACTOS A ALCANÇAR

### Gateways de Pagamento:
- **PayStack:** https://paystack.com/contact (support@paystack.com)
- **Cinetpay:** https://cinetpay.com (contact@cinetpay.com)
- **Flutterwave:** https://flutterwave.com (hi@flutterwavego.com)

### Mobile Money:
- **Orange Money GB:** Visitar escritório Orange em Bissau
- **MTN Mobile Money GB:** Visitar escritório MTN em Bissau

---

## 📊 PRÓXIMAS AÇÕES IMEDIATAS

### Esta Semana:
1. ✅ **Contactar PayStack** - Inscrever-se para conta comerciante (Prioridade #1)
2. ✅ **Visitar Escritório Orange Money** - Solicitar acesso API comerciante
3. ✅ **Visitar Escritório MTN** - Solicitar acesso API MoMo
4. ✅ **Rever requisitos legais** - Licença financeira necessária?

### Próxima Semana:
5. ✅ **Instalar SDKs de pagamento** - Após aprovação gateway recebida
6. ✅ **Configurar ambientes de teste** - Testes sandbox
7. ✅ **Criar classes de serviço** - Código de integração backend

---

**© 2026 Run-Run Guiné-Bissau. Todos os Direitos Reservados.**

*Relatório preparado por: Assistente de Desenvolvimento AI*  
*Para: Edivaldo Cardoso*  
*Próxima Data de Revisão: 13 de Janeiro de 2026*
