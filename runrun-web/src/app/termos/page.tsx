'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, FileText, AlertTriangle, Ban, CreditCard, Car, MessageSquare } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.png" alt="Run Run" width={40} height={40} className="rounded-full" />
            <span className="text-xl font-bold text-white">Run Run</span>
          </Link>
          <Link 
            href="/" 
            className="flex items-center text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Termos de Uso
          </h1>
          <p className="text-gray-400">
            Última atualização: 1 de Janeiro de 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Aceitação dos Termos</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Ao acessar ou usar o aplicativo Run Run, você concorda em ficar vinculado a estes Termos de Uso. 
                Se você não concordar com qualquer parte destes termos, não poderá acessar o serviço.
              </p>
              <p>
                Estes termos se aplicam a todos os usuários do aplicativo, incluindo passageiros, 
                motoristas e visitantes.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Car className="w-6 h-6 text-primary-500 mr-3" />
              2. Descrição do Serviço
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>
                A Run Run é uma plataforma de tecnologia que conecta passageiros a motoristas independentes. 
                Nossos serviços incluem:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Solicitação de corridas através do aplicativo</li>
                <li>Estimativa de preços e rotas</li>
                <li>Processamento de pagamentos</li>
                <li>Sistema de avaliação e feedback</li>
                <li>Suporte ao cliente 24/7</li>
              </ul>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mt-4">
                <p className="text-blue-400">
                  <strong>Nota:</strong> A Run Run não é uma empresa de transporte. Atuamos como intermediários 
                  tecnológicos entre passageiros e motoristas independentes.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Cadastro e Conta</h2>
            <div className="text-gray-300 space-y-4">
              <p>Para usar nossos serviços, você deve:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Ter pelo menos 18 anos de idade</li>
                <li>Fornecer informações verdadeiras e atualizadas</li>
                <li>Manter a segurança de sua senha</li>
                <li>Notificar-nos imediatamente sobre uso não autorizado</li>
              </ul>
              <p className="mt-4">
                Você é responsável por todas as atividades que ocorrem em sua conta.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <CreditCard className="w-6 h-6 text-green-500 mr-3" />
              4. Pagamentos e Taxas
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>
                As tarifas são calculadas com base na distância, tempo e demanda. Os preços estimados 
                podem variar devido a condições de tráfego ou alterações de rota.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Pagamento em dinheiro ou cartão</li>
                <li>Taxas de cancelamento podem ser aplicadas</li>
                <li>Promoções e descontos sujeitos a termos específicos</li>
                <li>Taxas de serviço incluídas no valor final</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Ban className="w-6 h-6 text-red-500 mr-3" />
              5. Condutas Proibidas
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>É expressamente proibido:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Uso do serviço para atividades ilegais</li>
                <li>Discriminação de qualquer natureza</li>
                <li>Assédio a motoristas, passageiros ou funcionários</li>
                <li>Transporte de materiais perigosos ou ilegais</li>
                <li>Danificar veículos de motoristas</li>
                <li>Criar contas falsas ou fraudulentas</li>
                <li>Uso de linguagem ofensiva ou ameaçadora</li>
              </ul>
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mt-4">
                <p className="text-red-400 flex items-start">
                  <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  Violações podem resultar em suspensão ou banimento permanente da plataforma.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Responsabilidades do Passageiro</h2>
            <div className="text-gray-300 space-y-4">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Estar no local de embarque no horário acordado</li>
                <li>Usar cinto de segurança durante toda a corrida</li>
                <li>Tratar motoristas com respeito</li>
                <li>Não consumir alimentos ou bebidas sem autorização</li>
                <li>Supervisionar menores de idade durante a corrida</li>
                <li>Informar destino correto ao motorista</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Responsabilidades do Motorista</h2>
            <div className="text-gray-300 space-y-4">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Manter documentação e veículo em dia</li>
                <li>Dirigir de forma segura e responsável</li>
                <li>Tratar passageiros com cortesia</li>
                <li>Seguir as rotas indicadas pelo aplicativo</li>
                <li>Não cancelar corridas sem motivo válido</li>
                <li>Manter o veículo limpo e em boas condições</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Limitação de Responsabilidade</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                A Run Run não se responsabiliza por:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Ações ou omissões de motoristas independentes</li>
                <li>Atrasos causados por condições de tráfego</li>
                <li>Objetos perdidos ou esquecidos nos veículos</li>
                <li>Interrupções no serviço devido a manutenção ou falhas técnicas</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Alterações nos Termos</h2>
            <div className="text-gray-300">
              <p>
                Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                Alterações significativas serão comunicadas através do aplicativo ou email. 
                O uso continuado após as alterações constitui aceitação dos novos termos.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <MessageSquare className="w-6 h-6 text-purple-500 mr-3" />
              10. Contato
            </h2>
            <div className="text-gray-300">
              <p>
                Para dúvidas sobre estes termos:
              </p>
              <div className="mt-4 p-4 bg-gray-900 rounded-xl">
                <p><strong className="text-white">Run Run</strong></p>
                <p>Email: <a href="mailto:suporte@runrungb.com" className="text-primary-400">suporte@runrungb.com</a></p>
                <p>Telefone: +245 966 084 539 / +245 957 338 295</p>
                <p>Endereço: Bissau, Guiné-Bissau</p>
              </div>
            </div>
          </section>
        </div>

        {/* Related Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link 
            href="/privacidade" 
            className="px-6 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl hover:border-primary-500 transition"
          >
            Política de Privacidade
          </Link>
          <Link 
            href="/contato" 
            className="px-6 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl hover:border-primary-500 transition"
          >
            Fale Conosco
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>© 2026 Run Run. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
