
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalysisResult, HistoricAnalysisResult, DimensionKey, ContentType } from '../types';
import Button from '../components/Button';
import Card from '../components/Card';
import { analyzeContent } from '../services/geminiService';
import { fetchSerpCompetitors } from '../services/serpService';
import { ChartIcon } from '../components/icons/ChartIcon';
import { VideoIcon } from '../components/icons/VideoIcon';
import { DocumentTextIcon } from '../components/icons/DocumentTextIcon';
import { CheckIcon } from '../components/icons/CheckIcon';

interface DashboardPageProps {
    setCurrentAnalysis: (result: AnalysisResult | null) => void;
    addAnalysisToHistory: (result: AnalysisResult, query: string) => void;
    history: HistoricAnalysisResult[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ setCurrentAnalysis, addAnalysisToHistory, history }) => {
    const [inputType, setInputType] = useState<'text' | 'url'>('text');
    const [contentType, setContentType] = useState<ContentType>('article');
    const [content, setContent] = useState('');
    const [url, setUrl] = useState('');
    const [keywords, setKeywords] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState(true);
    const [activeDimensions, setActiveDimensions] = useState<Record<string, boolean>>({});

    const navigate = useNavigate();

    const articleDimensions: { key: DimensionKey; label: string }[] = [
        { key: 'seo', label: 'SEO' },
        { key: 'serp', label: 'SERP Performance' },
        { key: 'aeo', label: 'AEO' },
        { key: 'humanization', label: 'Humanization' },
        { key: 'differentiation', label: 'Differentiation' },
        { key: 'freshness', label: 'Freshness' },
        { key: 'linking', label: 'Linking Structure' },
        { key: 'tone', label: 'Tone & Voice' },
        { key: 'accessibility', label: 'Accessibility' },
        { key: 'contentDepth', label: 'Content Depth' },
        { key: 'sentiment', label: 'Sentiment' },
    ];

    const videoDimensions: { key: DimensionKey; label: string }[] = [
        { key: 'hook', label: 'Hook Strength' },
        { key: 'visuals', label: 'Visual Pacing' },
        { key: 'engagement', label: 'Viral Potential' },
        { key: 'caption', label: 'Caption Quality' },
        { key: 'hashtags', label: 'Hashtag Strategy' },
        { key: 'trend', label: 'Trend Alignment' },
    ];

    const [platform, setPlatform] = useState<'YouTube' | 'Instagram' | 'TikTok'>('YouTube');

    useEffect(() => {
        const initialDims: Record<string, boolean> = {};
        const targetList = contentType === 'article' ? articleDimensions : videoDimensions;
        targetList.forEach(d => initialDims[d.key] = true);
        setActiveDimensions(initialDims);
    }, [contentType]);

    useEffect(() => {
        let interval: any;
        if (isLoading) {
            setLoadingProgress(0);
            interval = setInterval(() => {
                setLoadingProgress((prev) => {
                    if (prev >= 95) return 95;
                    return prev + Math.floor(Math.random() * 3) + 1;
                });
            }, 400);
        } else {
            setLoadingProgress(0);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleAnalyze = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setCurrentAnalysis(null);

        const analysisInput = inputType === 'text' ? content : url;
        if (!analysisInput.trim()) {
            setError('Please enter content or a URL to analyze.');
            setIsLoading(false);
            return;
        }

        const enabledDimensions = Object.keys(activeDimensions).filter(k => activeDimensions[k]);

        try {
            // 1. AI Analysis
            const aiPromise = analyzeContent(analysisInput, inputType, contentType, keywords, enabledDimensions, platform);

            // 2. SERP Data Fetch (if keywords provided or auto-detect)
            const searchQuery = keywords || (inputType === 'url' ? 'content analysis' : 'content quality');
            const serpPromise = fetchSerpCompetitors(searchQuery);

            const [aiResult, serpResult] = await Promise.all([aiPromise, serpPromise]);

            // 3. Merge Results
            const finalResult: AnalysisResult = {
                ...aiResult,
                competitors: serpResult.competitors,
                recommendedWordCount: serpResult.recommendedWordCount,
                overall: aiResult.overall // Keep AI overall score
            };

            setCurrentAnalysis(finalResult);
            addAnalysisToHistory(finalResult, analysisInput.substring(0, 50) + '...');
            setLoadingProgress(100);

            setTimeout(() => navigate('/analysis'), 500);

        } catch (err) {
            setError('Failed to analyze content. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [content, url, inputType, contentType, keywords, activeDimensions, platform, setCurrentAnalysis, addAnalysisToHistory, navigate]);

    const toggleDimension = (key: string) => setActiveDimensions(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className="bg-light-bg dark:bg-dark-bg min-h-[calc(100vh-64px)] pt-20 sm:pt-28 md:pt-32 pb-8 sm:pb-12">
            <div className="container mx-auto px-3 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Panel - Main Tool */}
                    <div className="lg:col-span-8 space-y-6">

                        <div className="flex space-x-2 mb-2">
                            <button
                                onClick={() => setContentType('article')}
                                className={`px-6 py-3 rounded-t-xl font-bold text-sm transition-all ${contentType === 'article' ? 'bg-white dark:bg-dark-card text-primary border-t-2 border-primary shadow-sm' : 'bg-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            >
                                <div className="flex items-center space-x-2">
                                    <DocumentTextIcon className="w-4 h-4" />
                                    <span>Content Audit</span>
                                </div>
                            </button>
                            <button
                                onClick={() => setContentType('video')}
                                className={`px-6 py-3 rounded-t-xl font-bold text-sm transition-all ${contentType === 'video' ? 'bg-white dark:bg-dark-card text-secondary border-t-2 border-secondary shadow-sm' : 'bg-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            >
                                <div className="flex items-center space-x-2">
                                    <VideoIcon className="w-4 h-4" />
                                    <span>Video Script Audit</span>
                                </div>

                            </button>
                        </div>

                        {contentType === 'video' && (
                            <div className="flex flex-col gap-2 mb-4 animate-fadeIn">
                                <div className="flex space-x-2">
                                    {['YouTube', 'Instagram'].map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPlatform(p as any)}
                                            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${platform === p
                                                ? 'bg-secondary text-white border-secondary'
                                                : 'bg-white dark:bg-dark-card text-gray-500 border-gray-200 dark:border-gray-700 hover:border-secondary'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                                {inputType === 'url' && (
                                    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-100 dark:border-orange-800">
                                        <p className="text-[11px] text-orange-600 dark:text-orange-400 font-medium flex items-start">
                                            <span className="mr-2 mt-0.5">⚠️</span>
                                            <span>
                                                <b>Want perfect results?</b> URL analysis is limited to metadata.
                                                <br />
                                                For a deep dive, please <b>paste your video script or transcript</b> above.
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        <Card className="rounded-tl-none border-t-0 shadow-md relative z-10">
                            <div className="flex items-center space-x-6 border-b border-gray-100 dark:border-gray-700 pb-4 mb-6">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="radio" checked={inputType === 'text'} onChange={() => setInputType('text')} className="text-primary focus:ring-primary" />
                                    <span className={`font-semibold ${inputType === 'text' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Direct Input</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="radio" checked={inputType === 'url'} onChange={() => setInputType('url')} className="text-primary focus:ring-primary" />
                                    <span className={`font-semibold ${inputType === 'url' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Fetch URL</span>
                                </label>
                            </div>

                            <div className="mb-6">
                                {inputType === 'text' ? (
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder={contentType === 'article' ? "Paste your article here..." : "Paste your video script or caption..."}
                                        className="w-full h-64 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none resize-y transition-all font-mono text-sm"
                                    />
                                ) : (
                                    <div className="relative">
                                        <input
                                            type="url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="https://example.com/post"
                                            className="w-full p-4 pl-12 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all"
                                        />
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🌐</span>
                                    </div>
                                )}
                            </div>

                            <div className="mb-8">
                                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                                    Target {contentType === 'article' ? "Keywords" : "Hashtags"} (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    placeholder={contentType === 'article' ? "e.g. content marketing, seo tips" : "e.g. #fitness, #motivation"}
                                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-1 focus:ring-primary outline-none"
                                />
                            </div>

                            {/* Metrics Configuration */}
                            <div className="mb-8 border-t border-gray-100 dark:border-gray-700 pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center">
                                        Analysis Metrics
                                    </h3>
                                    <button
                                        onClick={() => setShowSettings(!showSettings)}
                                        className="text-xs text-primary font-bold hover:underline"
                                    >
                                        {showSettings ? 'Hide Configuration' : 'Configure Metrics'}
                                    </button>
                                </div>

                                {showSettings ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-fadeIn">
                                        {(contentType === 'article' ? articleDimensions : videoDimensions).map((dim) => (
                                            <div
                                                key={dim.key}
                                                onClick={() => toggleDimension(dim.key)}
                                                className={`
                                        flex items-center space-x-3 cursor-pointer p-3 rounded-xl border transition-all select-none
                                        ${activeDimensions[dim.key]
                                                        ? 'bg-primary/5 border-primary/30 text-gray-900 dark:text-white'
                                                        : 'bg-gray-50 dark:bg-gray-800 border-transparent text-gray-500 opacity-60'
                                                    }
                                    `}
                                            >
                                                <div className={`
                                        w-5 h-5 rounded-md flex items-center justify-center border transition-colors
                                        ${activeDimensions[dim.key] ? 'bg-primary border-primary text-white' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'}
                                    `}>
                                                    {activeDimensions[dim.key] && <CheckIcon className="w-3 h-3" />}
                                                </div>
                                                <span className="text-sm font-semibold">{dim.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {Object.keys(activeDimensions).filter(k => activeDimensions[k]).map(k => (
                                            <span key={k} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                                {(contentType === 'article' ? articleDimensions : videoDimensions).find(d => d.key === k)?.label}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {isLoading && (
                                <div className="mb-6">
                                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                                        <span>ANALYZING...</span>
                                        <span>{loadingProgress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                        <div className="bg-primary h-full transition-all duration-300 ease-out" style={{ width: `${loadingProgress}%` }}></div>
                                    </div>
                                </div>
                            )}
                            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium">{error}</div>}

                            <Button
                                onClick={handleAnalyze}
                                disabled={isLoading}
                                size="lg"
                                className="w-full shadow-xl shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center"
                            >
                                {isLoading ? 'Processing...' : `Run ${contentType === 'article' ? '' : 'Viral '}Audit`}
                            </Button>
                        </Card>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <Card>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                <ChartIcon className="w-5 h-5 mr-2 text-secondary" />
                                Recent Audits
                            </h3>
                            <div className="space-y-2">
                                {history.slice(0, 5).map((item) => (
                                    <div key={item.id} onClick={() => { setCurrentAnalysis(item); navigate('/analysis'); }} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer group transition-colors">
                                        <div className="flex items-center space-x-3 overflow-hidden">
                                            <div className={`w-2 h-2 rounded-full ${item.overall.score >= 80 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.query}</span>
                                        </div>
                                        <span className="text-xs font-mono text-gray-400">{item.overall.score}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
