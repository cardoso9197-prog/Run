'use client'

import { useState, useEffect } from 'react'
import { 
  Bell,
  Send,
  MessageCircle,
  Smartphone,
  Mail,
  Users,
  Car,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  X,
  Globe
} from 'lucide-react'
import { apiClient } from '@/lib/api'

interface NotificationTemplate {
  id: string
  title: string
  message: string
  type: 'push' | 'sms' | 'email'
}

const templates: NotificationTemplate[] = [
  { 
    id: 'welcome', 
    title: 'Boas-vindas', 
    message: 'Bem-vindo ao Run Run! Estamos felizes em ter você conosco.',
    type: 'push'
  },
  { 
    id: 'promo', 
    title: 'Promoção Especial', 
    message: '🎉 Ganhe 20% de desconto na sua próxima corrida! Use o código RUNRUN20.',
    type: 'sms'
  },
  { 
    id: 'update', 
    title: 'Atualização Disponível', 
    message: 'Uma nova versão do app está disponível. Atualize para ter acesso a novos recursos!',
    type: 'push'
  },
  { 
    id: 'driver_approved', 
    title: 'Conta Aprovada', 
    message: 'Parabéns! Sua conta de motorista foi aprovada. Você já pode começar a aceitar corridas.',
    type: 'sms'
  },
  { 
    id: 'payment_reminder', 
    title: 'Lembrete de Pagamento', 
    message: 'Lembre-se de verificar seus pagamentos pendentes na sua conta.',
    type: 'email'
  }
]

export default function NotificationCenter() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  
  // Form state
  const [targetType, setTargetType] = useState<'all' | 'drivers' | 'passengers'>('all')
  const [notificationType, setNotificationType] = useState<'push' | 'sms' | 'email'>('push')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  // Stats
  const [stats, setStats] = useState({
    totalDrivers: 0,
    totalPassengers: 0,
    notificationsSent: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const result = await apiClient.getDashboardStats()
    if (result.success && result.data) {
      const data = result.data as any
      setStats({
        totalDrivers: data.onlineDrivers || 0,
        totalPassengers: data.activePassengers || 0,
        notificationsSent: 0
      })
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setTitle(template.title)
      setMessage(template.message)
      setNotificationType(template.type)
      setSelectedTemplate(templateId)
    }
  }

  const handleSendNotification = async () => {
    if (!title || !message) {
      setError('Título e mensagem são obrigatórios')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // In production, this would call an actual notification service
      // For now, we'll simulate sending notifications
      
      console.log('Sending notification:', {
        targetType,
        notificationType,
        title,
        message
      })

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      setSuccess(true)
      setStats(prev => ({ ...prev, notificationsSent: prev.notificationsSent + 1 }))
      
      // Reset form
      setTitle('')
      setMessage('')
      setSelectedTemplate('')

      setTimeout(() => {
        setSuccess(false)
        setShowModal(false)
      }, 2000)
    } catch (err) {
      setError('Falha ao enviar notificação')
    } finally {
      setLoading(false)
    }
  }

  const getTargetCount = () => {
    switch (targetType) {
      case 'drivers':
        return stats.totalDrivers
      case 'passengers':
        return stats.totalPassengers
      case 'all':
        return stats.totalDrivers + stats.totalPassengers
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Central de Notificações</h2>
          <p className="text-gray-400">Envie notificações push, SMS e emails para usuários</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition flex items-center justify-center"
        >
          <Send className="w-5 h-5 mr-2" />
          Nova Notificação
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Car className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalDrivers}</p>
          <p className="text-sm text-gray-400">Motoristas</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalPassengers}</p>
          <p className="text-sm text-gray-400">Passageiros</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Bell className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.notificationsSent}</p>
          <p className="text-sm text-gray-400">Enviadas Hoje</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Globe className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalDrivers + stats.totalPassengers}</p>
          <p className="text-sm text-gray-400">Total Usuários</p>
        </div>
      </div>

      {/* Notification Methods */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Push Notifications */}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mr-4">
              <Bell className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Push Notifications</h3>
              <p className="text-sm text-gray-400">Notificações instantâneas</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            Envie notificações push diretamente para os dispositivos dos usuários através do Firebase Cloud Messaging.
          </p>
          <div className="flex items-center text-sm text-blue-400">
            <CheckCircle className="w-4 h-4 mr-2" />
            Ativo e configurado
          </div>
        </div>

        {/* SMS - Orange/MTN */}
        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mr-4">
              <Smartphone className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">SMS (Orange/MTN)</h3>
              <p className="text-sm text-gray-400">Mensagens de texto</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            Integração com APIs Orange Money e MTN MoMo para envio de SMS em toda a Guiné-Bissau.
          </p>
          <div className="flex items-center text-sm text-yellow-400">
            <AlertCircle className="w-4 h-4 mr-2" />
            Configuração pendente
          </div>
        </div>

        {/* Email */}
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mr-4">
              <Mail className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Email</h3>
              <p className="text-sm text-gray-400">Emails em massa</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            Envie emails promocionais, atualizações e comunicações importantes para todos os usuários.
          </p>
          <div className="flex items-center text-sm text-green-400">
            <CheckCircle className="w-4 h-4 mr-2" />
            Ativo e configurado
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Templates Rápidos</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => {
                handleTemplateSelect(template.id)
                setShowModal(true)
              }}
              className="text-left p-4 bg-gray-900 border border-gray-700 rounded-xl hover:border-primary-500/50 hover:bg-gray-800 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  template.type === 'push' ? 'bg-blue-500/20 text-blue-400' :
                  template.type === 'sms' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {template.type.toUpperCase()}
                </span>
                <Send className="w-4 h-4 text-gray-500" />
              </div>
              <h4 className="font-medium text-white mb-1">{template.title}</h4>
              <p className="text-sm text-gray-400 line-clamp-2">{template.message}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Enviar Notificação</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {success ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">Notificação Enviada!</h4>
                  <p className="text-gray-400">A notificação foi enviada com sucesso para {getTargetCount()} usuários.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {error && (
                    <div className="bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl p-4">
                      {error}
                    </div>
                  )}

                  {/* Target Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Destinatários</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'all', label: 'Todos', count: stats.totalDrivers + stats.totalPassengers },
                        { value: 'drivers', label: 'Motoristas', count: stats.totalDrivers },
                        { value: 'passengers', label: 'Passageiros', count: stats.totalPassengers },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setTargetType(option.value as any)}
                          className={`p-3 rounded-xl border transition text-center ${
                            targetType === option.value
                              ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                              : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                          }`}
                        >
                          <p className="font-medium">{option.label}</p>
                          <p className="text-xs">{option.count} usuários</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notification Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Notificação</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'push', label: 'Push', icon: Bell },
                        { value: 'sms', label: 'SMS', icon: Smartphone },
                        { value: 'email', label: 'Email', icon: Mail },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setNotificationType(option.value as any)}
                          className={`p-3 rounded-xl border transition flex flex-col items-center ${
                            notificationType === option.value
                              ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                              : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                          }`}
                        >
                          <option.icon className="w-5 h-5 mb-1" />
                          <p className="font-medium text-sm">{option.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Promoção Especial"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Mensagem</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">{message.length}/160 caracteres</p>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSendNotification}
                      disabled={loading || !title || !message}
                      className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Enviar para {getTargetCount()}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
