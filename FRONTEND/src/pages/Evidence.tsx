import { useState, useEffect, useContext } from 'react';
import { FileSearch, Download, FileText, Hash, Trash2, Plus, X } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Evidence = () => {
  const { token } = useContext(AuthContext) || {};
  const [evidence, setEvidence] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'PCAP', size: '' });

  // Fetch Evidence
  const fetchEvidence = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/evidence', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvidence(res.data);
    } catch (err) {
      console.error('Failed to fetch evidence:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchEvidence();
  }, [token]);

  // Submit Manual Evidence
  const handleSubmitEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/evidence', {
        type: formData.type,
        name: formData.name || 'unnamed_artifact.log',
        size: formData.size || '0 KB'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowForm(false);
      setFormData({ name: '', type: 'PCAP', size: '' });
      fetchEvidence(); // Refresh list
    } catch (err) {
      console.error('Failed to add evidence:', err);
    }
  };

  // Delete Evidence
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/api/evidence/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvidence(); // Refresh list
    } catch (err) {
      console.error('Failed to delete evidence:', err);
    }
  };

  // Generate PDF
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6" id="evidence-container">
      {/* Header */}
      <div className="flex justify-between items-center hide-on-print">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text-main)] flex items-center gap-2">
            <FileSearch className="text-[var(--color-primary)]" /> Evidence Management
          </h2>
          <p className="text-[var(--color-text-muted)]">Secure repository of captured attacker artifacts</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowForm(true)}
            className="bg-[var(--color-secondary-alpha-10)] border border-[var(--color-secondary-alpha-30)] hover:bg-[var(--color-secondary-alpha-20)] text-[var(--color-secondary)] px-4 py-2 rounded flex items-center gap-2 transition-colors text-sm font-bold"
          >
            <Plus size={16} /> Upload Evidence
          </button>
          <button 
            onClick={handlePrintPDF}
            className="bg-[var(--color-primary-alpha-10)] border border-[var(--color-primary-alpha-30)] hover:bg-[var(--color-primary-alpha-20)] text-[var(--color-primary)] px-4 py-2 rounded flex items-center gap-2 transition-colors text-sm font-bold"
          >
            <Download size={16} /> Export PDF Report
          </button>
        </div>
      </div>

      {/* Manual Upload Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center hide-on-print">
          <div className="bg-[var(--color-bg-base)] border border-[var(--color-border-glass)] p-6 rounded-xl w-[400px] shadow-2xl relative">
            <button 
              onClick={() => setShowForm(false)} 
              className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-2">
              <FileSearch className="text-[var(--color-secondary)]" /> Upload New Evidence
            </h3>
            
            <form onSubmit={handleSubmitEvidence} className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--color-text-muted)] mb-1">File Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. suspicious_payload.exe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[var(--color-bg-card)] border border-[var(--color-border-glass)] rounded p-2 text-white focus:outline-none focus:border-[var(--color-secondary)]"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--color-text-muted)] mb-1">File Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-[var(--color-bg-card)] border border-[var(--color-border-glass)] rounded p-2 text-white focus:outline-none focus:border-[var(--color-secondary)]"
                >
                  <option value="PCAP">PCAP (Network Capture)</option>
                  <option value="LOG">LOG (Text Log)</option>
                  <option value="JSON">JSON (Raw Data)</option>
                  <option value="EXE">EXE (Executable)</option>
                  <option value="IMAGE">IMAGE (Screenshot)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[var(--color-text-muted)] mb-1">File Size</label>
                <input 
                  type="text" 
                  placeholder="e.g. 2.4 MB"
                  value={formData.size}
                  onChange={(e) => setFormData({...formData, size: e.target.value})}
                  className="w-full bg-[var(--color-bg-card)] border border-[var(--color-border-glass)] rounded p-2 text-white focus:outline-none focus:border-[var(--color-secondary)]"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-[var(--color-secondary)] hover:bg-amber-400 text-black font-bold py-2 rounded mt-2 transition-colors"
              >
                Save Evidence
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="glass-panel w-full overflow-hidden print-panel">
        <div className="hidden print-header p-6 border-b border-[var(--color-border-glass)] mb-4">
           <h1 className="text-3xl font-bold text-[var(--color-text-main)] tracking-wider mb-2">DecepShield AI</h1>
           <p className="text-[var(--color-secondary)] font-medium">Chain of Custody - Evidence Report</p>
           <p className="text-[var(--color-text-main)] font-mono text-sm mt-4">Generated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="w-full overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[var(--color-border-glass)] bg-[var(--color-bg-card)]">
                <th className="p-4 font-medium text-[var(--color-text-muted)] text-sm whitespace-nowrap">ID</th>
                <th className="p-4 font-medium text-[var(--color-text-muted)] text-sm whitespace-nowrap">TYPE</th>
                <th className="p-4 font-medium text-[var(--color-text-muted)] text-sm whitespace-nowrap">FILE NAME</th>
                <th className="p-4 font-medium text-[var(--color-text-muted)] text-sm whitespace-nowrap">SIZE</th>
                <th className="p-4 font-medium text-[var(--color-text-muted)] text-sm whitespace-nowrap">DATE</th>
                <th className="p-4 font-medium text-[var(--color-text-muted)] text-sm whitespace-nowrap">SHA-256 HASH</th>
                <th className="p-4 font-medium text-[var(--color-text-muted)] text-sm whitespace-nowrap text-right hide-on-print">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[var(--color-text-muted)]">Loading evidence...</td>
                </tr>
              ) : evidence.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[var(--color-text-muted)] italic">No evidence captured yet. Click "Upload Evidence" to demonstrate adding data!</td>
                </tr>
              ) : (
                evidence.map((item) => (
                  <tr key={item.id} className="border-b border-[var(--color-border-glass)] hover:bg-[var(--color-bg-hover)] transition-colors group">
                    <td className="p-4 text-[var(--color-text-main)] font-mono text-sm whitespace-nowrap">{item.id}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded bg-[var(--color-bg-active)] text-[var(--color-text-main)] text-xs font-bold border border-[var(--color-border-glass)] print-badge">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4 text-[var(--color-primary)] text-sm flex items-center gap-2 whitespace-nowrap">
                      <FileText size={14} /> {item.name}
                    </td>
                    <td className="p-4 text-[var(--color-text-muted)] text-sm whitespace-nowrap">{item.size}</td>
                    <td className="p-4 text-[var(--color-text-muted)] text-sm whitespace-nowrap">{item.date}</td>
                    <td className="p-4 text-[var(--color-text-muted)] font-mono text-xs max-w-[200px] truncate relative">
                      <div className="flex items-center gap-1">
                        <Hash size={12} className="text-[var(--color-secondary)] flex-shrink-0" />
                        <span className="truncate">{item.hash}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap hide-on-print">
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded hover:bg-red-900/30 text-[var(--color-text-muted)] hover:text-red-400 transition-colors" 
                        title="Delete Evidence"
                      >
                        <Trash2 size={16} />
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
  );
};

export default Evidence;
