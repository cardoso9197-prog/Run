'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    question: 'Como faço para criar uma conta no Run Run?',
    answer: 'É muito simples! Baixe o app, abra e clique em "Criar Conta". Você precisará informar seu número de telefone e receberá um código de verificação por SMS. Depois é só completar seu perfil com nome e criar uma senha. Pronto!',
  },
  {
    question: 'Quais tipos de veículos estão disponíveis?',
    answer: 'Atualmente oferecemos três categorias:\n\n🏍️ Moto: Rápido e econômico para 1 passageiro\n🚗 Normal: Carros comuns para 1-4 passageiros\n✨ Premium: Carros de luxo com mais conforto\n\nCada categoria tem preços diferentes, mostrados antes de confirmar a corrida.',
  },
  {
    question: 'Como posso pagar minha corrida?',
    answer: 'Aceitamos três formas de pagamento:\n\n• Cartão: Crédito ou débito via app\n• Orange Money: Pagamento via app\n• MTN MoMo: Pagamento via app\n\nVocê escolhe a forma preferida antes de solicitar a corrida.',
  },
  {
    question: 'O Run Run está disponível 24 horas?',
    answer: 'Sim! O Run Run opera 24 horas por dia, 7 dias por semana. Você pode solicitar uma corrida a qualquer momento, seja de dia ou de noite.',
  },
  {
    question: 'Como me torno um motorista parceiro?',
    answer: 'Para ser motorista Run Run:\n\n1. Baixe o app "Run Run Motorista" ou cadastre-se em runrungb.com/motorista\n2. Crie sua conta com dados pessoais\n3. Cadastre seu veículo\n4. Envie CNH (frente e verso), documento do veículo, seguro, foto de perfil e 4 fotos do veículo\n5. Aguarde a aprovação (24-48h)\n\nApós aprovado, você já pode começar a aceitar corridas!',
  },
  {
    question: 'Como funciona o preço das corridas?',
    answer: 'O preço é calculado automaticamente baseado em:\n\n• Distância do percurso\n• Tipo de veículo escolhido\n• Tarifa base da região\n\nO valor estimado é mostrado ANTES de você confirmar a corrida, sem surpresas!',
  },
  {
    question: 'Como cancelo uma corrida?',
    answer: 'Para cancelar:\n\n1. Na tela de busca por motorista, toque em "Cancelar"\n2. Selecione o motivo do cancelamento\n3. Confirme\n\n⚠️ Cancelamentos frequentes podem resultar em taxas. Se o motorista já estiver a caminho, considere aguardar.',
  },
  {
    question: 'O que fazer se perdi algo no carro?',
    answer: 'Se você perdeu algum objeto:\n\n1. Abra o app e vá em "Histórico"\n2. Selecione a corrida\n3. Toque em "Reportar problema"\n4. Escolha "Objeto perdido"\n5. Descreva o objeto\n\nEntraremos em contato com o motorista para ajudar a recuperar seu pertence.',
  },
  {
    question: 'Como avalio meu motorista ou passageiro?',
    answer: 'Após cada corrida:\n\n1. Aparecerá a tela de avaliação automaticamente\n2. Selecione de 1 a 5 estrelas\n3. Adicione um comentário (opcional)\n4. Toque em "Enviar"\n\n⭐ Suas avaliações ajudam a manter a qualidade do serviço!',
  },
  {
    question: 'O motorista não chegou, o que fazer?',
    answer: 'Se o motorista não aparecer:\n\n1. Verifique se o endereço está correto\n2. Tente ligar para o motorista pelo app\n3. Se não conseguir contato, cancele a corrida\n4. Reporte em "Histórico" > "Reportar problema"\n\n📞 Suporte: +245 966 084 539 / +245 957 338 295',
  },
  {
    question: 'Como entro em contato com o suporte?',
    answer: 'Você pode nos contatar por:\n\n• Chat no app ou site (24/7)\n• Telefone: +245 966 084 539 / +245 957 338 295\n• Email: suporte@runrungb.com\n• WhatsApp: +245 966 084 539 / +245 957 338 295\n\nEstamos sempre prontos para ajudar!',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Perguntas <span className="text-primary-500">Frequentes</span>
          </h2>
          <p className="text-lg text-gray-400">
            Encontre respostas rápidas para as dúvidas mais comuns
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-2xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-700 transition"
              >
                <span className="font-semibold text-white pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-primary-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-5 animate-fadeIn">
                  <p className="text-gray-400 whitespace-pre-line">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            Não encontrou o que procurava?
          </p>
          <a
            href="#suporte"
            className="inline-flex items-center bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-semibold transition"
          >
            Fale com o Suporte
          </a>
        </div>
      </div>
    </section>
  )
}
