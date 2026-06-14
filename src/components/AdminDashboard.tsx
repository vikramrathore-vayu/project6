import React, { useState } from 'react';
import { 
  Users, DollarSign, Target, Percent, 
  Settings, Download, Trash2, 
  PhoneCall, Play, RefreshCw
} from 'lucide-react';
import type { PricingConfig } from './QuoteCalculator';


export interface Lead {
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
}

interface AdminDashboardProps {
  leads: Lead[];
  config: PricingConfig;
  onUpdateConfig: (newConfig: PricingConfig) => void;
  onUpdateLeadStatus: (leadId: string, status: Lead['status']) => void;
  onDeleteLead: (leadId: string) => void;
  onTriggerSimulator: (lead: Lead, type: 'sms' | 'email' | 'missed') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  leads,
  config,
  onUpdateConfig,
  onUpdateLeadStatus,
  onDeleteLead,
  onTriggerSimulator,
}) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'settings'>('leads');
  const [filterStatus, setFilterStatus] = useState<Lead['status'] | 'All'>('All');
  
  // Pricing form states
  const [basePrice, setBasePrice] = useState(config.basePrice);
  const [perBedroom, setPerBedroom] = useState(config.perBedroom);
  const [perBathroom, setPerBathroom] = useState(config.perBathroom);
  const [deepCleanSurcharge, setDeepCleanSurcharge] = useState(config.deepCleanSurcharge);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Compute metrics
  const totalLeads = leads.length;
  const bookedLeads = leads.filter(l => l.status === 'Booked');
  const totalBookedValue = bookedLeads.reduce((acc, curr) => acc + curr.price, 0);
  const pipelineValue = leads
    .filter(l => l.status !== 'Lost')
    .reduce((acc, curr) => acc + curr.price, 0);
  const conversionRate = totalLeads > 0 ? (bookedLeads.length / totalLeads) * 100 : 0;

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    if (filterStatus === 'All') return true;
    return lead.status === filterStatus;
  });

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    await new Promise(r => setTimeout(r, 800));
    onUpdateConfig({
      basePrice,
      perBedroom,
      perBathroom,
      deepCleanSurcharge,
    });
    setIsSavingConfig(false);
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = ['ID', 'Date', 'Name', 'Email', 'Phone', 'Bedrooms', 'Bathrooms', 'Deep Clean', 'Price', 'Score', 'Status'];
    const rows = leads.map(l => [
      l.id,
      l.date,
      l.name,
      l.email,
      l.phone,
      l.bedrooms,
      l.bathrooms,
      l.deepClean ? 'Yes' : 'No',
      l.price,
      l.score,
      l.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vr_casa_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 text-foreground">
      {/* Header info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-medium tracking-tight">
            Revenue <span className="font-serif italic font-normal">Command Center</span>
          </h2>
          <p className="text-muted-foreground text-sm">
            Monitor incoming leads, coordinate instant quotes, and adjust pricing algorithms.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeTab === 'leads' 
                ? 'bg-foreground text-background' 
                : 'bg-secondary text-secondary-foreground hover:bg-muted border border-border/40'
            }`}
          >
            Leads Feed ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'settings' 
                ? 'bg-foreground text-background' 
                : 'bg-secondary text-secondary-foreground hover:bg-muted border border-border/40'
            }`}
          >
            <Settings className="w-4 h-4" />
            Pricing Rules
          </button>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="liquid-glass border border-border/30 rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs uppercase tracking-wider font-mono">Total Pipeline</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-serif">${pipelineValue.toLocaleString()}</span>
            <span className="text-[10px] text-muted-foreground font-mono">({totalLeads} Leads)</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="liquid-glass border border-border/30 rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs uppercase tracking-wider font-mono">Booked Revenue</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-serif text-white font-semibold">${totalBookedValue.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-400 font-mono">({bookedLeads.length} Booked)</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="liquid-glass border border-border/30 rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs uppercase tracking-wider font-mono">Win Rate</span>
            <Target className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-serif">{conversionRate.toFixed(1)}%</span>
            <span className="text-[10px] text-muted-foreground font-mono">Goal 25%</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="liquid-glass border border-border/30 rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs uppercase tracking-wider font-mono">Recovered Leads</span>
            <Percent className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-serif">
              {leads.filter(l => l.status === 'Contacted' || l.status === 'Booked').length}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">Via Automation</span>
          </div>
        </div>
      </div>

      {activeTab === 'leads' && (
        <div className="space-y-4">
          {/* Controls row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground uppercase">Filter Status:</span>
              <div className="inline-flex rounded-lg border border-border bg-card/45 p-1">
                {(['All', 'New', 'Contacted', 'Booked', 'Lost'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      filterStatus === status 
                        ? 'bg-foreground text-background font-semibold' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleExportCSV}
              disabled={leads.length === 0}
              className="text-xs uppercase tracking-wider font-mono border border-border hover:bg-secondary rounded-lg px-4 py-2 flex items-center gap-2 transition-all disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>

          {/* Leads Table Container */}
          <div className="liquid-glass border border-border/30 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/40 bg-card/60 text-xs font-mono uppercase text-muted-foreground">
                    <th className="py-4 px-6">Lead details</th>
                    <th className="py-4 px-6">Property / Service</th>
                    <th className="py-4 px-6 text-right">Value</th>
                    <th className="py-4 px-6 text-center">Score</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-center">Trigger Simulation</th>
                    <th className="py-4 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-sm">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground font-mono">
                        No leads registered in database. Use the Quote Calculator to submit a test lead.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-card/20 transition-colors">
                        <td className="py-4 px-6 space-y-1">
                          <div className="font-semibold text-foreground">{lead.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">{lead.email}</div>
                          <div className="text-xs text-muted-foreground font-mono">{lead.phone}</div>
                        </td>
                        <td className="py-4 px-6 space-y-1">
                          <div className="text-xs font-mono">
                            {lead.bedrooms} Bed / {lead.bathrooms} Bath
                          </div>
                          {lead.deepClean ? (
                            <span className="inline-flex items-center text-[10px] font-mono bg-white/10 text-foreground px-2 py-0.5 rounded border border-border/40">
                              Deep Clean
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground font-mono">Standard Clean</span>
                          )}
                          <div className="text-[10px] text-muted-foreground font-mono">
                            Submitted: {lead.date.split(',')[0]}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right font-serif text-lg font-medium">
                          ${lead.price.toFixed(2)}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center justify-center text-[10px] font-mono font-bold tracking-wider rounded px-2.5 py-1 ${
                            lead.score === 'HIGH' 
                              ? 'bg-white text-black border border-white' 
                              : lead.score === 'MEDIUM' 
                              ? 'bg-neutral-800 text-neutral-200 border border-neutral-700' 
                              : 'bg-transparent text-neutral-500 border border-neutral-800'
                          }`}>
                            {lead.score}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={lead.status}
                            onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as Lead['status'])}
                            className="bg-input border border-border/60 text-foreground text-xs rounded-lg px-2.5 py-1.5 focus:border-ring/60 focus:ring-1 focus:ring-ring/20 outline-none"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Booked">Booked</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => onTriggerSimulator(lead, 'sms')}
                              title="Simulate SMS confirmation sent"
                              className="px-2 py-1 bg-neutral-900 border border-border hover:border-foreground/50 rounded text-[10px] font-mono hover:bg-neutral-800 flex items-center gap-1 transition-all"
                            >
                              <Play className="w-2.5 h-2.5" /> SMS
                            </button>
                            <button
                              onClick={() => onTriggerSimulator(lead, 'missed')}
                              title="Simulate Missed Call auto response"
                              className="px-2 py-1 bg-neutral-900 border border-border hover:border-foreground/50 rounded text-[10px] font-mono hover:bg-neutral-800 flex items-center gap-1 transition-all"
                            >
                              <PhoneCall className="w-2.5 h-2.5" /> Missed Call
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => onDeleteLead(lead.id)}
                            className="text-muted-foreground hover:text-white p-1 hover:bg-neutral-800 rounded transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto liquid-glass border border-border/30 rounded-2xl p-6 md:p-10">
          <h3 className="text-xl font-medium tracking-tight mb-2 flex items-center gap-2">
            <Settings className="w-5 h-5 text-muted-foreground" />
            Adjust Pricing Algorithm
          </h3>
          <p className="text-muted-foreground text-xs mb-8">
            Changes saved here will immediately recalculate quotes generated by the frontend calculator in real time.
          </p>

          <form onSubmit={handleSaveConfig} className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label className="font-medium">Base Cleaning Rate</label>
                <span className="font-mono text-muted-foreground">${basePrice}</span>
              </div>
              <input
                type="range"
                min="40"
                max="200"
                step="5"
                value={basePrice}
                onChange={(e) => setBasePrice(parseInt(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label className="font-medium">Per Bedroom Incremental Surcharge</label>
                <span className="font-mono text-muted-foreground">${perBedroom}</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={perBedroom}
                onChange={(e) => setPerBedroom(parseInt(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label className="font-medium">Per Bathroom Incremental Surcharge</label>
                <span className="font-mono text-muted-foreground">${perBathroom}</span>
              </div>
              <input
                type="range"
                min="5"
                max="55"
                step="5"
                value={perBathroom}
                onChange={(e) => setPerBathroom(parseInt(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label className="font-medium">Deep Cleaning Upgrade Flat Fee</label>
                <span className="font-mono text-muted-foreground">${deepCleanSurcharge}</span>
              </div>
              <input
                type="range"
                min="20"
                max="150"
                step="5"
                value={deepCleanSurcharge}
                onChange={(e) => setDeepCleanSurcharge(parseInt(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
              />
            </div>

            <div className="pt-4 border-t border-border/20 flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => {
                  setBasePrice(config.basePrice);
                  setPerBedroom(config.perBedroom);
                  setPerBathroom(config.perBathroom);
                  setDeepCleanSurcharge(config.deepCleanSurcharge);
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-medium border border-border/60 text-muted-foreground hover:text-foreground transition-all"
              >
                Reset Changes
              </button>
              <button
                type="submit"
                disabled={isSavingConfig}
                className="px-6 py-2.5 rounded-xl text-sm font-medium bg-foreground text-background flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSavingConfig ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Syncing Formula...
                  </>
                ) : (
                  <>
                    Save Algorithm
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
