import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

const OfflinePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full animate-fade-in">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <WifiOff className="w-10 h-10 text-slate-400" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">You're Offline</h1>
                <p className="text-slate-600 mb-8">
                    It looks like you've lost your connection. Don't worry, Veritas will sync your data as soon as you're back online.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all active:scale-95"
                >
                    <RefreshCw className="w-5 h-5" />
                    Retry Connection
                </button>
            </div>
            <p className="mt-8 text-slate-400 text-sm">
                Veritas Legal Intelligence &copy; 2025
            </p>
        </div>
    );
};

export default OfflinePage;
