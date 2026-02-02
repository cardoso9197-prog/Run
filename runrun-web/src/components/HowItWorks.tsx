'use client'

import { Smartphone, MapPin, Car, CreditCard } from 'lucide-react'

const steps = [
  {
    icon: Smartphone,
    title: 'Baixe o App',
    description: 'Disponível para Android e iOS. Faça o download gratuito e crie sua conta em segundos.',
    color: 'bg-primary-500',
  },
  {
    icon: MapPin,
    title: 'Defina seu Destino',
    description: 'Digite para onde quer ir. Nosso sistema mostrará o preço estimado instantaneamente.',
    color: 'bg-primary-600',
  },
  {
    icon: Car,
    title: 'Aguarde o Motorista',
    description: 'Um motorista próximo aceitará sua corrida. Acompanhe em tempo real no mapa.',
    color: 'bg-primary-500',
  },
  {
    icon: CreditCard,
    title: 'Pague com Facilidade',
    description: 'Pague com cartão ou pelo app. Simples, rápido e seguro.',
    color: 'bg-primary-600',
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Como <span className="text-primary-500">Funciona</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Em apenas 4 passos simples, você pode solicitar uma corrida e chegar ao seu destino
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gray-700">
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-r-2 border-primary-500 rotate-45"></div>
                </div>
              )}
              
              <div className="text-center relative z-10">
                {/* Step Number */}
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
