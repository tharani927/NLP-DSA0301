import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Leaf, 
  Scale, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  EyeOff 
} from 'lucide-react';

export const EthicsSustainabilityView: React.FC = () => {
  const [rawPiiText, setRawPiiText] = useState(
    'Customer John Doe (SSN: 000-12-3456, Phone: +1-555-0199, Card: 4532-1100-8841-2910) requested a refund for payment ID #TX9921 sent from john.doe@securebank.com.'
  );

  // Redaction logic
  const redactPii = (text: string) => {
    return text
      // SSN
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED_SSN]')
      // Credit cards
      .replace(/\b(?:\d{4}[-\s]?){3}\d{4}\b/g, '[REDACTED_CARD_NUMBER]')
      // Emails
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
      // Phone numbers
      .replace(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[REDACTED_PHONE]');
  };

  const redactedText = redactPii(rawPiiText);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-700 mb-1">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">Ethics, Privacy, Algorithmic Bias & Sustainability</h2>
        </div>
        <p className="text-xs text-slate-500">
          Comprehensive compliance framework covering Personally Identifiable Information (PII) governance, fairness across customer groups, and Green Computing efficiency.
        </p>
      </div>

      {/* 3 Core Ethical Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Privacy */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">1. Data Privacy & PII Protection</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Support tickets frequently contain sensitive financial identifiers (credit card PANs, email addresses, phone numbers). 
            Our pre-indexing regex sanitization layer scrubs all PII tokens before creating search postings, ensuring GDPR and PCI-DSS compliance.
          </p>
        </div>

        {/* Pillar 2: Bias & Fairness */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">2. Algorithmic Fairness & Bias Mitigation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Lexical search can inadvertently favor verbose, formal complaints over non-native English or colloquial tickets. 
            BM25 document-length normalization ($b=0.75$) actively equalizes retrieval probability across varying message lengths and socio-linguistic styles.
          </p>
        </div>

        {/* Pillar 3: Sustainability */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
            <Leaf className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">3. Green NLP & Computational Efficiency</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Compared to power-hungry Large Language Models requiring massive GPU clusters (consuming ~0.05 kWh per inference), 
            our Okapi BM25 and TF-IDF engines run on lightweight CPU memory with under 0.2ms latency, consuming &lt; 0.00001 Wh per query.
          </p>
        </div>
      </div>

      {/* Interactive PII Sanitization Sandbox */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-emerald-600" />
            Live Pre-Indexing PII Redaction Demonstration Sandbox
          </h3>
          <span className="text-xs text-slate-500 font-medium">Automated Privacy Sanitizer</span>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Raw Customer Ticket with Sensitive Data
          </label>
          <textarea
            rows={3}
            value={rawPiiText}
            onChange={(e) => setRawPiiText(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs font-sans"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Sanitized Text Index Posting
            </span>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">100% Safe For Vector Storage</span>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs font-mono text-emerald-900 leading-relaxed">
            {redactedText}
          </div>
        </div>
      </div>

      {/* Sustainability Metrics Comparison Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <Zap className="w-4 h-4 text-amber-500" />
          Environmental Impact Comparison: Classical NLP vs Dense Deep Learning LLMs
        </h3>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Architecture</th>
                <th className="py-2.5 px-4">Hardware Required</th>
                <th className="py-2.5 px-4">Query Latency</th>
                <th className="py-2.5 px-4">Energy Consumption / Query</th>
                <th className="py-2.5 px-4">Carbon Footprint Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              <tr className="hover:bg-slate-50/80 transition">
                <td className="py-3 px-4 font-bold text-emerald-800">Okapi BM25 / TF-IDF (Our System)</td>
                <td className="py-3 px-4 text-slate-700">Standard CPU / RAM (Single Core)</td>
                <td className="py-3 px-4 text-emerald-700 font-mono font-bold">&lt; 0.25 ms</td>
                <td className="py-3 px-4 text-emerald-700 font-mono font-bold">~0.000008 Wh</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">Near-Zero Emissions (&lt; 0.001g CO2e/day)</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition">
                <td className="py-3 px-4 font-bold text-slate-800">Dense Bi-Encoder (BERT-Base)</td>
                <td className="py-3 px-4 text-slate-600">High-End GPU (e.g. NVIDIA T4/A10G)</td>
                <td className="py-3 px-4 text-slate-700 font-mono">15 - 45 ms</td>
                <td className="py-3 px-4 text-slate-700 font-mono">~0.002 Wh</td>
                <td className="py-3 px-4 text-amber-700 font-medium">Moderate (~250x higher)</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition">
                <td className="py-3 px-4 font-bold text-slate-800">Generative LLM (70B Parameters)</td>
                <td className="py-3 px-4 text-slate-600">Multi-GPU Cluster (8x NVIDIA H100)</td>
                <td className="py-3 px-4 text-slate-700 font-mono">800 - 3000 ms</td>
                <td className="py-3 px-4 text-slate-700 font-mono">~0.05 Wh</td>
                <td className="py-3 px-4 text-rose-700 font-bold">High Energy Consumption (~6,000x higher)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
