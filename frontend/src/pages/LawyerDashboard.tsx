
import {
    FileText, Clock,
    Zap, Plus, Filter,
    Search
} from 'lucide-react';

const LawyerDashboard = () => {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-serif font-bold">Case Preparation</h2>
                    <p className="text-muted-foreground mt-1">Management of active files and evidence submission.</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-primary text-white px-6 py-2.5 rounded text-sm font-bold shadow-judicial flex items-center gap-2">
                        <Plus size={18} />
                        New Case File
                    </button>
                </div>
            </div>

            {/* Preparation Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-border p-6 rounded shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">My Active Cases</span>
                        <FileText size={18} className="text-primary" />
                    </div>
                    <p className="text-3xl font-serif font-bold">14</p>
                    <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-[65%]" />
                    </div>
                    <p className="text-[10px] font-medium text-muted-foreground mt-2">65% Readiness score across all files</p>
                </div>

                <div className="bg-white border border-border p-6 rounded shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pending Evidence</span>
                        <Zap size={18} className="text-amber-500" />
                    </div>
                    <p className="text-3xl font-serif font-bold">09</p>
                    <div className="mt-4 flex gap-1">
                        {[1, 1, 1, 0, 0].map((v, i) => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full ${v ? 'bg-amber-500' : 'bg-muted'}`} />
                        ))}
                    </div>
                    <p className="text-[10px] font-medium text-muted-foreground mt-2">3 critical files requiring immediate review</p>
                </div>

                <div className="bg-white border border-border p-6 rounded shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Court Deadlines</span>
                        <Clock size={18} className="text-destructive" />
                    </div>
                    <p className="text-3xl font-serif font-bold">03</p>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-[10px] bg-destructive/10 text-destructive font-bold px-2 py-0.5 rounded">T-24h: Sterling Case</span>
                    </div>
                    <p className="text-[10px] font-medium text-muted-foreground mt-2">Highest priority task: Memorial submission</p>
                </div>
            </div>

            {/* Files & AI Suggestions */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Active Files List */}
                <div className="lg:col-span-3 bg-white border border-border rounded shadow-sm">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <h3 className="font-serif font-bold text-lg">Active Case Load</h3>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input type="text" placeholder="Filter cases..." className="pl-9 pr-3 py-1.5 bg-muted border-none rounded text-xs w-48" />
                            </div>
                            <button className="p-2 hover:bg-muted rounded transition-colors"><Filter size={16} /></button>
                        </div>
                    </div>
                    <div className="p-0">
                        <table className="w-full text-left">
                            <thead className="bg-muted text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-3">Case Reference</th>
                                    <th className="px-6 py-3">Client / Party</th>
                                    <th className="px-6 py-3">Integrity</th>
                                    <th className="px-6 py-3">Next Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {[
                                    { ref: 'REF-2025-A', party: 'Global Tech Industries', integrity: 98, action: 'Evidence Validation' },
                                    { ref: 'REF-2025-B', party: 'CloudCorp Solutions', integrity: 100, action: 'Final Review' },
                                    { ref: 'REF-2025-C', party: 'Private Sector Trust', integrity: 85, action: 'Upload Missing P-01' },
                                ].map((item, i) => (
                                    <tr key={i} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold">{item.ref}</td>
                                        <td className="px-6 py-4 text-sm font-medium">{item.party}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-1 bg-muted rounded-full">
                                                    <div className="bg-steel-green h-full" style={{ width: `${item.integrity}%` }} />
                                                </div>
                                                <span className="text-[10px] font-bold text-muted-foreground">{item.integrity}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold bg-muted px-2 py-1 rounded border border-border">{item.action}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* AI Suggestions (Contextual Lawyer AI) */}
                <div className="space-y-6">
                    <div className="bg-white border border-border rounded shadow-sm p-6 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-12 -mt-12" />
                        <h4 className="font-serif font-bold mb-4 relative z-10">AI Recommendations</h4>
                        <div className="space-y-4">
                            <div className="border-l-2 border-primary pl-4 py-1">
                                <p className="text-xs font-bold text-primary mb-1">Evidence Pattern</p>
                                <p className="text-xs text-muted-foreground">Similar evidence was rejected in Case B-12. Review Section 4 before filing.</p>
                            </div>
                            <div className="border-l-2 border-amber-500 pl-4 py-1">
                                <p className="text-xs font-bold text-amber-500 mb-1">Missing Link</p>
                                <p className="text-xs text-muted-foreground">Witness A mentions a contract dated 2024-10-01 which is not yet in evidence.</p>
                            </div>
                            <div className="border-l-2 border-steel-green pl-4 py-1">
                                <p className="text-xs font-bold text-steel-green mb-1">Search Hack</p>
                                <p className="text-xs text-muted-foreground">Use keyword "recursive" to find related precedents in Judicial Archive.</p>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-2 bg-muted text-foreground text-xs font-bold rounded hover:bg-slate-200 transition-colors">
                            View All Strategy Notes
                        </button>
                    </div>

                    <div className="bg-slate-900 text-white rounded p-6 shadow-judicial">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap size={16} className="text-amber-500" />
                            <h4 className="text-sm font-bold">Veritas Pro-Tip</h4>
                        </div>
                        <p className="text-xs text-white/70 leading-relaxed">
                            Always verify the SHA-256 hash stamp before presenting digital evidence. This ensures immediate acceptance by the Bench.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LawyerDashboard;
