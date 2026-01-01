import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    Gavel, Shield, FileText, Clock,
    CheckSquare, BarChart3, Settings,
    Search, LogOut, Bell, BrainCircuit,
    Cpu, Activity, Menu, X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Layout = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Role Simulation (In a real app, this comes from AuthContext)
    const userRole: string = "Judge"; // or "Lawyer" / "Admin"

    const navItems = [
        { icon: <Activity size={20} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <FileText size={20} />, label: 'Cases', path: '/cases' },
        { icon: <Shield size={20} />, label: 'Evidence', path: '/evidence' },
        { icon: <Clock size={20} />, label: 'Timeline', path: '/timeline' },
        { icon: <CheckSquare size={20} />, label: 'Hearings & Tasks', path: '/tasks' },
        { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/analytics' },
    ];

    const adminItems = [
        { icon: <Settings size={20} />, label: 'System Admin', path: '/admin' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className={cn(
                "border-r border-border bg-white flex flex-col shrink-0 transition-all duration-300 judicial-shadow",
                sidebarOpen ? "w-72" : "w-20"
            )}>
                {/* Branding */}
                <div className="h-20 flex items-center px-6 border-b border-border">
                    <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-white shrink-0">
                        <Gavel size={24} />
                    </div>
                    {sidebarOpen && (
                        <div className="ml-3 overflow-hidden">
                            <h1 className="font-serif font-bold text-lg leading-tight truncate">Veritas</h1>
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Judicial intelligence</p>
                        </div>
                    )}
                </div>

                {/* Primary Nav */}
                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    <div className={cn("px-3 mb-2", !sidebarOpen && "hidden")}>
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Operations</span>
                    </div>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded transition-all group",
                                isActive
                                    ? "bg-primary text-white shadow-judicial"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <span className={cn("shrink-0", !sidebarOpen && "mx-auto")}>{item.icon}</span>
                            {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                        </NavLink>
                    ))}

                    <div className={cn("px-3 mt-8 mb-2", !sidebarOpen && "hidden")}>
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Governance</span>
                    </div>
                    <NavLink
                        to="/ai-assistant"
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded transition-all group",
                            isActive
                                ? "bg-primary text-white"
                                : "text-muted-foreground hover:bg-muted"
                        )}
                    >
                        <span className={cn("shrink-0 text-amber-500", !sidebarOpen && "mx-auto")}>
                            <BrainCircuit size={20} />
                        </span>
                        {sidebarOpen && <span className="text-sm font-medium">AI Insights</span>}
                    </NavLink>

                    {userRole === "Admin" && adminItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded transition-all group",
                                isActive ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                            )}
                        >
                            <span className={cn("shrink-0", !sidebarOpen && "mx-auto")}>{item.icon}</span>
                            {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer Section */}
                <div className="p-4 border-t border-border space-y-2">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium text-destructive hover:bg-destructive/5 transition-all"
                    >
                        <LogOut size={20} className={cn(!sidebarOpen && "mx-auto")} />
                        {sidebarOpen && <span>System Exit</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Bar */}
                <header className="h-20 bg-white border-b border-border flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center flex-1 max-w-2xl">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="mr-6 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {sidebarOpen ? <Menu size={20} /> : <X size={20} />}
                        </button>

                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search Case ID, Party, or Evidence content..."
                                className="w-full bg-muted border-none rounded-md py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6 ml-6">
                        {/* System Health Indicators */}
                        <div className="hidden lg:flex items-center gap-4 px-4 py-2 bg-muted rounded-full border border-border">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-steel-green animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">DB Sync</span>
                            </div>
                            <div className="w-px h-3 bg-border" />
                            <div className="flex items-center gap-2">
                                <Cpu size={14} className="text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">AI Node</span>
                            </div>
                        </div>

                        <button className="text-muted-foreground hover:text-foreground relative">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full border-2 border-white" />
                        </button>

                        <div className="flex items-center gap-3 pl-6 border-l border-border">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold leading-tight">Hon. Vance Sterling</p>
                                <p className="text-[10px] font-bold uppercase text-muted-foreground">{userRole}</p>
                            </div>
                            <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
                                VS
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-background p-8">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
