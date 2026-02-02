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
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  Shield,
  RefreshCw,
  Image,
  X,
  AlertTriangle
} from 'lucide-react'
import { apiClient } from '@/lib/api'

interface Driver {
  id: number
  name: string
  email: string
  phone: string
  avatar: string | null
  status: 'active' | 'pending' | 'inactive' | 'rejected'
  vehicleType: string
  vehiclePlate: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: string
  vehicleColor: string
  totalRides: number
  totalEarnings: string
  rating: number
  joinDate: string
  lastRide: string
  location: string
  licenseNumber: string
  isVerified: boolean
  isActivated: boolean
  verificationNotes: string | null
  verifiedBy: string | null
  verificationDate: string | null
  documents: {
    photo: string | null
    license: string | null
    vehicle: string | null
  }
}

export default function DriverManagement() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<{ type: string; url: string } | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)

  const fetchDrivers = async () => {
    setLoading(true)
    setError(null)
    
    const result = await apiClient.getDrivers()
    
    if (result.success && result.data) {
      const transformedDrivers: Driver[] = (result.data as any[]).map((d: any) => {
        let status: 'active' | 'pending' | 'inactive' | 'rejected' = 'pending'
        if (d.is_verified && d.is_activated) {
          status = 'active'
        } else if (d.verification_notes && d.verification_notes.toLowerCase().includes('reject')) {
          status = 'rejected'
        } else if (!d.is_verified) {
          status = 'pending'
        } else {
          status = 'inactive'
        }
        
        return {
          id: d.id,
          name: d.name || 'Desconhecido',
          email: d.email || '',
          phone: d.phone || d.phone_number || '',
          avatar: d.profile_photo_url || null,
          status,
          vehicleType: d.vehicle_type || 'N/A',
          vehiclePlate: d.license_plate || 'N/A',
          vehicleMake: d.vehicle_make || '',
          vehicleModel: d.vehicle_model || '',
          vehicleYear: d.vehicle_year || '',
          vehicleColor: d.vehicle_color || '',
          totalRides: d.total_rides || 0,
          totalEarnings: `${(d.total_earnings || 0).toLocaleString()} XOF`,
          rating: d.average_rating || 0,
          joinDate: d.created_at ? new Date(d.created_at).toLocaleDateString('pt-BR') : '-',
          lastRide: d.last_ride ? new Date(d.last_ride).toLocaleDateString('pt-BR') : '-',
          location: 'Bissau',
          licenseNumber: d.license_number || '',
          isVerified: d.is_verified || false,
          isActivated: d.is_activated || false,
          verificationNotes: d.verification_notes || null,
          verifiedBy: d.verified_by || null,
          verificationDate: d.verification_date ? new Date(d.verification_date).toLocaleDateString('pt-BR') : null,
          documents: {
            photo: d.profile_photo_url || null,
            license: d.license_image || null,
            vehicle: d.vehicle_image || null
          }
        }
      })
      setDrivers(transformedDrivers)
    } else {
      setError(`Falha ao carregar motoristas: ${result.error}`)
    }
    
    setLoading(false)
  }

  useEffect(() => {
    fetchDrivers()
  }, [])

  const handleActivateDriver = async (driver: Driver) => {
    setActionLoading(true)
    setActionMessage(null)
    
    const result = await apiClient.activateDriver(driver.id, {
      verifiedBy: 'Admin Panel',
      notes: 'Driver approved via admin panel'
    })
    
    if (result.success) {
      setActionMessage({ type: 'success', text: `Motorista ${driver.name} ativado com sucesso!` })
      fetchDrivers()
      setSelectedDriver(null)
    } else {
      setActionMessage({ type: 'error', text: `Erro ao ativar: ${result.error}` })
    }
    
    setActionLoading(false)
    setTimeout(() => setActionMessage(null), 3000)
  }

  const handleRejectDriver = async () => {
    if (!selectedDriver) return
    
    setActionLoading(true)
    setActionMessage(null)
    
    const result = await apiClient.rejectDriver(selectedDriver.id, rejectReason || 'Application rejected by admin')
    
    if (result.success) {
      setActionMessage({ type: 'success', text: `Motorista ${selectedDriver.name} rejeitado.` })
      fetchDrivers()
      setSelectedDriver(null)
      setShowRejectModal(false)
      setRejectReason('')
    } else {
      setActionMessage({ type: 'error', text: `Erro ao rejeitar: ${result.error}` })
    }
    
    setActionLoading(false)
    setTimeout(() => setActionMessage(null), 3000)
  }

  const openDocument = (type: string, url: string | null) => {
    if (url) {
      setSelectedDocument({ type, url })
      setShowDocumentModal(true)
    }
  }

  const filteredDrivers = drivers.filter(driver => {
    if (statusFilter !== 'all' && driver.status !== statusFilter) return false
    if (searchQuery && !driver.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !driver.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !driver.phone.includes(searchQuery) &&
        !driver.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const pendingCount = drivers.filter(d => d.status === 'pending').length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-primary-500 animate-spin" />
        <span className="ml-2 text-gray-400">Carregando motoristas...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/20 text-red-400 border border-red-500/30 rounded-2xl p-6 text-center">
        <XCircle className="w-12 h-12 mx-auto mb-4" />
        <p className="font-medium">{error}</p>
        <button onClick={fetchDrivers} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
          Tentar Novamente
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Action Message Toast */}
      {actionMessage && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg ${
          actionMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {actionMessage.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestão de Motoristas</h2>
          <p className="text-gray-400">Verifique documentos e aprove motoristas</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={fetchDrivers} className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </button>
          {pendingCount > 0 && (
            <div className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-4 py-2 rounded-xl flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-medium">{pendingCount} aguardando aprovação</span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, email, telefone ou placa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'active', 'rejected'].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  statusFilter === filter 
                    ? filter === 'pending' ? 'bg-yellow-500 text-white' 
                      : filter === 'active' ? 'bg-green-500 text-white'
                      : filter === 'rejected' ? 'bg-red-500 text-white'
                      : 'bg-primary-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {filter === 'all' ? `Todos (${drivers.length})` 
                  : filter === 'pending' ? `Pendentes (${drivers.filter(d => d.status === 'pending').length})`
                  : filter === 'active' ? `Ativos (${drivers.filter(d => d.status === 'active').length})`
                  : `Rejeitados (${drivers.filter(d => d.status === 'rejected').length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => (
          <div key={driver.id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
            <div className={`h-2 ${
              driver.status === 'active' ? 'bg-green-500' :
              driver.status === 'pending' ? 'bg-yellow-500' :
              driver.status === 'rejected' ? 'bg-red-500' : 'bg-gray-500'
            }`} />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                    {driver.documents.photo ? (
                      <img src={driver.documents.photo} alt={driver.name} className="w-full h-full object-cover cursor-pointer"
                        onClick={() => openDocument('Foto do Motorista', driver.documents.photo)} />
                    ) : (
                      <User className="w-7 h-7 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{driver.name}</h3>
                    <p className="text-sm text-gray-400">{driver.vehicleType}</p>
                    <p className="text-xs text-gray-500">{driver.vehiclePlate}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  driver.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  driver.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  driver.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {driver.status === 'active' ? 'Ativo' : driver.status === 'pending' ? 'Pendente' : driver.status === 'rejected' ? 'Rejeitado' : 'Inativo'}
                </span>
              </div>

              {/* Vehicle Info */}
              <div className="bg-gray-900 border border-gray-700 p-3 rounded-xl mb-4">
                <p className="text-xs text-gray-500 mb-1">Veículo</p>
                <p className="text-sm text-white">{driver.vehicleMake} {driver.vehicleModel} {driver.vehicleYear}</p>
                <p className="text-xs text-gray-400">{driver.vehicleColor} • {driver.vehiclePlate}</p>
              </div>

              {/* Documents Status */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Documentos:</p>
                <div className="flex space-x-2">
                  {[
                    { key: 'photo', label: 'Foto', icon: Image, url: driver.documents.photo },
                    { key: 'license', label: 'Licença', icon: FileText, url: driver.documents.license },
                    { key: 'vehicle', label: 'Veículo', icon: Car, url: driver.documents.vehicle }
                  ].map(doc => (
                    <button
                      key={doc.key}
                      onClick={() => openDocument(doc.label, doc.url)}
                      disabled={!doc.url}
                      className={`flex-1 p-2 rounded-xl flex flex-col items-center justify-center transition ${
                        doc.url ? 'bg-green-500/20 border border-green-500/30 hover:bg-green-500/30 cursor-pointer' : 'bg-red-500/20 border border-red-500/30'
                      }`}
                    >
                      <doc.icon className={`w-4 h-4 ${doc.url ? 'text-green-400' : 'text-red-400'}`} />
                      <span className={`text-xs mt-1 ${doc.url ? 'text-green-400' : 'text-red-400'}`}>{doc.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <button onClick={() => setSelectedDriver(driver)} className="flex-1 py-2 bg-gray-700 text-gray-200 rounded-xl font-medium hover:bg-gray-600 transition text-sm">
                  <Eye className="w-4 h-4 inline mr-1" /> Detalhes
                </button>
                {driver.status === 'pending' && (
                  <>
                    <button onClick={() => handleActivateDriver(driver)} disabled={actionLoading}
                      className="flex-1 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition text-sm disabled:opacity-50">
                      <CheckCircle className="w-4 h-4 inline mr-1" /> Aprovar
                    </button>
                    <button onClick={() => { setSelectedDriver(driver); setShowRejectModal(true); }}
                      className="py-2 px-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-medium hover:bg-red-500/30 transition">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDrivers.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum motorista encontrado</p>
        </div>
      )}

      {/* Driver Detail Modal */}
      {selectedDriver && !showRejectModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Detalhes do Motorista</h3>
                <button onClick={() => setSelectedDriver(null)} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {selectedDriver.documents.photo ? (
                    <img src={selectedDriver.documents.photo} alt={selectedDriver.name} className="w-full h-full object-cover cursor-pointer"
                      onClick={() => openDocument('Foto do Motorista', selectedDriver.documents.photo)} />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <h4 className="text-xl font-bold text-white">{selectedDriver.name}</h4>
                <p className="text-gray-400">{selectedDriver.vehicleMake} {selectedDriver.vehicleModel} • {selectedDriver.vehiclePlate}</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                  selectedDriver.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  selectedDriver.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                  selectedDriver.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}>
                  {selectedDriver.status === 'active' ? 'Ativo' : selectedDriver.status === 'pending' ? 'Pendente' : selectedDriver.status === 'rejected' ? 'Rejeitado' : 'Inativo'}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {[
                  { icon: Mail, label: 'Email', value: selectedDriver.email || 'Não informado' },
                  { icon: Phone, label: 'Telefone', value: selectedDriver.phone || 'Não informado' },
                  { icon: FileText, label: 'Nº da Licença', value: selectedDriver.licenseNumber },
                  { icon: Calendar, label: 'Cadastrado em', value: selectedDriver.joinDate }
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

              {/* Vehicle Details */}
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-6">
                <h5 className="font-medium text-white mb-3 flex items-center">
                  <Car className="w-5 h-5 mr-2 text-primary-400" /> Informações do Veículo
                </h5>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: 'Tipo', value: selectedDriver.vehicleType },
                    { label: 'Marca', value: selectedDriver.vehicleMake || 'N/A' },
                    { label: 'Modelo', value: selectedDriver.vehicleModel || 'N/A' },
                    { label: 'Ano', value: selectedDriver.vehicleYear || 'N/A' },
                    { label: 'Cor', value: selectedDriver.vehicleColor || 'N/A' },
                    { label: 'Placa', value: selectedDriver.vehiclePlate }
                  ].map((item, i) => (
                    <div key={i}><span className="text-gray-500">{item.label}:</span><span className="text-white ml-2">{item.value}</span></div>
                  ))}
                </div>
              </div>

              {/* Documents Section */}
              <div className="mb-6">
                <h5 className="font-medium text-white mb-3">Documentos</h5>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { type: 'Foto do Motorista', icon: Image, url: selectedDriver.documents.photo, label: selectedDriver.documents.photo ? 'Ver Foto' : 'Sem Foto' },
                    { type: 'Licença de Condução', icon: FileText, url: selectedDriver.documents.license, label: selectedDriver.documents.license ? 'Ver Licença' : 'Sem Licença' },
                    { type: 'Documento do Veículo', icon: Car, url: selectedDriver.documents.vehicle, label: selectedDriver.documents.vehicle ? 'Ver Veículo' : 'Sem Doc.' }
                  ].map((doc, i) => (
                    <button key={i} onClick={() => openDocument(doc.type, doc.url)} disabled={!doc.url}
                      className={`p-4 rounded-xl flex flex-col items-center justify-center transition ${
                        doc.url ? 'bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 cursor-pointer' : 'bg-red-500/10 border border-red-500/30 cursor-not-allowed'
                      }`}>
                      <doc.icon className={`w-8 h-8 mb-2 ${doc.url ? 'text-green-400' : 'text-red-400'}`} />
                      <span className={`text-sm ${doc.url ? 'text-green-400' : 'text-red-400'}`}>{doc.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Verification Info */}
              {selectedDriver.verifiedBy && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-400"><strong>Verificado por:</strong> {selectedDriver.verifiedBy}</p>
                  {selectedDriver.verificationDate && <p className="text-sm text-blue-400"><strong>Data:</strong> {selectedDriver.verificationDate}</p>}
                  {selectedDriver.verificationNotes && <p className="text-sm text-blue-400 mt-2"><strong>Notas:</strong> {selectedDriver.verificationNotes}</p>}
                </div>
              )}

              {/* Action Buttons */}
              {selectedDriver.status === 'pending' && (
                <div className="flex space-x-3">
                  <button onClick={() => handleActivateDriver(selectedDriver)} disabled={actionLoading}
                    className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition disabled:opacity-50">
                    <CheckCircle className="w-5 h-5 inline mr-2" /> Aprovar Motorista
                  </button>
                  <button onClick={() => setShowRejectModal(true)}
                    className="flex-1 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-medium hover:bg-red-500/30 transition">
                    <XCircle className="w-5 h-5 inline mr-2" /> Rejeitar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedDriver && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-400 mr-2" /> Rejeitar Motorista
                </h3>
                <button onClick={() => { setShowRejectModal(false); setRejectReason(''); }} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-400 mb-4">
                Tem certeza que deseja rejeitar a candidatura de <strong className="text-white">{selectedDriver.name}</strong>?
              </p>
              
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Motivo da rejeição:</label>
                <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Ex: Documentos inválidos, foto ilegível..."
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={3} />
              </div>
              
              <div className="flex space-x-3">
                <button onClick={() => { setShowRejectModal(false); setRejectReason(''); }}
                  className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-600 transition">
                  Cancelar
                </button>
                <button onClick={handleRejectDriver} disabled={actionLoading}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition disabled:opacity-50">
                  {actionLoading ? 'Rejeitando...' : 'Confirmar Rejeição'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showDocumentModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">{selectedDocument.type}</h3>
              <button onClick={() => { setShowDocumentModal(false); setSelectedDocument(null); }}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-gray-800 rounded-2xl overflow-hidden">
              <img src={selectedDocument.url} alt={selectedDocument.type} className="w-full h-auto max-h-[80vh] object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
