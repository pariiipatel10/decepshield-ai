import { FileSearch, Download, FileJson, FileText, Hash } from 'lucide-react';

const MOCK_EVIDENCE = [
  { id: 'EV-1001', type: 'PCAP', name: 'network_capture_session_9a.pcap', size: '14.2 MB', date: '2026-07-12 14:22', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
  { id: 'EV-1002', type: 'JSON', name: 'raw_events_session_9a.json', size: '245 KB', date: '2026-07-12 14:25', hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4' },
  { id: 'EV-1003', type: 'LOG', name: 'auth_attempts.log', size: '1.1 MB', date: '2026-07-12 12:10', hash: 'd98c2579b4a1b027877c4155b9e847dc35c24a52c3c9597371f4ea2b2b1eb96d' },
  { id: 'EV-1004', type: 'IMAGE', name: 'screenshot_vnc_attempt.png', size: '4.5 MB', date: '2026-07-11 09:44', hash: 'c52b66236315579d1d6a6b5c3be9426f030fbaf4a26e4e5e78ecfb93635905d4' },
];

const Evidence = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text-main)] flex items-center gap-2">
            <FileSearch className="text-[var(--color-primary)]" /> Evidence Management
          </h2>
          <p className="text-[var(--color-text-muted)]">Secure repository of captured attacker artifacts with cryptographic hashes</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => alert('Exporting evidence data to JSON...')}
            className="bg-[var(--color-bg-hover)] border border-[var(--color-border-glass)] hover:bg-[var(--color-bg-active)] text-[var(--color-text-main)] px-4 py-2 rounded flex items-center gap-2 transition-colors text-sm"
          >
            <FileJson size={16} /> Export JSON
          </button>
          <button 
            onClick={() => alert('Generating Evidence PDF Report...')}
            className="bg-[var(--color-primary-alpha-10)] border border-[var(--color-primary-alpha-30)] hover:bg-[var(--color-primary-alpha-20)] text-[var(--color-primary)] px-4 py-2 rounded flex items-center gap-2 transition-colors text-sm"
          >
            <Download size={16} /> Export PDF Report
          </button>
        </div>
      </div>

      <div className="glass-panel w-full overflow-hidden">
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
                <th className="p-4 font-medium text-[var(--color-text-muted)] text-sm whitespace-nowrap text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_EVIDENCE.map((item) => (
                <tr key={item.id} className="border-b border-[var(--color-border-glass)] hover:bg-[var(--color-bg-hover)] transition-colors group">
                  <td className="p-4 text-[var(--color-text-main)] font-mono text-sm whitespace-nowrap">{item.id}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded bg-[var(--color-bg-active)] text-[var(--color-text-main)] text-xs font-bold border border-[var(--color-border-glass)]">
                      {item.type}
                    </span>
                  </td>
                  <td 
                    className="p-4 text-[var(--color-primary)] text-sm hover:underline cursor-pointer flex items-center gap-2 whitespace-nowrap"
                    onClick={() => alert(`Opening preview for ${item.name}...`)}
                  >
                    <FileText size={14} /> {item.name}
                  </td>
                  <td className="p-4 text-[var(--color-text-muted)] text-sm whitespace-nowrap">{item.size}</td>
                  <td className="p-4 text-[var(--color-text-muted)] text-sm whitespace-nowrap">{item.date}</td>
                  <td className="p-4 text-[var(--color-text-muted)] font-mono text-xs max-w-[200px] truncate relative">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-[var(--color-text-main)] transition-colors" onClick={() => { navigator.clipboard.writeText(item.hash); alert('Hash copied to clipboard!'); }}>
                      <Hash size={12} className="text-[var(--color-secondary)] flex-shrink-0" />
                      <span className="truncate">{item.hash}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button 
                      onClick={() => alert(`Downloading evidence package for ${item.id}...`)}
                      className="p-2 rounded hover:bg-[var(--color-bg-active)] text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-alpha-50)]" 
                      title="Download Evidence"
                    >
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Evidence;
