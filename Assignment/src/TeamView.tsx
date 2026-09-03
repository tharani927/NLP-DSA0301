import React from 'react';
import { 
  Users, 
  Award, 
  BookOpen, 
  Code, 
  CheckCircle2, 
  Sparkles, 
  GraduationCap, 
  Layers, 
  Cpu 
} from 'lucide-react';
import { TEAM_MEMBERS } from '../../data/sampleDataset';

export const TeamView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-700 mb-1">
          <Users className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">Project Team & Contribution Distribution</h2>
        </div>
        <p className="text-xs text-slate-500">
          Academic details and individual module responsibilities for the College Slot A Natural Language Processing Assignment.
        </p>
      </div>

      {/* Course & Assignment Metadata Card */}
      <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs shadow-xs">
        <div>
          <span className="text-slate-400 block text-[11px] mb-0.5 font-bold uppercase tracking-wider">Course Title</span>
          <strong className="text-slate-900 text-sm">Natural Language Processing (NLP)</strong>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px] mb-0.5 font-bold uppercase tracking-wider">Assignment Slot</span>
          <strong className="text-emerald-700 text-sm">Slot A Assignment (DSA0301)</strong>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px] mb-0.5 font-bold uppercase tracking-wider">Domain Area</span>
          <strong className="text-slate-800 text-sm">Customer Support Ticket Retrieval</strong>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px] mb-0.5 font-bold uppercase tracking-wider">Implementation Status</span>
          <strong className="text-emerald-700 text-sm">100% Fully Functional & Tested</strong>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TEAM_MEMBERS.map((member, idx) => (
          <div 
            key={idx}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-black text-lg">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
                  <span className="text-xs text-emerald-700 font-bold">{member.role}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                Team Member #{idx + 1}
              </span>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Assigned Technical Modules & Responsibilities:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {member.contributions.map((contrib, cIdx) => (
                  <li key={cIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{contrib}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Collaboration & Peer Review Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
          <GraduationCap className="w-4 h-4 text-emerald-600" />
          Academic Honor Code & Execution Standards
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          This system was collaboratively engineered by <strong>Tharani, Lalitha, Tejasri, and Anusha</strong>. 
          All mathematical formulations for text preprocessing, Porter stemming suffix reduction, Penn Treebank POS classification, 
          Vector Space TF-IDF Cosine Similarity, Okapi BM25 ranking, and quantitative information retrieval evaluation metrics (Precision@K, Recall@K, F1@K, MRR) 
          are directly implemented in custom TypeScript algorithms without relying on black-box server-side dependencies.
        </p>
      </div>
    </div>
  );
};
