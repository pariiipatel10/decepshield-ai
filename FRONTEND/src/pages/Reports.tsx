import { useState, useEffect, useContext } from 'react';
import { FileText, Download, BarChart2, Briefcase, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

import html2pdf from 'html2pdf.js';

const severityColors: Record<string, string> = {
  'Critical': '#ef4444',
  'High': '#f97316',
  'Medium': '#eab308',
  'Low': '#ff2a85'
};

const Reports = () => {
  const { token } = useContext(AuthContext) || {};
  const [barData, setBarData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [keyFindings, setKeyFindings] = useState<any[]>([]);

  const [reportType, setReportType] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/api/reports');
        setBarData(res.data.barData || []);
        
        const mappedPie = (res.data.pieData || []).map((item: any) => ({
          ...item,
          color: severityColors[item.name] || '#3b82f6'
        }));
        setPieData(mappedPie);

        const total = mappedPie.reduce((acc: number, curr: any) => acc + curr.value, 0);
        setTotalEvents(total);
        setKeyFindings(res.data.keyFindings || []);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      }
    };
    if (token) fetchReports();
  }, [token]);

  const handlePrintPDF = (type: string) => {
    setReportType(type);
    setIsGenerating(true);

    // Wait for React to re-render the DOM with the correct title and hidden elements
    setTimeout(() => {
      const element = document.getElementById('report-preview');
      if (!element) {
        setReportType(null);
        setIsGenerating(false);
        return;
      }

      const opt = {
        margin:       10,
        filename:     `DecepShield_${type}_Report.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false, backgroundColor: '#0f172a' }, // Dark background
        jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
      };

      // Generate the PDF
      html2pdf().set(opt).from(element).save()
        .then(() => {
          setReportType(null);
          setIsGenerating(false);
        })
        .catch((err: unknown) => {
          console.error('Failed to generate PDF:', err);
          setReportType(null);
          setIsGenerating(false);
        });
    }, 500);
  };

  const handleExportJSON = () => {
    const exportData = {
      generatedAt: new Date().toISOString(),
      source: "DecepShield AI Threat Intelligence",
      indicators: barData,
      severityDistribution: pieData.map(p => ({ severity: p.name, count: p.value })),
      keyFindings: keyFindings
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadNode = document.createElement('a');
    downloadNode.setAttribute("href", dataStr);
    downloadNode.setAttribute("download", "threat_intel_feed.json");
    document.body.appendChild(downloadNode);
    downloadNode.click();
    downloadNode.remove();
  };

  return (
    <div className="space-y-6" id="reports-container">
      <div className={`flex justify-between items-center ${reportType ? 'hidden' : 'hide-on-print'}`}>
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text-main)] flex items-center gap-2">
            <FileText className="text-[var(--color-primary)]" /> Automated Reports
          </h2>
          <p className="text-[var(--color-text-muted)]">Generate compliance, executive, and technical threat reports</p>
        </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${reportType ? 'hidden' : 'hide-on-print'}`}>
        <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 border-t-4 border-t-[var(--color-primary)] flex flex-col">
          <div className="w-12 h-12 rounded-full bg-[var(--color-primary-alpha-10)] flex items-center justify-center mb-4">
            <Briefcase size={24} className="text-[var(--color-primary)]" />
          </div>
          <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-2">Executive Summary</h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-6 flex-1">
            High-level overview of attack trends, risk exposure, and ROI of deceptive defenses for C-suite.
          </p>
          <button 
            onClick={() => handlePrintPDF('executive')}
            disabled={isGenerating}
            className="w-full bg-[var(--color-primary-alpha-10)] border border-[var(--color-primary-alpha-30)] hover:bg-[var(--color-primary-alpha-20)] text-[var(--color-primary)] px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} /> {isGenerating && reportType === 'executive' ? 'Generating…' : 'Generate PDF'}
          </button>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 border-t-4 border-t-[var(--color-tertiary)] flex flex-col">
          <div className="w-12 h-12 rounded-full bg-[var(--color-tertiary-alpha-10)] flex items-center justify-center mb-4">
            <BarChart2 size={24} className="text-[var(--color-tertiary)]" />
          </div>
          <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-2">Technical Analysis</h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-6 flex-1">
            Detailed metrics on exploited CVEs, top attacker IPs, payloads used, and honeypot interaction logs.
          </p>
          <button 
            onClick={() => handlePrintPDF('technical')}
            disabled={isGenerating}
            className="w-full bg-[var(--color-tertiary-alpha-10)] border border-[var(--color-tertiary-alpha-30)] hover:bg-[var(--color-tertiary-alpha-20)] text-[var(--color-tertiary)] px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} /> {isGenerating && reportType === 'technical' ? 'Generating…' : 'Generate PDF'}
          </button>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 border-t-4 border-t-[var(--color-secondary)] flex flex-col">
          <div className="w-12 h-12 rounded-full bg-[var(--color-secondary-alpha-10)] flex items-center justify-center mb-4">
            <BrainCircuit size={24} className="text-[var(--color-secondary)]" />
          </div>
          <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-2">Threat Intel Feed</h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-6 flex-1">
            STIX/TAXII compatible export of identified IOCs (Indicators of Compromise) and attacker TTPs.
          </p>
          <button 
            onClick={handleExportJSON}
            className="w-full bg-[var(--color-secondary-alpha-10)] border border-[var(--color-secondary-alpha-30)] hover:bg-[var(--color-secondary-alpha-20)] text-[var(--color-secondary)] px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors font-bold"
          >
            <FileText size={16} /> Export JSON
          </button>
        </motion.div>
      </div>

      <div className={`glass-panel p-6 mt-8 ${reportType ? 'mt-0 border-none shadow-none' : 'print-panel'}`} id="report-preview">
        <div className={`flex justify-between items-center mb-6 ${reportType ? 'hidden' : 'hide-on-print'}`}>
          <h3 className="text-xl font-bold text-[var(--color-text-main)]">Report Preview: Q3 Threat Landscape</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-[var(--color-bg-active)] hover:bg-[var(--color-bg-active-hover)] rounded text-xs text-[var(--color-text-main)] transition-colors">This Week</button>
            <button className="px-3 py-1 bg-[var(--color-primary-alpha-20)] border border-[var(--color-primary-alpha-40)] rounded text-xs text-[var(--color-primary)] transition-colors">This Quarter</button>
          </div>
        </div>
        
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border-glass)] rounded-lg p-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
            <FileText size={300} />
          </div>
          
          <div className="flex justify-between items-start mb-8 relative z-10 border-b border-[var(--color-border-glass)] pb-6">
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text-main)] tracking-wider mb-2">DecepShield AI</h1>
              <p className="text-[var(--color-secondary)] font-medium">
                {reportType === 'executive' ? 'Executive Threat Exposure & ROI Summary' : 
                 reportType === 'technical' ? 'Technical Incident Analysis Report' : 
                 'Quarterly Threat Intelligence Report'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[var(--color-text-main)] font-mono text-sm mb-1">Generated: {new Date().toISOString().split('T')[0]}</p>
              <p className="text-[var(--color-tertiary)] font-mono text-xs border border-[var(--color-tertiary-alpha-30)] bg-[var(--color-tertiary-alpha-10)] px-2 py-1 rounded inline-block">CONFIDENTIAL</p>
            </div>
          </div>
          
          {/* Executive Summary Unique Layout */}
          {(!reportType || reportType === 'executive') && (
            <div className="mb-8 relative z-10">
              <h4 className="text-[var(--color-text-main)] font-bold mb-4 flex items-center gap-2">
                <Briefcase size={18} className="text-[var(--color-primary)]" /> Business Risk & Deflection Metrics
              </h4>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[var(--color-bg-base)] border border-green-500/30 p-4 rounded-lg">
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">Estimated Cost Saved</p>
                  <p className="text-2xl font-bold text-green-400">$1.4M</p>
                  <p className="text-xs text-green-500/70 mt-1">Based on prevented breaches</p>
                </div>
                <div className="bg-[var(--color-bg-base)] border border-[var(--color-tertiary-alpha-30)] p-4 rounded-lg">
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">Active Decoys Deployed</p>
                  <p className="text-2xl font-bold text-[var(--color-tertiary)]">142</p>
                  <p className="text-xs text-[var(--color-tertiary)]/70 mt-1">Across 3 global regions</p>
                </div>
                <div className="bg-[var(--color-bg-base)] border border-[var(--color-secondary-alpha-30)] p-4 rounded-lg">
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">Overall Risk Posture</p>
                  <p className="text-2xl font-bold text-[var(--color-secondary)]">Low</p>
                  <p className="text-xs text-[var(--color-secondary)]/70 mt-1">98% threats contained in honeypot</p>
                </div>
              </div>
              <div className="bg-[var(--color-bg-base)] p-4 rounded-lg border border-[var(--color-border-glass)]">
                <h5 className="font-bold text-[var(--color-text-main)] mb-2">Executive Overview</h5>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  During this quarter, DecepShield AI effectively diverted over {totalEvents.toLocaleString()} unauthorized access attempts into isolated honeypot environments. This proactive defense strategy absorbed automated reconnaissance and targeted brute-force attacks, completely shielding production databases and internal employee portals. No production assets were compromised.
                </p>
              </div>
            </div>
          )}

          {/* Technical Analysis Unique Layout */}
          {(!reportType || reportType === 'technical') && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div>
                  <h4 className="text-[var(--color-text-main)] font-bold mb-4 flex items-center gap-2">
                    <BarChart2 size={18} className="text-[var(--color-primary)]" /> Top Attack Vectors
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                        <XAxis type="number" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                        <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.8)', fontSize: 12}} width={80} />
                        <Tooltip 
                          cursor={{fill: 'rgba(255,255,255,0.05)'}}
                          contentStyle={{ backgroundColor: 'rgba(20, 20, 30, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        />
                        <Bar dataKey="value" fill="var(--color-neon-blue)" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-[var(--color-text-main)] font-bold mb-4 flex items-center gap-2">
                    <BrainCircuit size={18} className="text-[var(--color-secondary)]" /> Incident Severity Distribution
                  </h4>
                  <div className="h-64 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'rgba(20, 20, 30, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                      <span className="text-2xl font-bold text-[var(--color-text-main)]">{totalEvents}</span>
                      <span className="text-xs text-[var(--color-text-muted)]">Total Events</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 border-t border-[var(--color-border-glass)] pt-6 relative z-10">
                 <h4 className="text-[var(--color-text-main)] font-bold mb-4 flex items-center gap-2">
                   <BrainCircuit size={18} className="text-[var(--color-primary)]" /> Real-Time Key Findings (Technical)
                 </h4>
                 <ul className="space-y-3">
                   {keyFindings.length > 0 ? (
                     keyFindings.map((finding, idx) => (
                       <li key={idx} className="flex gap-3">
                         <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${idx === 0 ? 'bg-[var(--color-tertiary)]' : idx === 1 ? 'bg-[var(--color-secondary)]' : 'bg-[var(--color-primary)]'}`}></div>
                         <p className="text-sm text-[var(--color-text-muted)]">
                           <strong className="text-[var(--color-text-main)]">{finding.title}:</strong> {finding.description}
                         </p>
                       </li>
                     ))
                   ) : (
                     <li className="flex gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 shrink-0"></div>
                       <p className="text-sm text-[var(--color-text-muted)]">No analytical findings yet.</p>
                     </li>
                   )}
                 </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
