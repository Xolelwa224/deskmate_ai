import { useState } from 'react';
import {
  HardHat, Wallet, ClipboardCheck, Users, FileText, BarChart3,
  ArrowRight, MapPin, Calendar, Building2, Ruler, Phone, Mail,
  Linkedin, Facebook, Instagram, Twitter, ShieldCheck, Sparkles,
  CheckCircle2, ChevronRight, Construction,
} from 'lucide-react';
import { Logo } from './ui/Logo';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { ProgressBar } from './ui/ProgressBar';
import { Input, Textarea, Select } from './ui/Form';
import { useStore } from '../store/StoreContext';
import { formatCurrency, formatDate } from '../utils/format';
import { images } from '../data/seed';
import type { ProjectType } from '../types';

interface LandingPageProps {
  onEnterApp: () => void;
}

export function LandingPage({ onEnterApp }: LandingPageProps) {
  const { projects, addEnquiry } = useStore();
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const portfolioProjects = projects.slice(0, 6);

  const services = [
    { icon: ClipboardCheck, title: 'Construction Project Planning', desc: 'Helping clients understand project scope, timelines, resources and priorities before construction begins.' },
    { icon: Wallet, title: 'Cost & Budget Consulting', desc: 'Track project budgets, estimated costs, actual spending and potential overruns.' },
    { icon: HardHat, title: 'Site Inspection & Monitoring', desc: 'Record site observations, construction progress, safety concerns and outstanding work.' },
    { icon: Users, title: 'Contractor Coordination', desc: 'Keep contractors, suppliers and project stakeholders aligned.' },
    { icon: FileText, title: 'Construction Documentation', desc: 'Manage project documents, reports, quotations and inspection records.' },
    { icon: BarChart3, title: 'Project Progress Management', desc: 'Monitor milestones, deadlines, completion percentages and project health.' },
  ];

  const trustItems = [
    { icon: ClipboardCheck, label: 'Project Planning' },
    { icon: Wallet, label: 'Cost Management' },
    { icon: HardHat, label: 'Site Monitoring' },
    { icon: Building2, label: 'Construction Consulting' },
  ];

  return (
    <div className="min-h-screen bg-charcoal-900">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-charcoal-950/80 backdrop-blur-md border-b border-charcoal-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-7 text-sm text-charcoal-300">
            <a href="#services" className="hover:text-cream-100 transition-colors">Services</a>
            <a href="#portfolio" className="hover:text-cream-100 transition-colors">Projects</a>
            <a href="#about" className="hover:text-cream-100 transition-colors">About</a>
            <a href="#contact" className="hover:text-cream-100 transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onEnterApp} className="hidden sm:inline-flex">
              Client Login
            </Button>
            <Button size="sm" onClick={() => setShowEnquiry(true)}>
              Start a Project
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 sm:pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={images.heroConstruction} alt="Construction site" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 via-charcoal-950/85 to-charcoal-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-charcoal-950/50" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <Badge variant="terracotta" size="md" >
              <MapPin size={12} /> Mbombela, Mpumalanga
            </Badge>
            <h1 className="font-display font-extrabold text-cream-50 text-4xl sm:text-5xl lg:text-6xl leading-tight mt-4 text-balance">
              Plan Better. Build Smarter. Deliver With Confidence.
            </h1>
            <p className="text-cream-200/80 text-lg mt-5 leading-relaxed max-w-xl">
              Construction consulting and project management support for residential, commercial and development projects.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Button size="lg" onClick={() => setShowEnquiry(true)}>
                Start a Project <ArrowRight size={18} />
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}>
                View Our Projects
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-charcoal-800 border-y border-charcoal-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-terracotta-600/10 text-terracotta-400 shrink-0">
                    <Icon size={20} />
                  </div>
                  <span className="text-sm font-medium text-cream-100">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="olive" size="md">Our Services</Badge>
            <h2 className="font-display font-bold text-cream-50 text-3xl sm:text-4xl mt-4">
              Construction consulting that covers every phase
            </h2>
            <p className="text-charcoal-400 mt-4">
              From initial planning to final handover, we help you manage costs, monitor quality and keep your project on track.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="group bg-charcoal-800 border border-charcoal-700/60 rounded-xl p-6 hover:border-terracotta-600/40 hover:shadow-elevated transition-all duration-300"
                >
                  <div className="p-3 rounded-xl bg-terracotta-600/10 text-terracotta-400 w-fit group-hover:scale-110 transition-transform duration-300">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-display font-bold text-cream-100 text-lg mt-4">{service.title}</h3>
                  <p className="text-sm text-charcoal-400 mt-2 leading-relaxed">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="py-20 px-4 sm:px-6 bg-charcoal-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="terracotta" size="md">Project Portfolio</Badge>
            <h2 className="font-display font-bold text-cream-50 text-3xl sm:text-4xl mt-4">
              Selected projects we've consulted on
            </h2>
            <p className="text-charcoal-400 mt-4 text-sm">
              Sample portfolio data shown for demonstration purposes.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolioProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-charcoal-800 border border-charcoal-700/60 rounded-xl overflow-hidden hover:shadow-elevated transition-all duration-300"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="terracotta" size="sm">{project.type}</Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-display font-bold text-cream-50 text-lg">{project.name}</h3>
                    <p className="text-xs text-cream-200/70 flex items-center gap-1 mt-0.5">
                      <MapPin size={11} /> {project.location}
                    </p>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-charcoal-400">Budget</span>
                    <span className="text-cream-100 font-medium">{formatCurrency(project.budget)}</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-charcoal-400">Progress</span>
                      <span className="text-cream-100 font-medium">{project.progress}%</span>
                    </div>
                    <ProgressBar value={project.progress} size="sm" />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <Badge variant={project.status === 'Completed' ? 'success' : project.status === 'At Risk' ? 'warning' : 'info'} size="sm">{project.status}</Badge>
                    {project.progress === 100 && (
                      <span className="text-xs text-olive-400 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="outline" size="lg" onClick={onEnterApp}>
              View All Projects in Dashboard <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="olive" size="md">About Us</Badge>
              <h2 className="font-display font-bold text-cream-50 text-3xl sm:text-4xl mt-4 leading-tight">
                A modern construction consulting company built on practical project management
              </h2>
              <p className="text-charcoal-300 mt-5 leading-relaxed">
                Xolelwa BuildConsult focuses on the fundamentals that make construction projects succeed:
                planning, project coordination, cost awareness, site monitoring, documentation and clear client communication.
              </p>
              <p className="text-charcoal-400 mt-4 leading-relaxed">
                We work alongside clients, contractors and suppliers to keep projects organised, transparent and on budget —
                from the first sketch to the final handover.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { icon: ClipboardCheck, label: 'Planning & Coordination' },
                  { icon: Wallet, label: 'Cost Awareness' },
                  { icon: HardHat, label: 'Site Monitoring' },
                  { icon: FileText, label: 'Documentation' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-2.5">
                      <Icon size={18} className="text-terracotta-400 shrink-0" />
                      <span className="text-sm text-cream-100">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative">
              <div className="bg-charcoal-800 border border-charcoal-700/60 rounded-2xl p-8">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-terracotta-600/40 shrink-0">
                    <img src={images.founder} alt="Xolelwa Lubisi" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-cream-50 text-xl">Xolelwa Lubisi</h3>
                    <p className="text-sm text-terracotta-400 mt-0.5">Founder & Construction Project Consultant</p>
                  </div>
                </div>
                <p className="text-sm text-charcoal-300 mt-5 leading-relaxed">
                  "I started Xolelwa BuildConsult to bring structure and transparency to construction projects.
                  Too many projects run over budget and behind schedule because the basics — planning, tracking and communication —
                  aren't done well. Our job is to make sure they are."
                </p>
                <div className="mt-5 pt-5 border-t border-charcoal-700/50">
                  <p className="text-xs text-charcoal-500">
                    This is a demonstration portfolio business application showcasing construction consulting and project management capabilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="py-20 px-4 sm:px-6 bg-charcoal-950/50">
        <div className="max-w-4xl mx-auto text-center">
          <ShieldCheck size={36} className="text-terracotta-400 mx-auto" />
          <h2 className="font-display font-bold text-cream-50 text-3xl sm:text-4xl mt-4">
            Ready to start your project?
          </h2>
          <p className="text-charcoal-400 mt-4 max-w-xl mx-auto">
            Tell us about your project and our consulting team will review the information and get back to you.
          </p>
          <div className="mt-8">
            <Button size="lg" onClick={() => setShowEnquiry(true)}>
              Start Your Project <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal-950 border-t border-charcoal-800/50 px-4 sm:px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="sm:col-span-2">
              <Logo />
              <p className="text-sm text-charcoal-400 mt-4 max-w-xs leading-relaxed">
                Plan Better. Build Smarter. Deliver With Confidence.
              </p>
              <p className="text-xs text-charcoal-500 mt-4 max-w-xs">
                Construction consulting and project management support for residential, commercial and development projects.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-display font-semibold text-cream-100 mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#services" className="text-charcoal-400 hover:text-cream-100 transition-colors">Services</a></li>
                <li><a href="#portfolio" className="text-charcoal-400 hover:text-cream-100 transition-colors">Projects</a></li>
                <li><a href="#about" className="text-charcoal-400 hover:text-cream-100 transition-colors">About</a></li>
                <li><a href="#contact" className="text-charcoal-400 hover:text-cream-100 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-display font-semibold text-cream-100 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-charcoal-400 hover:text-cream-100 transition-colors">Privacy</a></li>
                <li><a href="#" className="text-charcoal-400 hover:text-cream-100 transition-colors">Terms</a></li>
              </ul>
              <div className="flex items-center gap-3 mt-4">
                <a href="#" className="p-2 rounded-lg bg-charcoal-800 text-charcoal-400 hover:text-cream-100 hover:bg-charcoal-700 transition-colors"><Linkedin size={16} /></a>
                <a href="#" className="p-2 rounded-lg bg-charcoal-800 text-charcoal-400 hover:text-cream-100 hover:bg-charcoal-700 transition-colors"><Facebook size={16} /></a>
                <a href="#" className="p-2 rounded-lg bg-charcoal-800 text-charcoal-400 hover:text-cream-100 hover:bg-charcoal-700 transition-colors"><Instagram size={16} /></a>
                <a href="#" className="p-2 rounded-lg bg-charcoal-800 text-charcoal-400 hover:text-cream-100 hover:bg-charcoal-700 transition-colors"><Twitter size={16} /></a>
              </div>
            </div>
          </div>
          <div className="border-t border-charcoal-800/50 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-charcoal-500">© 2026 Xolelwa BuildConsult. Demo portfolio application.</p>
            <div className="flex items-center gap-2 text-xs text-charcoal-500">
              <Construction size={14} className="text-terracotta-500" />
              <span>Built for demonstration purposes</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Enquiry Modal */}
      {showEnquiry && (
        <EnquiryForm
          onClose={() => { setShowEnquiry(false); setSubmitted(false); }}
          onSubmit={(data) => { addEnquiry(data); setSubmitted(true); }}
          submitted={submitted}
          onEnterApp={onEnterApp}
        />
      )}
    </div>
  );
}

interface EnquiryFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  submitted: boolean;
  onEnterApp: () => void;
}

function EnquiryForm({ onClose, onSubmit, submitted, onEnterApp }: EnquiryFormProps) {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', projectType: '', location: '',
    estimatedBudget: '', expectedStartDate: '', description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Required';
    if (!form.email.trim()) newErrors.email = 'Required';
    if (!form.phone.trim()) newErrors.phone = 'Required';
    if (!form.projectType) newErrors.projectType = 'Required';
    if (!form.description.trim()) newErrors.description = 'Required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        ...form,
        date: new Date().toISOString().split('T')[0],
        status: 'New' as const,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-charcoal-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[92vh] bg-charcoal-800 border border-charcoal-700 rounded-t-2xl sm:rounded-2xl shadow-elevated flex flex-col animate-slide-up">
        <div className="px-5 py-4 border-b border-charcoal-700/60 shrink-0">
          <h2 className="text-lg font-display font-bold text-cream-100">Start Your Project</h2>
          <p className="text-xs text-charcoal-400 mt-1">Tell us about your project and we'll be in touch.</p>
        </div>

        {submitted ? (
          <div className="px-5 py-12 text-center flex-1">
            <div className="w-16 h-16 rounded-full bg-olive-600/15 border border-olive-600/30 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} className="text-olive-400" />
            </div>
            <h3 className="font-display font-bold text-cream-50 text-lg mt-5">Enquiry Received</h3>
            <p className="text-sm text-charcoal-400 mt-3 max-w-sm mx-auto leading-relaxed">
              Thank you. Your project enquiry has been received. Our consulting team will review the information and contact you.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <Button variant="outline" onClick={onClose}>Close</Button>
              <Button onClick={onEnterApp}>View in Dashboard</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1">
              <Input label="Full Name" value={form.fullName} onChange={(v) => set('fullName', v)} required error={errors.fullName} placeholder="John Doe" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Email" type="email" value={form.email} onChange={(v) => set('email', v)} required error={errors.email} placeholder="john@email.com" icon={<Mail size={16} />} />
                <Input label="Phone" value={form.phone} onChange={(v) => set('phone', v)} required error={errors.phone} placeholder="082 123 4567" icon={<Phone size={16} />} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Project Type"
                  value={form.projectType}
                  onChange={(v) => set('projectType', v)}
                  required
                  placeholder="Select type"
                  options={[
                    { value: 'Residential', label: 'Residential' },
                    { value: 'Commercial', label: 'Commercial' },
                    { value: 'Renovation', label: 'Renovation' },
                    { value: 'Interior', label: 'Interior' },
                    { value: 'Infrastructure', label: 'Infrastructure' },
                    { value: 'Other', label: 'Other' },
                  ]}
                />
                <Input label="Project Location" value={form.location} onChange={(v) => set('location', v)} placeholder="e.g. Mbombela" icon={<MapPin size={16} />} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Estimated Budget"
                  value={form.estimatedBudget}
                  onChange={(v) => set('estimatedBudget', v)}
                  placeholder="Select range"
                  options={[
                    { value: 'Under R500K', label: 'Under R500K' },
                    { value: 'R500K - R1M', label: 'R500K - R1M' },
                    { value: 'R1M - R5M', label: 'R1M - R5M' },
                    { value: 'R5M - R10M', label: 'R5M - R10M' },
                    { value: 'Over R10M', label: 'Over R10M' },
                  ]}
                />
                <Input label="Expected Start Date" type="date" value={form.expectedStartDate} onChange={(v) => set('expectedStartDate', v)} icon={<Calendar size={16} />} />
              </div>
              <Textarea label="Project Description" value={form.description} onChange={(v) => set('description', v)} required error={errors.description} rows={4} placeholder="Tell us about your project..." />
            </div>
            <div className="px-5 py-4 border-t border-charcoal-700/60 flex items-center justify-end gap-3 shrink-0">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSubmit}>Submit Enquiry</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
