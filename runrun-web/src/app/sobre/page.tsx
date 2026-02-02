'use client'

import Image from 'next/image'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Target, 
  Eye, 
  Heart, 
  Users, 
  MapPin, 
  Award,
  Rocket,
  Shield,
  Clock
} from 'lucide-react'

const stats = [
  { value: '3,000+', label: 'Corridas Realizadas' },
  { value: '500+', label: 'Motoristas Parceiros' },
  { value: '50+', label: 'Usuários Ativos' },
  { value: '4.8', label: 'Avaliação Média' },
]

const values = [
  { 
    icon: Shield, 
    title: 'Segurança', 
    description: 'A segurança de nossos usuários é nossa prioridade número um.',
    color: 'text-blue-500 bg-blue-500/20'
  },
  { 
    icon: Heart, 
    title: 'Compromisso', 
    description: 'Comprometidos com a qualidade e satisfação em cada corrida.',
    color: 'text-red-500 bg-red-500/20'
  },
  { 
    icon: Users, 
    title: 'Comunidade', 
    description: 'Construindo uma comunidade forte de motoristas e passageiros.',
    color: 'text-green-500 bg-green-500/20'
  },
  { 
    icon: Rocket, 
    title: 'Inovação', 
    description: 'Sempre buscando novas formas de melhorar sua experiência.',
    color: 'text-purple-500 bg-purple-500/20'
  },
]

const timeline = [
  { year: '2025', title: 'Fundação', description: 'Run Run é fundada com a missão de revolucionar o transporte em Guiné-Bissau.' },
  { year: '2026', title: 'Lançamento Beta', description: 'Primeiras corridas realizadas em Bissau com motoristas selecionados.' },
  { year: '2026', title: 'Expansão', description: 'Mais de 500 motoristas parceiros e cobertura em toda a capital.' },
  { year: '2026', title: 'Consolidação', description: 'Líder de mercado com milhares de corridas diárias.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.png" alt="Run Run" width={40} height={40} className="rounded-full" />
            <span className="text-xl font-bold text-white">Run Run</span>
          </Link>
          <Link 
            href="/" 
            className="flex items-center text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500/20 to-black py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sobre a <span className="text-primary-500">Run Run</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Somos a primeira plataforma de transporte por aplicativo da Guiné-Bissau, 
            conectando passageiros a motoristas de forma segura, rápida e acessível.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-16">
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">{stat.value}</p>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
            <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-primary-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Nossa Missão</h2>
            <p className="text-gray-300 leading-relaxed">
              Democratizar o acesso ao transporte de qualidade na Guiné-Bissau, oferecendo 
              uma alternativa segura, confiável e acessível para todos. Queremos transformar 
              a forma como as pessoas se movem pela cidade, criando oportunidades de renda 
              para motoristas e conveniência para passageiros.
            </p>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
              <Eye className="w-7 h-7 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Nossa Visão</h2>
            <p className="text-gray-300 leading-relaxed">
              Ser a plataforma de mobilidade líder na África Ocidental, expandindo nossos 
              serviços para todas as cidades da Guiné-Bissau e países vizinhos. Sonhamos com 
              um futuro onde qualquer pessoa possa se locomover com segurança e praticidade, 
              contribuindo para o desenvolvimento econômico da região.
            </p>
          </div>
        </div>

        {/* Values */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Nossos Valores</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center hover:border-gray-600 transition">
                <div className={`w-14 h-14 ${value.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                <p className="text-gray-400 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Nossa História</h2>
          <div className="relative">
            {/* Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-700 hidden md:block" />
            
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 inline-block">
                      <span className="text-primary-500 font-bold text-lg">{item.year}</span>
                      <h3 className="text-xl font-bold text-white mt-2">{item.title}</h3>
                      <p className="text-gray-400 mt-2">{item.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-12 h-12 bg-primary-500 rounded-full items-center justify-center z-10">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-primary-500/20 to-gray-800 border border-gray-700 rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center mb-4">
                  <MapPin className="w-8 h-8 text-primary-500 mr-3" />
                  <h2 className="text-2xl font-bold text-white">Onde Estamos</h2>
                </div>
                <p className="text-gray-300 max-w-md">
                  Atualmente operamos em Bissau, a capital da Guiné-Bissau. 
                  Em breve expandiremos para outras cidades do país.
                </p>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center">
                <p className="text-4xl font-bold text-primary-500">🇬🇼</p>
                <p className="text-white font-bold mt-2">Guiné-Bissau</p>
                <p className="text-gray-400 text-sm">Bissau</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-12">
            <Award className="w-16 h-16 text-primary-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Faça Parte da Run Run</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Seja como passageiro ou motorista, junte-se a milhares de pessoas que já 
              confiam na Run Run para suas viagens diárias.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/#download"
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-bold transition"
              >
                Baixar Aplicativo
              </Link>
              <Link 
                href="/motorista"
                className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-xl font-bold transition"
              >
                Seja Motorista
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>© 2026 Run Run. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
