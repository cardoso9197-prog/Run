'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer id="suporte" className="bg-black text-white border-t border-gray-800">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Image src="/logo.png" alt="Run Run" width={45} height={45} className="rounded-full" />
              <span className="text-2xl font-bold">
                Run <span className="text-primary-500">Run</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              O primeiro serviço de transporte por aplicativo da Guiné-Bissau. 
              Conectando passageiros e motoristas de forma segura e eficiente.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-500 rounded-full flex items-center justify-center transition border border-gray-700 hover:border-primary-500">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-500 rounded-full flex items-center justify-center transition border border-gray-700 hover:border-primary-500">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-500 rounded-full flex items-center justify-center transition border border-gray-700 hover:border-primary-500">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-500 rounded-full flex items-center justify-center transition border border-gray-700 hover:border-primary-500">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/sobre" className="text-gray-400 hover:text-white transition">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="#como-funciona" className="text-gray-400 hover:text-white transition">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="#download" className="text-gray-400 hover:text-white transition">
                  Baixar App
                </Link>
              </li>
              <li>
                <Link href="/motorista" className="text-gray-400 hover:text-white transition">
                  Seja Motorista
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-gray-400 hover:text-white transition">
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-400 hover:text-white transition">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* For Drivers */}
          <div>
            <h4 className="text-lg font-bold mb-6">Para Motoristas</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/motorista" className="text-gray-400 hover:text-white transition">
                  Como se Cadastrar
                </Link>
              </li>
              <li>
                <Link href="/motorista#requisitos" className="text-gray-400 hover:text-white transition">
                  Requisitos
                </Link>
              </li>
              <li>
                <Link href="/motorista#ganhos" className="text-gray-400 hover:text-white transition">
                  Quanto Posso Ganhar
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-gray-400 hover:text-white transition">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-gray-400 hover:text-white transition">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contato 24/7</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+245966084539" className="flex items-center text-gray-400 hover:text-white transition">
                  <Phone className="w-5 h-5 mr-3 text-primary-500" />
                  +245 966 084 539
                </a>
              </li>
              <li>
                <a href="tel:+245957338295" className="flex items-center text-gray-400 hover:text-white transition">
                  <Phone className="w-5 h-5 mr-3 text-primary-500" />
                  +245 957 338 295
                </a>
              </li>
              <li>
                <a href="mailto:suporte@runrungb.com" className="flex items-center text-gray-400 hover:text-white transition">
                  <Mail className="w-5 h-5 mr-3 text-primary-500" />
                  suporte@runrungb.com
                </a>
              </li>
              <li>
                <div className="flex items-start text-gray-400">
                  <MapPin className="w-5 h-5 mr-3 text-primary-500 flex-shrink-0 mt-0.5" />
                  <span>Bissau, Guiné-Bissau</span>
                </div>
              </li>
            </ul>

            {/* Support Hours */}
            <div className="mt-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
              <div className="flex items-center text-primary-500 mb-2">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></span>
                Suporte Online
              </div>
              <p className="text-sm text-gray-400">
                Disponível 24 horas por dia, 7 dias por semana
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Run Run. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-sm">
              Feito com ❤️ em Guiné-Bissau 🇬🇼
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
