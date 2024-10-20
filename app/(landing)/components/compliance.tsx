'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { CheckMark } from './logos'
import { motion, AnimatePresence } from 'framer-motion'

const standards = [
  {
    name: 'RGPD',
    icon: '/rgpd-logo.png?height=40&width=40',
    explanation: `Le non-respect du Règlement Général sur la Protection des Données (RGPD) peut entraîner des sanctions financières très élevées, pouvant atteindre 20 millions d'euros ou 4 % du chiffre d'affaires annuel mondial, selon le montant le plus élevé.

Ces sanctions sont déterminées en fonction de la gravité de la violation, de la durée de l'infraction et du degré de coopération avec les autorités. Les entreprises qui ne respectent pas ces obligations risquent également de perdre la confiance de leurs clients, impactant ainsi leur réputation et leurs activités.

Composants clés du RGPD :

• Consentement explicite : Les entreprises doivent obtenir un consentement clair et informé avant de traiter des données personnelles.

• Droit à l'oubli : Les individus peuvent demander la suppression de leurs données personnelles.

• Portabilité des données : Les utilisateurs peuvent demander à recevoir leurs données personnelles dans un format structuré et transférable.

• Responsabilité des entreprises : Elles doivent assurer la protection des données par défaut et mettre en place des mesures de sécurité appropriées.

• Notification des violations : Les organisations doivent informer les autorités et les personnes concernées en cas de violation de données dans les 72 heures.`
  },
  {
    name: 'HIPAA',
    icon: '/hipaa-logo.png?height=40&width=40',
    explanation: `HIPAA (Health Insurance Portability and Accountability Act) est une loi américaine qui protège la confidentialité et la sécurité des informations de santé. Le non-respect de HIPAA peut entraîner des sanctions civiles et pénales importantes.

Composants clés de HIPAA :

• Règle de confidentialité : Protège la confidentialité des informations de santé identifiables.

• Règle de sécurité : Exige des mesures de sécurité pour protéger les informations de santé électroniques.

• Règle d'application : Définit les procédures d'enquête et les sanctions en cas de violation.

• Règle de notification de violation : Exige la notification des patients en cas de violation de leurs informations de santé.`
  },
  {
    name: 'SOC 2',
    icon: '/soc-logo.png?height=40&width=40',
    explanation: `SOC 2 (Service Organization Control 2) est un cadre d'audit volontaire développé par l'AICPA. Il évalue les contrôles d'une organisation en matière de sécurité, disponibilité, intégrité de traitement, confidentialité et protection de la vie privée.

Principes clés de SOC 2 :

• Sécurité : Protection contre les accès non autorisés.

• Disponibilité : Accessibilité du système pour les opérations.

• Intégrité de traitement : Traitement précis, complet et autorisé.

• Confidentialité : Protection des informations sensibles.

• Protection de la vie privée : Collecte, utilisation, conservation et divulgation des informations personnelles conformément aux engagements de l'organisation.`
  },
]

export function Compliance() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const handleStandardClick = (index: number) => {
    setActiveIndex(prevIndex => prevIndex === index ? null : index)
  }

  return (
    <div className="text-white w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-around mb-8">
        {standards.map((standard, index) => (
          <div
            key={standard.name}
            className="cursor-pointer transition-transform duration-300 hover:scale-110 flex flex-col items-center"
            onClick={() => handleStandardClick(index)}
          >
            <Image 
              src={standard.icon} 
              alt={`${standard.name} icon`} 
              width={80} 
              height={80} 
              className="w-16 h-16 sm:w-20 sm:h-20"
            />
            <div className="flex items-center mt-2 space-x-2">
              <p className="text-center text-sm sm:text-base">{standard.name}</p>
              <CheckMark className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {activeIndex !== null && (
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 p-4 sm:p-6 rounded-lg mt-4"
          >
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-semibold mb-4"
            >
              {standards[activeIndex].name}
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm leading-relaxed whitespace-pre-wrap"
            >
              {standards[activeIndex].explanation}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
