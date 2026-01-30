'use client'

import { useState } from 'react'
import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import { Smartphone, Download, Apple, Play } from 'lucide-react'

// App download URLs - Updated January 30, 2026 with latest production builds
const APP_URLS = {
  passenger: {
    android: 'https://expo.dev/accounts/edipro/projects/runrun-passenger/builds/832240a1-38e4-423b-a7d9-21c14040b79f',
    ios: 'https://expo.dev/accounts/edipro/projects/runrun-passenger/builds/2a9b4c70-88d2-4eb6-9afe-907c825f684f',
  },
  driver: {
    android: 'https://expo.dev/accounts/edipro/projects/runrun-driver/builds/d1fcaf68-a08b-4baf-bac8-7235e5b5ab40',
    ios: 'https://expo.dev/accounts/edipro/projects/runrun-driver/builds/5484669a-8d5f-4406-92b1-e4a7c28be80b',
  },
}

export default function DownloadSection() {
  const [selectedApp, setSelectedApp] = useState<'passenger' | 'driver'>('passenger')
  const [selectedPlatform, setSelectedPlatform] = useState<'android' | 'ios'>('android')

  const currentUrl = APP_URLS[selectedApp][selectedPlatform]

  return (
    <section id="download" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Baixe o <span className="text-primary-500">App</span> Agora
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Última versão com autenticação corrigida, reserva de corridas otimizada e integração completa com backend Railway. Disponível para Android e iOS.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - App Selection */}
          <div>
            {/* App Type Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-800 rounded-full p-1 flex border border-gray-700">
                <button
                  onClick={() => setSelectedApp('passenger')}
                  className={`px-6 py-3 rounded-full font-semibold transition ${
                    selectedApp === 'passenger'
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  🚶 Passageiro
                </button>
                <button
                  onClick={() => setSelectedApp('driver')}
                  className={`px-6 py-3 rounded-full font-semibold transition ${
                    selectedApp === 'driver'
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  🚗 Motorista
                </button>
              </div>
            </div>

            {/* App Info Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 text-white border border-gray-700">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mr-4 border border-gray-700 overflow-hidden">
                  <Image src="/logo.png" alt="Run Run" width={60} height={60} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    Run Run <span className="text-primary-500">{selectedApp === 'passenger' ? 'Passageiro' : 'Motorista'}</span>
                  </h3>
                  <p className="text-gray-400">Versão 1.0</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6">
                {selectedApp === 'passenger'
                  ? 'Solicite corridas, acompanhe em tempo real, pague com Orange Money ou MTN Momo. Sistema de reservas otimizado para melhor experiência!'
                  : 'Ganhe dinheiro sendo seu próprio patrão. Sistema de corridas em tempo real, retiradas via Orange Money. Comece a faturar hoje!'}
              </p>

              <div className="flex flex-wrap gap-3">
                <span className="bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full text-sm text-green-400">
                  ✓ Login Corrigido
                </span>
                <span className="bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full text-sm text-green-400">
                  ✓ Reservas Otimizadas
                </span>
                <span className="bg-primary-500/20 border border-primary-500/30 px-3 py-1 rounded-full text-sm text-primary-400">
                  ✓ GPS em Tempo Real
                </span>
                <span className="bg-primary-500/20 border border-primary-500/30 px-3 py-1 rounded-full text-sm text-primary-400">
                  ✓ Pagamento Mobile
                </span>
                <span className="bg-primary-500/20 border border-primary-500/30 px-3 py-1 rounded-full text-sm text-primary-400">
                  ✓ Suporte 24/7
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - QR Code & Download */}
          <div className="text-center">
            {/* Platform Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-800 rounded-full p-1 flex border border-gray-700">
                <button
                  onClick={() => setSelectedPlatform('android')}
                  className={`flex items-center px-6 py-3 rounded-full font-semibold transition ${
                    selectedPlatform === 'android'
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Android
                </button>
                <button
                  onClick={() => setSelectedPlatform('ios')}
                  className={`flex items-center px-6 py-3 rounded-full font-semibold transition ${
                    selectedPlatform === 'ios'
                      ? 'bg-gray-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Apple className="w-5 h-5 mr-2" />
                  iOS
                </button>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-gray-800 rounded-3xl p-8 shadow-xl inline-block mb-8 border border-gray-700">
              <div className="bg-white rounded-2xl p-4">
                <QRCodeSVG
                  value={currentUrl}
                  size={200}
                  level="H"
                  includeMargin={true}
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </div>
              <p className="text-sm text-gray-400 mt-4">
                Escaneie para baixar
              </p>
            </div>

            {/* Download Button */}
            <div>
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 rounded-full font-bold text-lg transition hover:scale-105 bg-primary-500 hover:bg-primary-600 text-white"
              >
                <Download className="w-6 h-6 mr-2" />
                Baixar para {selectedPlatform === 'android' ? 'Android' : 'iOS'}
              </a>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              {selectedPlatform === 'android' 
                ? 'Arquivo APK - Instale diretamente no seu dispositivo' 
                : 'Arquivo IPA - Para iOS Simulator ou TestFlight'}
            </p>
          </div>
        </div>

        {/* All Download Links */}
        <div className="mt-16 pt-16 border-t border-gray-800">
          <h3 className="text-xl font-bold text-center mb-8 text-white">
            Links Diretos para Download
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Passenger Downloads */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h4 className="font-bold text-lg mb-4 flex items-center text-white">
                <span className="text-2xl mr-2">🚶</span>
                App Passageiro
              </h4>
              <div className="space-y-3">
                <a
                  href={APP_URLS.passenger.android}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-900 rounded-xl hover:bg-gray-700 transition border border-gray-700"
                >
                  <span className="flex items-center text-white">
                    <Play className="w-5 h-5 text-primary-500 mr-2" />
                    Android (APK)
                  </span>
                  <Download className="w-5 h-5 text-gray-400" />
                </a>
                <a
                  href={APP_URLS.passenger.ios}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-900 rounded-xl hover:bg-gray-700 transition border border-gray-700"
                >
                  <span className="flex items-center text-white">
                    <Apple className="w-5 h-5 text-gray-300 mr-2" />
                    iOS (Simulator)
                  </span>
                  <Download className="w-5 h-5 text-gray-400" />
                </a>
              </div>
            </div>

            {/* Driver Downloads */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h4 className="font-bold text-lg mb-4 flex items-center text-white">
                <span className="text-2xl mr-2">🚗</span>
                App Motorista
              </h4>
              <div className="space-y-3">
                <a
                  href={APP_URLS.driver.android}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-900 rounded-xl hover:bg-gray-700 transition border border-gray-700"
                >
                  <span className="flex items-center text-white">
                    <Play className="w-5 h-5 text-primary-500 mr-2" />
                    Android (APK)
                  </span>
                  <Download className="w-5 h-5 text-gray-400" />
                </a>
                <a
                  href={APP_URLS.driver.ios}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-900 rounded-xl hover:bg-gray-700 transition border border-gray-700"
                >
                  <span className="flex items-center text-white">
                    <Apple className="w-5 h-5 text-gray-300 mr-2" />
                    iOS (Simulator)
                  </span>
                  <Download className="w-5 h-5 text-gray-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
