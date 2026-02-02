'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Clock, Shield } from 'lucide-react'

export default function Hero() {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <div className="inline-flex items-center bg-primary-500/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-primary-500/30">
              <span className="animate-pulse-slow w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
              <span className="text-sm font-medium text-primary-400">Run Run Primeiro em Guiné-Bissau!</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Sua corrida está a um{' '}
              <span className="text-primary-500">toque</span> de distância
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg">
              O primeiro serviço de transporte por aplicativo da Guiné-Bissau. 
              Seguro, rápido e confiável. Disponível 24 horas por dia.
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary-500/20 border border-primary-500/30 rounded-full flex items-center justify-center mb-2">
                  <MapPin className="w-6 h-6 text-primary-500" />
                </div>
                <span className="text-sm text-gray-300">GPS em Tempo Real</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary-500/20 border border-primary-500/30 rounded-full flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 text-primary-500" />
                </div>
                <span className="text-sm text-gray-300">24/7 Disponível</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary-500/20 border border-primary-500/30 rounded-full flex items-center justify-center mb-2">
                  <Shield className="w-6 h-6 text-primary-500" />
                </div>
                <span className="text-sm text-gray-300">100% Seguro</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#download"
                className="inline-flex items-center justify-center bg-primary-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary-600 transition group"
              >
                Baixar Agora
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/driver"
                className="inline-flex items-center justify-center border-2 border-primary-500 text-primary-500 px-8 py-4 rounded-full font-bold text-lg hover:bg-primary-500/10 transition"
              >
                Seja Motorista
              </Link>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div className="relative hidden md:block">
            <div className="relative z-10">
              {/* Logo Display */}
              <div className="flex justify-center mb-8">
                <Image 
                  src="/logo.png" 
                  alt="Run Run Logo" 
                  width={200} 
                  height={200}
                  className="drop-shadow-2xl"
                />
              </div>
              {/* Phone Frame */}
              <div className="bg-gray-800 rounded-[3rem] p-3 shadow-2xl mx-auto w-72 border border-gray-700">
                <div className="bg-gray-900 rounded-[2.5rem] overflow-hidden">
                  {/* Phone Screen */}
                  <div className="h-[500px] bg-gradient-to-b from-gray-900 to-black p-4">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs text-gray-400">9:41</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-2 bg-gray-600 rounded-sm"></div>
                        <div className="w-4 h-2 bg-gray-600 rounded-sm"></div>
                        <div className="w-6 h-3 bg-primary-500 rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* App Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-gray-400 text-sm">Olá, 👋</p>
                        <p className="font-bold text-lg text-white">Bem-vindo!</p>
                      </div>
                      <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-full" />
                    </div>

                    {/* Search Bar */}
                    <div className="bg-gray-800 rounded-xl p-4 mb-4 border border-gray-700">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                        <span className="text-gray-400 text-sm">Para onde você quer ir?</span>
                      </div>
                    </div>

                    {/* Map Placeholder */}
                    <div className="bg-gray-800 rounded-xl h-48 mb-4 relative overflow-hidden border border-gray-700">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center animate-pulse">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center">
                        <span className="text-2xl mb-1 block">🏍️</span>
                        <span className="text-xs font-medium text-gray-300">Moto</span>
                      </div>
                      <div className="bg-primary-500/20 border border-primary-500/30 rounded-xl p-3 text-center">
                        <span className="text-2xl mb-1 block">🚗</span>
                        <span className="text-xs font-medium text-white">Normal</span>
                      </div>
                      <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center">
                        <span className="text-2xl mb-1 block">✨</span>
                        <span className="text-xs font-medium text-gray-300">Premium</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 -right-10 w-40 h-40 bg-primary-500/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 -left-10 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
