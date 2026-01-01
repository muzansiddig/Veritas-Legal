import { useState } from 'react';
import {
    Plus, Search, Filter, MoreHorizontal,
    CheckCircle2, Clock, Tag, LayoutDashboard, List
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const TasksPage = () => {
    const [activeBoard, setActiveBoard] = useState<'board' | 'list'>('board');

    const [tasks] = useState([
        { id: '1', title: 'Review Artifact Recovery Report', status: 'In Progress', priority: 'High', due: '2025-12-30', assignee: 'Hon. Vance', project: 'CR-2025-0042' },
        { id: '2', title: 'File Defense Motion for Discovery', status: 'Pending', priority: 'Critical', due: '2026-01-05', assignee: 'J. Sterling', project: 'CR-2025-0042' },
        { id: '3', title: 'Witness Interview Transcription', status: 'In Progress', priority: 'Medium', due: '2025-12-31', assignee: 'A. Miller', project: 'CV-2025-0108' },
        { id: '4', title: 'Evidence Hash Verification', status: 'Completed', priority: 'Low', due: '2025-12-28', assignee: 'Veritas Node', project: 'SYSTEM-LOG' },
    ]);

    const columns = ['Pending', 'In Progress', 'Completed'];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">Hearings & Deadlines</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Operational task management for the judicial workflow.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-muted border border-border p-1 rounded flex">
                        <button
                            onClick={() => setActiveBoard('board')}
                            className={cn(
                                "px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all flex items-center gap-2",
                                activeBoard === 'board' ? "bg-white text-primary shadow-sm border border-border/50" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <LayoutDashboard size={14} /> Board
                        </button>
                        <button
                            onClick={() => setActiveBoard('list')}
                            className={cn(
                                "px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all flex items-center gap-2",
                                activeBoard === 'list' ? "bg-white text-primary shadow-sm border border-border/50" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <List size={14} /> Registry
                        </button>
                    </div>
                    <button className="bg-primary text-white px-6 py-2 rounded text-xs font-bold shadow-judicial flex items-center gap-2">
                        <Plus size={16} /> New Requirement
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Search requirements by ID, Law Officer, or Case Reference..."
                        className="w-full bg-white border border-border pl-12 pr-4 py-2.5 rounded text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                </div>
                <button className="px-4 py-2 border border-border rounded bg-white hover:bg-muted font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <Filter size={14} /> Filter Set
                </button>
            </div>

            {activeBoard === 'board' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {columns.map(col => (
                        <div key={col} className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        col === 'Pending' ? 'bg-slate-400' : col === 'In Progress' ? 'bg-primary' : 'bg-steel-green'
                                    )} />
                                    {col}
                                    <span className="ml-2 text-[10px] opacity-60">[{tasks.filter(t => t.status === col).length}]</span>
                                </h3>
                                <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal size={14} /></button>
                            </div>

                            <div className="space-y-4 min-h-[600px] p-4 bg-muted/30 border border-border border-dashed rounded">
                                {tasks.filter(t => t.status === col).map(task => (
                                    <div key={task.id} className="bg-white border border-border p-5 rounded shadow-sm hover:border-primary/40 transition-all cursor-pointer group">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider",
                                                task.priority === 'Critical' ? 'bg-destructive/10 text-destructive' :
                                                    task.priority === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-muted text-muted-foreground'
                                            )}>
                                                {task.priority}
                                            </span>
                                            <button className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight size={14} /></button>
                                        </div>
                                        <h4 className="font-serif font-bold text-sm mb-2 group-hover:text-primary transition-colors">{task.title}</h4>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1 mb-4">
                                            <Tag size={10} /> {task.project}
                                        </p>

                                        <div className="flex items-center justify-between pt-4 border-t border-border">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-primary text-[10px] font-bold">
                                                    {task.assignee.substring(0, 2)}
                                                </div>
                                                <span className="text-[10px] font-bold text-muted-foreground italic">{task.assignee}</span>
                                            </div>
                                            <div className={cn(
                                                "flex items-center gap-1 text-[10px] font-bold font-mono",
                                                new Date(task.due) < new Date() ? 'text-destructive' : 'text-muted-foreground'
                                            )}>
                                                <Clock size={10} /> {task.due}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full py-3 border border-border border-dashed rounded text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-white hover:text-primary transition-all flex items-center justify-center gap-2">
                                    <Plus size={12} /> Add Entry
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-border rounded shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-6 py-4 border-b border-border">Title / ID</th>
                                <th className="px-6 py-4 border-b border-border">Case Context</th>
                                <th className="px-6 py-4 border-b border-border">Expiry Date</th>
                                <th className="px-6 py-4 border-b border-border">Execution Officer</th>
                                <th className="px-6 py-4 border-b border-border">State</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {tasks.map(task => (
                                <tr key={task.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {task.status === 'Completed' ? <CheckCircle2 className="text-steel-green" size={18} /> : <div className="w-4 h-4 rounded border border-border" />}
                                            <div>
                                                <p className="font-serif font-bold text-sm">{task.title}</p>
                                                <p className="text-[9px] font-mono text-muted-foreground">REQ-{task.id}000X</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-primary">{task.project}</td>
                                    <td className="px-6 py-4 text-xs font-mono font-bold">{task.due}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-primary font-bold text-[10px] uppercase">
                                                {task.assignee.substring(0, 2)}
                                            </div>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{task.assignee}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider",
                                            task.status === 'Completed' ? 'bg-steel-green/10 text-steel-green' : 'bg-primary/10 text-primary'
                                        )}>
                                            {task.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const ArrowRight = ({ className }: any) => <div className={className}>➡️</div>;

export default TasksPage;
