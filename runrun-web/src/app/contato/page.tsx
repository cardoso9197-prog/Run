'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  Building,
  Users,
  ArrowLeft
} from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
  }

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

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Entre em <span className="text-primary-500">Contato</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Tem alguma dúvida ou quer fazer parceria conosco? Estamos aqui para ajudar!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Contato 24/7</h3>
              <p className="text-gray-400 mb-3">Ligue para nossa central de atendimento</p>
              <a href="tel:+245966084539" className="text-primary-400 hover:text-primary-300 font-medium block">
                +245 966 084 539
              </a>
              <a href="tel:+245957338295" className="text-primary-400 hover:text-primary-300 font-medium block mt-2">
                +245 957 338 295
              </a>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Email</h3>
              <p className="text-gray-400 mb-3">Envie-nos um email a qualquer hora</p>
              <a href="mailto:suporte@runrungb.com" className="text-green-400 hover:text-green-300 font-medium">
                suporte@runrungb.com
              </a>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Localização</h3>
              <p className="text-gray-400 mb-3">Visite nosso escritório</p>
              <p className="text-blue-400 font-medium">
                Bissau, Guiné-Bissau
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Horário</h3>
              <p className="text-gray-400 mb-3">Atendimento ao cliente</p>
              <p className="text-yellow-400 font-medium">
                24 horas, 7 dias por semana
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Mensagem Enviada!</h3>
                  <p className="text-gray-400 mb-6">
                    Obrigado pelo seu contato. Nossa equipe responderá em breve.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
                    }}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition"
                  >
                    Enviar Nova Mensagem
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white mb-6">Envie uma Mensagem</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-300 mb-2 font-medium">Nome Completo</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Seu nome"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2 font-medium">Email</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-300 mb-2 font-medium">Telefone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="+245 9XX XXX XXX"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2 font-medium">Assunto</label>
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Selecione um assunto</option>
                          <option value="suporte">Suporte ao Cliente</option>
                          <option value="motorista">Quero ser Motorista</option>
                          <option value="parceria">Parceria Empresarial</option>
                          <option value="imprensa">Imprensa</option>
                          <option value="outro">Outro</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2 font-medium">Mensagem</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        placeholder="Escreva sua mensagem aqui..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-xl font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Enviar Mensagem
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Quick Links */}
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <Link 
                href="/#download" 
                className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-primary-500 transition flex items-center"
              >
                <MessageSquare className="w-8 h-8 text-primary-500 mr-3" />
                <div>
                  <p className="text-white font-medium">Chat 24/7</p>
                  <p className="text-gray-400 text-sm">Suporte imediato</p>
                </div>
              </Link>
              <Link 
                href="/motorista" 
                className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-green-500 transition flex items-center"
              >
                <Users className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-white font-medium">Seja Motorista</p>
                  <p className="text-gray-400 text-sm">Cadastre-se agora</p>
                </div>
              </Link>
              <Link 
                href="/sobre" 
                className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-blue-500 transition flex items-center"
              >
                <Building className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-white font-medium">Sobre Nós</p>
                  <p className="text-gray-400 text-sm">Conheça a empresa</p>
                </div>
              </Link>
            </div>
          </div>
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
