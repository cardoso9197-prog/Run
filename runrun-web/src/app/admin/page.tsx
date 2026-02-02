'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Car, 
  AlertTriangle,
  Settings,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  History,
  DollarSign,
  Send
} from 'lucide-react'
import SupportTickets from '@/components/admin/SupportTickets'
import UserManagement from '@/components/admin/UserManagement'
import DriverManagement from '@/components/admin/DriverManagement'
import DashboardOverview from '@/components/admin/DashboardOverview'
import RideHistory from '@/components/admin/RideHistory'
import FinancialReports from '@/components/admin/FinancialReports'
import NotificationCenter from '@/components/admin/NotificationCenter'
import { WithdrawalsPanel } from '@/components/admin'
import { useAdminAuth } from '@/lib/adminAuth'

const menuItems = [
  { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
  { id: 'withdrawals', label: 'Saques', icon: DollarSign },
  { id: 'rides', label: 'Corridas', icon: History },
  { id: 'financial', label: 'Financeiro', icon: DollarSign },
  { id: 'notifications', label: 'Notificações', icon: Send },
  { id: 'tickets', label: 'Suporte', icon: MessageSquare },
  { id: 'users', label: 'Passageiros', icon: Users },
  { id: 'drivers', label: 'Motoristas', icon: Car },
  { id: 'alerts', label: 'Alertas', icon: AlertTriangle },
  { id: 'settings', label: 'Configurações', icon: Settings },
]

export default function AdminPage() {
  const { isAuthenticated, isLoading, logout } = useAdminAuth()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview onNavigate={setActiveSection} />
      case 'withdrawals':
        return <WithdrawalsPanel />
      case 'rides':
        return <RideHistory />
      case 'financial':
        return <FinancialReports />
      case 'notifications':
        return <NotificationCenter />
      case 'tickets':
        return <SupportTickets />
      case 'users':
        return <UserManagement />
      case 'drivers':
        return <DriverManagement />
      case 'alerts':
        return <AlertsSection />
      case 'settings':
        return <SettingsSection />
      default:
        return <DashboardOverview onNavigate={setActiveSection} />
    }
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <Image src="/logo.png" alt="Run Run" width={40} height={40} className="rounded-full" />
              <span className="text-xl font-bold text-white">
                Run <span className="text-primary-500">Run</span>
              </span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  setIsSidebarOpen(false)
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                  activeSection === item.id
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.id === 'tickets' && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    3
                  </span>
                )}
                {item.id === 'drivers' && (
                  <span className="ml-auto bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full">
                    2
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-white">👤</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Admin</p>
                <p className="text-gray-400 text-sm">cardoso9197@gmail.com</p>
              </div>
              <button 
                onClick={logout}
                className="text-gray-400 hover:text-white"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold text-white">
                {menuItems.find(item => item.id === activeSection)?.label}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:flex items-center bg-gray-800 border border-gray-700 rounded-full px-4 py-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  className="bg-transparent border-none focus:outline-none ml-2 w-48 text-white placeholder-gray-500"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
              </button>

              {/* Online Status */}
              <div className="flex items-center space-x-2 bg-primary-500/20 border border-primary-500/30 px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-primary-400 font-medium">Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}

// Alerts Section Component
function AlertsSection() {
  const alerts = [
    { id: 1, type: 'warning', title: 'Motorista offline por muito tempo', description: 'António Dias está offline há 48 horas', time: '2h atrás' },
    { id: 2, type: 'error', title: 'Reclamação grave', description: 'Passageiro relatou comportamento inadequado', time: '5h atrás' },
    { id: 3, type: 'info', title: 'Novo motorista pendente', description: 'Pedro Gomes aguarda aprovação', time: '1 dia' },
    { id: 4, type: 'warning', title: 'Pagamento atrasado', description: 'Cobrança pendente do motorista #234', time: '2 dias' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Alertas do Sistema</h2>
        <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm border border-yellow-500/30">
          {alerts.length} alertas ativos
        </span>
      </div>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className={`p-4 rounded-xl border ${
            alert.type === 'error' ? 'bg-red-500/10 border-red-500/30' :
            alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
            'bg-blue-500/10 border-blue-500/30'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`font-bold ${
                  alert.type === 'error' ? 'text-red-400' :
                  alert.type === 'warning' ? 'text-yellow-400' :
                  'text-blue-400'
                }`}>{alert.title}</h3>
                <p className="text-gray-400 mt-1">{alert.description}</p>
              </div>
              <span className="text-gray-500 text-sm">{alert.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Settings Section Component
function SettingsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Configurações</h2>
      <div className="grid gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Configurações Gerais</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Notificações por Email</p>
                <p className="text-gray-400 text-sm">Receber alertas por email</p>
              </div>
              <button className="w-12 h-6 bg-primary-500 rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Notificações Push</p>
                <p className="text-gray-400 text-sm">Receber notificações no navegador</p>
              </div>
              <button className="w-12 h-6 bg-gray-600 rounded-full relative">
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Som de Alertas</p>
                <p className="text-gray-400 text-sm">Tocar som ao receber ticket</p>
              </div>
              <button className="w-12 h-6 bg-primary-500 rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Segurança</h3>
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition">
            Alterar Senha
          </button>
        </div>
      </div>
    </div>
  )
}
