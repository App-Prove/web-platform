"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Example from "./components/example";
import { MagicCard } from "@/components/ui/magic-card";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import CalendlyWidget from "./components/calendly-widget";
import Link from "next/link";
import { Euratechnologie, CyberCampus } from "./components/logos";
import CalcomWidget from "./components/calcom-widget";
import { Compliance } from "./components/compliance";

function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        setMatches(media.matches);
    }, [query]);
    return matches;
}

export default function Home() {
  const scrollRef = useRef(null);
  const { scrollY } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"],
  });

  const isMobile = useMediaQuery('(max-width: 768px)'); 
  const y = useTransform(scrollY, [0, !isMobile ? 500 : 0], [0, !isMobile ? -250 : -50]);


  return (
    <div className="min-h-full px-2 sm:px-0 mb-24 w-full flex flex-col sm:gap-30 overflow-hidden sm:overflow-visible">
      <section className="text-center mt-32 sm:mt-24 flex relative flex-col gap-4">
        <h1 className="text-4xl font-medium z-10 ">N&apos;attendez plus pour sécuriser votre code</h1>
        <p className="text-lg text-muted-foreground z-10 text-center sm:px-0">Scan de votre codebase, identification des failles de sécurité et résolutions des bugs en quelques clics.</p>
        <div className="sm:mt-8 z-10 flex justify-center">
          <Link href="#book-call">
            <Button className="bg-primary text-white">Sécurisez maintenant</Button>
          </Link>
        </div>
        <motion.div
          className="relative w-fit h-[500px] overflow-hidden -translate-y-52 pointer-events-none transition-opacity duration-300 opacity-0"
          initial={{ y: 0 }}
          animate={{ y: -10, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 30,
            restDelta: 0.001
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10 pointer-events-none h-full w-full"></div>
          <motion.div style={{ y }}>
            <Image src="/hero.png" alt="App-Prove" width={1000} height={1000} />
          </motion.div>
        </motion.div>
      </section>

      <section className="flex flex-col gap-16 -mt-60 sm:mt-32 z-10" id="incubators">
        <h2 className="text-center text-2xl font-medium">Soutenu par des incubateurs de renommée internationale</h2>
        <div className="flex w-full justify-around">
          <Euratechnologie />
          <CyberCampus />
        </div>
      </section>

      <section className="flex flex-col gap-8 py-24" id="features">
        <div className="flex flex-col sm:flex-row sm:gap-24">
          <h2 className="text-left text-2xl font-medium w-full">Un processus d&apos;identification des failles de sécurité efficace</h2>
          <p className="text-left text-muted-foreground text-sm">App-Prove aide les entreprises, auditeurs et développeurs dans leur processus d&apos;audit cyber-securité, le rendant simple, rapide et assure une sécurité maximale</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 h-fit sm:h-48">
          <MagicCard className="flex h-48 items-center justify-center">
            <CardContent>
              Scan automatique de votre codebase
            </CardContent>
          </MagicCard>
          <MagicCard className="flex h-48 items-center justify-center">
            <CardContent>
              Identification des failles de sécurité
            </CardContent>
          </MagicCard>
          <MagicCard className="flex h-48 items-center justify-center">
            <CardContent>
              Résolutions des bugs en quelques clics
            </CardContent>
          </MagicCard>
        </div>
        <p className="text-sm text-muted-foreground">
          *Nous utilisons des modèles entrainés sur le code pour identifier toutes les failles de sécurité, puis dans une seconde étape faisons appel à des développeurs experimentés pour attester de la pertinence des recommendations
        </p>
      </section>

      <section className="flex flex-col gap-4 py-24" id="faq">
        <h2 className="text-center text-2xl font-medium">Questions & réponses</h2>
        <Accordion type="multiple"  className="w-full grid sm:grid-cols-2 gap-8">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left">
              À qui s&apos;adresse App-Prove ?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              App-Prove est un outil d&apos;audit de cybersécurité nouvelle génération, à destination des entreprises et cabinets d&apos;audit.
              <br />
              En mettant l&apos;intelligence artificielle au service de l&apos;humain, nous réduisons considérablement les temps d&apos;intervention et les coûts d&apos;un audit cyber, tout en augmentant leur efficacité.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left">
              Qui a accès à mon code informatique ?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Lorsque vous partagez votre codebase à App-Prove, uniquement nos algorithmes accèdent au code. Les auditeurs sont convoqués uniquement pour vérifier des parties de code. De plus, le code est réparti au sein des auditeurs, rendant ainsi toute reconstitution de la codebase impossible.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left">
            Comment fonctionne App-Prove ?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              App-Prove fonctionne en 4 étapes :
              <ul>
                <li>1. Le client connecte sa codebase (repo Git) ou télécharge un fichier .zip de son code.</li>
                <li>2. App-Prove analyse le code et identifie les failles de sécurité en utilisant des modèles d&apos;intelligence artificielle locale entraînés sur le code par MistralAI.</li>
                <li>3. App-Prove valide la pertinence des failles de sécurité en faisant appel à des développeurs expérimentés.</li>
                <li>4. Les résultats sont présentés dans une interface intuitive, avec des explications claires sur les failles de sécurité et des recommandations sur la manière de les corriger.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left">
              Combien cela coûte ?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {/* Add pricing information here */}
              Contactez-nous pour obtenir un devis personnalisé en fonction de vos besoins spécifiques.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="flex flex-col gap-4 py-24" id="compliance">
        <h2 className="text-center text-2xl font-medium">Respect des normes en vigueur</h2>
        <Compliance />
      </section>

      <section className="flex flex-col gap-4 py-24" id="book-call">
        <h2 className="text-center text-2xl font-medium">Prenez rendez-vous avec un expert</h2>
        <CalcomWidget />
      </section>
    </div>
  );
}
