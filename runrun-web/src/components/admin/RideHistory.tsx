'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  MapPin,
  Calendar,
  Clock,
  Car,
  User,
  DollarSign,
  Filter,
  Download,
  Eye,
  RefreshCw,
  XCircle,
  X,
  CheckCircle,
  AlertTriangle,
  Navigation
} from 'lucide-react'
import { apiClient } from '@/lib/api'

interface Ride {
  id: number
  passenger: string
  passengerId: number
  driver: string
  driverId: number | null
  pickupAddress: string
  dropoffAddress: string
  status: 'pending' | 'accepted' | 'picked_up' | 'in_progress' | 'completed' | 'cancelled'
  fare: string
  distance: string
  duration: string
  paymentMethod: string
  createdAt: string
  completedAt: string | null
  rating: number | null
}

export default function RideHistory() {
  const [rides, setRides] = useState<Ride[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null)

  const fetchRides = async () => {
    setLoading(true)
    setError(null)
    
    const result = await apiClient.getRides(1, 100, statusFilter !== 'all' ? statusFilter : undefined)
    
    if (result.success && result.data) {
      const transformedRides: Ride[] = ((result.data as any).rides || result.data || []).map((r: any) => ({
        id: r.id,
        passenger: r.passenger_name || r.passenger || 'Desconhecido',
        passengerId: r.passenger_id,
        driver: r.driver_name || r.driver || 'Não atribuído',
        driverId: r.driver_id,
        pickupAddress: r.pickup_address || 'N/A',
        dropoffAddress: r.dropoff_address || 'N/A',
        status: r.status || 'pending',
        fare: `${(r.estimated_fare || r.final_fare || 0).toLocaleString()} XOF`,
        distance: r.distance ? `${r.distance} km` : 'N/A',
        duration: r.duration ? `${r.duration} min` : 'N/A',
        paymentMethod: r.payment_method || 'cash',
        createdAt: r.created_at ? new Date(r.created_at).toLocaleString('pt-BR') : '-',
        completedAt: r.completed_at ? new Date(r.completed_at).toLocaleString('pt-BR') : null,
        rating: r.rating
      }))
      setRides(transformedRides)
    } else {
      // Handle case when backend is not available - show empty state instead of error
      if (result.error?.includes('Not found') || result.error?.includes('fetch')) {
        setRides([])
      } else {
        setError(`Falha ao carregar corridas: ${result.error}`)
      }
    }
    
    setLoading(false)
  }

  useEffect(() => {
    fetchRides()
  }, [statusFilter])

  const filteredRides = rides.filter(ride => {
    if (searchQuery && 
        !ride.passenger.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ride.driver.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ride.pickupAddress.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ride.dropoffAddress.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'in_progress': case 'picked_up': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'accepted': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'pending': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída'
      case 'in_progress': return 'Em Progresso'
      case 'picked_up': return 'Passageiro Embarcado'
      case 'accepted': return 'Aceita'
      case 'pending': return 'Pendente'
      case 'cancelled': return 'Cancelada'
      default: return status
    }
  }

  const exportToCSV = () => {
    const headers = ['ID', 'Passageiro', 'Motorista', 'Origem', 'Destino', 'Status', 'Valor', 'Data']
    const csvData = filteredRides.map(r => [
      r.id, r.passenger, r.driver, r.pickupAddress, r.dropoffAddress, 
      getStatusLabel(r.status), r.fare, r.createdAt
    ])
    
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `corridas_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const stats = {
    total: rides.length,
    completed: rides.filter(r => r.status === 'completed').length,
    inProgress: rides.filter(r => ['in_progress', 'picked_up', 'accepted'].includes(r.status)).length,
    cancelled: rides.filter(r => r.status === 'cancelled').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-primary-500 animate-spin" />
        <span className="ml-2 text-gray-400">Carregando corridas...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/20 text-red-400 border border-red-500/30 rounded-2xl p-6 text-center">
        <XCircle className="w-12 h-12 mx-auto mb-4" />
        <p className="font-medium">{error}</p>
        <button onClick={fetchRides} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
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
          <h2 className="text-2xl font-bold text-white">Histórico de Corridas</h2>
          <p className="text-gray-400">Gerencie todas as corridas da plataforma</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={fetchRides} className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </button>
          <button onClick={exportToCSV} className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total de Corridas</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <p className="text-green-400 text-sm">Concluídas</p>
          <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <p className="text-blue-400 text-sm">Em Progresso</p>
          <p className="text-2xl font-bold text-blue-400">{stats.inProgress}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">Canceladas</p>
          <p className="text-2xl font-bold text-red-400">{stats.cancelled}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por passageiro, motorista ou endereço..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'completed', 'in_progress', 'pending', 'cancelled'].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  statusFilter === filter 
                    ? filter === 'completed' ? 'bg-green-500 text-white'
                      : filter === 'in_progress' ? 'bg-blue-500 text-white'
                      : filter === 'pending' ? 'bg-orange-500 text-white'
                      : filter === 'cancelled' ? 'bg-red-500 text-white'
                      : 'bg-primary-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {filter === 'all' ? 'Todas' 
                  : filter === 'completed' ? 'Concluídas'
                  : filter === 'in_progress' ? 'Em Progresso'
                  : filter === 'pending' ? 'Pendentes'
                  : 'Canceladas'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rides Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Passageiro</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Motorista</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rota</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredRides.map((ride) => (
                <tr key={ride.id} className="hover:bg-gray-700/50 transition">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-white">#{ride.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-white">{ride.passenger}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Car className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-white">{ride.driver}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-white truncate max-w-[200px]" title={ride.pickupAddress}>
                        <span className="text-green-400">●</span> {ride.pickupAddress}
                      </p>
                      <p className="text-gray-400 truncate max-w-[200px]" title={ride.dropoffAddress}>
                        <span className="text-red-400">●</span> {ride.dropoffAddress}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-white">{ride.fare}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(ride.status)}`}>
                      {getStatusLabel(ride.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400">{ride.createdAt}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedRide(ride)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition"
                      title="Ver detalhes"
                    >
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRides.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhuma corrida encontrada</p>
        </div>
      )}

      {/* Ride Detail Modal */}
      {selectedRide && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Detalhes da Corrida #{selectedRide.id}</h3>
                <button onClick={() => setSelectedRide(null)} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedRide.status)}`}>
                    {getStatusLabel(selectedRide.status)}
                  </span>
                </div>

                <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                  <h4 className="text-sm text-gray-400 mb-3">Rota</h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-1 mr-3"></div>
                      <div>
                        <p className="text-xs text-gray-500">Origem</p>
                        <p className="text-white">{selectedRide.pickupAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-red-500 rounded-full mt-1 mr-3"></div>
                      <div>
                        <p className="text-xs text-gray-500">Destino</p>
                        <p className="text-white">{selectedRide.dropoffAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                    <User className="w-5 h-5 text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500">Passageiro</p>
                    <p className="text-white font-medium">{selectedRide.passenger}</p>
                  </div>
                  <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                    <Car className="w-5 h-5 text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500">Motorista</p>
                    <p className="text-white font-medium">{selectedRide.driver}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center">
                    <DollarSign className="w-5 h-5 text-green-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Valor</p>
                    <p className="text-white font-bold">{selectedRide.fare}</p>
                  </div>
                  <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center">
                    <Navigation className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Distância</p>
                    <p className="text-white font-bold">{selectedRide.distance}</p>
                  </div>
                  <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center">
                    <Clock className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Duração</p>
                    <p className="text-white font-bold">{selectedRide.duration}</p>
                  </div>
                </div>

                <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Pagamento</p>
                      <p className="text-white">{selectedRide.paymentMethod === 'cash' ? 'Dinheiro' : selectedRide.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Criada em</p>
                      <p className="text-white">{selectedRide.createdAt}</p>
                    </div>
                  </div>
                  {selectedRide.completedAt && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <p className="text-xs text-gray-500">Concluída em</p>
                      <p className="text-green-400">{selectedRide.completedAt}</p>
                    </div>
                  )}
                </div>

                {selectedRide.rating && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
                    <p className="text-xs text-yellow-400 mb-1">Avaliação</p>
                    <p className="text-2xl font-bold text-yellow-400">⭐ {selectedRide.rating.toFixed(1)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
