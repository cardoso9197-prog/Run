'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Bell } from 'lucide-react'

export default function PrivacyPage() {
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
            <Shield className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Política de Privacidade
          </h1>
          <p className="text-gray-400">
            Última atualização: 1 de Janeiro de 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Eye className="w-6 h-6 text-primary-500 mr-3" />
              1. Informações que Coletamos
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>
                A Run Run coleta informações para fornecer serviços melhores a todos os nossos usuários. 
                As informações que coletamos incluem:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Informações de cadastro (nome, email, telefone)</li>
                <li>Informações de localização durante o uso do aplicativo</li>
                <li>Histórico de corridas e transações</li>
                <li>Informações do dispositivo</li>
                <li>Dados de comunicação com o suporte</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Database className="w-6 h-6 text-blue-500 mr-3" />
              2. Como Usamos suas Informações
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>Utilizamos as informações coletadas para:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fornecer, manter e melhorar nossos serviços</li>
                <li>Processar transações e enviar notificações relacionadas</li>
                <li>Conectar passageiros a motoristas</li>
                <li>Prevenir fraudes e aumentar a segurança</li>
                <li>Personalizar a experiência do usuário</li>
                <li>Enviar comunicações promocionais (com seu consentimento)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Users className="w-6 h-6 text-green-500 mr-3" />
              3. Compartilhamento de Informações
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Não vendemos suas informações pessoais. Compartilhamos dados apenas nas seguintes situações:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Entre passageiros e motoristas para facilitar corridas</li>
                <li>Com prestadores de serviços que nos ajudam a operar</li>
                <li>Para cumprir obrigações legais</li>
                <li>Em caso de fusão ou aquisição da empresa</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Lock className="w-6 h-6 text-yellow-500 mr-3" />
              4. Segurança dos Dados
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Criptografia de dados em trânsito e em repouso</li>
                <li>Controles de acesso rigorosos</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Auditorias regulares de segurança</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Bell className="w-6 h-6 text-purple-500 mr-3" />
              5. Seus Direitos
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>Você tem direito a:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir informações incorretas</li>
                <li>Solicitar exclusão de dados</li>
                <li>Retirar consentimento para comunicações</li>
                <li>Portabilidade de dados</li>
              </ul>
              <p className="mt-4">
                Para exercer esses direitos, entre em contato conosco através do email: 
                <a href="mailto:suporte@runrungb.com" className="text-primary-400 hover:text-primary-300 ml-1">
                  suporte@runrungb.com
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Alterações nesta Política</h2>
            <div className="text-gray-300">
              <p>
                Podemos atualizar esta política periodicamente. Notificaremos você sobre alterações 
                significativas através do aplicativo ou por email. O uso continuado de nossos serviços 
                após as alterações constitui aceitação da política atualizada.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Contato</h2>
            <div className="text-gray-300">
              <p>
                Se você tiver dúvidas sobre esta política de privacidade, entre em contato:
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
            href="/termos" 
            className="px-6 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl hover:border-primary-500 transition"
          >
            Termos de Uso
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
