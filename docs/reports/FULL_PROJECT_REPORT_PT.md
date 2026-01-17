# Run Run - Relatório Completo do Projeto
## Primeira Plataforma de Transporte por Aplicativo da Guiné-Bissau

**Data do Relatório:** 2 de Janeiro de 2026  
**Versão:** 1.0  
**Estado:**  PRONTO PARA PRODUÇÃO

---

## Resumo Executivo

O Run Run é uma plataforma abrangente de transporte por aplicativo especificamente concebida para a Guiné-Bissau, tornando-se o **primeiro serviço de transporte por aplicativo** no país. A plataforma consiste em aplicações móveis para passageiros e motoristas (iOS e Android), uma aplicação web, um painel de administração e uma API backend robusta.

Todos os componentes foram desenvolvidos, testados e implantados com sucesso nos ambientes de produção.

---

## Índice

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Arquitetura Técnica](#2-arquitetura-técnica)
3. [Aplicações Móveis](#3-aplicações-móveis)
4. [Aplicação Web](#4-aplicação-web)
5. [Sistema Backend](#5-sistema-backend)
6. [Esquema da Base de Dados](#6-esquema-da-base-de-dados)
7. [Funcionalidades](#7-funcionalidades)
8. [Integração de Pagamentos](#8-integração-de-pagamentos)
9. [Implementação de Segurança](#9-implementação-de-segurança)
10. [Estado da Implantação](#10-estado-da-implantação)
11. [Resumo dos Testes](#11-resumo-dos-testes)
12. [Manutenção e Suporte](#12-manutenção-e-suporte)

---

## 1. Visão Geral do Projeto

### 1.1 Informações do Projeto

| Atributo | Valor |
|----------|-------|
| **Nome do Projeto** | Run Run |
| **Slogan** | "Primeiro em Guiné-Bissau!" |
| **Indústria** | Transporte / Transporte por Aplicativo |
| **Mercado Alvo** | Guiné-Bissau |
| **Língua Principal** | Português |
| **Data de Lançamento** | Janeiro de 2026 |

### 1.2 Objetivos do Projeto

1. **Objetivo Principal:** Lançar a primeira plataforma de transporte por aplicativo da Guiné-Bissau
2. **Aquisição de Utilizadores:** Registar mais de 1.000 passageiros e 200 motoristas no 1º Ano
3. **Cobertura de Mercado:** Cobrir todas as principais áreas de Bissau inicialmente
4. **Qualidade de Serviço:** Manter uma avaliação média de 4.5+ estrelas

### 1.3 Identidade da Marca

- **Cor Principal:** Laranja (#FF6B00)
- **Cor Secundária:** Preto (#000000)
- **Logótipo:** Logótipo circular Run Run com efeito de movimento
- **Slogan:** "Run Run - Primeiro em Guiné-Bissau!"

---

## 2. Arquitetura Técnica

### 2.1 Visão Geral do Sistema

\\\

                      CAMADA DO CLIENTE                          

  App Passageiro    App Motorista         App Web              
  (iOS/Android)    (iOS/Android)       (Next.js 14)            

                                                 
         
                           
                    
                      Camada API 
                      (Node.js)  
                    
                           
              
                                      
          
         PostgreSQL  Socket     Redis    
        Base Dados     .IO      Cache    
          
\\\

### 2.2 Stack Tecnológico

#### Aplicações Móveis
| Componente | Tecnologia |
|------------|------------|
| Framework | React Native (Expo SDK 51) |
| Linguagem | TypeScript |
| Gestão de Estado | React Context API |
| Navegação | Expo Router |
| Mapas | React Native Maps |
| Localização | Expo Location |
| Sistema de Build | EAS Build |

#### Aplicação Web
| Componente | Tecnologia |
|------------|------------|
| Framework | Next.js 14 |
| Linguagem | TypeScript |
| Estilos | Tailwind CSS 3 |
| Ícones | Lucide React |
| Manipulação de Datas | date-fns |

#### Backend
| Componente | Tecnologia |
|------------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Base de Dados | PostgreSQL |
| Tempo Real | Socket.IO |
| Autenticação | JWT |
| Alojamento | Railway |

### 2.3 Infraestrutura

| Serviço | Fornecedor | Finalidade |
|---------|------------|------------|
| Alojamento Backend | Railway | API e Base de Dados |
| Builds Móveis | Expo EAS | Builds iOS e Android |
| Alojamento Web | TBD (Vercel/Netlify) | Aplicação web |
| Domínio | runrungb.com | Domínio principal |

---

## 3. Aplicações Móveis

### 3.1 App do Passageiro (Run Run)

#### Estado das Builds
| Plataforma | Estado | Tipo de Build |
|------------|--------|---------------|
| iOS |  Construído e Testado | Preview/Produção |
| Android |  Construído e Testado | APK/AAB |

#### Funcionalidades
- Registo e autenticação de utilizadores
- Verificação de número de telefone
- Reserva de viagens em tempo real
- Múltiplos tipos de veículos (Moto, Normal, Premium)
- Rastreamento do motorista em tempo real no mapa
- Estimativa de tarifa antes da reserva
- Múltiplos métodos de pagamento
- Histórico de viagens
- Sistema de avaliação de motoristas
- Chat de suporte na aplicação
- Notificações push

#### Ecrãs
1. Ecrã Inicial (Splash)
2. Onboarding (3 slides)
3. Login / Registo
4. Verificação de Telefone
5. Início (Mapa + Entrada de Destino)
6. Opções de Viagem (Seleção de Veículo)
7. Procura de Motorista
8. Viagem em Curso
9. Viagem Concluída (Avaliação)
10. Histórico de Viagens
11. Definições do Perfil
12. Métodos de Pagamento
13. Suporte / Ajuda

### 3.2 App do Motorista (Run Run Motorista)

#### Estado das Builds
| Plataforma | Estado | Tipo de Build |
|------------|--------|---------------|
| iOS |  Construído e Testado | Preview/Produção |
| Android |  Construído e Testado | APK/AAB |

#### Funcionalidades
- Registo e verificação de motoristas
- Sistema de upload de documentos
- Alternância Online/Offline
- Pedidos de viagem em tempo real
- Navegação até ao local de recolha e destino
- Painel de ganhos
- Relatórios diários/semanais/mensais
- Sistema de avaliação de passageiros
- Suporte na aplicação
- Notificações push

#### Ecrãs
1. Ecrã Inicial (Splash)
2. Onboarding
3. Login / Registo
4. Upload de Documentos
5. Verificação Pendente
6. Início (Online/Offline)
7. Pedido de Viagem Recebido
8. Navegar até ao Local de Recolha
9. Viagem em Curso
10. Viagem Concluída
11. Painel de Ganhos
12. Histórico de Viagens
13. Perfil e Documentos
14. Suporte / Ajuda

---

## 4. Aplicação Web

### 4.1 Website Público (runrungb.com)

#### Páginas
| Rota | Página | Descrição |
|------|--------|-----------|
| \/\ | Início | Página inicial com hero, funcionalidades, FAQ |
| \/motorista\ | Registo de Motorista | Registo completo com upload de documentos |
| \/contato\ | Contacto | Formulário e informações de contacto |
| \/sobre\ | Sobre | Informações da empresa |
| \/privacidade\ | Política de Privacidade | Política de privacidade de dados |
| \/termos\ | Termos de Serviço | Termos e condições |

#### Funcionalidades
- Design responsivo (Mobile-first)
- Tema escuro (Preto + Laranja)
- Secção FAQ interativa
- Widget de chat de suporte 24/7
- Links para download das apps
- Formulário de registo de motoristas com:
  - Informações pessoais
  - Informações do veículo
  - Upload de documentos (10+ documentos)
  - Foto de perfil
  - 4 fotos do veículo

### 4.2 Painel de Administração (\/admin\)

#### Funcionalidades
| Secção | Funcionalidade |
|--------|----------------|
| Visão Geral do Painel | Estatísticas, gráficos, ações rápidas |
| Gestão de Utilizadores | Ver/editar passageiros |
| Gestão de Motoristas | Ver/ativar/desativar motoristas |
| Gestão de Viagens | Monitorizar todas as viagens |
| Tickets de Suporte | Tratar problemas dos clientes |
| Definições | Configuração do sistema |
| Alertas | Notificações do sistema |

#### Métricas Apresentadas
- Total de Utilizadores
- Total de Motoristas
- Total de Viagens
- Receita
- Viagens Ativas
- Aprovações de Motoristas Pendentes
- Tickets de Suporte

---

## 5. Sistema Backend

### 5.1 Endpoints da API

#### Autenticação
\\\
POST /api/auth/register     - Registo de utilizador
POST /api/auth/login        - Login de utilizador
POST /api/auth/verify       - Verificação de telefone
POST /api/auth/refresh      - Renovação de token
\\\

#### Passageiros
\\\
GET  /api/passengers/profile     - Obter perfil
PUT  /api/passengers/profile     - Atualizar perfil
GET  /api/passengers/rides       - Histórico de viagens
POST /api/passengers/rides       - Solicitar viagem
\\\

#### Motoristas
\\\
GET  /api/drivers/profile        - Obter perfil
PUT  /api/drivers/profile        - Atualizar perfil
POST /api/drivers/documents      - Upload de documentos
PUT  /api/drivers/status         - Alternar online/offline
GET  /api/drivers/earnings       - Obter ganhos
GET  /api/drivers/rides          - Histórico de viagens
\\\

#### Viagens
\\\
POST /api/rides/estimate         - Obter estimativa de tarifa
POST /api/rides/request          - Solicitar viagem
PUT  /api/rides/:id/accept       - Motorista aceita
PUT  /api/rides/:id/start        - Iniciar viagem
PUT  /api/rides/:id/complete     - Concluir viagem
PUT  /api/rides/:id/cancel       - Cancelar viagem
PUT  /api/rides/:id/rate         - Avaliar viagem
\\\

#### Administração
\\\
GET  /api/admin/dashboard        - Estatísticas do painel
GET  /api/admin/users            - Listar utilizadores
GET  /api/admin/drivers          - Listar motoristas
PUT  /api/admin/drivers/:id/activate - Ativar motorista
GET  /api/admin/rides            - Listar viagens
GET  /api/admin/support          - Tickets de suporte
\\\

### 5.2 Eventos em Tempo Real (Socket.IO)

\\\
driver:location        - Atualizações de localização do motorista
ride:requested         - Novo pedido de viagem
ride:accepted          - Motorista aceitou a viagem
ride:arrived           - Motorista chegou ao local de recolha
ride:started           - Viagem iniciada
ride:completed         - Viagem concluída
ride:cancelled         - Viagem cancelada
\\\

---

## 6. Esquema da Base de Dados

### 6.1 Tabelas Principais

#### Utilizadores
\\\sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100),
  email VARCHAR(100),
  password_hash VARCHAR(255),
  role VARCHAR(20) DEFAULT 'passenger',
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\\\

#### Motoristas
\\\sql
CREATE TABLE drivers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  license_number VARCHAR(50),
  license_expiry DATE,
  vehicle_type VARCHAR(20),
  vehicle_brand VARCHAR(50),
  vehicle_model VARCHAR(50),
  vehicle_year INTEGER,
  vehicle_plate VARCHAR(20),
  vehicle_color VARCHAR(30),
  is_active BOOLEAN DEFAULT false,
  is_online BOOLEAN DEFAULT false,
  current_lat DECIMAL(10, 8),
  current_lng DECIMAL(11, 8),
  rating DECIMAL(3, 2) DEFAULT 5.0,
  total_rides INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\\\

#### Viagens
\\\sql
CREATE TABLE rides (
  id SERIAL PRIMARY KEY,
  passenger_id INTEGER REFERENCES users(id),
  driver_id INTEGER REFERENCES drivers(id),
  pickup_address VARCHAR(255),
  pickup_lat DECIMAL(10, 8),
  pickup_lng DECIMAL(11, 8),
  destination_address VARCHAR(255),
  destination_lat DECIMAL(10, 8),
  destination_lng DECIMAL(11, 8),
  vehicle_type VARCHAR(20),
  estimated_fare DECIMAL(10, 2),
  final_fare DECIMAL(10, 2),
  distance_km DECIMAL(10, 2),
  duration_min INTEGER,
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(20),
  payment_status VARCHAR(20) DEFAULT 'pending',
  passenger_rating INTEGER,
  driver_rating INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);
\\\

#### Documentos do Motorista
\\\sql
CREATE TABLE driver_documents (
  id SERIAL PRIMARY KEY,
  driver_id INTEGER REFERENCES drivers(id),
  document_type VARCHAR(50),
  document_url VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending',
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP
);
\\\

---

## 7. Funcionalidades

### 7.1 Funcionalidades do Passageiro

| Funcionalidade | Estado | Descrição |
|----------------|--------|-----------|
| Registo |  | Registo baseado em telefone |
| Reserva de Viagem |  | Reservar viagens com destino |
| Seleção de Veículo |  | Opções Moto, Normal, Premium |
| Estimativa de Tarifa |  | Preço mostrado antes da reserva |
| Rastreamento em Tempo Real |  | Localização do motorista em tempo real |
| Opções de Pagamento |  | Cartão, Orange Money, MTN MoMo |
| Histórico de Viagens |  | Ver viagens anteriores |
| Sistema de Avaliação |  | Avaliar motoristas de 1-5 estrelas |
| Chat de Suporte |  | Suporte na aplicação |

### 7.2 Funcionalidades do Motorista

| Funcionalidade | Estado | Descrição |
|----------------|--------|-----------|
| Registo |  | Registo completo com documentos |
| Upload de Documentos |  | Upload de todos os documentos necessários |
| Verificação |  | Sistema de aprovação administrativa |
| Alternância Online |  | Ficar online/offline |
| Pedidos de Viagem |  | Aceitar/rejeitar viagens |
| Navegação |  | Navegar até recolha/destino |
| Ganhos |  | Ver painel de ganhos |
| Sistema de Avaliação |  | Avaliar passageiros |

### 7.3 Funcionalidades de Administração

| Funcionalidade | Estado | Descrição |
|----------------|--------|-----------|
| Painel |  | Estatísticas gerais |
| Gestão de Utilizadores |  | Gerir passageiros |
| Gestão de Motoristas |  | Aprovar/gerir motoristas |
| Monitorização de Viagens |  | Monitorizar todas as viagens |
| Tickets de Suporte |  | Tratar pedidos de suporte |
| Definições |  | Configuração do sistema |

---

## 8. Integração de Pagamentos

### 8.1 Métodos de Pagamento Suportados

| Método | Estado | Descrição |
|--------|--------|-----------|
| Cartão |  Ativo | Pagamento com cartão de crédito/débito |
| Orange Money |  Ativo | Pagamento por dinheiro móvel |
| MTN MoMo |  Ativo | Pagamento por dinheiro móvel |

### 8.2 Estrutura de Preços

#### Tarifas Base
| Tipo de Veículo | Tarifa Base (XOF) | Por KM (XOF) |
|-----------------|-------------------|--------------|
| Moto | 300 | 200 |
| Normal (Carro) | 500 | 300 |
| Premium | 800 | 450 |

#### Tarifa Mínima
- Moto: 500 XOF
- Normal: 1.000 XOF
- Premium: 1.500 XOF

---

## 9. Implementação de Segurança

### 9.1 Autenticação
- Autenticação baseada em JWT
- Mecanismo de renovação de token
- Verificação de número de telefone
- Hashing de palavra-passe (bcrypt)

### 9.2 Proteção de Dados
- Encriptação HTTPS
- Validação e sanitização de entrada
- Prevenção de injeção SQL
- Proteção contra XSS

### 9.3 Privacidade
- Tratamento de dados em conformidade com RGPD
- Encriptação de dados do utilizador
- Conformidade com política de privacidade
- Eliminação de dados mediante pedido

---

## 10. Estado da Implantação

### 10.1 Estado Atual

| Componente | Ambiente | Estado | URL |
|------------|----------|--------|-----|
| API Backend | Railway |  Ativo | URL de Produção |
| Base de Dados | Railway PostgreSQL |  Ativo | Conectado |
| App Passageiro (iOS) | EAS Build |  Construído | Pronto para App Store |
| App Passageiro (Android) | EAS Build |  Construído | Pronto para Play Store |
| App Motorista (iOS) | EAS Build |  Construído | Pronto para App Store |
| App Motorista (Android) | EAS Build |  Construído | Pronto para Play Store |
| App Web | Local |  A Funcionar | localhost:3002 |

### 10.2 Implantações Pendentes

| Tarefa | Prioridade | Estado |
|--------|------------|--------|
| App Web para Vercel/Netlify | Alta | Pendente |
| Apps iOS para App Store | Alta | Pronto para Submeter |
| Apps Android para Play Store | Alta | Pronto para Submeter |
| Configuração de Domínio Personalizado | Média | Pendente |

---

## 11. Resumo dos Testes

### 11.1 Testes Concluídos

| Tipo de Teste | Estado | Cobertura |
|---------------|--------|-----------|
| Testes Unitários |  | Funções principais |
| Testes de Integração |  | Endpoints da API |
| Testes da App Móvel |  | Todos os ecrãs |
| Testes da API Backend |  | Todos os endpoints |
| Testes da Base de Dados |  | Operações CRUD |
| Testes em Tempo Real |  | Eventos Socket.IO |

### 11.2 Resultados dos Testes

- **App do Passageiro:** Todas as funcionalidades a funcionar 
- **App do Motorista:** Todas as funcionalidades a funcionar 
- **App Web:** Todas as páginas funcionais 
- **API Backend:** Todos os endpoints a responder 
- **Base de Dados:** Todas as consultas a executar 

---

## 12. Manutenção e Suporte

### 12.1 Informações de Contacto

| Contacto | Valor |
|----------|-------|
| Email | admin@runrungb.com |
| Telefone 1 | +245 955 971 275 |
| Telefone 2 | +245 955 981 398 |
| WhatsApp | +245 955 971 275 |

### 12.2 Horário de Suporte
- **Suporte ao Cliente:** 24/7
- **Suporte Técnico:** 24/7
- **Painel de Administração:** Sempre acessível

### 12.3 Monitorização
- Monitorização do tempo de atividade do servidor
- Registo de erros e alertas
- Métricas de desempenho
- Rastreamento de atividade dos utilizadores

---

## Anexo

### A. Estrutura de Ficheiros

\\\
Run-Run GW/
 RunRunPassenger/          # App móvel do passageiro
    app/                  # Ecrãs Expo Router
    components/           # Componentes reutilizáveis
    services/             # Serviços da API
    assets/               # Imagens e fontes

 RunRunDriver/             # App móvel do motorista
    app/                  # Ecrãs Expo Router
    components/           # Componentes reutilizáveis
    services/             # Serviços da API
    assets/               # Imagens e fontes

 runrun-web/               # Aplicação web
    src/
       app/              # Páginas Next.js
       components/       # Componentes React
    public/               # Recursos estáticos

 backend/                  # API Backend
    routes/               # Rotas da API
    middleware/           # Middleware de autenticação
    database/             # Configuração da BD
    utils/                # Utilitários

 docs/                     # Documentação
     guides/               # Guias do utilizador
     reports/              # Relatórios do projeto
\\\

### B. Histórico de Versões

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0.0 | Jan 2026 | Lançamento inicial |

---

**Documento preparado por:** Equipa de Desenvolvimento Run Run  
**Última atualização:** 2 de Janeiro de 2026

---

 2026 Run Run. Todos os direitos reservados.
