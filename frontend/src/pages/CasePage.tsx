import { useState } from 'react';
import {
    Plus, Search, Filter,
    AlertCircle, FileText, ArrowLeft,
    CheckCircle2,
    Clock, Activity,
    BrainCircuit, ChevronRight, Download, Archive, Lock
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}



const CasePage = () => {
    const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
    const [activeTab, setActiveTab] = useState<'evidence' | 'timeline' | 'parties' | 'audit'>('evidence');
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
    const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);

    // Mock Data
    const mockCases = [
        {
            id: '1',
            title: 'State vs. Sterling Global',
            case_number: 'CR-2025-0042-S',
            status: 'Active',
            jurisdiction: 'District Court of Appeals',
            judge: 'Hon. Elizabeth Vance',
            procedural_progress: 65,
            parties: { plaintiff: 'The People', defendant: 'Sterling Global Corp' }
        },
        {
            id: '2',
            title: 'In re: CloudCorp Patent',
            case_number: 'CV-2025-0108-P',
            status: 'Hearing Set',
            jurisdiction: 'Federal Patent Court',
            judge: 'Hon. Robert Miller',
            procedural_progress: 30,
            parties: { plaintiff: 'InnovateSoft', defendant: 'CloudCorp' }
        }
    ];

    const currentCase = mockCases.find(c => c.id === selectedCaseId) || mockCases[0];

    const timelineEvents = [
        { date: '2025-10-14 14:00', title: 'Incident Chronology Start', type: 'incident', actor: 'System', verified: true },
        { date: '2025-11-02 09:15', title: 'Initial Evidence Filing', type: 'filing', actor: 'Lawyer (Defense)', verified: true },
        { date: '2025-11-02 09:20', title: 'SHA-256 Chain Initiation', type: 'system', actor: 'Veritas Node', verified: true },
        { date: '2025-12-20 10:00', title: 'Judicial Review Commenced', type: 'judicial', actor: 'Hon. Vance', verified: true },
        { date: '2025-12-29 16:45', title: 'AI Analysis Generation', type: 'ai', actor: 'Veritas AI', verified: false, conflict: true },
    ];

    return (
        <div className="flex h-full min-h-0 overflow-hidden -m-8">
            {/* Left: Main Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-background overflow-y-auto">
                <div className="p-10 max-w-6xl mx-auto w-full space-y-8">
                    {/* Breadcrumbs & Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {view !== 'list' && (
                                <button onClick={() => setView('list')} className="p-2 hover:bg-muted rounded transition-colors">
                                    <ArrowLeft size={18} />
                                </button>
                            )}
                            <div>
                                <h1 className="text-3xl font-serif font-bold text-primary">
                                    {view === 'list' ? 'Judicial Archive' : currentCase.title}
                                </h1>
                                <p className="text-muted-foreground text-sm font-medium mt-1">
                                    {view === 'list' ? 'Repository of active and archived legal matters.' : `Case ID: ${currentCase.case_number} • ${currentCase.jurisdiction}`}
                                </p>
                            </div>
                        </div>
                        {view === 'list' && (
                            <button onClick={() => setView('create')} className="bg-primary text-white px-6 py-2.5 rounded text-sm font-bold shadow-judicial flex items-center gap-2">
                                <Plus size={18} /> New Case Entry
                            </button>
                        )}
                    </div>

                    {view === 'list' ? (
                        <div className="space-y-6">
                            {/* Search & Filter */}
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                    <input type="text" placeholder="Search archive..." className="w-full bg-white border border-border pl-12 pr-4 py-3 rounded text-sm focus:ring-1 focus:ring-primary outline-none" />
                                </div>
                                <button className="px-4 py-2 border border-border rounded bg-white hover:bg-muted font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                    <Filter size={16} /> Filter
                                </button>
                            </div>

                            {/* Case Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {mockCases.map(c => (
                                    <div
                                        key={c.id}
                                        onClick={() => { setSelectedCaseId(c.id); setView('detail'); }}
                                        className="bg-white border border-border p-6 rounded shadow-sm hover:shadow-judicial hover:border-primary/40 transition-all cursor-pointer group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="bg-primary text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{c.status}</span>
                                            <Lock size={14} className="text-muted-foreground" />
                                        </div>
                                        <h3 className="text-xl font-serif font-bold group-hover:text-primary transition-colors">{c.title}</h3>
                                        <p className="font-mono text-[11px] text-muted-foreground mb-4">{c.case_number}</p>

                                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-border">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Integrity</p>
                                                <div className="flex items-center gap-1 text-steel-green">
                                                    <CheckCircle2 size={12} />
                                                    <span className="text-xs font-bold font-mono">Verified</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Progress</p>
                                                <p className="text-xs font-bold font-mono text-primary mt-1">{c.procedural_progress}%</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Detail View */
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {/* Case Context Bar */}
                            <div className="bg-white border border-border p-8 rounded shadow-sm flex flex-col md:flex-row gap-12">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Presiding Judge</p>
                                    <p className="font-serif font-bold text-primary">{currentCase.judge}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Parties</p>
                                    <p className="text-sm font-medium">{currentCase.parties.plaintiff} v. {currentCase.parties.defendant}</p>
                                </div>
                                <div className="flex-1 flex justify-end gap-3">
                                    <button onClick={() => setIsAIPanelOpen(!isAIPanelOpen)} className="bg-muted border border-border px-4 py-2 rounded text-xs font-bold flex items-center gap-2 hover:bg-slate-200 transition-colors">
                                        <BrainCircuit size={16} className="text-primary" /> AI Insights Drawer
                                    </button>
                                    <button className="bg-primary text-white px-6 py-2 rounded text-xs font-bold shadow-judicial">Submit Decision Draft</button>
                                </div>
                            </div>

                            {/* Sub-Navigation */}
                            <div className="flex gap-10 border-b border-border px-2 overflow-x-auto no-scrollbar">
                                {[
                                    { id: 'evidence', label: 'Judicial Library', icon: <Archive size={16} /> },
                                    { id: 'timeline', label: 'Procedural Events', icon: <Clock size={16} /> },
                                    { id: 'parties', label: 'Affiliated Entities', icon: <Users size={16} /> },
                                    { id: 'audit', label: 'System Logs', icon: <Activity size={16} /> }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={cn(
                                            "flex items-center gap-2 pb-4 text-xs font-bold uppercase tracking-widest transition-all relative border-b-2",
                                            activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {tab.icon} {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Evidence Library */}
                            {activeTab === 'evidence' && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="bg-white border border-border p-6 rounded shadow-sm hover:border-primary/30 transition-all flex gap-6">
                                            <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-primary shrink-0">
                                                <FileText size={32} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-serif font-bold text-lg truncate">Evidence_Exhibit_P-022_{i}.pdf</h4>
                                                    <Download size={16} className="text-muted-foreground cursor-pointer hover:text-primary" />
                                                </div>
                                                <p className="text-xs text-muted-foreground mb-4 font-mono">SHA-256: 0x82...{i}f7</p>
                                                <div className="flex gap-2">
                                                    <span className="text-[10px] font-bold bg-steel-green/10 text-steel-green px-2 py-0.5 rounded flex items-center gap-1">
                                                        <CheckCircle2 size={10} /> Validated
                                                    </span>
                                                    <span className="text-[10px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded">PDF DOCUMENT</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="border border-border border-dashed p-10 rounded flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer group">
                                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors mb-2">
                                            <Plus size={24} />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Add New Exhibit</span>
                                    </div>
                                </div>
                            )}

                            {/* Vertical Chronological Axis */}
                            {activeTab === 'timeline' && (
                                <div className="relative pl-12 pb-20 pt-4">
                                    <div className="absolute left-[23px] top-0 bottom-0 w-1 bg-border rounded-full" />
                                    <div className="space-y-12">
                                        {timelineEvents.map((ev, i) => (
                                            <div key={i} className="relative">
                                                <div className={cn(
                                                    "absolute left-[-24px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all",
                                                    ev.conflict ? "bg-destructive animate-pulse scale-125" : "bg-primary"
                                                )} />
                                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                                    <p className="text-[11px] font-mono font-bold text-muted-foreground shrink-0 w-32">{ev.date}</p>
                                                    <div className={cn(
                                                        "bg-white border p-5 rounded shadow-sm flex-1 flex items-center justify-between hover:border-primary/30 transition-all",
                                                        ev.conflict && "border-destructive/30 bg-destructive/[0.02]"
                                                    )}>
                                                        <div>
                                                            <h4 className="font-serif font-bold text-lg">{ev.title}</h4>
                                                            <p className="text-xs text-muted-foreground font-medium">Recorded by: <span className="text-foreground">{ev.actor}</span></p>
                                                        </div>
                                                        {ev.conflict ? (
                                                            <div className="flex items-center gap-2 text-destructive">
                                                                <AlertCircle size={16} />
                                                                <span className="text-[10px] font-bold uppercase tracking-widest">Inconsistency Found</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-steel-green opacity-40">
                                                                <Lock size={14} />
                                                                <span className="text-[10px] font-bold uppercase tracking-widest">Immutable</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Placeholder for others */}
                            {['parties', 'audit'].includes(activeTab) && (
                                <div className="p-20 border border-border border-dashed rounded text-center italic text-muted-foreground">
                                    Judicial data visualization preparing for this module...
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: AI Drawer / Sidepanel */}
            <aside className={cn(
                "w-96 bg-white border-l border-border transition-all duration-300 transform fixed right-0 top-20 bottom-0 z-40 shadow-2xl flex flex-col",
                isAIPanelOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="p-6 border-b border-border flex items-center justify-between bg-primary text-white">
                    <div className="flex items-center gap-2">
                        <BrainCircuit size={20} className="text-amber-500" />
                        <h3 className="font-serif font-bold text-lg">Veritas XAI Report</h3>
                    </div>
                    <button onClick={() => setIsAIPanelOpen(false)} className="hover:bg-white/10 p-1 rounded">
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Summary Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Intelligence Summary</span>
                            <span className="text-[10px] font-bold bg-steel-green/10 text-steel-green px-2 py-0.5 rounded">Confidence: 94%</span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-700 italic">
                            Evidence set P-022 significantly validates the Plaintiff's claim regarding the timestamp of the server breach but introduces a 2-hour discrepancy with witness statement W-04.
                        </p>
                    </div>

                    {/* Claims Section */}
                    <div className="space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Extracted Claims & Citations</span>
                        <div className="space-y-4">
                            {[
                                { finding: "System identifies 'Admin' as perpetrator.", source: "P-022.pdf" },
                                { finding: "Breach initiated from North Gate terminal.", source: "P-012.jpg" },
                                { finding: "Contradiction: Witness claims gate was locked.", source: "W-04.doc", risk: true },
                            ].map((claim, idx) => (
                                <div key={idx} className={cn(
                                    "p-4 border rounded space-y-2",
                                    claim.risk ? "border-destructive/20 bg-destructive/[0.03]" : "border-border bg-muted"
                                )}>
                                    <p className="text-xs font-medium leading-normal">{claim.finding}</p>
                                    <div className="flex items-center justify-between pt-2 border-t border-black/5">
                                        <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                                            <FileText size={10} /> Citation: {claim.source}
                                        </span>
                                        {claim.risk && <span className="text-[9px] font-bold text-destructive uppercase">High Risk</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-border bg-muted">
                    <button className="w-full bg-primary text-white py-3 rounded text-sm font-bold shadow-judicial">
                        Generate Official Findings
                    </button>
                </div>
            </aside>

            {/* Backdrop for mobile interaction */}
            {isAIPanelOpen && (
                <div onClick={() => setIsAIPanelOpen(false)} className="fixed inset-0 bg-black/50 z-30 transition-opacity" />
            )}
        </div>
    );
};

// Sub-components as placeholders
const Users = ({ className }: any) => <div className={className}>👥</div>;

export default CasePage;
