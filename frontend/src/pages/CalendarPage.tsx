import { useState } from 'react';
import {
    ChevronLeft, ChevronRight, Plus,
    Gavel, Users, Clock, MapPin
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const CalendarPage = () => {
    const [currentMonth] = useState('December 2025');

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const events = [
        { id: '1', day: 20, title: 'Case Registration Set', type: 'system', case: 'State vs. Doe' },
        { id: '2', day: 22, title: 'Preliminary Hearing', type: 'hearing', case: 'State vs. Doe', time: '10:00 AM' },
        { id: '3', day: 29, title: 'Exhibit Analysis Session', type: 'task', case: 'State vs. Doe', time: '02:00 PM' },
        { id: '4', day: 31, title: 'Submission Deadline', type: 'deadline', case: 'TechCorp Case', time: '05:00 PM' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">Judicial Session Calendar</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Official scheduling of court sessions, hearings, and procedural deadlines.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white border border-border rounded p-1">
                        <button className="p-2 hover:bg-muted rounded"><ChevronLeft size={18} /></button>
                        <span className="px-6 text-xs font-bold uppercase tracking-widest min-w-[140px] text-center">{currentMonth}</span>
                        <button className="p-2 hover:bg-muted rounded"><ChevronRight size={18} /></button>
                    </div>
                    <button className="bg-primary text-white px-6 py-2.5 rounded text-xs font-bold shadow-judicial flex items-center gap-2">
                        <Plus size={16} /> New Session
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Calendar Grid */}
                <div className="lg:col-span-3 bg-white border border-border rounded shadow-sm overflow-hidden">
                    <div className="grid grid-cols-7 border-b bg-muted/50">
                        {weekDays.map(day => (
                            <div key={day} className="py-3 text-center text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em]">{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 auto-rows-[140px]">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={`empty-${i}`} className="border-r border-b border-border bg-muted/20" />
                        ))}
                        {days.map(day => (
                            <div key={day} className="border-r border-b border-border p-3 group hover:bg-muted/30 transition-colors relative">
                                <span className={cn(
                                    "text-xs font-bold font-mono",
                                    day === 29 ? "w-6 h-6 bg-primary text-white rounded flex items-center justify-center -ml-1 -mt-1 shadow-sm" : "text-slate-400 group-hover:text-primary transition-colors"
                                )}>
                                    {day}
                                </span>
                                <div className="mt-4 space-y-1">
                                    {events.filter(e => e.day === day).map(event => (
                                        <div key={event.id} className={cn(
                                            "p-1.5 rounded text-[9px] font-bold border truncate",
                                            event.type === 'hearing' ? "bg-amber-100 text-amber-700 border-amber-200" :
                                                event.type === 'deadline' ? "bg-destructive/10 text-destructive border-destructive/20" :
                                                    "bg-primary/10 text-primary border-primary/20"
                                        )}>
                                            {event.time && <span className="mr-1 opacity-60">[{event.time}]</span>}
                                            {event.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Events */}
                <div className="space-y-6">
                    <div className="bg-white border border-border p-6 rounded shadow-sm">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                            <Clock size={14} className="text-primary" /> Today's Sessions
                        </h3>
                        <div className="space-y-8">
                            <div className="relative pl-6 border-l-2 border-primary">
                                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded bg-primary" />
                                <p className="text-[9px] font-bold text-primary uppercase tracking-widest leading-none">14:00 HRS</p>
                                <h4 className="font-serif font-bold text-sm mt-2">Exhibit Analysis Session</h4>
                                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1"><MapPin size={10} /> Judicial Chamber 402</p>
                                <div className="mt-3 px-2 py-1 bg-muted rounded text-[9px] font-bold text-muted-foreground inline-block">
                                    CR-2025-0042
                                </div>
                            </div>

                            <div className="relative pl-6 border-l-2 border-border">
                                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded bg-border" />
                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">T+24 HRS</p>
                                <h4 className="font-serif font-bold text-sm mt-2 text-muted-foreground">Expert Consultation</h4>
                                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1"><Users size={10} /> Forensic Node Integration</p>
                                <div className="mt-3 px-2 py-1 bg-muted rounded text-[9px] font-bold text-muted-foreground inline-block opacity-60">
                                    CV-2025-0108
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary text-white p-8 rounded shadow-judicial flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center mb-4">
                            <Gavel size={24} className="text-amber-500" />
                        </div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Integrity Advisory</h4>
                        <p className="text-xs text-white/70 leading-relaxed mb-6 italic">
                            All scheduled sessions are immutable once locked into the blockchain ledger. Discrepancies must be signed by the Registry.
                        </p>
                        <button className="w-full py-3 bg-white/5 border border-white/10 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 transition-all">
                            Review Institutional Rules
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
