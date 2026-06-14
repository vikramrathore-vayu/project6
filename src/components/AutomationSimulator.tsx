import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ShieldAlert } from 'lucide-react';
import type { Lead } from './AdminDashboard';


interface AutomationSimulatorProps {
  activeLead: Lead | null;
  activeScenario: 'sms' | 'email' | 'missed' | null;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'system' | 'user' | 'owner';
  text: string;
  time: string;
}

export const AutomationSimulator: React.FC<AutomationSimulatorProps> = ({
  activeLead,
  activeScenario,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [phoneType, setPhoneType] = useState<'customer' | 'owner'>('customer');

  const lead = activeLead || {
    id: 'DEMO-99',
    name: 'Vikram Rathore (Demo)',
    email: 'vikram@thevrcasa.com',
    phone: '(512) 555-0199',
    bedrooms: 3,
    bathrooms: 2,
    deepClean: true,
    price: 220,
    score: 'MEDIUM' as const,
    status: 'New' as const,
    date: new Date().toLocaleDateString(),
  };

  const scenario = activeScenario || 'sms';

  useEffect(() => {
    // Generate initial messages based on scenario
    setMessages([]);
    setPhoneType(scenario === 'missed' || scenario === 'sms' ? 'customer' : 'owner');

    const loadMessages = async () => {
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 800));
      setIsTyping(false);

      if (scenario === 'sms') {
        setMessages([
          {
            id: '1',
            sender: 'system',
            text: `Hi ${lead.name.split(' ')[0]}, thanks for requesting an instant quote from SparkleClean Texas! Your estimated cost is $${lead.price}. Would you like to lock this reservation? Reply BOOK to schedule.`,
            time: 'Just now'
          }
        ]);
      } else if (scenario === 'missed') {
        setMessages([
          {
            id: '1',
            sender: 'system',
            text: `Hi! Sorry we missed your call. We're currently on a cleaning job but want to help! Would you like an instant quote for your home? Reply YES to start.`,
            time: '1m ago'
          }
        ]);
      } else if (scenario === 'email') {
        setPhoneType('owner');
        setMessages([
          {
            id: '1',
            sender: 'owner',
            text: `🚨 NEW LEAD REGISTERED!\nName: ${lead.name}\nValue: $${lead.price}\nPriority: ${lead.score}\nPhone: ${lead.phone}\nDetails: ${lead.bedrooms} Bed / ${lead.bathrooms} Bath\n\nReply CONTACT to call immediately.`,
            time: 'Just now'
          }
        ]);
      }
    };

    loadMessages();
  }, [scenario, activeLead]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: inputText,
      time: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    
    // Simulate automated answer
    setIsTyping(true);
    setTimeout(async () => {
      setIsTyping(false);
      let replyText = "";
      
      const inputUpper = inputText.toUpperCase().trim();
      
      if (scenario === 'missed') {
        if (inputUpper === 'YES') {
          replyText = `Awesome! What is the number of bedrooms in your house? (Reply with a number 1 to 8)`;
        } else if (/^[1-8]$/.test(inputUpper)) {
          replyText = `Got it, ${inputUpper} bedrooms. And how many bathrooms? (Reply 1 to 6)`;
        } else if (/^[1-6]$/.test(inputUpper)) {
          replyText = `Great. Based on standard rates, your instant cleaning quote is $180. To confirm and book your slot, tap here: thevrcasa.com/book-demo`;
        } else {
          replyText = `Sorry, I didn't quite catch that. Reply YES to get your instant quote or call us back anytime!`;
        }
      } else if (scenario === 'sms') {
        if (inputUpper === 'BOOK') {
          replyText = `Fantastic! We have reserved your $${lead.price} quote. Click here to select your cleaning date & time: thevrcasa.com/schedule-res`;
        } else {
          replyText = `Got it. If you wish to book, reply BOOK. If you have questions, call us directly at ${lead.phone}.`;
        }
      } else if (scenario === 'email') {
        if (inputUpper === 'CONTACT') {
          replyText = `Calling lead ${lead.name} at ${lead.phone}... Dialing triggered via phone gateway.`;
        } else {
          replyText = `Command not recognized. Reply CONTACT to dial lead.`;
        }
      }

      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: phoneType === 'owner' ? 'owner' : 'system',
        text: replyText,
        time: 'Just now'
      }]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-sm liquid-glass border border-border/80 rounded-[40px] p-3 shadow-2xl flex flex-col h-[650px] overflow-hidden"
      >
        {/* Smartphone Bezel details */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10 flex items-center justify-center">
          <div className="w-12 h-3.5 bg-neutral-900 rounded-full flex items-center justify-center border border-neutral-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500/80 mr-1 animate-pulse" />
            <span className="w-6 h-1 bg-neutral-700 rounded-full" />
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 bg-[#000] rounded-[32px] overflow-hidden border border-neutral-900 flex flex-col relative pt-8">
          
          {/* Phone Header */}
          <div className="px-5 py-3 border-b border-border/30 bg-card/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {phoneType === 'customer' ? (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold font-mono border border-border/40 text-foreground">
                  SC
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/40">
                  <ShieldAlert className="w-4 h-4 text-white" />
                </div>
              )}
              <div>
                <div className="text-xs font-semibold text-foreground">
                  {phoneType === 'customer' ? 'SparkleClean Texas' : 'VR CASA ALERTS'}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {phoneType === 'customer' ? 'Online Automation Gateway' : 'Priority Notification'}
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground text-xs font-mono border border-border bg-neutral-900 hover:bg-neutral-800 px-2.5 py-1 rounded-md"
            >
              Exit
            </button>
          </div>

          {/* Chat bubbles container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs scrollbar-thin">
            
            {/* Context bar */}
            <div className="text-center">
              <span className="inline-block px-3 py-1 bg-neutral-950 border border-neutral-900 rounded-full text-[9px] font-mono text-muted-foreground tracking-wide uppercase">
                {scenario === 'sms' && 'Instant Quote Recovery Flow'}
                {scenario === 'missed' && 'Missed Call Recovery Active'}
                {scenario === 'email' && 'Real-time Lead Scoring Dispatch'}
              </span>
            </div>

            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const isMe = msg.sender === 'user';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 border whitespace-pre-wrap ${
                        isMe
                          ? 'bg-foreground text-background border-foreground rounded-tr-sm'
                          : msg.sender === 'owner'
                          ? 'bg-neutral-950 text-white border-white/20 rounded-tl-sm font-mono'
                          : 'bg-[#0a0a0a] text-neutral-200 border-border/40 rounded-tl-sm'
                      }`}
                    >
                      <div>{msg.text}</div>
                      <div className={`text-[8px] mt-1 text-right font-mono ${
                        isMe ? 'text-background/70' : 'text-neutral-500'
                      }`}>
                        {msg.time}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-neutral-900 border border-border/30 rounded-2xl px-4 py-3 rounded-tl-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Interactive quick response helper */}
          {!isTyping && messages.length > 0 && (
            <div className="px-4 py-2 bg-neutral-950 border-t border-neutral-900 overflow-x-auto whitespace-nowrap flex gap-2 shrink-0 scrollbar-none">
              {scenario === 'missed' && messages.length === 1 && (
                <button
                  onClick={() => { setInputText('YES'); }}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-border rounded-full text-[10px] font-mono text-foreground font-medium shrink-0"
                >
                  "YES"
                </button>
              )}
              {scenario === 'missed' && messages[messages.length-1]?.text.includes('bedrooms') && (
                ['2', '3', '4'].map(num => (
                  <button
                    key={num}
                    onClick={() => { setInputText(num); }}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-border rounded-full text-[10px] font-mono text-foreground font-medium shrink-0"
                  >
                    "{num}"
                  </button>
                ))
              )}
              {scenario === 'missed' && messages[messages.length-1]?.text.includes('bathrooms') && (
                ['1', '2', '3'].map(num => (
                  <button
                    key={num}
                    onClick={() => { setInputText(num); }}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-border rounded-full text-[10px] font-mono text-foreground font-medium shrink-0"
                  >
                    "{num}"
                  </button>
                ))
              )}
              {scenario === 'sms' && messages.length === 1 && (
                <button
                  onClick={() => { setInputText('BOOK'); }}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-border rounded-full text-[10px] font-mono text-foreground font-medium shrink-0"
                >
                  "BOOK"
                </button>
              )}
              {scenario === 'email' && messages.length === 1 && (
                <button
                  onClick={() => { setInputText('CONTACT'); }}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-border rounded-full text-[10px] font-mono text-foreground font-medium shrink-0"
                >
                  "CONTACT"
                </button>
              )}
            </div>
          )}

          {/* Form input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-neutral-900 bg-card/40 flex gap-2">
            <input
              type="text"
              placeholder="Type command or reply..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-input border border-border/40 focus:border-ring/40 outline-none rounded-xl px-3 py-2 text-xs text-foreground transition-all"
            />
            <button
              type="submit"
              className="bg-foreground text-background p-2 rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      </motion.div>
    </div>
  );
};
