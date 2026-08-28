import { useState } from 'react';
import { Calculator, Ruler, Package } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Form';
import { PageHeader } from '../components/ui/PageHeader';
import { formatCurrencyFull } from '../utils/format';

export function Calculators() {
  const [activeCalc, setActiveCalc] = useState('budget');

  return (
    <div className="p-4 sm:p-6 pb-20 lg:pb-6 animate-fade-in">
      <PageHeader title="Calculators" description="Construction cost and measurement calculators" />

      <div className="flex gap-2 mb-5">
        <CalcTab id="budget" label="Budget Calculator" icon={Calculator} active={activeCalc} onClick={setActiveCalc} />
        <CalcTab id="area" label="Area Calculator" icon={Ruler} active={activeCalc} onClick={setActiveCalc} />
        <CalcTab id="material" label="Material Cost" icon={Package} active={activeCalc} onClick={setActiveCalc} />
      </div>

      {activeCalc === 'budget' && <BudgetCalculator />}
      {activeCalc === 'area' && <AreaCalculator />}
      {activeCalc === 'material' && <MaterialCostCalculator />}
    </div>
  );
}

function CalcTab({ id, label, icon: Icon, active, onClick }: { id: string; label: string; icon: typeof Calculator; active: string; onClick: (id: string) => void }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${active === id ? 'bg-terracotta-600/15 text-terracotta-300 border border-terracotta-600/30' : 'text-charcoal-400 hover:text-charcoal-200 border border-transparent'}`}
    >
      <Icon size={16} /> <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function BudgetCalculator() {
  const [materials, setMaterials] = useState('');
  const [labour, setLabour] = useState('');
  const [equipment, setEquipment] = useState('');
  const [professionalFees, setProfessionalFees] = useState('');
  const [other, setOther] = useState('');

  const m = Number(materials) || 0, l = Number(labour) || 0, e = Number(equipment) || 0;
  const p = Number(professionalFees) || 0, o = Number(other) || 0;
  const subtotal = m + l + e + p + o;
  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  return (
    <Card className="p-5 max-w-lg">
      <div className="space-y-4">
        <Input label="Materials (R)" type="number" value={materials} onChange={setMaterials} placeholder="0" />
        <Input label="Labour (R)" type="number" value={labour} onChange={setLabour} placeholder="0" />
        <Input label="Equipment (R)" type="number" value={equipment} onChange={setEquipment} placeholder="0" />
        <Input label="Professional Fees (R)" type="number" value={professionalFees} onChange={setProfessionalFees} placeholder="0" />
        <Input label="Other Costs (R)" type="number" value={other} onChange={setOther} placeholder="0" />
        <div className="bg-charcoal-900/60 rounded-lg p-4 border border-charcoal-700/40 space-y-2">
          <div className="flex items-center justify-between text-sm"><span className="text-charcoal-400">Subtotal</span><span className="text-cream-100 font-medium">{formatCurrencyFull(subtotal)}</span></div>
          <div className="flex items-center justify-between text-sm"><span className="text-charcoal-400">VAT (15%)</span><span className="text-cream-100 font-medium">{formatCurrencyFull(vat)}</span></div>
          <div className="flex items-center justify-between text-lg font-display font-bold pt-2 border-t border-charcoal-700/40"><span className="text-cream-100">Estimated Project Cost</span><span className="text-terracotta-400">{formatCurrencyFull(total)}</span></div>
        </div>
      </div>
    </Card>
  );
}

function AreaCalculator() {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const l = Number(length) || 0, w = Number(width) || 0;
  const area = l * w;

  return (
    <Card className="p-5 max-w-lg">
      <div className="space-y-4">
        <Input label="Length (m)" type="number" value={length} onChange={setLength} placeholder="0" />
        <Input label="Width (m)" type="number" value={width} onChange={setWidth} placeholder="0" />
        <div className="bg-charcoal-900/60 rounded-lg p-4 border border-charcoal-700/40">
          <div className="flex items-center justify-between text-lg font-display font-bold"><span className="text-cream-100">Area</span><span className="text-terracotta-400">{area.toLocaleString()} m²</span></div>
        </div>
      </div>
    </Card>
  );
}

function MaterialCostCalculator() {
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const q = Number(quantity) || 0, up = Number(unitPrice) || 0;
  const total = q * up;

  return (
    <Card className="p-5 max-w-lg">
      <div className="space-y-4">
        <Input label="Quantity" type="number" value={quantity} onChange={setQuantity} placeholder="0" />
        <Input label="Unit Price (R)" type="number" value={unitPrice} onChange={setUnitPrice} placeholder="0" />
        <div className="bg-charcoal-900/60 rounded-lg p-4 border border-charcoal-700/40">
          <div className="flex items-center justify-between text-lg font-display font-bold"><span className="text-cream-100">Total Cost</span><span className="text-terracotta-400">{formatCurrencyFull(total)}</span></div>
        </div>
      </div>
    </Card>
  );
}
