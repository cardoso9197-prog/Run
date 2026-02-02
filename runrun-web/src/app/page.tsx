'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import DownloadSection from '@/components/DownloadSection'
import SupportChat from '@/components/SupportChat'
import Footer from '@/components/Footer'
import FAQ from '@/components/FAQ'
import HowItWorks from '@/components/HowItWorks'
import Stats from '@/components/Stats'

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Stats />
      <HowItWorks />
      <Features />
      <DownloadSection />
      <FAQ />
      <Footer />
      
      {/* Floating Support Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-500 hover:bg-primary-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40"
        aria-label="Open Support Chat"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Support Chat Modal */}
      <SupportChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </main>
  )
}
