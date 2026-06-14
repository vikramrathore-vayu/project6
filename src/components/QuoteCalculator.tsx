import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, RefreshCw, Calculator, Sparkles, User, Mail, Phone, Calendar } from 'lucide-react';

export interface PricingConfig {
  basePrice: number;
  perBedroom: number;
  perBathroom: number;
  deepCleanSurcharge: number;
}

interface QuoteCalculatorProps {
  config: PricingConfig;
  onLeadSubmit: (lead: {
    id: string;
    name: string;
    email: string;
    phone: string;
    bedrooms: number;
    bathrooms: number;
    deepClean: boolean;
    price: number;
    score: 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'New' | 'Contacted' | 'Booked' | 'Lost';
    date: string;
  }) => void;
}

export const QuoteCalculator: React.FC<QuoteCalculatorProps> = ({ config, onLeadSubmit }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [deepClean, setDeepClean] = useState<boolean>(false);
  
  // Contact details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate price
  const calculatePrice = () => {
    return (
      config.basePrice +
      bedrooms * config.perBedroom +
      bathrooms * config.perBathroom +
      (deepClean ? config.deepCleanSurcharge : 0)
    );
  };

  const currentPrice = calculatePrice();

  // Score lead
  const getLeadScore = (price: number): 'HIGH' | 'MEDIUM' | 'LOW' => {
    if (price > 250) return 'HIGH';
    if (price >= 150) return 'MEDIUM';
    return 'LOW';
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    setIsSubmitting(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const finalPrice = calculatePrice();
    const score = getLeadScore(finalPrice);

    const newLead = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      name,
      email,
      phone,
      bedrooms,
      bathrooms,
      deepClean,
      price: finalPrice,
      score,
      status: 'New' as const,
      date: new Date().toLocaleString(),
    };

    onLeadSubmit(newLead);
    setIsSubmitting(false);
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setBedrooms(2);
    setBathrooms(1);
    setDeepClean(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto liquid-glass rounded-3xl border border-border p-6 md:p-10 text-foreground">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/30">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-muted-foreground" />
          <span className="text-xs uppercase tracking-[3px] text-muted-foreground font-medium">Instant Quote Engine</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-foreground' : 'bg-muted'}`} />
          <span className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-foreground' : 'bg-muted'}`} />
          <span className={`w-2 h-2 rounded-full ${step === 3 ? 'bg-foreground' : 'bg-muted'}`} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">
              Configure Your <span className="font-serif italic font-normal">Service Details</span>
            </h3>
            <p className="text-muted-foreground text-sm mb-8">
              Adjust the sliders below to match your home specifications for an instant, accurate estimate.
            </p>

            <form onSubmit={handleNextStep} className="space-y-8">
              {/* Bedrooms Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium tracking-wide">Bedrooms</label>
                  <span className="text-2xl font-serif italic">{bedrooms} {bedrooms === 1 ? 'Room' : 'Rooms'}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(parseInt(e.target.value))}
                  className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>1 BED</span>
                  <span>4 BEDS</span>
                  <span>8 BEDS</span>
                </div>
              </div>

              {/* Bathrooms Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium tracking-wide">Bathrooms</label>
                  <span className="text-2xl font-serif italic">{bathrooms} {bathrooms === 1 ? 'Bath' : 'Baths'}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(parseInt(e.target.value))}
                  className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>1 BATH</span>
                  <span>3 BATHS</span>
                  <span>6 BATHS</span>
                </div>
              </div>

              {/* Service Type / Deep Clean Surcharge */}
              <div className="pt-4 border-t border-border/20">
                <label className="relative flex items-center justify-between cursor-pointer p-4 rounded-xl border border-border/40 bg-card/40 hover:bg-card/80 transition-all">
                  <div className="flex flex-col gap-1 pr-6">
                    <span className="text-sm font-medium flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-muted-foreground" />
                      Deep Cleaning Upgrade
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Recommended for homes that haven't been professionally cleaned in over 3 months.
                    </span>
                  </div>
                  <div className="relative flex items-center shrink-0">
                    <input
                      type="checkbox"
                      checked={deepClean}
                      onChange={(e) => setDeepClean(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-foreground/20 after:bg-muted-foreground/30 peer-checked:after:bg-foreground"></div>
                  </div>
                </label>
              </div>

              {/* Live Price Display */}
              <div className="bg-card/60 border border-border/30 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-[2px] font-mono block">Estimated Cost</span>
                  <span className="text-4xl md:text-5xl font-serif font-light">${currentPrice}</span>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-foreground text-background font-medium rounded-full px-8 py-4 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                >
                  Book Instant Quote
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">
              Secure Your <span className="font-serif italic font-normal">Pricing Reservation</span>
            </h3>
            <p className="text-muted-foreground text-sm mb-8">
              Submit your details to lock in this price. A confirmation code will be sent to your phone.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input details */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="Vikram Rathore"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-input border border-border/40 focus:border-ring/60 focus:ring-1 focus:ring-ring/20 outline-none rounded-xl pl-12 pr-4 py-3.5 text-foreground transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    placeholder="vikram@thevrcasa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-input border border-border/40 focus:border-ring/60 focus:ring-1 focus:ring-ring/20 outline-none rounded-xl pl-12 pr-4 py-3.5 text-foreground transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    required
                    placeholder="(512) 555-0199"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-input border border-border/40 focus:border-ring/60 focus:ring-1 focus:ring-ring/20 outline-none rounded-xl pl-12 pr-4 py-3.5 text-foreground transition-all"
                  />
                </div>
              </div>

              {/* Price breakdown summary */}
              <div className="bg-card/40 border border-border/20 rounded-2xl p-5 text-sm font-mono space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Base Cleaning Rate</span>
                  <span>${config.basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Bedrooms ({bedrooms})</span>
                  <span>+${(bedrooms * config.perBedroom).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Bathrooms ({bathrooms})</span>
                  <span>+${(bathrooms * config.perBathroom).toFixed(2)}</span>
                </div>
                {deepClean && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Deep Clean Surcharge</span>
                    <span>+${config.deepCleanSurcharge.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-border/20 pt-2 flex justify-between text-foreground font-serif text-lg font-medium">
                  <span>Total Lock Price</span>
                  <span>${currentPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center p-3.5 rounded-xl border border-border/60 hover:bg-card/60 active:scale-95 transition-all text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-foreground text-background font-medium rounded-xl py-3.5 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Registering Infrastructure...
                    </>
                  ) : (
                    <>
                      Lock My Quote (${currentPrice})
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-6"
          >
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6 border border-white/20">
              <Check className="w-8 h-8 text-foreground" />
            </div>
            
            <h3 className="text-3xl font-medium tracking-tight mb-2">
              Quote <span className="font-serif italic font-normal">Successfully Locked!</span>
            </h3>
            
            <div className="max-w-md mx-auto bg-card/40 border border-border/20 rounded-2xl p-5 mb-8 text-sm font-mono space-y-3 mt-6">
              <div className="flex justify-between border-b border-border/20 pb-2">
                <span className="text-muted-foreground">Reservation ID</span>
                <span className="font-semibold">VR-{Math.random().toString(36).substr(2, 4).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Client Name</span>
                <span>{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Locked</span>
                <span>{bedrooms} Bed / {bathrooms} Bath {deepClean && '(Deep Clean)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Guaranteed Price</span>
                <span className="text-foreground font-semibold font-sans text-base">${currentPrice}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Date & Time</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="text-muted-foreground text-sm max-w-md mx-auto mb-8 space-y-2">
              <p>📱 An automated SMS confirmation has been dispatched to <span className="text-foreground">{phone}</span>.</p>
              <p>✉️ A detailed recovery route map and calendar link have been sent to <span className="text-foreground">{email}</span>.</p>
            </div>

            <button
              onClick={handleReset}
              className="bg-secondary text-secondary-foreground border border-border hover:bg-muted font-medium rounded-full px-8 py-3.5 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Calculate Another Quote
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
