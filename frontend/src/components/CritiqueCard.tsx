import React from 'react';
import { ArchitectureCritique } from '../types/critique';
import { 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert, 
  DollarSign, 
  Lightbulb, 
  BrainCircuit,
  Target
} from 'lucide-react';

interface CritiqueCardProps {
  critique: ArchitectureCritique;
}

export default function CritiqueCard({ critique }: CritiqueCardProps) {
  // Helper function to render a list with a specific icon and color scheme
  const renderListSection = (
    title: string, 
    items: string[], 
    Icon: React.ElementType, 
    colorClass: string,
    bgColorClass: string
  ) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className={`p-5 rounded-xl border ${bgColorClass} mb-4`}>
        <div className="flex items-center space-x-2 mb-3">
          <Icon className={`w-5 h-5 ${colorClass}`} />
          <h3 className={`font-semibold ${colorClass}`}>{title}</h3>
        </div>
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start text-sm text-slate-700">
              <span className={`mr-2 mt-1 min-w-[6px] h-[6px] rounded-full ${colorClass.replace('text-', 'bg-')}`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Header: Score & Summary */}
      <div className="p-6 border-b border-slate-100 bg-slate-50">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2 text-slate-800">
            <Target className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold">Architecture Analysis</h2>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-3xl font-extrabold text-blue-600">
              {critique.confidence_score}<span className="text-lg text-slate-400">/100</span>
            </div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">AI Confidence</p>
          </div>
        </div>
        
        <p className="text-slate-700 leading-relaxed text-sm">
          {critique.summary}
        </p>
      </div>

      {/* Body: The Detailed Critique */}
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {renderListSection(
            "Critical Bottlenecks", 
            critique.bottlenecks, 
            AlertTriangle, 
            "text-red-700", 
            "bg-red-50 border-red-100"
          )}
          
          {renderListSection(
            "Scalability Risks", 
            critique.scalability_risks, 
            TrendingUp, 
            "text-orange-700", 
            "bg-orange-50 border-orange-100"
          )}
          
          {renderListSection(
            "Reliability Gaps", 
            critique.reliability_gaps, 
            ShieldAlert, 
            "text-yellow-700", 
            "bg-yellow-50 border-yellow-100"
          )}
          
          {renderListSection(
            "Cost Inefficiencies", 
            critique.cost_red_flags, 
            DollarSign, 
            "text-purple-700", 
            "bg-purple-50 border-purple-100"
          )}
        </div>

        {/* Suggested Improvements (Full Width) */}
        {renderListSection(
          "Suggested Improvements", 
          critique.suggested_improvements, 
          Lightbulb, 
          "text-emerald-700", 
          "bg-emerald-50 border-emerald-100"
        )}

        {/* AI Reasoning Footer */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center space-x-2 mb-2 text-slate-600">
            <BrainCircuit className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">AI Reasoning</h4>
          </div>
          <p className="text-xs text-slate-600 italic">
            "{critique.reasoning}"
          </p>
        </div>
      </div>
    </div>
  );
}