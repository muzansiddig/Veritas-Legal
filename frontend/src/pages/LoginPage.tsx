import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { Gavel, Mail, Lock, Briefcase, ArrowRight, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('Lawyer');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                const data = await authService.login(email, password);
                localStorage.setItem('token', data.access_token);
                // In a real app, role would be fetched here
                navigate('/dashboard');
            } else {
                await authService.signup({ email, password, first_name: firstName, last_name: lastName, role });
                setIsLogin(true);
                setError('Credential set recognized. Please authenticate.');
            }
        } catch (err: any) {
            console.error('Auth error:', err);
            setError(err.response?.data?.detail || 'Authentication failed. Access denied.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 font-sans">
            {/* Branding - Judicial Style */}
            <div className="text-center mb-12 space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded bg-primary text-white shadow-judicial mb-4">
                    <Gavel size={40} />
                </div>
                <div className="space-y-1">
                    <h1 className="text-4xl font-serif font-bold tracking-tight text-primary uppercase">Veritas</h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground flex items-center justify-center gap-2">
                        <ShieldCheck size={12} className="text-steel-green" /> Governmental Legal Intelligence
                    </p>
                </div>
            </div>

            <div className="w-full max-w-lg bg-white border border-border rounded shadow-judicial-lg overflow-hidden">
                {/* Auth Toggle */}
                <div className="flex border-b border-border">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${isLogin ? 'bg-white text-primary border-b-2 border-primary' : 'bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Official Access
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${!isLogin ? 'bg-white text-primary border-b-2 border-primary' : 'bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Credential Registry
                    </button>
                </div>

                <div className="p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Given Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded border border-border bg-muted/30 focus:bg-white focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Surname</label>
                                    <input
                                        type="text"
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded border border-border bg-muted/30 focus:bg-white focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Mail size={12} /> Institutional Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 rounded border border-border bg-muted/30 focus:bg-white focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
                                placeholder="name@court.gov"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Lock size={12} /> Secure Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 rounded border border-border bg-muted/30 focus:bg-white focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Briefcase size={12} /> Professional Designation
                                </label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded border border-border bg-muted/30 focus:bg-white focus:ring-1 focus:ring-primary outline-none text-sm transition-all appearance-none"
                                >
                                    <option>Judge</option>
                                    <option>Lawyer</option>
                                    <option>Managing Partner</option>
                                    <option>Legal Assistant</option>
                                    <option>Audit Officer</option>
                                </select>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-md">
                                <p className="text-xs text-destructive font-bold flex items-center gap-2">
                                    <AlertCircle size={14} /> {error}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-4 bg-primary text-white rounded font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-judicial disabled:opacity-50"
                        >
                            {loading ? 'Initializing Interface...' : isLogin ? 'Authenticate Access' : 'Register Credentials'}
                            {!loading && <ArrowRight size={16} />}
                        </button>
                    </form>
                </div>
            </div>

            <footer className="mt-12 text-center space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                    Authorized Personnel Only • Secure Terminal A-42
                </p>
                <div className="flex items-center justify-center gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-steel-green" />
                    <span className="text-[10px] font-mono text-muted-foreground">AES-256 E2E Encryption Active</span>
                </div>
            </footer>
        </div>
    );
};

const AlertCircle = ({ className }: any) => <div className={className}>⚠️</div>;

export default LoginPage;
