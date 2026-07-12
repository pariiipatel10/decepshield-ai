import { Construction } from 'lucide-react';

const PlaceholderPage = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
      <div className="w-20 h-20 rounded-full bg-[var(--color-bg-hover)] border border-[var(--color-border-glass)] flex items-center justify-center mb-4">
        <Construction size={40} className="text-[var(--color-text-muted)]" />
      </div>
      <h2 className="text-3xl font-bold text-[var(--color-text-main)]">{title}</h2>
      <p className="text-[var(--color-text-muted)] max-w-md">
        This module is currently under active development. The AI models and data pipelines are being wired up.
      </p>
    </div>
  );
};

export default PlaceholderPage;
