'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  User,
  X,
  RefreshCw,
  XCircle
} from 'lucide-react'
import { apiClient } from '@/lib/api'

interface Ticket {
  id: number
  user: string
  email: string
  phone: string
  issue: string
  category: string
  status: 'pending' | 'in-progress' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  messages: { sender: string; text: string; time: string }[]
}

export default function SupportTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchTickets = async () => {
    setLoading(true)
    setError(null)
    
    const result = await apiClient.getSupportTickets()
    
    if (result.success && result.data) {
      // Transform API data to component format
      const transformedTickets = (result.data as any[]).map((t: any) => ({
        id: t.id,
        user: t.user_name || t.user || 'Desconhecido',
        email: t.email || '',
        phone: t.phone || '',
        issue: t.issue || t.subject || t.message || '',
        category: t.category || 'Geral',
        status: t.status || 'pending',
        priority: t.priority || 'medium',
        createdAt: t.created_at ? new Date(t.created_at).toLocaleString() : '-',
        messages: t.messages || []
      }))
      setTickets(transformedTickets)
    } else {
      // No tickets yet - show empty state instead of error
      setTickets([])
    }
    
    setLoading(false)
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const filteredTickets = tickets.filter(ticket => {
    if (filter !== 'all' && ticket.status !== filter) return false
    if (searchQuery && !ticket.user.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !ticket.issue.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedTicket) {
      // In production, this would send to the API
      console.log('Sending message:', newMessage)
      setNewMessage('')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-primary-500 animate-spin" />
        <span className="ml-2 text-gray-400">Carregando tickets...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/20 text-red-400 border border-red-500/30 rounded-2xl p-6 text-center">
        <XCircle className="w-12 h-12 mx-auto mb-4" />
        <p className="font-medium">{error}</p>
        <button
          onClick={fetchTickets}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Tentar Novamente
        </button>
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-12 text-center">
        <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <h3 className="text-xl font-bold text-white mb-2">Nenhum ticket de suporte</h3>
        <p className="text-gray-400 mb-4">Ainda não há tickets de suporte no sistema.</p>
        <button
          onClick={fetchTickets}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
        >
          <RefreshCw className="w-4 h-4 inline mr-2" />
          Atualizar
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-200px)] bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
      {/* Ticket List */}
      <div className={`w-full md:w-1/3 border-r border-gray-700 ${selectedTicket ? 'hidden md:block' : ''}`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-400">{filteredTickets.length} tickets</span>
            <button
              onClick={fetchTickets}
              className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
            >
              <RefreshCw className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                filter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                filter === 'in-progress' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Em Andamento
            </button>
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100%-140px)]">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700/50 transition ${
                selectedTicket?.id === ticket.id ? 'bg-primary-500/20' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{ticket.user}</h3>
                    <p className="text-xs text-gray-400">{ticket.category}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  ticket.priority === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  ticket.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                  'bg-gray-700 text-gray-300'
                }`}>
                  {ticket.priority === 'high' ? 'Alta' : ticket.priority === 'medium' ? 'Média' : 'Baixa'}
                </span>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2">{ticket.issue}</p>
              <div className="flex items-center justify-between mt-2">
                <span className={`inline-flex items-center text-xs ${
                  ticket.status === 'pending' ? 'text-yellow-400' :
                  ticket.status === 'in-progress' ? 'text-blue-400' :
                  'text-green-400'
                }`}>
                  {ticket.status === 'pending' ? <Clock className="w-3 h-3 mr-1" /> :
                   ticket.status === 'in-progress' ? <AlertCircle className="w-3 h-3 mr-1" /> :
                   <CheckCircle className="w-3 h-3 mr-1" />}
                  {ticket.status === 'pending' ? 'Pendente' :
                   ticket.status === 'in-progress' ? 'Em Andamento' : 'Resolvido'}
                </span>
                <span className="text-xs text-gray-500">{ticket.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedTicket ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedTicket(null)}
                className="md:hidden p-2 hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">{selectedTicket.user}</h3>
                <p className="text-sm text-gray-400">{selectedTicket.issue}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <a href={`tel:${selectedTicket.phone}`} className="p-2 hover:bg-gray-700 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400" />
              </a>
              <a href={`mailto:${selectedTicket.email}`} className="p-2 hover:bg-gray-700 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
              </a>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
            {selectedTicket.messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'support' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] p-3 rounded-2xl ${
                  message.sender === 'support' 
                    ? 'bg-primary-500 text-white rounded-br-none' 
                    : 'bg-gray-800 text-white rounded-bl-none border border-gray-700'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <span className={`text-xs ${message.sender === 'support' ? 'text-primary-100' : 'text-gray-400'}`}>
                    {message.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-700 bg-gray-800">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua resposta..."
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="p-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center space-x-2 mt-3">
              <button className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-sm hover:bg-green-500/30 transition">
                Marcar Resolvido
              </button>
              <button className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-sm hover:bg-blue-500/30 transition">
                Em Andamento
              </button>
              <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm hover:bg-gray-600 transition">
                Transferir
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-900">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400">Selecione um ticket</h3>
            <p className="text-gray-500">Escolha um ticket da lista para ver detalhes</p>
          </div>
        </div>
      )}
    </div>
  )
}
