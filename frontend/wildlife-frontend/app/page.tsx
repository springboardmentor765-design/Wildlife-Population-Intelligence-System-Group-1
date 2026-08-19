'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP Scroll Animations
    const ctx = gsap.context(() => {
      // Fade and slide up features section when it comes into view
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });

      // Parallax effect on hero
      gsap.to('.hero-content', {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        y: 200,
        opacity: 0
      });

      // Background decorative circle parallax
      gsap.to('.hero-bg', {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
        y: 300,
      });

      // About section parallax text
      gsap.fromTo('.about-content',
        { y: 100 },
        {
          scrollTrigger: {
            trigger: '.about-section',
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

  return (
    <div 
      className="font-sans min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'linear-gradient(rgba(5, 5, 5, 0.5), rgba(5, 5, 5, 0.95)), url("/hero-banner.png")',
      }}
    >
      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-12 md:px-8 relative overflow-hidden"
      >
        <div className="hero-content relative z-10 max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent leading-none"
          >
            AI-Powered Wildlife Monitoring
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-sm sm:text-base md:text-lg max-w-2xl text-zinc-300 leading-relaxed mx-auto mb-8"
          >
            Protecting biodiversity through advanced computer vision. Detect, track, and map wildlife populations globally with real-time YOLO inference.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link 
              href="/detection" 
              className="w-full sm:w-auto px-8 py-3.5 bg-[#4CAF50] text-white rounded-full no-underline font-bold text-base hover:bg-[#4CAF50]/90 transition-all text-center shadow-[0_4px_15px_rgba(76,175,80,0.4)]"
            >
              Start Detecting
            </Link>
            <Link 
              href="/map" 
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent text-[#4CAF50] border-2 border-[#4CAF50] rounded-full no-underline font-bold text-base hover:bg-[#4CAF50]/10 transition-all text-center"
            >
              View Global Map
            </Link>
          </motion.div>
        </div>

        {/* Background Decorative Elements */}
        <motion.div
          className="hero-bg absolute rounded-full pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          style={{ 
            width: 'min(80vw, 800px)', 
            height: 'min(80vw, 800px)', 
            background: 'radial-gradient(circle, rgba(76,175,80,0.15) 0%, rgba(0,0,0,0) 70%)', 
            top: '-20%', 
            left: '-10%', 
            zIndex: 1 
          }}
        />
        <motion.div
          className="hero-bg absolute rounded-full pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
          style={{ 
            width: 'min(60vw, 600px)', 
            height: 'min(60vw, 600px)', 
            background: 'radial-gradient(circle, rgba(129,199,132,0.1) 0%, rgba(0,0,0,0) 70%)', 
            bottom: '-20%', 
            right: '-5%', 
            zIndex: 1 
          }}
        />
      </section>

      {/* ABOUT SECTION */}
      <section className="about-section py-16 md:py-32 px-6 md:px-8 bg-transparent flex flex-col items-center text-center relative overflow-hidden">
        <div className="about-content max-w-3xl relative z-10">
          <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">About WildlifeAI</h3>
          <p className="text-sm sm:text-base md:text-lg text-zinc-400 leading-relaxed mb-6">
            WildlifeAI is a state-of-the-art conservation technology platform built to tackle the global biodiversity crisis. We leverage advanced artificial intelligence—specifically real-time YOLO computer vision—to automatically detect, classify, and map wildlife species from camera traps, drones, and satellite imagery.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-zinc-400 leading-relaxed">
            Our mission is to equip researchers, forest departments, and conservation officers with actionable, data-driven insights. By analyzing population stability, tracking endangered species, and scoring ecosystem health, we enable faster, more effective environmental protection strategies.
          </p>
        </div>
      </section>

      {/* FEATURES SECTION (Scroll Triggered) */}
      <section ref={featuresRef} className="py-12 md:py-24 px-6 md:px-8 bg-transparent flex flex-col items-center">
        <h3 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">Powerful Capabilities</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl w-full">

          <div className="feature-card bg-[#1a1a1c]/90 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/10 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/10 cursor-default group h-full">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 transform origin-left">📸</div>
            <h4 className="text-xl font-bold mb-3 text-[#4CAF50]">Real-time Detection</h4>
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">Upload images or stream video to our customized YOLOv11 model to instantly identify species and calculate confidence scores.</p>
          </div>

          <div className="feature-card bg-[#1a1a1c]/90 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/10 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/10 cursor-default group h-full">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 transform origin-left">🌍</div>
            <h4 className="text-xl font-bold mb-3 text-[#4CAF50]">Geographic Mapping</h4>
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">Visualize wildlife populations on an interactive map. Track migration patterns and pinpoint high-density habitats globally.</p>
          </div>

          <div className="feature-card bg-[#1a1a1c]/90 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/10 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/10 cursor-default group h-full">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 transform origin-left">📊</div>
            <h4 className="text-xl font-bold mb-3 text-[#4CAF50]">Data Analytics</h4>
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">Access comprehensive dashboards showing species counts, time-series activity, and aggregate statistics across all detections.</p>
          </div>

        </div>
      </section>

      {/* SERVICES CTA SECTION */}
      <section className="py-12 md:py-24 px-6 md:px-8 bg-transparent flex flex-col items-center text-center">
        <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Scale Your Conservation Efforts?</h3>
        <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mb-8 leading-relaxed">
          Explore our enterprise services for custom model training, dedicated satellite integrations, and 24/7 priority support.
        </p>
        <Link 
          href="/services" 
          className="w-full sm:w-auto px-8 py-3.5 bg-white text-zinc-950 hover:bg-zinc-200 transition-colors rounded-full no-underline font-bold text-base text-center shadow-[0_4px_15px_rgba(255,255,255,0.2)]"
        >
          Explore Services
        </Link>
      </section>

    </div>
  );
}
