'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Car,
  Star,
  Eye,
  Ban,
  MessageSquare,
  RefreshCw,
  XCircle,
  X,
  Send,
  CheckCircle
} from 'lucide-react'
import { apiClient } from '@/lib/api'

interface UserData {
  id: number
  name: string
  email: string
  phone: string
  avatar: string | null
  status: 'active' | 'inactive' | 'banned'
  totalRides: number
  totalSpent: string
  rating: number
  joinDate: string
  lastRide: string
  location: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  
  // Message modal state
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [messageUser, setMessageUser] = useState<UserData | null>(null)
  const [messageSubject, setMessageSubject] = useState('')
  const [messageContent, setMessageContent] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messageResult, setMessageResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    
    const result = await apiClient.getPassengers()
    
    if (result.success && result.data) {
      const transformedUsers: UserData[] = (result.data as any[]).map((u: any) => {
        const status: 'active' | 'inactive' | 'banned' = u.is_active !== false ? 'active' : 'inactive'
        return {
          id: u.id,
          name: u.name || u.full_name || 'Desconhecido',
          email: u.email || '',
          phone: u.phone || u.phone_number || '',
          avatar: u.profile_photo_url || null,
          status,
          totalRides: u.total_rides || 0,
          totalSpent: `${(u.total_spent || 0).toLocaleString()} XOF`,
          rating: u.average_rating || 5.0,
          joinDate: u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : '-',
          lastRide: u.last_ride ? new Date(u.last_ride).toLocaleDateString('pt-BR') : '-',
          location: 'Bissau'
        }
      })
      setUsers(transformedUsers)
    } else {
      setError(`Falha ao carregar passageiros: ${result.error}`)
    }
    
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const openMessageModal = (user: UserData) => {
    setMessageUser(user)
    setMessageSubject('')
    setMessageContent('')
    setMessageResult(null)
    setShowMessageModal(true)
  }

  const handleSendMessage = async () => {
    if (!messageUser || !messageContent.trim()) return
    
    setSendingMessage(true)
    setMessageResult(null)
    
    const result = await apiClient.sendMessage(
      messageUser.id, 
      'passenger', 
      messageContent, 
      messageSubject || undefined
    )
    
    if (result.success) {
      setMessageResult({ type: 'success', text: `Mensagem enviada para ${messageUser.name}!` })
      setTimeout(() => {
        setShowMessageModal(false)
        setMessageUser(null)
        setMessageSubject('')
        setMessageContent('')
        setMessageResult(null)
      }, 2000)
    } else {
      setMessageResult({ type: 'error', text: `Erro ao enviar: ${result.error}` })
    }
    
    setSendingMessage(false)
  }

  const filteredUsers = users.filter(user => {
    if (statusFilter !== 'all' && user.status !== statusFilter) return false
    if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !user.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !user.phone.includes(searchQuery)) return false
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-primary-500 animate-spin" />
        <span className="ml-2 text-gray-400">Carregando passageiros...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/20 text-red-400 border border-red-500/30 rounded-2xl p-6 text-center">
        <XCircle className="w-12 h-12 mx-auto mb-4" />
        <p className="font-medium">{error}</p>
        <button onClick={fetchUsers} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
          Tentar Novamente
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestão de Passageiros</h2>
          <p className="text-gray-400">Gerencie os usuários da plataforma</p>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={fetchUsers} className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </button>
          <span className="text-sm text-gray-400">{filteredUsers.length} usuários encontrados</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou telefone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            {['all', 'active', 'inactive', 'banned'].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  statusFilter === filter 
                    ? filter === 'active' ? 'bg-green-500 text-white'
                      : filter === 'inactive' ? 'bg-yellow-500 text-white'
                      : filter === 'banned' ? 'bg-red-500 text-white'
                      : 'bg-primary-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {filter === 'all' ? 'Todos' : filter === 'active' ? 'Ativos' : filter === 'inactive' ? 'Inativos' : 'Banidos'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Usuário</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contato</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Corridas</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total Gasto</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Avaliação</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-xs text-gray-400">
                          <MapPin className="w-3 h-3 inline mr-1" />{user.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-white">{user.phone || '-'}</p>
                    <p className="text-xs text-gray-400">{user.email || '-'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Car className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-white">{user.totalRides}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-white">{user.totalSpent}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium text-white">{user.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      user.status === 'inactive' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {user.status === 'active' ? 'Ativo' : user.status === 'inactive' ? 'Inativo' : 'Banido'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => setSelectedUser(user)} className="p-2 hover:bg-gray-700 rounded-lg transition" title="Ver detalhes">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button onClick={() => openMessageModal(user)} className="p-2 hover:bg-gray-700 rounded-lg transition" title="Enviar mensagem">
                        <MessageSquare className="w-4 h-4 text-blue-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-700 rounded-lg transition" title="Banir usuário">
                        <Ban className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum usuário encontrado</p>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Detalhes do Usuário</h3>
                <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <h4 className="text-xl font-bold text-white">{selectedUser.name}</h4>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                  selectedUser.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  selectedUser.status === 'inactive' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {selectedUser.status === 'active' ? 'Ativo' : selectedUser.status === 'inactive' ? 'Inativo' : 'Banido'}
                </span>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email', value: selectedUser.email || 'Não informado' },
                  { icon: Phone, label: 'Telefone', value: selectedUser.phone || 'Não informado' },
                  { icon: MapPin, label: 'Localização', value: selectedUser.location },
                  { icon: Calendar, label: 'Membro desde', value: selectedUser.joinDate }
                ].map((item, i) => (
                  <div key={i} className="flex items-center p-3 bg-gray-900 border border-gray-700 rounded-xl">
                    <item.icon className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="font-medium text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
                  <Car className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-xl font-bold text-white">{selectedUser.totalRides}</p>
                  <p className="text-xs text-gray-400">Corridas</p>
                </div>
                <div className="text-center p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                  <p className="text-xl font-bold text-white">{selectedUser.totalSpent}</p>
                  <p className="text-xs text-gray-400">Total Gasto</p>
                </div>
                <div className="text-center p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  </div>
                  <p className="text-xl font-bold text-white">{selectedUser.rating.toFixed(1)}</p>
                  <p className="text-xs text-gray-400">Avaliação</p>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button 
                  onClick={() => { setSelectedUser(null); openMessageModal(selectedUser); }}
                  className="flex-1 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition flex items-center justify-center"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Enviar Mensagem
                </button>
                <button className="px-4 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-medium hover:bg-red-500/30 transition">
                  <Ban className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && messageUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <MessageSquare className="w-5 h-5 text-blue-400 mr-2" />
                  Enviar Mensagem
                </h3>
                <button 
                  onClick={() => { setShowMessageModal(false); setMessageUser(null); setMessageResult(null); }}
                  className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Result Message */}
              {messageResult && (
                <div className={`mb-4 p-3 rounded-xl flex items-center ${
                  messageResult.type === 'success' 
                    ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                    : 'bg-red-500/20 border border-red-500/30 text-red-400'
                }`}>
                  {messageResult.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 mr-2" />
                  ) : (
                    <XCircle className="w-5 h-5 mr-2" />
                  )}
                  {messageResult.text}
                </div>
              )}
              
              <div className="flex items-center mb-4 p-3 bg-gray-900 border border-gray-700 rounded-xl">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                  {messageUser.avatar ? (
                    <img src={messageUser.avatar} alt={messageUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-white">{messageUser.name}</p>
                  <p className="text-xs text-gray-400">{messageUser.phone || messageUser.email}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Assunto (opcional):</label>
                <input
                  type="text"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  placeholder="Ex: Atualização da conta"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Mensagem:</label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Digite sua mensagem aqui..."
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => { setShowMessageModal(false); setMessageUser(null); setMessageResult(null); }}
                  className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={sendingMessage || !messageContent.trim()}
                  className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center"
                >
                  {sendingMessage ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
