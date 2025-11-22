
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { HistoricAnalysisResult, UserProfile, CalendarReminder, Competitor } from '../types';
import { analyzeContent } from '../services/geminiService';
import { fetchSerpCompetitors } from '../services/serpService';
import Card from '../components/Card';
import { TrendingUpIcon } from '../components/icons/TrendingUpIcon';
import { PieChartIcon } from '../components/icons/PieChartIcon';
import { TargetIcon } from '../components/icons/TargetIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../components/icons/ChevronRightIcon';

interface ProgressPageProps {
    history: HistoricAnalysisResult[];
}

// --- SVG COMPONENTS ---

const CompetitorComparisonChart: React.FC<{ history: HistoricAnalysisResult[] }> = ({ history }) => {
    if (history.length === 0) return <div className="h-40 flex items-center justify-center text-gray-400 italic text-sm">No data available.</div>;

    const userAvg = Math.round(history.reduce((acc, curr) => acc + curr.overall.score, 0) / history.length);

    let compSum = 0;
    let compCount = 0;
    history.forEach(h => {
        if (h.competitors && h.competitors.length > 0) {
            h.competitors.forEach(c => {
                compSum += c.score;
                compCount++;
            });
        }
    });
    const compAvg = compCount > 0 ? Math.round(compSum / compCount) : 0;

    const max = 100;
    const userHeight = (userAvg / max) * 100;
    const compHeight = (compAvg / max) * 100;

    return (
        <div className="flex items-end justify-center h-48 gap-12 pt-6 pb-2">
            <div className="flex flex-col items-center gap-2 group">
                <span className="font-bold text-2xl text-primary">{userAvg}</span>
                <div className="w-16 bg-primary/20 rounded-t-xl relative overflow-hidden transition-all duration-1000 group-hover:bg-primary/30" style={{ height: `${userHeight}%` }}>
                    <div className="absolute bottom-0 left-0 w-full bg-primary transition-all duration-1000" style={{ height: '100%' }}></div>
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase">You</span>
            </div>

            <div className="flex flex-col items-center gap-2 group">
                <span className="font-bold text-2xl text-gray-500">{compAvg}</span>
                <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-t-xl relative overflow-hidden transition-all duration-1000 group-hover:bg-gray-300 dark:group-hover:bg-gray-600" style={{ height: `${compHeight}%` }}>
                    <div className="absolute bottom-0 left-0 w-full bg-gray-400 dark:bg-gray-600 transition-all duration-1000" style={{ height: '100%' }}></div>
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase">Competitors</span>
            </div>
        </div>
    );
};

const ImprovedVelocityChart: React.FC<{ data: HistoricAnalysisResult[] }> = ({ data }) => {
    const chartData = [...data].sort((a, b) => a.timestamp - b.timestamp).slice(-10);

    if (chartData.length < 2) return (
        <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <TrendingUpIcon className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-sm font-medium">Complete at least 2 audits to see your trend line.</span>
        </div>
    );

    // Dimensions matching container aspect ratio strictly 2:1 to REMOVE WHITESPACE
    const height = 400;
    const width = 800;
    const paddingX = 40;
    const paddingY = 20;

    const maxScore = 100;
    const graphHeight = height - (paddingY * 2);
    const graphWidth = width - (paddingX * 2);

    const points = chartData.map((item, index) => {
        const x = paddingX + (index / (chartData.length - 1)) * graphWidth;
        const y = (height - paddingY) - (item.overall.score / maxScore) * graphHeight;
        return `${x},${y}`;
    }).join(' ');

    const areaPoints = `${points} ${paddingX + graphWidth},${height - paddingY} ${paddingX},${height - paddingY}`;

    return (
        <div className="w-full h-auto aspect-[2/1] min-h-[200px]">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 50, 100].map((tick) => {
                    const y = (height - paddingY) - (tick / 100) * graphHeight;
                    return (
                        <g key={tick}>
                            <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" className="dark:stroke-gray-700 opacity-50" />
                            <text x={paddingX - 10} y={y + 4} textAnchor="end" className="text-[10px] fill-gray-400 font-medium">{tick}</text>
                        </g>
                    );
                })}

                {/* Dates */}
                {chartData.map((item, index) => {
                    const x = paddingX + (index / (chartData.length - 1)) * graphWidth;
                    const date = new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                    if (chartData.length > 5 && index % 2 !== 0 && index !== chartData.length - 1) return null;
                    return (
                        <text key={item.id} x={x} y={height - 5} textAnchor="middle" className="text-[10px] fill-gray-500 dark:fill-gray-400 font-medium">
                            {date}
                        </text>
                    )
                })}

                <polygon points={areaPoints} fill="url(#chartGradient)" />
                <polyline points={points} fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                {chartData.map((item, index) => {
                    const x = paddingX + (index / (chartData.length - 1)) * graphWidth;
                    const y = (height - paddingY) - (item.overall.score / maxScore) * graphHeight;
                    return (
                        <g key={item.id} className="group cursor-pointer">
                            <circle cx={x} cy={y} r="12" fill="transparent" />
                            <circle cx={x} cy={y} r="4" className="fill-white stroke-primary dark:stroke-primary-dark hover:r-6 transition-all" strokeWidth="2.5" />
                            <title>{item.overall.score} - {new Date(item.timestamp).toLocaleDateString()}</title>
                        </g>
                    )
                })}
            </svg>
        </div>
    );
};

const ContentMixPie: React.FC<{ articles: number, videos: number }> = ({ articles, videos }) => {
    const total = articles + videos;
    if (total === 0) return <div className="h-40 flex items-center justify-center text-gray-400 italic text-sm">No data available.</div>;
    const articlePct = articles / total;
    const videoPct = videos / total;
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const articleDash = articlePct * circumference;

    return (
        <div className="flex flex-col items-center justify-center h-full py-4">
            <div className="relative w-48 h-48">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <circle cx="18" cy="18" r="16" fill="transparent" stroke="#EC4899" strokeWidth="5" />
                    <circle cx="18" cy="18" r="16" fill="transparent" stroke="#3B82F6" strokeWidth="5" strokeDasharray={`${articleDash} ${circumference}`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold font-display text-light-text dark:text-dark-text">{total}</span>
                    <span className="text-[10px] text-gray-500 uppercase">Audits</span>
                </div>
            </div>
            <div className="flex gap-4 mt-6 text-sm">
                <div className="flex items-center"><span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>Article ({Math.round(articlePct * 100)}%)</div>
                <div className="flex items-center"><span className="w-3 h-3 bg-pink-500 rounded-full mr-2"></span>Video ({Math.round(videoPct * 100)}%)</div>
            </div>
        </div>
    );
};

const SmartCalendar: React.FC<{ history: HistoricAnalysisResult[], reminders: CalendarReminder[], onAddReminder: (date: Date, text: string) => void }> = ({ history, reminders, onAddReminder }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [newReminderText, setNewReminderText] = useState("");

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToToday = () => {
        const now = new Date();
        setCurrentDate(now);
        setSelectedDate(now);
    };

    const toDateString = (d: Date) => d.toDateString();

    const handleSaveReminder = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDate && newReminderText.trim()) {
            onAddReminder(selectedDate, newReminderText);
            setNewReminderText("");
        }
    };

    const handleDayClick = (dateObj: Date) => {
        setSelectedDate(dateObj);
    };

    // Get upcoming reminders for the current month
    const upcomingReminders = reminders.filter(r => {
        const rDate = new Date(r.date);
        return rDate.getMonth() === month && rDate.getFullYear() === year && rDate >= new Date();
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 3);

    return (
        <div className="h-full flex flex-col min-h-[500px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-xl text-gray-900 dark:text-white">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={goToToday} className="text-xs font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors mr-2">
                        Today
                    </button>
                    <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
                    </button>
                    <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <span key={d} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{d}</span>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-6">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dateObj = new Date(year, month, i + 1);
                    const isToday = toDateString(new Date()) === toDateString(dateObj);
                    const isSelected = selectedDate && toDateString(selectedDate) === toDateString(dateObj);
                    const hasAudit = history.some(h => toDateString(new Date(h.timestamp)) === toDateString(dateObj));
                    const dayReminders = reminders.filter(r => toDateString(new Date(r.date)) === toDateString(dateObj));
                    const hasReminder = dayReminders.length > 0;

                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleDayClick(dateObj); }}
                            className={`
                                relative w-full aspect-square flex flex-col items-center justify-center rounded-lg transition-all duration-200 group
                                ${isSelected
                                    ? 'bg-primary text-white shadow-md ring-2 ring-primary ring-offset-1 dark:ring-offset-gray-800'
                                    : isToday
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-bold'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}
                            `}
                        >
                            <span className={`text-sm ${isSelected || isToday ? 'font-bold' : 'font-medium'}`}>{i + 1}</span>

                            {/* Dots */}
                            <div className="flex gap-0.5 mt-1 h-1.5">
                                {hasAudit && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-green-500'}`}></div>}
                                {hasReminder && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-purple-500'}`}></div>}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Selected Date / Upcoming Panel */}
            <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                {selectedDate ? (
                    <div className="animate-fadeIn">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-gray-900 dark:text-white flex items-center">
                                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                                {selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                            </h4>
                            <button onClick={() => setSelectedDate(null)} className="text-xs text-gray-400 hover:text-gray-600">Close</button>
                        </div>

                        {/* Existing Reminders for Selected Date */}
                        <div className="space-y-2 mb-4">
                            {reminders.filter(r => toDateString(new Date(r.date)) === toDateString(selectedDate)).map((r, idx) => (
                                <div key={idx} className="flex items-center text-sm bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${r.completed ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                                    <span className={r.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}>{r.title}</span>
                                </div>
                            ))}
                            {reminders.filter(r => toDateString(new Date(r.date)) === toDateString(selectedDate)).length === 0 && (
                                <p className="text-xs text-gray-400 italic ml-1">No reminders set for this day.</p>
                            )}
                        </div>

                        {/* Add Reminder Form */}
                        <form onSubmit={handleSaveReminder} className="flex gap-2 mt-auto">
                            <input
                                type="text"
                                value={newReminderText}
                                onChange={(e) => setNewReminderText(e.target.value)}
                                placeholder="Add task..."
                                className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
                                autoFocus
                            />
                            <button type="submit" className="bg-primary text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors">
                                +
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="h-full flex flex-col">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Upcoming in {currentDate.toLocaleString('default', { month: 'long' })}</h4>
                        {upcomingReminders.length > 0 ? (
                            <div className="space-y-2">
                                {upcomingReminders.map((r, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm bg-white dark:bg-gray-800 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2.5"></div>
                                            <span className="text-gray-700 dark:text-gray-300">{r.title}</span>
                                        </div>
                                        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-1.5 py-0.5 rounded">
                                            {new Date(r.date).getDate()}th
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                <CalendarIcon className="w-8 h-8 mb-2 opacity-20" />
                                <p className="text-xs">No upcoming tasks.</p>
                                <p className="text-[10px] opacity-70">Select a date to add one.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const WeaknessAnalyzer: React.FC<{ history: HistoricAnalysisResult[] }> = ({ history }) => {
    const dimensionTotals: Record<string, { sum: number, count: number }> = {};
    history.forEach(h => {
        const process = (key: string, scoreObj: any) => {
            if (scoreObj && scoreObj.score > -1) {
                if (!dimensionTotals[key]) dimensionTotals[key] = { sum: 0, count: 0 };
                dimensionTotals[key].sum += scoreObj.score;
                dimensionTotals[key].count += 1;
            }
        };
        ['seo', 'humanization', 'linking', 'hook', 'visuals'].forEach(k => process(k, (h as any)[k]));
    });

    const averages = Object.entries(dimensionTotals)
        .map(([key, val]) => ({ key, avg: Math.round(val.sum / val.count) }))
        .sort((a, b) => a.avg - b.avg);

    if (averages.length === 0) return <p className="text-gray-500 italic text-xs">No data yet.</p>;

    return (
        <div className="space-y-3">
            {averages.slice(0, 3).map((item) => (
                <div key={item.key} className="group">
                    <div className="flex justify-between text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300 uppercase">
                        <span>{item.key}</span>
                        <span className={item.avg < 50 ? 'text-error' : 'text-warning'}>{item.avg}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                        <div className={`h-full rounded-full ${item.avg < 50 ? 'bg-error' : 'bg-warning'}`} style={{ width: `${item.avg}%` }}></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

const ProgressPage: React.FC<ProgressPageProps> = ({ history }) => {
    const [reminders, setReminders] = useState<CalendarReminder[]>([]);
    const [targetScore, setTargetScore] = useState(85);
    const [monthlyGoal, setMonthlyGoal] = useState(10);
    const [isEditingGoals, setIsEditingGoals] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (auth.currentUser) {
                const docRef = doc(db, 'users', auth.currentUser.uid);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    const data = snap.data() as UserProfile;
                    if (data.goals) {
                        setTargetScore(data.goals.targetScore);
                        setMonthlyGoal(data.goals.monthlyAuditGoal);
                    }
                    if (data.reminders) {
                        setReminders(data.reminders);
                    }
                }
            }
        }
        loadData();
    }, []);

    const saveGoals = async () => {
        if (!auth.currentUser) return;
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
            goals: { targetScore, monthlyAuditGoal: monthlyGoal }
        }, { merge: true });
        setIsEditingGoals(false);
    };

    const handleAddReminder = async (date: Date, title: string) => {
        if (!auth.currentUser) return;
        const newReminder: CalendarReminder = { date: date.toISOString(), title, completed: false };
        const updatedReminders = [...reminders, newReminder];
        setReminders(updatedReminders);
        await setDoc(doc(db, 'users', auth.currentUser.uid), { reminders: arrayUnion(newReminder) }, { merge: true });
    };

    const currentMonthAudits = history.filter(h => {
        const d = new Date(h.timestamp);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    const avgScore = history.length > 0 ? Math.round(history.reduce((a, b) => a + b.overall.score, 0) / history.length) : 0;

    const [userUrl, setUserUrl] = useState('');
    const [userTopic, setUserTopic] = useState('');
    const [isBenchmarking, setIsBenchmarking] = useState(false);
    const [benchmarkData, setBenchmarkData] = useState<{ userScore: number, topCompetitors: Competitor[] } | null>(null);

    const handleBenchmark = async () => {
        if (!userUrl.trim()) return;
        setIsBenchmarking(true);
        try {
            // 1. Analyze the USER'S URL
            const userResult = await analyzeContent(userUrl, 'url', 'article', userTopic || 'general', ['seo', 'serp']);

            // 2. Fetch Top 5 Competitors for the topic
            const topic = userTopic || userResult.topic || 'content quality';
            const serpResult = await fetchSerpCompetitors(topic);

            setBenchmarkData({
                userScore: userResult.overall.score,
                topCompetitors: serpResult.competitors
            });

        } catch (e) {
            console.error("Benchmarking failed", e);
            alert("Failed to analyze. Please check the URL.");
        } finally {
            setIsBenchmarking(false);
        }
    };

    return (
        // FIX: Increased top padding to pt-40 (160px) to clear header.
        <div className="container mx-auto max-w-6xl px-3 sm:px-6 lg:px-8 pb-8 sm:pb-12 pt-20 sm:pt-32 md:pt-40">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-light-text dark:text-dark-text flex items-center mb-6">
                <TrendingUpIcon className="w-7 h-7 mr-2 text-primary" />
                Progress & Analytics
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Charts */}
                <div className="lg:col-span-2 space-y-6 min-w-0">
                    <Card className="p-6">
                        <h3 className="font-bold text-base text-gray-900 dark:text-white mb-4">Score Velocity</h3>
                        <ImprovedVelocityChart data={history} />
                    </Card>

                    <Card className="p-6">
                        <h3 className="font-bold text-base text-gray-900 dark:text-white mb-4">Niche Benchmarking</h3>
                        <p className="text-xs text-gray-500 mb-4">Enter your content URL to see how you rank against top competitors in your niche.</p>

                        <div className="mb-6 flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                placeholder="Your Content URL (e.g. yoursite.com/post)"
                                value={userUrl}
                                onChange={(e) => setUserUrl(e.target.value)}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <input
                                type="text"
                                placeholder="Topic (Optional)"
                                value={userTopic}
                                onChange={(e) => setUserTopic(e.target.value)}
                                className="w-full sm:w-1/3 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <button
                                onClick={handleBenchmark}
                                disabled={isBenchmarking}
                                className="px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
                            >
                                {isBenchmarking ? 'Analyzing...' : 'Rank Me'}
                            </button>
                        </div>

                        {benchmarkData ? (
                            <div className="animate-fadeIn">
                                <div className="flex items-end justify-center h-64 gap-2 sm:gap-4 pt-6 pb-8 border-b border-gray-100 dark:border-gray-700 mb-4 overflow-x-auto">
                                    {/* User Bar */}
                                    <div className="flex flex-col justify-end items-center gap-2 group min-w-[60px] h-full z-10">
                                        <span className="font-bold text-xl text-primary">{benchmarkData.userScore}</span>
                                        <div className="w-12 sm:w-16 bg-primary/20 rounded-t-xl relative overflow-hidden transition-all duration-1000 group-hover:bg-primary/30" style={{ height: `${benchmarkData.userScore}%` }}>
                                            <div className="absolute bottom-0 left-0 w-full bg-primary transition-all duration-1000" style={{ height: '100%' }}></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-900 dark:text-white uppercase text-center truncate w-full px-1">You</span>
                                    </div>

                                    {/* Top 5 Competitors */}
                                    {benchmarkData.topCompetitors.map((comp, i) => (
                                        <div key={i} className="flex flex-col justify-end items-center gap-2 group min-w-[60px] h-full">
                                            <span className="font-bold text-sm text-gray-400">{comp.score}</span>
                                            <div className="w-12 sm:w-16 bg-gray-200 dark:bg-gray-700 rounded-t-lg relative overflow-hidden transition-all duration-1000 hover:bg-gray-300 dark:hover:bg-gray-600" style={{ height: `${comp.score}%` }}>
                                                <div className="absolute bottom-0 left-0 w-full bg-gray-400 dark:bg-gray-600 transition-all duration-1000" style={{ height: '100%' }}></div>
                                            </div>
                                            <div className="flex flex-col items-center w-full">
                                                <span className="text-[9px] font-bold text-gray-500 uppercase text-center w-full px-1 line-clamp-2 h-6 leading-3" title={comp.name}>
                                                    {comp.name}
                                                </span>
                                                <a href={comp.url} target="_blank" rel="noreferrer" className="text-[8px] text-blue-400 hover:underline mt-0.5">View</a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-center text-gray-400">Comparing your score vs. top 5 competitors in this topic.</p>
                            </div>
                        ) : (
                            <div className="h-40 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                <span className="text-sm font-medium">Enter your URL to see where you stand.</span>
                            </div>
                        )}
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <CalendarIcon className="w-5 h-5 text-green-500" />
                                <h3 className="font-bold text-base">Audit Schedule</h3>
                            </div>
                            <SmartCalendar history={history} reminders={reminders} onAddReminder={handleAddReminder} />
                        </Card>
                        <Card className="p-6">
                            <h3 className="font-bold text-sm mb-3 flex items-center">
                                <PieChartIcon className="w-4 h-4 mr-2 text-purple-500" />
                                Content Mix
                            </h3>
                            <ContentMixPie articles={history.filter(h => h.contentType !== 'video').length} videos={history.filter(h => h.contentType === 'video').length} />
                        </Card>
                    </div>
                </div>

                {/* Right Column: Goals */}
                <div className="space-y-6 min-w-0">
                    <Card className="bg-gradient-to-br from-primary to-blue-700 text-white border-none p-6 shadow-lg">
                        <div className="flex justify-between items-start mb-8">
                            <h3 className="font-bold text-lg flex items-center"><TargetIcon className="w-5 h-5 mr-2 text-blue-200" /> Goals</h3>
                            <button onClick={() => isEditingGoals ? saveGoals() : setIsEditingGoals(true)} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors font-bold">
                                {isEditingGoals ? 'SAVE' : 'EDIT'}
                            </button>
                        </div>
                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between text-sm text-blue-100 mb-2">
                                    <span>Target Score</span>
                                    {isEditingGoals ? <input type="number" value={targetScore} onChange={e => setTargetScore(Number(e.target.value))} className="w-16 text-right text-black rounded px-2 py-1 text-sm font-bold" /> : <span className="font-bold text-xl">{targetScore}</span>}
                                </div>
                                <div className="w-full bg-blue-900/40 rounded-full h-3"><div className={`h-full rounded-full transition-all duration-1000 ease-out ${avgScore >= targetScore ? 'bg-green-400' : 'bg-yellow-400'}`} style={{ width: `${Math.min((avgScore / targetScore) * 100, 100)}%` }}></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm text-blue-100 mb-2">
                                    <span>Audits / Month</span>
                                    {isEditingGoals ? <input type="number" value={monthlyGoal} onChange={e => setMonthlyGoal(Number(e.target.value))} className="w-16 text-right text-black rounded px-2 py-1 text-sm font-bold" /> : <span className="font-bold text-xl">{monthlyGoal}</span>}
                                </div>
                                <div className="w-full bg-blue-900/40 rounded-full h-3"><div className="bg-white h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min((currentMonthAudits / monthlyGoal) * 100, 100)}%` }}></div></div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="font-bold text-sm mb-6 flex items-center"><TrendingUpIcon className="w-4 h-4 mr-2 text-red-500 transform rotate-180" /> Lowest Metrics</h3>
                        <WeaknessAnalyzer history={history} />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProgressPage;
