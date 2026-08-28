import { useState } from 'react';
import { Sparkles, Send, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { useStore } from '../store/StoreContext';
import { formatDate } from '../utils/format';

const examplePrompts = [
  'Summarise this project.',
  'Identify potential budget risks.',
  'Create a weekly progress summary.',
  'Turn my site inspection notes into a report.',
  'Create a client update from these project notes.',
  'Explain this construction term.',
];

function generateResponse(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes('summar')) {
    return 'Based on the current project data, you have 6 active projects with a combined value of R42.8M. Two projects are flagged as At Risk (Nkomazi Commercial Centre and Mbombela Logistics Warehouse), primarily due to budget overruns on steelwork. The Riverside Family Residence is 78% complete and on track for November handover.';
  }
  if (p.includes('budget') && p.includes('risk')) {
    return 'Potential budget risks identified:\n\n1. Nkomazi Commercial Centre — actual cost at 52% of budget but only 52% complete. Steel costs are the main driver.\n2. Mbombela Logistics Warehouse — 55% over budget on steelwork. Recommend re-tendering the steel subcontract.\n3. Cement supply in the region is tightening — consider increasing buffer stock.';
  }
  if (p.includes('weekly') || p.includes('progress')) {
    return 'Weekly Progress Summary (Week of 27 August 2026):\n\n• Riverside Residence: Tiling 80% complete, ceiling installation started. On track.\n• Nkomazi Centre: Steel columns installed for units 3-4. Critical safety issues identified — edge protection needs reinforcement.\n• Warehouse: Brickwork 70% on east wall. Quality issue with joint alignment — re-pointing required.\n• 4 inspections completed this week, 1 flagged Critical.\n• 3 tasks overdue, 2 due today.';
  }
  if (p.includes('inspection')) {
    return 'Based on the latest inspection records, here is a formatted report summary:\n\nThe most critical inspection was at Nkomazi Commercial Centre on 22 August. Key findings: water accumulation in north excavation, formwork movement, and a worker without safety boots (sent off site). Recommended actions: reinforce edge protection, pump water, and recheck formwork before the next concrete pour.';
  }
  if (p.includes('client')) {
    return 'Client Update — Riverside Family Residence:\n\nDear Thabo and Nomsa,\n\nProgress this week: Tiling is 80% complete in the living areas and ceiling installation has begun in the main bedroom. A minor grout colour mismatch was identified and a sample has been approved before continuing.\n\nNext steps: Electrical rough-in is scheduled for this week, and a plumbing inspection is booked for 29 August. We remain on track for your November handover.\n\nBest regards,\nXolelwa Lubisi';
  }
  if (p.includes('term') || p.includes('explain')) {
    return 'Common construction terms:\n\n• Blinding concrete: A thin layer of low-grade concrete placed below foundations to provide a clean, level working surface.\n• Rebar: Reinforcing steel bars embedded in concrete to increase tensile strength.\n• Snag list: A list of minor defects or incomplete work that needs fixing before handover.\n• BOQ (Bill of Quantities): A document listing all materials, parts and labour quantities needed for a project.';
  }
  return 'I can help with project summaries, budget risk analysis, progress reports, inspection notes, client updates, and construction terminology. Try one of the example prompts above, or ask me about your current projects.';
}

export function AIAssistant() {
  const { chatMessages, addChatMessage } = useStore();
  const [input, setInput] = useState('');

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    addChatMessage({ role: 'user', content: text });
    setInput('');
    setTimeout(() => {
      const response = generateResponse(text);
      addChatMessage({ role: 'assistant', content: response });
    }, 500);
  };

  return (
    <div className="p-4 sm:p-6 pb-20 lg:pb-6 animate-fade-in">
      <PageHeader title="BuildAssist" description="Your construction productivity assistant" />

      <Card className="p-4 mb-4 border-terracotta-600/20 bg-terracotta-600/5">
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="text-terracotta-400 shrink-0 mt-0.5" />
          <p className="text-sm text-charcoal-300">AI-generated suggestions should be reviewed by a qualified professional before being used for construction, financial, safety or contractual decisions.</p>
        </div>
      </Card>

      {chatMessages.length === 0 && (
        <Card className="p-5 mb-4">
          <h3 className="text-sm font-display font-semibold text-cream-100 mb-3">Try these prompts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {examplePrompts.map((prompt) => (
              <button key={prompt} onClick={() => sendMessage(prompt)}
                className="text-left text-sm text-charcoal-300 p-3 rounded-lg bg-charcoal-900/40 border border-charcoal-700/30 hover:border-terracotta-600/40 hover:text-cream-100 transition-colors">
                {prompt}
              </button>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-4 mb-4 min-h-[200px]">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <Sparkles size={36} className="text-terracotta-400/60 mb-3" />
            <p className="text-sm text-charcoal-400">Ask me anything about your projects.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-terracotta-600/20 border border-terracotta-600/30' : 'bg-charcoal-900/50 border border-charcoal-700/40'}`}>
                  <p className="text-sm text-cream-100 whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-[10px] text-charcoal-500 mt-1.5">{formatDate(msg.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="Type your question..."
          className="flex-1 bg-charcoal-800 border border-charcoal-600/60 rounded-lg text-sm text-cream-100 placeholder-charcoal-500 px-4 py-2.5 focus:outline-none focus:border-terracotta-500/60 focus:ring-1 focus:ring-terracotta-500/30 transition-colors"
        />
        <Button onClick={() => sendMessage(input)}><Send size={16} /> Send</Button>
      </div>
    </div>
  );
}
