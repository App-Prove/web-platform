'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
const standards = [
  {
    name: 'RGPD',
    icon: '/rgpd.png?height=40&width=40',
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
    icon: '/hipaa.png?height=40&width=40',
    explanation: `HIPAA (Health Insurance Portability and Accountability Act) est une loi américaine qui protège la confidentialité et la sécurité des informations de santé. Le non-respect de HIPAA peut entraîner des sanctions civiles et pénales importantes.

Composants clés de HIPAA :

• Règle de confidentialité : Protège la confidentialité des informations de santé identifiables.

• Règle de sécurité : Exige des mesures de sécurité pour protéger les informations de santé électroniques.

• Règle d'application : Définit les procédures d'enquête et les sanctions en cas de violation.

• Règle de notification de violation : Exige la notification des patients en cas de violation de leurs informations de santé.`
  },
  {
    name: 'SOC 2',
    icon: '/soc.png?height=40&width=40',
    explanation: `SOC 2 (Service Organization Control 2) est un cadre d'audit volontaire développé par l'AICPA. Il évalue les contrôles d'une organisation en matière de sécurité, disponibilité, intégrité de traitement, confidentialité et protection de la vie privée.

Principes clés de SOC 2 :

• Sécurité : Protection contre les accès non autorisés.

• Disponibilité : Accessibilité du système pour les opérations.

• Intégrité de traitement : Traitement précis, complet et autorisé.

• Confidentialité : Protection des informations sensibles.

• Protection de la vie privée : Collecte, utilisation, conservation et divulgation des informations personnelles conformément aux engagements de l'organisation.`
  },
]

function CheckMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.26955 1.74712C8.47309 1.57372 8.73173 1.47849 8.99911 1.47849C9.2665 1.47849 9.52514 1.57372 9.72867 1.74712L11.1327 2.94299C11.3131 3.09686 11.5375 3.18979 11.7739 3.20849L13.6122 3.35474C13.8788 3.37612 14.1292 3.49182 14.3182 3.68109C14.5073 3.87036 14.6227 4.1208 14.6438 4.38749L14.7901 6.22574C14.8088 6.46213 14.9017 6.68657 15.0556 6.86699L16.2526 8.26987C16.4262 8.47348 16.5217 8.73236 16.5217 8.99999C16.5217 9.26763 16.4262 9.5265 16.2526 9.73012L15.0556 11.1341C14.9022 11.3143 14.8097 11.5384 14.7912 11.7742L14.6449 13.6125C14.6238 13.8794 14.5082 14.13 14.3189 14.3192C14.1296 14.5085 13.879 14.6241 13.6122 14.6452L11.7728 14.7915C11.5368 14.8104 11.3128 14.9033 11.1327 15.057L9.72867 16.2529C9.52514 16.4263 9.2665 16.5215 8.99911 16.5215C8.73173 16.5215 8.47309 16.4263 8.26955 16.2529L6.86555 15.057C6.68512 14.9031 6.46069 14.8102 6.2243 14.7915L4.38605 14.6452C4.11938 14.6239 3.86906 14.5082 3.68 14.3189C3.49094 14.1296 3.37551 13.8792 3.35443 13.6125L3.20818 11.7742C3.18947 11.5379 3.09655 11.3134 2.94268 11.133L1.74568 9.73124C1.57198 9.52763 1.47656 9.26876 1.47656 9.00112C1.47656 8.73348 1.57198 8.47461 1.74568 8.27099L2.94268 6.86699C3.09633 6.68687 3.18924 6.46286 3.20818 6.22687L3.35443 4.38862C3.37576 4.12213 3.4913 3.87195 3.68034 3.68291C3.86938 3.49387 4.11956 3.37833 4.38605 3.35699L6.22543 3.21074C6.46155 3.19149 6.68557 3.09818 6.86555 2.94412L8.26955 1.74824V1.74712Z" fill="#C9C9C9" />
      <path d="M6.46875 9L8.15625 10.6875L11.5312 7.3125" stroke="black" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Compliance() {
  const [activeIndex, setActiveIndex] = useState(0)

  const goToNextStandard = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % standards.length)
  }, [])

  const handleStandardClick = (index: number) => {
    setActiveIndex(index)
  }


  return (
    <div className="text-white rounded-lg overflow-hidden">
      <div className="space-y-4">
        {standards.map((standard, index) => (
          <div
            key={standard.name}
            className={`flex items-start px-8 py-6 rounded transition-all duration-500 ease-in-out cursor-pointer  ${
              index === activeIndex ? 'bg-gray-800 scale-105' : 'bg-gray-900 scale-100 hover:bg-gray-850'
            }`}
            onClick={() => handleStandardClick(index)}
          >
            <div className="flex items-center space-x-4 w-1/3">
              <Image src={standard.icon} alt={`${standard.name} icon`} width={80} height={80} className="w-16 h-16 sm:w-20 sm:h-20" />
              <span className="text-lg font-semibold">{standard.name}</span>
              <CheckMark />
            </div>
            <div className={`w-2/3 transition-all duration-500 ease-in-out ${
              index === activeIndex ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0'
            }`}>
              <div className="text-sm leading-relaxed whitespace-pre-wrap hidden sm:block">
                {standard.explanation}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
