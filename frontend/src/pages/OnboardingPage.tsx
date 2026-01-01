import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { Building2, Globe, Clock, Users, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

const PRACTICE_AREAS = [
    'Criminal Law', 'Civil Litigation', 'Commercial Law', 'Family Law',
    'Intellectual Property', 'Real Estate', 'Employment Law', 'Tax Law',
    'Immigration Law', 'Administrative Law'
];

const OnboardingWizard = () => {
    const [step, setStep] = useState(1);
    const [firmData, setFirmData] = useState({
        name: '',
        jurisdiction: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        currency: 'USD',
        practice_areas: [] as string[],
        employee_counts: {
            lawyer: 1,
            paralegal: 0,
            admin: 1,
            other: 0
        }
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const togglePracticeArea = (area: string) => {
        setFirmData(prev => ({
            ...prev,
            practice_areas: prev.practice_areas.includes(area)
                ? prev.practice_areas.filter(a => a !== area)
                : [...prev.practice_areas, area]
        }));
    };

    const handleComplete = async () => {
        setLoading(true);
        try {
            await authService.setupFirm(firmData);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                <div className="flex justify-between mb-8 px-2">
                    {[1, 2, 3, 4].map((s) => (
                        <div
                            key={s}
                            className={`flex-1 h-2 rounded-full mx-1 transition-all ${s <= step ? 'bg-primary' : 'bg-muted'
                                }`}
                        />
                    ))}
                </div>

                <div className="premium-glass premium-shadow rounded-3xl p-8 md:p-12 transition-all">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <Building2 size={24} />
                                <h2 className="text-2xl font-bold">Your Law Firm</h2>
                            </div>
                            <p className="text-muted-foreground">Tell us about your organization to personalize your workspace.</p>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Firm Name</label>
                                    <input
                                        type="text"
                                        value={firmData.name}
                                        onChange={(e) => setFirmData({ ...firmData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none"
                                        placeholder="e.g. Acme Law Group"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2"><Globe size={14} /> Jurisdiction</label>
                                        <input
                                            type="text"
                                            value={firmData.jurisdiction}
                                            onChange={(e) => setFirmData({ ...firmData, jurisdiction: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border bg-background"
                                            placeholder="e.g. New York, USA"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2"><Clock size={14} /> Timezone</label>
                                        <input
                                            type="text"
                                            value={firmData.timezone}
                                            readOnly
                                            className="w-full px-4 py-3 rounded-xl border bg-muted"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <CheckCircle2 size={24} />
                                <h2 className="text-2xl font-bold">Practice Areas</h2>
                            </div>
                            <p className="text-muted-foreground">Select all areas of law your firm practices.</p>

                            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                {PRACTICE_AREAS.map(area => (
                                    <button
                                        key={area}
                                        onClick={() => togglePracticeArea(area)}
                                        className={`p-3 rounded-xl border text-sm font-medium transition-all text-left flex items-center justify-between ${firmData.practice_areas.includes(area)
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'hover:border-primary/50'
                                            }`}
                                    >
                                        {area}
                                        {firmData.practice_areas.includes(area) && <CheckCircle2 size={14} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <Users size={24} />
                                <h2 className="text-2xl font-bold">Team Composition</h2>
                            </div>
                            <p className="text-muted-foreground">How many team members will be using Veritas?</p>

                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(firmData.employee_counts).map(([role, count]) => (
                                    <div key={role} className="p-4 rounded-xl border bg-background flex flex-col gap-2">
                                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{role}</label>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setFirmData({
                                                    ...firmData,
                                                    employee_counts: { ...firmData.employee_counts, [role]: Math.max(0, count - 1) }
                                                })}
                                                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80"
                                            >-</button>
                                            <span className="text-xl font-bold flex-1 text-center">{count}</span>
                                            <button
                                                onClick={() => setFirmData({
                                                    ...firmData,
                                                    employee_counts: { ...firmData.employee_counts, [role]: count + 1 }
                                                })}
                                                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80"
                                            >+</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 text-center">
                            <div className="inline-flex w-20 h-20 rounded-full bg-primary/10 text-primary items-center justify-center mb-4">
                                <CheckCircle2 size={40} />
                            </div>
                            <h2 className="text-3xl font-bold">All set!</h2>
                            <p className="text-muted-foreground">Your firm "<span className="text-foreground font-semibold">{firmData.name}</span>" is ready for digital transformation.</p>

                            <div className="bg-muted/50 p-6 rounded-2xl text-left space-y-3">
                                <h4 className="text-sm font-bold uppercase text-muted-foreground">Configuration Summary</h4>
                                <div className="flex flex-wrap gap-2">
                                    {firmData.practice_areas.map(a => (
                                        <span key={a} className="px-3 py-1 bg-white rounded-full text-xs font-medium border premium-shadow">{a}</span>
                                    ))}
                                </div>
                                <p className="text-sm italic">
                                    Total of {Object.values(firmData.employee_counts).reduce((a, b) => a + b, 0)} users across {firmData.practice_areas.length} practice areas.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-12 pt-6 border-t font-semibold">
                        <button
                            onClick={() => setStep(s => s - 1)}
                            disabled={step === 1 || loading}
                            className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-all disabled:opacity-0"
                        >
                            <ChevronLeft size={20} /> Back
                        </button>

                        {step < 4 ? (
                            <button
                                onClick={() => setStep(s => s + 1)}
                                disabled={!firmData.name && step === 1}
                                className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl premium-shadow hover:opacity-90 transition-all"
                            >
                                Next <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button
                                onClick={handleComplete}
                                disabled={loading}
                                className="flex items-center gap-2 bg-primary text-primary-foreground px-12 py-3 rounded-xl premium-shadow hover:opacity-90 transition-all animate-pulse"
                            >
                                {loading ? 'Finalizing...' : 'Launch Dashboard'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingWizard;
