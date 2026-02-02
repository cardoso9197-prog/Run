'use client'

import { Shield, Clock, MapPin, CreditCard, Star, Headphones } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Segurança Total',
    description: 'Todos os motoristas são verificados e as corridas são rastreadas em tempo real para sua segurança.',
    color: 'text-primary-500',
    bg: 'bg-primary-500/10',
  },
  {
    icon: Clock,
    title: '24/7 Disponível',
    description: 'Precisa de uma corrida às 3 da manhã? Estamos sempre disponíveis, a qualquer hora do dia ou da noite.',
    color: 'text-primary-500',
    bg: 'bg-primary-500/10',
  },
  {
    icon: MapPin,
    title: 'Rastreamento GPS',
    description: 'Acompanhe seu motorista em tempo real. Compartilhe sua localização com amigos e família.',
    color: 'text-primary-500',
    bg: 'bg-primary-500/10',
  },
  {
    icon: CreditCard,
    title: 'Pagamento Flexível',
    description: 'Pague com cartão, Orange Money ou MTN MoMo. Você escolhe a forma que preferir.',
    color: 'text-primary-500',
    bg: 'bg-primary-500/10',
  },
  {
    icon: Star,
    title: 'Preços Justos',
    description: 'Sem surpresas! Veja o preço antes de solicitar. Tarifas transparentes e competitivas.',
    color: 'text-primary-500',
    bg: 'bg-primary-500/10',
  },
  {
    icon: Headphones,
    title: 'Suporte 24/7',
    description: 'Nossa equipe de suporte está sempre pronta para ajudar. Chat ao vivo disponível no app e site.',
    color: 'text-primary-500',
    bg: 'bg-primary-500/10',
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Por que escolher <span className="text-primary-500">Run Run</span>?
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            O melhor serviço de transporte da Guiné-Bissau, projetado pensando em você
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:border-primary-500/50 transition group"
            >
              <div className={`w-14 h-14 ${feature.bg} border border-primary-500/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
