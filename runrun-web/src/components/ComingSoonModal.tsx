'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-primary-500 rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          aria-label="Fechar"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center border-2 border-primary-500">
            <span className="text-5xl">📱</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-4">
          Em Breve Disponível! 🚀
        </h2>

        {/* Message */}
        <div className="text-center space-y-4 mb-8">
          <p className="text-lg text-gray-300">
            App estará brevemente disponível em <span className="font-semibold text-primary-500">Apple Store</span> e <span className="font-semibold text-primary-500">Play Store</span> para baixar.
          </p>
          <p className="text-gray-400">
            Volte mais logo! 🎉
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Contact Info */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
          <p className="text-sm text-gray-400 mb-4 text-center">
            Para mais informação contacte:
          </p>
          
          <div className="space-y-3">
            <div className="text-center">
              <p className="font-bold text-lg text-white">Edivaldo Cardoso</p>
              <p className="text-sm text-primary-400">Programador Líder & Fundador</p>
              <p className="text-sm text-gray-400">Run-Run Guiné-Bissau</p>
            </div>

            <a 
              href="tel:+245955971275"
              className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition"
            >
              <span>📞</span>
              <span>+245 955 971 275</span>
            </a>

            <a 
              href="mailto:suporte@runrungb.com"
              className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition"
            >
              <span>✉️</span>
              <span>suporte@runrungb.com</span>
            </a>
          </div>
        </div>

        {/* Close button at bottom */}
        <button
          onClick={onClose}
          className="w-full mt-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}
