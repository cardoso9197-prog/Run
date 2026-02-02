'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Car, 
  DollarSign, 
  Clock, 
  Shield,
  CheckCircle,
  Upload,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  ArrowLeft,
  ArrowRight,
  Camera,
  X,
  ImageIcon
} from 'lucide-react'

const benefits = [
  { icon: DollarSign, title: 'Ganhe Dinheiro', description: 'Defina seus próprios horários e ganhe conforme trabalha' },
  { icon: Clock, title: 'Horário Flexível', description: 'Trabalhe quando quiser, sem compromissos fixos' },
  { icon: Shield, title: 'Segurança', description: 'Sistema de verificação e suporte 24 horas' },
  { icon: Car, title: 'Use seu Veículo', description: 'Trabalhe com seu próprio carro ou moto' },
]

const requirements = [
  'Ter mais de 21 anos',
  'Possuir CNH válida (categoria A ou B)',
  'Ter veículo em bom estado',
  'Seguro do veículo em dia',
  'Smartphone com acesso à internet',
  'Não ter antecedentes criminais',
]

interface UploadedFile {
  name: string
  preview: string
}

interface UploadedFiles {
  profilePhoto: UploadedFile | null
  licenseFont: UploadedFile | null
  licenseBack: UploadedFile | null
  vehicleDocument: UploadedFile | null
  insurance: UploadedFile | null
  criminalRecord: UploadedFile | null
  vehicleFront: UploadedFile | null
  vehicleBack: UploadedFile | null
  vehicleLeft: UploadedFile | null
  vehicleRight: UploadedFile | null
  vehicleInterior: UploadedFile | null
}

export default function DriverRegistrationPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    birthDate: '',
    address: '',
    city: '',
    vehicleType: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    vehiclePlate: '',
    vehicleColor: '',
    licenseNumber: '',
    licenseExpiry: '',
  })
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    profilePhoto: null,
    licenseFont: null,
    licenseBack: null,
    vehicleDocument: null,
    insurance: null,
    criminalRecord: null,
    vehicleFront: null,
    vehicleBack: null,
    vehicleLeft: null,
    vehicleRight: null,
    vehicleInterior: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentFileField, setCurrentFileField] = useState<keyof UploadedFiles | null>(null)

  const handleFileSelect = (field: keyof UploadedFiles) => {
    setCurrentFileField(field)
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && currentFileField) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedFiles(prev => ({
          ...prev,
          [currentFileField]: {
            name: file.name,
            preview: reader.result as string
          }
        }))
      }
      reader.readAsDataURL(file)
    }
    e.target.value = ''
  }

  const removeFile = (field: keyof UploadedFiles) => {
    setUploadedFiles(prev => ({
      ...prev,
      [field]: null
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
      return
    }
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setSubmitted(true)
  }

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
      <section className="bg-gradient-to-br from-primary-500/20 to-black py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Seja um <span className="text-primary-500">Motorista Run Run</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Ganhe dinheiro dirigindo na sua cidade. Cadastre-se agora e comece a fazer corridas!
          </p>
          
          {/* Benefits Grid */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 text-center">
                <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-primary-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {submitted ? (
          /* Success State */
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-12 text-center">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Cadastro Enviado!</h2>
            <p className="text-gray-400 text-lg mb-6 max-w-md mx-auto">
              Obrigado pelo seu interesse em ser motorista Run Run! Nossa equipe analisará seus documentos e entraremos em contato em até 48 horas.
            </p>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md mx-auto mb-8">
              <h3 className="text-white font-bold mb-4">Próximos Passos:</h3>
              <ul className="text-left space-y-3">
                <li className="flex items-start text-gray-400">
                  <span className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">1</span>
                  Análise de documentos (24-48h)
                </li>
                <li className="flex items-start text-gray-400">
                  <span className="w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">2</span>
                  Verificação de antecedentes
                </li>
                <li className="flex items-start text-gray-400">
                  <span className="w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">3</span>
                  Ativação da conta
                </li>
                <li className="flex items-start text-gray-400">
                  <span className="w-6 h-6 bg-gray-700 text-white rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">4</span>
                  Comece a fazer corridas!
                </li>
              </ul>
            </div>
            <Link 
              href="/"
              className="inline-flex items-center bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-bold transition"
            >
              Voltar para Home
            </Link>
          </div>
        ) : (
          /* Registration Form */
          <div className="grid md:grid-cols-3 gap-8">
            {/* Requirements Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 sticky top-6">
                <h3 className="text-lg font-bold text-white mb-4">Requisitos</h3>
                <ul className="space-y-3">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start text-gray-400 text-sm">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-2">
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        s < step ? 'bg-green-500 text-white' :
                        s === step ? 'bg-primary-500 text-white' :
                        'bg-gray-700 text-gray-400'
                      }`}>
                        {s < step ? <CheckCircle className="w-5 h-5" /> : s}
                      </div>
                      {s < 3 && (
                        <div className={`w-20 md:w-32 h-1 mx-2 ${
                          s < step ? 'bg-green-500' : 'bg-gray-700'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Step 1: Personal Info */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Dados Pessoais</h2>
                      
                      <div>
                        <label className="block text-gray-300 mb-2 font-medium">Nome Completo</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Seu nome completo"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-300 mb-2 font-medium">Email</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="seu@email.com"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2 font-medium">Telefone</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="+245 9XX XXX XXX"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-300 mb-2 font-medium">CPF/BI</label>
                          <input
                            type="text"
                            required
                            value={formData.cpf}
                            onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Número do documento"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2 font-medium">Data de Nascimento</label>
                          <input
                            type="date"
                            required
                            value={formData.birthDate}
                            onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-2 font-medium">Endereço</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            required
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Seu endereço completo"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Vehicle Info */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Dados do Veículo</h2>
                      
                      <div>
                        <label className="block text-gray-300 mb-2 font-medium">Tipo de Veículo</label>
                        <select
                          required
                          value={formData.vehicleType}
                          onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Selecione o tipo</option>
                          <option value="moto">Moto</option>
                          <option value="normal">Normal (Carro)</option>
                          <option value="premium">Premium</option>
                        </select>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-300 mb-2 font-medium">Marca</label>
                          <input
                            type="text"
                            required
                            value={formData.vehicleBrand}
                            onChange={(e) => setFormData({...formData, vehicleBrand: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Ex: Toyota"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2 font-medium">Modelo</label>
                          <input
                            type="text"
                            required
                            value={formData.vehicleModel}
                            onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Ex: Corolla"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-300 mb-2 font-medium">Ano</label>
                          <input
                            type="number"
                            required
                            min="2000"
                            max="2026"
                            value={formData.vehicleYear}
                            onChange={(e) => setFormData({...formData, vehicleYear: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Ex: 2020"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2 font-medium">Placa</label>
                          <input
                            type="text"
                            required
                            value={formData.vehiclePlate}
                            onChange={(e) => setFormData({...formData, vehiclePlate: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Ex: GB-1234-A"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Documents */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Documentos e Fotos</h2>
                      
                      {/* Hidden File Input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />

                      {/* License Information */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-300 mb-2 font-medium">Número da CNH</label>
                          <div className="relative">
                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              required
                              value={formData.licenseNumber}
                              onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                              className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="Número da licença"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2 font-medium">Validade da CNH</label>
                          <input
                            type="date"
                            required
                            value={formData.licenseExpiry}
                            onChange={(e) => setFormData({...formData, licenseExpiry: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Profile Photo */}
                      <div className="space-y-3">
                        <label className="block text-white font-bold text-lg">📸 Foto de Perfil do Motorista</label>
                        <p className="text-gray-400 text-sm">Envie uma foto clara do seu rosto (será exibida para passageiros)</p>
                        
                        <div 
                          onClick={() => handleFileSelect('profilePhoto')}
                          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition
                            ${uploadedFiles.profilePhoto 
                              ? 'border-green-500 bg-green-500/10' 
                              : 'border-gray-700 hover:border-primary-500 hover:bg-primary-500/5'}`}
                        >
                          {uploadedFiles.profilePhoto ? (
                            <div className="relative inline-block">
                              <img 
                                src={uploadedFiles.profilePhoto.preview} 
                                alt="Preview" 
                                className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-primary-500"
                              />
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeFile('profilePhoto'); }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <p className="mt-2 text-green-400 text-sm">✓ {uploadedFiles.profilePhoto.name}</p>
                            </div>
                          ) : (
                            <div className="py-4">
                              <Camera className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                              <p className="text-gray-400">Clique para fazer upload da sua foto</p>
                              <p className="text-gray-500 text-xs mt-1">JPG, PNG (máx. 5MB)</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Required Documents */}
                      <div className="space-y-4">
                        <label className="block text-white font-bold text-lg">📄 Documentos Obrigatórios</label>
                        
                        {/* CNH Front */}
                        <div 
                          onClick={() => handleFileSelect('licenseFont')}
                          className={`border-2 border-dashed rounded-xl p-4 cursor-pointer transition
                            ${uploadedFiles.licenseFont 
                              ? 'border-green-500 bg-green-500/10' 
                              : 'border-gray-700 hover:border-primary-500'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {uploadedFiles.licenseFont ? (
                                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                              ) : (
                                <Upload className="w-6 h-6 text-gray-400 mr-3" />
                              )}
                              <div>
                                <span className="text-gray-300 font-medium">CNH - Frente</span>
                                {uploadedFiles.licenseFont && (
                                  <p className="text-green-400 text-xs">{uploadedFiles.licenseFont.name}</p>
                                )}
                              </div>
                            </div>
                            {uploadedFiles.licenseFont ? (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeFile('licenseFont'); }}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                Remover
                              </button>
                            ) : (
                              <span className="text-primary-400 text-sm">Selecionar arquivo</span>
                            )}
                          </div>
                        </div>

                        {/* CNH Back */}
                        <div 
                          onClick={() => handleFileSelect('licenseBack')}
                          className={`border-2 border-dashed rounded-xl p-4 cursor-pointer transition
                            ${uploadedFiles.licenseBack 
                              ? 'border-green-500 bg-green-500/10' 
                              : 'border-gray-700 hover:border-primary-500'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {uploadedFiles.licenseBack ? (
                                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                              ) : (
                                <Upload className="w-6 h-6 text-gray-400 mr-3" />
                              )}
                              <div>
                                <span className="text-gray-300 font-medium">CNH - Verso</span>
                                {uploadedFiles.licenseBack && (
                                  <p className="text-green-400 text-xs">{uploadedFiles.licenseBack.name}</p>
                                )}
                              </div>
                            </div>
                            {uploadedFiles.licenseBack ? (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeFile('licenseBack'); }}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                Remover
                              </button>
                            ) : (
                              <span className="text-primary-400 text-sm">Selecionar arquivo</span>
                            )}
                          </div>
                        </div>

                        {/* Vehicle Document */}
                        <div 
                          onClick={() => handleFileSelect('vehicleDocument')}
                          className={`border-2 border-dashed rounded-xl p-4 cursor-pointer transition
                            ${uploadedFiles.vehicleDocument 
                              ? 'border-green-500 bg-green-500/10' 
                              : 'border-gray-700 hover:border-primary-500'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {uploadedFiles.vehicleDocument ? (
                                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                              ) : (
                                <Upload className="w-6 h-6 text-gray-400 mr-3" />
                              )}
                              <div>
                                <span className="text-gray-300 font-medium">Documento do Veículo (CRLV)</span>
                                {uploadedFiles.vehicleDocument && (
                                  <p className="text-green-400 text-xs">{uploadedFiles.vehicleDocument.name}</p>
                                )}
                              </div>
                            </div>
                            {uploadedFiles.vehicleDocument ? (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeFile('vehicleDocument'); }}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                Remover
                              </button>
                            ) : (
                              <span className="text-primary-400 text-sm">Selecionar arquivo</span>
                            )}
                          </div>
                        </div>

                        {/* Insurance */}
                        <div 
                          onClick={() => handleFileSelect('insurance')}
                          className={`border-2 border-dashed rounded-xl p-4 cursor-pointer transition
                            ${uploadedFiles.insurance 
                              ? 'border-green-500 bg-green-500/10' 
                              : 'border-gray-700 hover:border-primary-500'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {uploadedFiles.insurance ? (
                                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                              ) : (
                                <Upload className="w-6 h-6 text-gray-400 mr-3" />
                              )}
                              <div>
                                <span className="text-gray-300 font-medium">Comprovante de Seguro</span>
                                {uploadedFiles.insurance && (
                                  <p className="text-green-400 text-xs">{uploadedFiles.insurance.name}</p>
                                )}
                              </div>
                            </div>
                            {uploadedFiles.insurance ? (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeFile('insurance'); }}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                Remover
                              </button>
                            ) : (
                              <span className="text-primary-400 text-sm">Selecionar arquivo</span>
                            )}
                          </div>
                        </div>

                        {/* Criminal Record */}
                        <div 
                          onClick={() => handleFileSelect('criminalRecord')}
                          className={`border-2 border-dashed rounded-xl p-4 cursor-pointer transition
                            ${uploadedFiles.criminalRecord 
                              ? 'border-green-500 bg-green-500/10' 
                              : 'border-gray-700 hover:border-primary-500'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {uploadedFiles.criminalRecord ? (
                                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                              ) : (
                                <Upload className="w-6 h-6 text-gray-400 mr-3" />
                              )}
                              <div>
                                <span className="text-gray-300 font-medium">Certidão de Antecedentes Criminais</span>
                                {uploadedFiles.criminalRecord && (
                                  <p className="text-green-400 text-xs">{uploadedFiles.criminalRecord.name}</p>
                                )}
                              </div>
                            </div>
                            {uploadedFiles.criminalRecord ? (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeFile('criminalRecord'); }}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                Remover
                              </button>
                            ) : (
                              <span className="text-primary-400 text-sm">Selecionar arquivo</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Vehicle Photos */}
                      <div className="space-y-4">
                        <label className="block text-white font-bold text-lg">🚗 Fotos do Veículo</label>
                        <p className="text-gray-400 text-sm">Envie 4 fotos do seu veículo (obrigatório para aprovação)</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {/* Front */}
                          <div 
                            onClick={() => handleFileSelect('vehicleFront')}
                            className={`border-2 border-dashed rounded-xl p-4 cursor-pointer transition aspect-square flex flex-col items-center justify-center
                              ${uploadedFiles.vehicleFront 
                                ? 'border-green-500 bg-green-500/10' 
                                : 'border-gray-700 hover:border-primary-500'}`}
                          >
                            {uploadedFiles.vehicleFront ? (
                              <div className="relative w-full h-full">
                                <img 
                                  src={uploadedFiles.vehicleFront.preview} 
                                  alt="Frente" 
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); removeFile('vehicleFront'); }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                                <span className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded">Frente</span>
                              </div>
                            ) : (
                              <>
                                <ImageIcon className="w-8 h-8 text-gray-500 mb-2" />
                                <span className="text-gray-400 text-xs text-center">Frente</span>
                              </>
                            )}
                          </div>

                          {/* Back */}
                          <div 
                            onClick={() => handleFileSelect('vehicleBack')}
                            className={`border-2 border-dashed rounded-xl p-4 cursor-pointer transition aspect-square flex flex-col items-center justify-center
                              ${uploadedFiles.vehicleBack 
                                ? 'border-green-500 bg-green-500/10' 
                                : 'border-gray-700 hover:border-primary-500'}`}
                          >
                            {uploadedFiles.vehicleBack ? (
                              <div className="relative w-full h-full">
                                <img 
                                  src={uploadedFiles.vehicleBack.preview} 
                                  alt="Traseira" 
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); removeFile('vehicleBack'); }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                                <span className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded">Traseira</span>
                              </div>
                            ) : (
                              <>
                                <ImageIcon className="w-8 h-8 text-gray-500 mb-2" />
                                <span className="text-gray-400 text-xs text-center">Traseira</span>
                              </>
                            )}
                          </div>

                          {/* Left Side */}
                          <div 
                            onClick={() => handleFileSelect('vehicleLeft')}
                            className={`border-2 border-dashed rounded-xl p-4 cursor-pointer transition aspect-square flex flex-col items-center justify-center
                              ${uploadedFiles.vehicleLeft 
                                ? 'border-green-500 bg-green-500/10' 
                                : 'border-gray-700 hover:border-primary-500'}`}
                          >
                            {uploadedFiles.vehicleLeft ? (
                              <div className="relative w-full h-full">
                                <img 
                                  src={uploadedFiles.vehicleLeft.preview} 
                                  alt="Lado Esquerdo" 
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); removeFile('vehicleLeft'); }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                                <span className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded">Esquerda</span>
                              </div>
                            ) : (
                              <>
                                <ImageIcon className="w-8 h-8 text-gray-500 mb-2" />
                                <span className="text-gray-400 text-xs text-center">Lado Esquerdo</span>
                              </>
                            )}
                          </div>

                          {/* Right Side */}
                          <div 
                            onClick={() => handleFileSelect('vehicleRight')}
                            className={`border-2 border-dashed rounded-xl p-4 cursor-pointer transition aspect-square flex flex-col items-center justify-center
                              ${uploadedFiles.vehicleRight 
                                ? 'border-green-500 bg-green-500/10' 
                                : 'border-gray-700 hover:border-primary-500'}`}
                          >
                            {uploadedFiles.vehicleRight ? (
                              <div className="relative w-full h-full">
                                <img 
                                  src={uploadedFiles.vehicleRight.preview} 
                                  alt="Lado Direito" 
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); removeFile('vehicleRight'); }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                                <span className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded">Direita</span>
                              </div>
                            ) : (
                              <>
                                <ImageIcon className="w-8 h-8 text-gray-500 mb-2" />
                                <span className="text-gray-400 text-xs text-center">Lado Direito</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Optional Interior Photo */}
                        <div 
                          onClick={() => handleFileSelect('vehicleInterior')}
                          className={`border-2 border-dashed rounded-xl p-4 cursor-pointer transition
                            ${uploadedFiles.vehicleInterior 
                              ? 'border-green-500 bg-green-500/10' 
                              : 'border-gray-700 hover:border-primary-500'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {uploadedFiles.vehicleInterior ? (
                                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                              ) : (
                                <ImageIcon className="w-6 h-6 text-gray-400 mr-3" />
                              )}
                              <div>
                                <span className="text-gray-300 font-medium">Interior do Veículo (Opcional)</span>
                                {uploadedFiles.vehicleInterior && (
                                  <p className="text-green-400 text-xs">{uploadedFiles.vehicleInterior.name}</p>
                                )}
                              </div>
                            </div>
                            {uploadedFiles.vehicleInterior ? (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeFile('vehicleInterior'); }}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                Remover
                              </button>
                            ) : (
                              <span className="text-primary-400 text-sm">Selecionar arquivo</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Upload Progress Summary */}
                      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                        <h4 className="text-white font-medium mb-3">📋 Resumo do Upload</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            {uploadedFiles.profilePhoto ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-gray-600 mr-2" />
                            )}
                            <span className={uploadedFiles.profilePhoto ? 'text-green-400' : 'text-gray-400'}>Foto de Perfil</span>
                          </div>
                          <div className="flex items-center">
                            {uploadedFiles.licenseFont ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-gray-600 mr-2" />
                            )}
                            <span className={uploadedFiles.licenseFont ? 'text-green-400' : 'text-gray-400'}>CNH Frente</span>
                          </div>
                          <div className="flex items-center">
                            {uploadedFiles.licenseBack ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-gray-600 mr-2" />
                            )}
                            <span className={uploadedFiles.licenseBack ? 'text-green-400' : 'text-gray-400'}>CNH Verso</span>
                          </div>
                          <div className="flex items-center">
                            {uploadedFiles.vehicleDocument ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-gray-600 mr-2" />
                            )}
                            <span className={uploadedFiles.vehicleDocument ? 'text-green-400' : 'text-gray-400'}>Doc. Veículo</span>
                          </div>
                          <div className="flex items-center">
                            {uploadedFiles.insurance ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-gray-600 mr-2" />
                            )}
                            <span className={uploadedFiles.insurance ? 'text-green-400' : 'text-gray-400'}>Seguro</span>
                          </div>
                          <div className="flex items-center">
                            {uploadedFiles.criminalRecord ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-gray-600 mr-2" />
                            )}
                            <span className={uploadedFiles.criminalRecord ? 'text-green-400' : 'text-gray-400'}>Antecedentes</span>
                          </div>
                          <div className="flex items-center">
                            {uploadedFiles.vehicleFront && uploadedFiles.vehicleBack && uploadedFiles.vehicleLeft && uploadedFiles.vehicleRight ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-gray-600 mr-2" />
                            )}
                            <span className={uploadedFiles.vehicleFront && uploadedFiles.vehicleBack && uploadedFiles.vehicleLeft && uploadedFiles.vehicleRight ? 'text-green-400' : 'text-gray-400'}>4 Fotos Veículo</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                        <p className="text-yellow-400 text-sm">
                          <strong>⚠️ Importante:</strong> Todos os documentos devem estar legíveis e dentro da validade. 
                          As fotos do veículo devem mostrar claramente a condição do carro.
                          Documentos ilegíveis ou fotos inadequadas serão rejeitados.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="flex items-center px-6 py-3 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-600 transition"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Voltar
                      </button>
                    ) : (
                      <div />
                    )}
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center px-8 py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Enviando...
                        </>
                      ) : step < 3 ? (
                        <>
                          Próximo
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      ) : (
                        <>
                          Enviar Cadastro
                          <CheckCircle className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
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
