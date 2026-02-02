'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Phone, Mail, MessageCircle, Clock, User, Bot } from 'lucide-react'
import { format } from 'date-fns'

interface Message {
  id: string
  text: string
  sender: 'user' | 'support' | 'bot'
  timestamp: Date
}

interface SupportChatProps {
  isOpen: boolean
  onClose: () => void
}

const quickReplies = [
  'Como faço para solicitar uma corrida?',
  'Quais formas de pagamento são aceitas?',
  'Como me torno motorista?',
  'Minha corrida foi cobrada incorretamente',
  'Perdi um objeto no carro',
  'Como cancelo uma corrida?',
  'Como avalio meu motorista?',
  'O motorista não chegou',
  'Como funciona o preço?',
  'Falar com atendente',
]

const botResponses: { [key: string]: string } = {
  'como faço para solicitar uma corrida?': 
    'Para solicitar uma corrida:\n\n1. Abra o app Run Run\n2. Digite seu destino na barra de pesquisa\n3. Escolha o tipo de veículo (Moto, Normal ou Premium)\n4. Confirme a solicitação\n5. Aguarde o motorista chegar!\n\nO app mostrará o preço estimado antes de confirmar.',
  
  'quais formas de pagamento são aceitas?': 
    'Aceitamos as seguintes formas de pagamento:\n\n� Cartão (crédito/débito)\n📱 Orange Money\n📱 MTN MoMo\n\nVocê pode escolher a forma de pagamento antes de solicitar a corrida.',
  
  'como me torno motorista?': 
    'Para se tornar motorista Run Run:\n\n1. Baixe o app Run Run Motorista ou cadastre-se em runrungb.com/motorista\n2. Crie sua conta com seus dados\n3. Adicione as informações do veículo\n4. Envie os documentos necessários (CNH, documento do veículo, seguro, foto de perfil, 4 fotos do veículo)\n5. Aguarde a verificação (24-48h)\n\nRequisitos: Ter mais de 21 anos, CNH válida, veículo em bom estado, celular com GPS.',
  
  'perdi um objeto no carro': 
    'Lamentamos saber que você perdeu algo! Para recuperar:\n\n1. Abra o app e vá em "Histórico de Corridas"\n2. Selecione a corrida onde perdeu o objeto\n3. Toque em "Reportar problema"\n4. Escolha "Objeto perdido"\n\nEntraremos em contato com o motorista para ajudar na recuperação.\n\n📞 Ou ligue: +245 966 084 539 / +245 957 338 295',
  
  'minha corrida foi cobrada incorretamente': 
    'Vamos resolver isso! Para contestar uma cobrança:\n\n1. Abra o app e vá em "Histórico"\n2. Selecione a corrida em questão\n3. Toque em "Reportar problema"\n4. Escolha "Problema com cobrança"\n5. Descreva o problema\n\nNossa equipe analisará e responderá em até 24 horas.\n\n📧 Email: suporte@runrungb.com',
  
  'como cancelo uma corrida?': 
    'Para cancelar uma corrida:\n\n1. Na tela de busca por motorista, toque em "Cancelar"\n2. Selecione o motivo do cancelamento\n3. Confirme o cancelamento\n\n⚠️ Atenção: Cancelamentos frequentes podem resultar em taxas ou restrições na conta.\n\nSe o motorista já estiver a caminho, considere aguardar para evitar taxas.',
  
  'como avalio meu motorista?': 
    'Após cada corrida, você pode avaliar o motorista:\n\n1. Ao final da corrida, aparecerá a tela de avaliação\n2. Selecione de 1 a 5 estrelas\n3. Adicione um comentário (opcional)\n4. Toque em "Enviar"\n\n⭐ Suas avaliações ajudam a manter a qualidade do serviço!',
  
  'o motorista não chegou': 
    'Sentimos muito pelo inconveniente! Aqui está o que fazer:\n\n1. Verifique se o endereço de embarque está correto\n2. Tente ligar para o motorista pelo app\n3. Se não conseguir contato, cancele a corrida\n4. Reporte o problema em "Histórico" > "Reportar problema"\n\n📞 Suporte: +245 966 084 539 / +245 957 338 295',
  
  'como funciona o preço?': 
    'O preço das corridas é calculado automaticamente:\n\n📍 Tarifa base da região\n📏 Distância do percurso\n🚗 Tipo de veículo (Moto, Normal ou Premium)\n\nO valor estimado é mostrado ANTES de confirmar a corrida - sem surpresas!\n\n💡 Dica: A tarifa pode variar conforme a demanda em horários de pico.',
  
  'falar com atendente': 
    'Um de nossos atendentes vai te ajudar! 👋\n\nVocê pode nos contactar por:\n\n📞 Telefone: +245 966 084 539 / +245 957 338 295\n📧 Email: suporte@runrungb.com\n💬 WhatsApp: +245 966 084 539 / +245 957 338 295\n\nHorário de atendimento: 24 horas, 7 dias por semana.',
}

export default function SupportChat({ isOpen, onClose }: SupportChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! 👋 Bem-vindo ao suporte Run Run!\n\nSou o assistente virtual e estou aqui para ajudar 24 horas por dia.\n\nComo posso ajudá-lo hoje?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (text: string = inputText) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const lowerText = text.toLowerCase().trim()
      let response = botResponses[lowerText]

      if (!response) {
        // Check for partial matches
        for (const key of Object.keys(botResponses)) {
          if (lowerText.includes(key.split(' ').slice(0, 3).join(' '))) {
            response = botResponses[key]
            break
          }
        }
      }

      if (!response) {
        response = 'Obrigado pela sua mensagem! 😊\n\nNão encontrei uma resposta automática para sua pergunta. Um de nossos atendentes irá responder em breve.\n\nEnquanto isso, você pode:\n📞 Ligar: +245 966 084 539 / +245 957 338 295\n📧 Email: suporte@runrungb.com'
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 transition-opacity"
        onClick={onClose}
      />

      {/* Chat Window */}
      <div className="relative w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-slideIn flex flex-col max-h-[80vh] border border-gray-700">
        {/* Header */}
        <div className="bg-black p-4 text-white border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-500/20 border border-primary-500/30 rounded-full flex items-center justify-center mr-3">
                <MessageCircle className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Suporte <span className="text-primary-500">Run Run</span></h3>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></span>
                  Online 24/7
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Quick Contact Options */}
        <div className="flex border-b border-gray-800">
      <a
        href="tel:+245966084539"
            className="flex-1 flex items-center justify-center py-3 text-sm text-gray-300 hover:bg-gray-800 transition"
          >
            <Phone className="w-4 h-4 mr-2 text-primary-500" />
            Ligar
          </a>
          <a
            href="mailto:suporte@runrungb.com"
            className="flex-1 flex items-center justify-center py-3 text-sm text-gray-300 hover:bg-gray-800 transition border-l border-gray-800"
          >
            <Mail className="w-4 h-4 mr-2 text-primary-500" />
            Email
          </a>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] bg-gray-900">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender !== 'user' && (
                <div className="w-8 h-8 bg-primary-500/20 border border-primary-500/30 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-500" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-primary-500 text-white rounded-br-md'
                    : 'bg-gray-800 text-gray-200 rounded-bl-md border border-gray-700'
                }`}
              >
                <p className="whitespace-pre-line text-sm">{message.text}</p>
                <span className={`text-xs mt-2 block ${
                  message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                }`}>
                  {format(message.timestamp, 'HH:mm')}
                </span>
              </div>
              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                  <User className="w-4 h-4 text-gray-300" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="w-8 h-8 bg-primary-500/20 border border-primary-500/30 rounded-full flex items-center justify-center mr-2">
                <Bot className="w-4 h-4 text-primary-500" />
              </div>
              <div className="bg-gray-800 rounded-2xl rounded-bl-md p-4 border border-gray-700">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="px-4 pb-2 bg-gray-900">
          <div className="flex flex-wrap gap-2">
            {quickReplies.slice(0, 3).map((reply, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply)}
                className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full transition border border-gray-700"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-800 bg-black">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-white placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-700 text-white rounded-full transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
