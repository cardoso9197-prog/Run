'use client'

import { Users, Car, MapPin, Star } from 'lucide-react'

const stats = [
  { icon: Users, value: '1,000+', label: 'Usuários Registrados', color: 'bg-primary-500' },
  { icon: Car, value: '50+', label: 'Motoristas Ativos', color: 'bg-primary-600' },
  { icon: MapPin, value: '5,000+', label: 'Corridas Completadas', color: 'bg-primary-500' },
  { icon: Star, value: '4.8', label: 'Avaliação Média', color: 'bg-primary-600' },
]

export default function Stats() {
  return (
    <section className="py-12 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-primary-500/50 transition text-center"
            >
              <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
