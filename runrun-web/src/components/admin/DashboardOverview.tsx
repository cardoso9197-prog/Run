'use client'

import { useEffect, useState } from 'react'
import { 
  Users, 
  Car, 
  TrendingUp, 
  DollarSign, 
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { apiClient } from '@/lib/api'

interface DashboardOverviewProps {
  onNavigate?: (section: string) => void
}

interface DashboardStats {
  totalRides: number
  activePassengers: number
  onlineDrivers: number
  todayRevenue: number
  recentRides: Array<{
    id: number
    passenger: string
    driver: string
    route: string
    status: string
    fare: string
  }>
  recentTickets?: Array<{
    id: number
    user: string
    issue: string
    status: string
    time: string
  }>
  pendingDrivers: number
}

export default function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    setLoading(true)
    setError(null)
    
    const result = await apiClient.getDashboardStats()
    
    if (result.success && result.data) {
      setStats(result.data as DashboardStats)
    } else {
      // Show error - no mock data, only real Railway database
      setError(`Falha ao carregar dados: ${result.error}`)
    }
    
    setLoading(false)
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Carregando estatísticas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    const isWarning = error.includes('demonstração') || error.includes('backend não conectado')
    return (
      <div className={`${isWarning ? 'bg-yellow-500/10 border-yellow-500/50' : 'bg-red-500/10 border-red-500/50'} border rounded-2xl p-6 mb-6`}>
        <div className="flex items-start gap-3">
          <AlertCircle className={`w-6 h-6 ${isWarning ? 'text-yellow-500' : 'text-red-500'} flex-shrink-0`} />
          <div>
            <h3 className={`${isWarning ? 'text-yellow-500' : 'text-red-500'} font-semibold mb-2`}>
              {isWarning ? 'Modo Demonstração' : 'Erro ao Carregar Dashboard'}
            </h3>
            <p className={`${isWarning ? 'text-yellow-400' : 'text-red-400'} text-sm`}>{error}</p>
            {!isWarning && (
              <button 
                onClick={fetchStats}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium"
              >
                Tentar Novamente
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  const displayStats = [
    { 
      label: 'Corridas Hoje', 
      value: stats?.totalRides?.toString() || '0', 
      change: '+12%', 
      icon: Car, 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Passageiros Ativos', 
      value: stats?.activePassengers?.toString() || '0', 
      change: '+5%', 
      icon: Users, 
      color: 'bg-green-500' 
    },
    { 
      label: 'Motoristas Online', 
      value: stats?.onlineDrivers?.toString() || '0', 
      change: '+8%', 
      icon: TrendingUp, 
      color: 'bg-purple-500' 
    },
    { 
      label: 'Receita Hoje', 
      value: `${stats?.todayRevenue?.toLocaleString() || '0'} XOF`, 
      change: '+15%', 
      icon: DollarSign, 
      color: 'bg-primary-500' 
    },
  ]
  
  return (
    <div className="space-y-6">
      {/* Refresh Button */}
      <div className="flex justify-end">
        <button 
          onClick={fetchStats}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, index) => (
          <div key={index} className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-medium">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Support Tickets */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Tickets de Suporte</h2>
            <span className="bg-red-500/20 text-red-400 text-sm px-3 py-1 rounded-full border border-red-500/30">
              {stats?.recentTickets?.length || 0} pendentes
            </span>
          </div>
          <div className="space-y-4">
            {(stats?.recentTickets && stats.recentTickets.length > 0) ? (
              stats.recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 bg-gray-900 border border-gray-700 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{ticket.user}</p>
                      <p className="text-sm text-gray-400">{ticket.issue}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      ticket.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {ticket.status === 'pending' ? 'Pendente' :
                       ticket.status === 'in-progress' ? 'Em Andamento' : 'Resolvido'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{ticket.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-8">Nenhum ticket encontrado</p>
            )}
          </div>
          <button 
            onClick={() => onNavigate?.('tickets')}
            className="w-full mt-4 text-primary-400 hover:text-primary-300 font-medium text-sm"
          >
            Ver todos os tickets →
          </button>
        </div>

        {/* Recent Rides */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Corridas Recentes</h2>
            <span className="bg-green-500/20 text-green-400 text-sm px-3 py-1 rounded-full border border-green-500/30">
              {stats?.recentRides?.filter(r => r.status === 'in-progress').length || 0} em andamento
            </span>
          </div>
          <div className="space-y-4">
            {(stats?.recentRides && stats.recentRides.length > 0) ? (
              stats.recentRides.map((ride) => (
              <div key={ride.id} className="flex items-center justify-between p-4 bg-gray-900 border border-gray-700 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    ride.status === 'completed' ? 'bg-green-500/20' : 'bg-blue-500/20'
                  }`}>
                    {ride.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Clock className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{ride.route}</p>
                    <p className="text-sm text-gray-400">
                      {ride.passenger} → {ride.driver}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">{ride.fare}</p>
                  <span className={`text-xs ${
                    ride.status === 'completed' ? 'text-green-400' : 'text-blue-400'
                  }`}>
                    {ride.status === 'completed' ? 'Concluída' : 'Em andamento'}
                  </span>
                </div>
              </div>
            ))
            ) : (
              <p className="text-center text-gray-400 py-8">Nenhuma corrida encontrada</p>
            )}
          </div>
          <button className="w-full mt-4 text-primary-400 hover:text-primary-300 font-medium text-sm">
            Ver todas as corridas →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-6">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => onNavigate?.('tickets')}
            className="p-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl transition text-center"
          >
            <MessageSquare className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-200">Novo Ticket</span>
          </button>
          <button 
            onClick={() => onNavigate?.('users')}
            className="p-4 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl transition text-center"
          >
            <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-200">Adicionar Usuário</span>
          </button>
          <button 
            onClick={() => onNavigate?.('drivers')}
            className="p-4 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl transition text-center"
          >
            <Car className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-200">Aprovar Motorista</span>
          </button>
          <button 
            onClick={() => onNavigate?.('alerts')}
            className="p-4 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-xl transition text-center"
          >
            <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-200">Ver Alertas</span>
          </button>
        </div>
      </div>
    </div>
  )
}
