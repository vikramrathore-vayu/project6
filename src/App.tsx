import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hls from 'hls.js';
import { ArrowLeft } from 'lucide-react';

// Imports
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { QuoteCalculator } from './components/QuoteCalculator';
import type { PricingConfig } from './components/QuoteCalculator';
import { AdminDashboard } from './components/AdminDashboard';
import type { Lead } from './components/AdminDashboard';
import { AutomationSimulator } from './components/AutomationSimulator';
import { ScrollWordReveal } from './components/ScrollWordReveal';

// Import local assets
import avatar1 from './assets/avatar-1.png';
import avatar2 from './assets/avatar-2.png';
import avatar3 from './assets/avatar-3.png';
import chatgptIcon from './assets/icon-chatgpt.png';
import perplexityIcon from './assets/icon-perplexity.png';
import googleIcon from './assets/icon-google.png';

// Initial Pricing Formula config
const DEFAULT_PRICING: PricingConfig = {
  basePrice: 80,
  perBedroom: 20,
  perBathroom: 15,
  deepCleanSurcharge: 50,
};

// Mock leads data
const INITIAL_LEADS: Lead[] = [
  {
    id: 'VR-TX91',
    name: 'Sarah Jenkins',
    email: 'sarah.j@texascleaning.com',
    phone: '(512) 555-0240',
    bedrooms: 4,
    bathrooms: 3,
    deepClean: true,
    price: 265, // 80 + 80 + 45 + 50
    score: 'HIGH',
    status: 'Booked',
    date: '2026-06-13 14:32:10',
  },
  {
    id: 'VR-TX12',
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    phone: '(214) 555-0100',
    bedrooms: 3,
    bathrooms: 2,
    deepClean: false,
    price: 170, // 80 + 60 + 30
    score: 'MEDIUM',
    status: 'New',
    date: '2026-06-14 09:15:30',
  },
  {
    id: 'VR-ON05',
    name: 'Robert Miller',
    email: 'rob.miller@rogers.ca',
    phone: '(416) 555-0310',
    bedrooms: 2,
    bathrooms: 1,
    deepClean: false,
    price: 135, // 80 + 40 + 15
    score: 'LOW',
    status: 'Contacted',
    date: '2026-06-12 11:45:00',
  }
];

// Reusable fadeUp animation helper
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

export default function App() {
  const [view, setView] = useState<'landing' | 'demo' | 'dashboard'>('landing');
  const [config, setConfig] = useState<PricingConfig>(() => {
    const saved = localStorage.getItem('vr_casa_pricing_config');
    return saved ? JSON.parse(saved) : DEFAULT_PRICING;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('vr_casa_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [emailInput, setEmailInput] = useState('');
  
  // Simulator states
  const [activeSimulatorLead, setActiveSimulatorLead] = useState<Lead | null>(null);
  const [activeSimulatorScenario, setActiveSimulatorScenario] = useState<'sms' | 'email' | 'missed' | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('vr_casa_pricing_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('vr_casa_leads', JSON.stringify(leads));
  }, [leads]);

  // HLS stream logic for CTA video
  const ctaVideoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (view === 'landing' && ctaVideoRef.current) {
      const video = ctaVideoRef.current;
      const hlsUrl = 'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8';
      
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(err => console.log("HLS autoplay prevented:", err));
        });
        return () => {
          hls.destroy();
        };
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Fallback for Safari/native HLS support
        video.src = hlsUrl;
        video.play().catch(err => console.log("Native HLS autoplay prevented:", err));
      }
    }
  }, [view]);

  // Lead updates handlers
  const handleNewLead = (newLead: Lead) => {
    setLeads(prev => [newLead, ...prev]);
    // Automatically queue simulation for SMS confirmation
    setActiveSimulatorLead(newLead);
    setActiveSimulatorScenario('sms');
  };

  const handleUpdateLeadStatus = (leadId: string, status: Lead['status']) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));
  };

  const handleDeleteLead = (leadId: string) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
  };

  const handleTriggerSimulator = (lead: Lead, scenario: 'sms' | 'email' | 'missed') => {
    setActiveSimulatorLead(lead);
    setActiveSimulatorScenario(scenario);
  };

  const handleHeroEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    // Redirect to quote engine demo
    setView('demo');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#000] text-foreground font-sans overflow-x-hidden selection:bg-white/20 selection:text-white">
      {/* Glow backgrounds */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] glow-spot rounded-full z-0" />
      <div className="fixed bottom-[-1%] right-[-1%] w-[40%] h-[40%] glow-spot rounded-full z-0" />

      {/* Sticky Navigation */}
      <Navbar currentView={view} onViewChange={setView} onContactClick={() => {}} />

      {/* Main Container with transitions */}
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.main
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full"
            id="home"
          >
            {/* 1. Hero Section (full viewport height) */}
            <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6 md:px-28 pb-12 pt-24 overflow-hidden">
              {/* Autoplaying looping muted video covering section */}
              <div className="absolute inset-0 w-full h-full z-0">
                <video
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-35"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-0 bg-black/60 pointer-events-none" />
              </div>

              {/* Content */}
              <div className="relative z-10 max-w-4xl mx-auto space-y-8 mt-12">
                {/* Avatar row */}
                <motion.div 
                  {...fadeUp(0.1)}
                  className="flex flex-col sm:flex-row items-center justify-center gap-3"
                >
                  <div className="flex -space-x-2.5">
                    <img className="w-8 h-8 rounded-full border-2 border-background object-cover grayscale" src={avatar1} alt="Subscriber Avatar" />
                    <img className="w-8 h-8 rounded-full border-2 border-background object-cover grayscale" src={avatar2} alt="Subscriber Avatar" />
                    <img className="w-8 h-8 rounded-full border-2 border-background object-cover grayscale" src={avatar3} alt="Subscriber Avatar" />
                  </div>
                  <span className="text-muted-foreground text-xs uppercase tracking-widest font-mono">
                    7,000+ local leads recovered this month
                  </span>
                </motion.div>

                {/* Heading */}
                <motion.h1 
                  {...fadeUp(0.2)}
                  className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[0.9] text-foreground"
                >
                  Get Inspired <span className="font-serif italic font-normal text-muted-foreground">with Us</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p 
                  {...fadeUp(0.3)}
                  className="text-sm md:text-lg max-w-xl mx-auto font-mono text-[#e1e3e6] leading-relaxed"
                >
                  Join our feed for meaningful updates, news around technology and a shared journey toward depth and direction.
                </motion.p>

                {/* Email Form */}
                <motion.div 
                  {...fadeUp(0.4)}
                  className="w-full max-w-md mx-auto"
                >
                  <form onSubmit={handleHeroEmailSubmit} className="liquid-glass rounded-full p-1.5 flex items-center border border-border/40">
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="Enter email to get quote..."
                      className="bg-transparent text-sm text-foreground outline-none border-none pl-5 pr-2 py-3 flex-1 min-w-0"
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-foreground text-background font-semibold text-xs tracking-wider rounded-full px-6 py-3 hover:bg-white transition-all shrink-0 uppercase"
                    >
                      Subscribe
                    </motion.button>
                  </form>
                </motion.div>
              </div>

              {/* Bottom fade line */}
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
            </section>

            {/* 2. "Search has changed" Section */}
            <section id="how-it-works" className="relative bg-[#000] py-32 px-6 md:px-28 text-center border-t border-border/10">
              <div className="max-w-4xl mx-auto space-y-6 mb-24">
                <motion.h2 
                  {...fadeUp(0.1)}
                  className="text-4xl md:text-7xl font-medium tracking-tight leading-none"
                >
                  Search has <span className="font-serif italic font-normal text-muted-foreground">changed.</span> Have you?
                </motion.h2>
                <motion.p 
                  {...fadeUp(0.2)}
                  className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto font-mono"
                >
                  Customers no longer comb through directories. They search on AI networks and demand immediate quotes. If your website lacks an instant quote funnel, they call your competitor.
                </motion.p>
              </div>

              {/* Platform cards grid */}
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
                {/* ChatGPT Card */}
                <motion.div 
                  {...fadeUp(0.2)}
                  className="liquid-glass border border-border/30 rounded-3xl p-8 flex flex-col items-center gap-6 group hover:border-foreground/45 transition-colors"
                >
                  <div className="w-48 h-48 rounded-full border border-border/40 flex items-center justify-center p-6 bg-card/60 relative overflow-hidden group-hover:scale-105 transition-all">
                    <img src={chatgptIcon} alt="ChatGPT Icon" className="w-20 h-20 object-contain invert opacity-75 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-base tracking-wide">ChatGPT Integration</h4>
                    <p className="text-muted-foreground text-xs font-mono leading-relaxed">
                      Sync quote logic to LLM pipelines so customers get pricing dynamically from custom agents.
                    </p>
                  </div>
                </motion.div>

                {/* Perplexity Card */}
                <motion.div 
                  {...fadeUp(0.3)}
                  className="liquid-glass border border-border/30 rounded-3xl p-8 flex flex-col items-center gap-6 group hover:border-foreground/45 transition-colors"
                >
                  <div className="w-48 h-48 rounded-full border border-border/40 flex items-center justify-center p-6 bg-card/60 relative overflow-hidden group-hover:scale-105 transition-all">
                    <img src={perplexityIcon} alt="Perplexity Icon" className="w-20 h-20 object-contain invert opacity-75 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-base tracking-wide">Perplexity Search</h4>
                    <p className="text-muted-foreground text-xs font-mono leading-relaxed">
                      Optimize site metadata to rank as the primary answer when consumers search local business inquiries.
                    </p>
                  </div>
                </motion.div>

                {/* Google AI Card */}
                <motion.div 
                  {...fadeUp(0.4)}
                  className="liquid-glass border border-border/30 rounded-3xl p-8 flex flex-col items-center gap-6 group hover:border-foreground/45 transition-colors"
                >
                  <div className="w-48 h-48 rounded-full border border-border/40 flex items-center justify-center p-6 bg-card/60 relative overflow-hidden group-hover:scale-105 transition-all">
                    <img src={googleIcon} alt="Google AI Icon" className="w-20 h-20 object-contain invert opacity-75 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-base tracking-wide">Google Gemini Maps</h4>
                    <p className="text-muted-foreground text-xs font-mono leading-relaxed">
                      Position quote buttons directly within search endpoints to bypass traditional web page navigation.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Tagline */}
              <motion.div 
                {...fadeUp(0.5)}
                className="text-muted-foreground text-xs font-mono tracking-widest uppercase border-t border-border/10 pt-10"
              >
                If you don't answer the questions, someone else will.
              </motion.div>
            </section>

            {/* 3. Mission Section */}
            <section id="philosophy" className="relative py-32 px-6 md:px-28 bg-[#000] border-t border-border/10">
              <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                {/* Large looping video */}
                <div className="w-full lg:w-1/2 aspect-square max-w-[450px] mx-auto rounded-3xl overflow-hidden border border-border/40 bg-card/25 shadow-2xl relative shrink-0">
                  <video
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/45 pointer-events-none" />
                </div>

                {/* Scroll-driven Reveal Text */}
                <div className="w-full lg:w-1/2 space-y-8 text-left">
                  <ScrollWordReveal
                    text="We're building a space where curiosity meets clarity — where readers find depth, writers find reach, and every newsletter becomes a conversation worth having."
                    highlights={["curiosity", "meets", "clarity", "depth", "reach"]}
                    className="text-2xl md:text-4xl font-medium tracking-tight text-[#f1f3f5] leading-tight"
                  />
                  <ScrollWordReveal
                    text="A platform where content, community, and insight flow together — with less noise, less friction, and more meaning for everyone involved."
                    highlights={["content", "community", "insight", "friction", "meaning"]}
                    className="text-lg md:text-xl font-normal text-neutral-400 font-mono leading-relaxed"
                  />
                </div>
              </div>
            </section>

            {/* 4. Solution Section */}
            <section id="use-cases" className="relative py-32 px-6 md:px-28 bg-[#000] border-t border-border/20">
              <div className="max-w-5xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                  <span className="text-xs tracking-[4px] uppercase text-muted-foreground font-mono font-medium block">
                    THE SOLUTION
                  </span>
                  <h2 className="text-4xl md:text-6xl font-medium tracking-tight">
                    The platform for <span className="font-serif italic font-normal text-muted-foreground">meaningful</span> content
                  </h2>
                </div>

                {/* Solution Video Aspect 3/1 */}
                <div className="w-full aspect-[3/1] rounded-2xl overflow-hidden border border-border/40 bg-card/60 relative">
                  <video
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                </div>

                {/* 4 Column Feature Grid */}
                <div className="grid md:grid-cols-4 gap-8 pt-8">
                  {/* Col 1 */}
                  <div className="space-y-3 p-4 border-l border-border/20">
                    <span className="text-xs font-mono text-muted-foreground">01 / CAPTURE</span>
                    <h4 className="font-semibold text-base">Curated Feed</h4>
                    <p className="text-muted-foreground text-xs font-mono leading-relaxed">
                      Clean quote calculator that captures 100% of website visits and details.
                    </p>
                  </div>

                  {/* Col 2 */}
                  <div className="space-y-3 p-4 border-l border-border/20">
                    <span className="text-xs font-mono text-muted-foreground">02 / INTERACT</span>
                    <h4 className="font-semibold text-base">Writer Tools</h4>
                    <p className="text-muted-foreground text-xs font-mono leading-relaxed">
                      Instant scoring metrics, priority flags, and dynamic formula builders.
                    </p>
                  </div>

                  {/* Col 3 */}
                  <div className="space-y-3 p-4 border-l border-border/20">
                    <span className="text-xs font-mono text-muted-foreground">03 / CONVERT</span>
                    <h4 className="font-semibold text-base">Community</h4>
                    <p className="text-muted-foreground text-xs font-mono leading-relaxed">
                      Automated missed-call-to-text SMS flows ensuring leads don't go to competitors.
                    </p>
                  </div>

                  {/* Col 4 */}
                  <div className="space-y-3 p-4 border-l border-border/20">
                    <span className="text-xs font-mono text-muted-foreground">04 / MAINTAIN</span>
                    <h4 className="font-semibold text-base">Distribution</h4>
                    <p className="text-muted-foreground text-xs font-mono leading-relaxed">
                      Real-time dashboard to coordinate bookings and monitor revenue leakage.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. CTA Section (HLS video background via hls.js) */}
            <section className="relative py-40 px-6 md:px-28 text-center bg-[#000] border-t border-border/20 overflow-hidden flex flex-col items-center justify-center">
              {/* HLS Video Background */}
              <video
                ref={ctaVideoRef}
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-20 pointer-events-none"
              />
              <div className="absolute inset-0 bg-background/60 z-[1] pointer-events-none" />

              {/* Content Container */}
              <div className="relative z-10 max-w-2xl mx-auto space-y-8 flex flex-col items-center">
                {/* Concentric circles logo icon */}
                <div className="w-10 h-10 rounded-full border-2 border-foreground/60 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full border border-foreground/60" />
                </div>

                <h2 className="text-4xl md:text-6xl font-medium tracking-tight">
                  Start Your <span className="font-serif italic font-normal text-muted-foreground">Journey</span>
                </h2>
                
                <p className="text-muted-foreground text-sm max-w-sm mx-auto font-mono">
                  Experience the conversion infrastructure live. Test the calculator quote engine or explore the admin leads board.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center pt-2">
                  <button
                    onClick={() => setView('demo')}
                    className="bg-foreground text-background font-semibold text-xs tracking-wider uppercase rounded-lg px-8 py-4 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1"
                  >
                    Subscribe Now
                  </button>
                  <button
                    onClick={() => setView('dashboard')}
                    className="liquid-glass border border-border/60 text-foreground text-xs font-semibold tracking-wider uppercase rounded-lg px-8 py-4 hover:bg-neutral-900 transition-all flex items-center justify-center gap-1"
                  >
                    Start Writing
                  </button>
                </div>
              </div>
            </section>
          </motion.main>
        )}

        {view === 'demo' && (
          <motion.main
            key="demo"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full pt-32 pb-24 px-6 md:px-28"
          >
            <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
              <button 
                onClick={() => setView('landing')}
                className="text-xs font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1 border border-border px-3.5 py-1.5 rounded-full bg-neutral-950 transition-all mb-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return to landing page
              </button>
              <h2 className="text-3xl md:text-5xl font-medium tracking-tight">
                Instant Quote <span className="font-serif italic font-normal text-muted-foreground">Funnel MVP</span>
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto font-mono">
                Fill out the cleaning specifications to compute a price. The generated lead will dynamically score itself and sync to the Admin Dashboard.
              </p>
            </div>

            <QuoteCalculator config={config} onLeadSubmit={handleNewLead} />
          </motion.main>
        )}

        {view === 'dashboard' && (
          <motion.main
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full pt-32 pb-24 px-6 md:px-12 lg:px-28"
          >
            <AdminDashboard
              leads={leads}
              config={config}
              onUpdateConfig={setConfig}
              onUpdateLeadStatus={handleUpdateLeadStatus}
              onDeleteLead={handleDeleteLead}
              onTriggerSimulator={handleTriggerSimulator}
            />
          </motion.main>
        )}
      </AnimatePresence>

      {/* Footer component */}
      <Footer />

      {/* Global Interactive Phone Automation Simulator popup */}
      <AnimatePresence>
        {activeSimulatorScenario !== null && (
          <AutomationSimulator
            activeLead={activeSimulatorLead}
            activeScenario={activeSimulatorScenario}
            onClose={() => {
              setActiveSimulatorScenario(null);
              setActiveSimulatorLead(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
