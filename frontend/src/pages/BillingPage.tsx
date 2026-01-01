import { useState } from 'react';
import {
    Plus, Search, Filter, MoreHorizontal,
    TrendingUp, FileText, Download, Clock, ShieldCheck
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const BillingPage = () => {
    const [invoices] = useState([
        { id: 'INV-2025-001-S', client: 'Sterling Global Corp', amount: 25000, status: 'Settled', date: '2025-12-20', due: '2025-12-27' },
        { id: 'INV-2025-002-C', client: 'CloudCorp Solutions', amount: 15400, status: 'Pending', date: '2025-12-25', due: '2026-01-01' },
        { id: 'INV-2025-003-I', client: 'InnovateSoft Ltd', amount: 1200, status: 'Contested', date: '2025-12-10', due: '2025-12-17' },
    ]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">Financial Ledger</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Official oversight of judicial fees, billable hours, and institutional settlements.</p>
                </div>
                <button className="bg-primary text-white px-6 py-2.5 rounded text-xs font-bold shadow-judicial flex items-center gap-2">
                    <Plus size={16} /> New Disbursement
                </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-border p-6 rounded shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-muted rounded text-primary"><TrendingUp size={24} /></div>
                        <div className="flex items-center gap-1 text-[9px] font-bold text-steel-green bg-steel-green/10 px-2 py-0.5 rounded uppercase">
                            +12.5% Performance
                        </div>
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Total Institutional Revenue</p>
                    <h2 className="text-3xl font-serif font-bold mt-2 text-primary">$1,124,500</h2>
                </div>

                <div className="bg-white border border-border p-6 rounded shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-muted rounded text-amber-500"><Clock size={24} /></div>
                        <div className="text-[9px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase font-mono">
                            REQ/AUTH-402
                        </div>
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Unsettled Invoices</p>
                    <h2 className="text-3xl font-serif font-bold mt-2 text-amber-500">$15,400</h2>
                </div>

                <div className="bg-white border border-border p-6 rounded shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-muted rounded text-primary"><FileText size={24} /></div>
                        <div className="flex items-center gap-1 text-[9px] font-bold text-steel-green bg-steel-green/10 px-2 py-0.5 rounded uppercase">
                            <ShieldCheck size={10} /> Certified
                        </div>
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Verified Billable Hours</p>
                    <h2 className="text-3xl font-serif font-bold mt-2 text-primary">1,142 <span className="text-sm font-sans font-medium text-muted-foreground">HRS</span></h2>
                </div>
            </div>

            {/* Invoices Ledger */}
            <div className="space-y-6">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Filter ledger by reference, entity, or status..."
                            className="w-full bg-white border border-border pl-12 pr-4 py-2.5 rounded text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                    </div>
                    <button className="px-4 py-2 border border-border rounded bg-white hover:bg-muted font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <Filter size={14} /> Criteria
                    </button>
                </div>

                <div className="bg-white border border-border rounded shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                                <tr>
                                    <th className="px-6 py-4 border-b border-border">System ID</th>
                                    <th className="px-6 py-4 border-b border-border">Target Entity</th>
                                    <th className="px-6 py-4 border-b border-border">Amount (USD)</th>
                                    <th className="px-6 py-4 border-b border-border">Certification Date</th>
                                    <th className="px-6 py-4 border-b border-border">Ledger State</th>
                                    <th className="px-6 py-4 border-b border-border text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {invoices.map(inv => (
                                    <tr key={inv.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <span className="font-mono text-[10px] font-bold text-primary">{inv.id}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="font-serif font-bold text-sm">{inv.client}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="font-mono font-bold text-sm italic">${inv.amount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-0.5">
                                                <p className="text-[10px] font-bold font-mono">{inv.date}</p>
                                                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Due: {inv.due}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider",
                                                inv.status === 'Settled' ? "bg-steel-green/10 text-steel-green" :
                                                    inv.status === 'Pending' ? "bg-amber-100 text-amber-700" :
                                                        "bg-destructive/10 text-destructive"
                                            )}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-3 text-muted-foreground">
                                                <button className="hover:text-primary transition-colors"><Download size={16} /></button>
                                                <button className="hover:text-primary transition-colors"><MoreHorizontal size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingPage;
