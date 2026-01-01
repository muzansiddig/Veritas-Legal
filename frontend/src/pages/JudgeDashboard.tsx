
import {
    Gavel, Users, Clock, AlertTriangle,
    ArrowUpRight
} from 'lucide-react';

const JudgeDashboard = () => {
    return (
        <div className="space-y-8">
            {/* Header / Stats */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-serif font-bold">Judicial Oversight</h2>
                    <p className="text-muted-foreground mt-1">High-level summary of active cases and procedural health.</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-white border border-border px-4 py-2 rounded text-sm font-bold hover:bg-muted transition-colors">
                        Session Calendar
                    </button>
                    <button className="bg-primary text-white px-4 py-2 rounded text-sm font-bold shadow-judicial">
                        New Decision Draft
                    </button>
                </div>
            </div>

            {/* Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Active Cases', value: '42', icon: <Gavel size={24} />, color: 'text-primary', trend: '+3 this week' },
                    { label: 'Hearings Today', value: '08', icon: <Users size={24} />, color: 'text-steel-green', trend: 'Next in 45m' },
                    { label: 'Pending Decisions', value: '12', icon: <Clock size={24} />, color: 'text-amber-500', trend: 'Avg 4d delay' },
                    { label: 'Conflict Alerts', value: '03', icon: <AlertTriangle size={24} />, color: 'text-destructive', trend: 'Action required' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 border border-border rounded shadow-sm hover:shadow-judicial transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("p-2 rounded bg-muted group-hover:bg-white transition-colors", stat.color)}>
                                {stat.icon}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                {stat.trend}
                            </span>
                        </div>
                        <h4 className="text-muted-foreground text-xs font-bold uppercase tracking-wider">{stat.label}</h4>
                        <p className="text-3xl font-serif font-bold mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Actionable List & Procedural Health */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Sessions */}
                <div className="lg:col-span-2 bg-white border border-border rounded shadow-sm">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <h3 className="font-serif font-bold text-lg">Active Sessions & Filings</h3>
                        <button className="text-primary text-sm font-bold hover:underline">View All</button>
                    </div>
                    <div className="p-0">
                        <table className="w-full text-left">
                            <thead className="bg-muted text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-3">Case ID</th>
                                    <th className="px-6 py-3">Parties</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {[
                                    { id: 'CIV-2025-0042', parties: 'Sterling vs. Global Tech', status: 'Active', color: 'bg-steel-green' },
                                    { id: 'CRM-2025-0918', parties: 'State vs. Doe', status: 'In Review', color: 'bg-amber-500' },
                                    { id: 'CIV-2025-0103', parties: 'Muzanal vs. CloudCorp', status: 'Conflict', color: 'bg-destructive' },
                                ].map((item, i) => (
                                    <tr key={i} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-mono font-bold text-primary">{item.id}</td>
                                        <td className="px-6 py-4 text-sm font-medium">{item.parties}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-2 h-2 rounded-full", item.color)} />
                                                <span className="text-xs font-bold">{item.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="p-1 hover:text-primary transition-colors">
                                                <ArrowUpRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Procedural Alerts */}
                <div className="bg-primary text-white p-8 rounded shadow-judicial-lg flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center">
                            <BrainCircuit size={24} className="text-amber-500" />
                        </div>
                        <div>
                            <h3 className="font-serif font-bold text-lg leading-tight">Veritas AI Insights</h3>
                            <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Analysis Engine Active</p>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div className="bg-white/5 border border-white/10 p-4 rounded hover:bg-white/10 transition-colors cursor-pointer group">
                            <p className="text-xs text-amber-500 font-bold mb-1">Temporal Conflict</p>
                            <p className="text-sm font-medium">Exhibit B-12 contradicts witness testimony in Case CIV-0042.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded hover:bg-white/10 transition-colors cursor-pointer">
                            <p className="text-xs text-steel-green font-bold mb-1">Pattern Detected</p>
                            <p className="text-sm font-medium">Global Tech shows recursive filing behavior in 3 active cases.</p>
                        </div>
                    </div>

                    <button className="mt-8 w-full bg-white text-primary py-3 rounded text-sm font-bold hover:bg-slate-100 transition-colors">
                        Launch System Analysis
                    </button>
                </div>
            </div>
        </div>
    );
};

// Simple utility to make the component standalone for now
const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');
const BrainCircuit = ({ className }: any) => <div className={className}>🧠</div>;

export default JudgeDashboard;
