'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/logo.png" 
              alt="Run Run Logo" 
              width={45} 
              height={45}
              className="rounded-full"
            />
            <span className="text-2xl font-bold text-white">
              Run <span className="text-primary-500">Run</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/sobre" className="text-gray-300 hover:text-primary-500 transition">
              Sobre
            </Link>
            <Link href="#como-funciona" className="text-gray-300 hover:text-primary-500 transition">
              Como Funciona
            </Link>
            <Link href="#download" className="text-gray-300 hover:text-primary-500 transition">
              Download
            </Link>
            <Link href="/contato" className="text-gray-300 hover:text-primary-500 transition">
              Contato
            </Link>
            <Link href="/motorista" className="text-gray-300 hover:text-primary-500 transition">
              Seja Motorista
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex flex-col">
              <a href="tel:+245966084539" className="flex items-center text-gray-300 hover:text-primary-500">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-sm">+245 966 084 539</span>
              </a>
              <a href="tel:+245957338295" className="flex items-center text-gray-300 hover:text-primary-500 mt-1">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-sm">+245 957 338 295</span>
              </a>
            </div>
            <Link
              href="#download"
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-full font-semibold transition"
            >
              Baixar App
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fadeIn bg-black/95">
            <nav className="flex flex-col space-y-4">
              <Link href="/sobre" className="text-gray-300 hover:text-primary-500 transition py-2">
                Sobre
              </Link>
              <Link href="#como-funciona" className="text-gray-300 hover:text-primary-500 transition py-2">
                Como Funciona
              </Link>
              <Link href="#download" className="text-gray-300 hover:text-primary-500 transition py-2">
                Download
              </Link>
              <Link href="/contato" className="text-gray-300 hover:text-primary-500 transition py-2">
                Contato
              </Link>
              <Link href="/motorista" className="text-gray-300 hover:text-primary-500 transition py-2">
                Seja Motorista
              </Link>
              <Link
                href="#download"
                className="bg-primary-500 text-white px-6 py-3 rounded-full font-semibold text-center"
              >
                Baixar App
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
