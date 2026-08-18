'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Server, Satellite, ShieldCheck, Cpu, Headphones, Zap } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ServicesPage() {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.services-header-content',
        { y: 100 },
        {
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
          y: -50,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const services = [
    {
      title: "Custom YOLOv11 Training",
      description: "Need to track a highly specific or rare species? Our ML engineers will fine-tune our base YOLOv11 vision models on your custom dataset for unparalleled accuracy.",
      icon: <Cpu className="w-8 h-8 text-green-500" />,
      features: ["Custom Dataset Curation", "Hyperparameter Tuning", "Edge-Device Deployment"]
    },
    {
      title: "Satellite & Drone Integration",
      description: "Scale your monitoring beyond camera traps. We integrate high-resolution satellite imagery and automated drone swarms directly into your dashboard.",
      icon: <Satellite className="w-8 h-8 text-blue-500" />,
      features: ["Real-time Telemetry", "Thermal Imaging Support", "Automated Flight Paths"]
    },
    {
      title: "Enterprise On-Premise Hosting",
      description: "For government agencies with strict data residency requirements, we deploy the entire WildVision AI stack on your secure, air-gapped infrastructure.",
      icon: <Server className="w-8 h-8 text-purple-500" />,
      features: ["Air-gapped Deployment", "Military-Grade Encryption", "Data Sovereignty Guarantee"]
    },
    {
      title: "Predictive Poaching Analytics",
      description: "Leverage historical data, lunar phases, and weather patterns to predict and intercept poaching activities before they happen.",
      icon: <Cpu className="w-8 h-8 text-red-500" />,
      features: ["Risk Heatmaps", "Real-Time Threat Alerts", "Automated Patrol Routing"]
    },
    {
      title: "Bioacoustic Monitoring",
      description: "Continuously analyze audio streams from dense rainforests to identify specific animal calls, chainsaws, or vehicle sounds in real-time.",
      icon: <Headphones className="w-8 h-8 text-orange-500" />,
      features: ["Multi-Species Sound Classification", "Gunshot Triangulation", "Offline Edge Processing"]
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-white p-4 sm:p-8 pt-16 md:pt-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <header ref={headerRef} className="text-center mb-12 md:mb-20">
          <div className="services-header-content relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent leading-tight"
            >
              Powerful Capabilities
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed"
            >
              Scale your environmental protection efforts with custom artificial intelligence solutions, dedicated hardware integrations, and elite engineering support.
            </motion.p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="bg-[#121214]/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-green-500/50 transition-colors group relative overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
                {service.icon}
              </div>
              
              <div className="bg-[#1a1a1c] w-16 h-16 rounded-xl flex items-center justify-center mb-6 border border-white/5 shadow-lg shrink-0">
                {service.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-zinc-400 leading-relaxed mb-6">
                {service.description}
              </p>
              
              <ul className="space-y-3 mb-8 flex-grow">
                {service.features.map(feature => (
                  <li key={feature} className="flex items-center gap-3 text-zinc-300">
                    <ShieldCheck className="w-5 h-5 text-green-500/70 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button className="mt-auto px-6 py-3 bg-white/5 hover:bg-green-500 text-white rounded-lg font-medium transition-all w-full flex items-center justify-center gap-2 border border-white/10 hover:border-green-500">
                <Zap className="w-4 h-4" /> Request Quote
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
