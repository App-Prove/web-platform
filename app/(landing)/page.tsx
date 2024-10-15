"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Compliance from "./components/compliance";
import Image from "next/image";
import Example from "./components/example";
import { MagicCard } from "@/components/ui/magic-card";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import CalendlyWidget from "./components/calendly-widget";
import Link from "next/link";
import { Euratechnologie, CyberCampus } from "./components/logos";

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
    <div className="min-h-full px-2 sm:px-0 mb-24 w-full flex flex-col gap-60 overflow-hidden sm:overflow-visible">
      <section className="mt-32 sm:mt-24 flex relative flex-col gap-4">
        <h1 className="text-4xl font-medium z-10 hidden sm:block">Cabinet d&apos;audit nouvelle génération, <br />pour les entreprises innovantes</h1>
        <h1 className="text-4xl font-semibold z-10 block sm:hidden text-center">Sécurisez votre code <strong className="text-orange">rapidement</strong></h1>
        <p className="text-lg text-muted-foreground z-10 text-center md:text-left sm:px-0 hidden sm:block">Scan de votre codebase, identification des failles de sécurité et résolutions des bugs en quelques clics.</p>
        <p className="font-medium text-muted-foreground z-10 text-center md:text-left sm:px-0 block sm:hidden">App-Prove est un cabinet d&apos;audit,<br /> spécialisé dans la cyber-sécurité, <br /> pour les entreprises innovantes.</p>
        <div className="mt-4 z-10 flex justify-center sm:justify-start">
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

      <section className="flex flex-col gap-16 -mt-60" id="incubators">
        <h2 className="text-center text-2xl font-medium">Accompagnés par des incubateurs de renommée internationale</h2>
        <div className="flex w-full justify-around">
          <Euratechnologie />
          <CyberCampus />
        </div>
      </section>

      <section className="flex flex-col gap-8 py-24" id="features">
        <div className="flex flex-col sm:flex-row sm:gap-24">
          <h2 className="text-left text-2xl font-medium w-full">Un processus d&apos;identification des failles de sécurité efficace</h2>
          <p className="text-left text-muted-foreground text-sm">App-Prove aide les entreprises et développeurs dans leur processus d&apos;audit cyber-securité, le rendant simple, rapide et assure une sécurité maximale</p>
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
        <Accordion type="multiple" defaultValue={["item-1", "item-2"]} className="w-full grid sm:grid-cols-2 gap-8">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left">
              Quelle est la différence avec un cabinet d&apos;audit ?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              App-Prove est un cabinet nouvelle génération offrant à ses auditeurs et ses clients, les outils pour rendre l&apos;audit simple, rapide et respectant les normes du secteur.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left">
              Qui sont les auditeurs chez App-Prove ?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              App-Prove fait appel à des développeurs freelance sélectionnés pour leurs compétences en développement informatique, et formés à l&apos;audit de cyber-sécurité. Dans une démarche d&apos;ouverture de l&apos;audit à tous, nous permettons à n&apos;importe quel développeur de s&apos;inscrire sur la plateforme, et passer les tests pour être recruté par App-Prove.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left">
              Qui a accès à mon code informatique ?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Lorsque vous partagez votre codebase à App-Prove, uniquement nos algorithmes accèdent au code. Les auditeurs sont convoqués uniquement pour vérifier des parties de code. De plus, le code est réparti au sein des auditeurs, rendant ainsi toute reconstitution de la codebase impossible.
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
        <CalendlyWidget />
      </section>
    </div>
  );
}
