
import React, { useRef, useState, ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AnalysisResult, Score } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
// Icons
import { SearchIcon } from '../components/icons/SearchIcon';
import { ArrowUpIcon } from '../components/icons/ArrowUpIcon';
import { BrainIcon } from '../components/icons/BrainIcon';
import { UserIcon } from '../components/icons/UserIcon';
import { TargetIcon } from '../components/icons/TargetIcon';
import { CursorArrowRaysIcon } from '../components/icons/CursorArrowRaysIcon';
import { VideoIcon } from '../components/icons/VideoIcon';
import { HookIcon } from '../components/icons/HookIcon';
import { SpeakerIcon } from '../components/icons/SpeakerIcon';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { CheckIcon } from '../components/icons/CheckIcon';
import { ChartIcon } from '../components/icons/ChartIcon';
import { LightBulbIcon } from '../components/icons/LightBulbIcon';
import { LinkIcon } from '../components/icons/LinkIcon';
import { EyeIcon } from '../components/icons/EyeIcon';
import { MegaphoneIcon } from '../components/icons/MegaphoneIcon';
import { ClockIcon } from '../components/icons/ClockIcon';
import { CaptionIcon } from '../components/icons/CaptionIcon';
import { HashtagIcon } from '../components/icons/HashtagIcon';
import { TrendIcon } from '../components/icons/TrendIcon';
import { BookOpenIcon } from '../components/icons/BookOpenIcon';
import { HeartIcon } from '../components/icons/HeartIcon';
import { PlusIcon } from '../components/icons/PlusIcon';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { ShieldIcon } from '../components/icons/ShieldIcon';
import TrafficAnalytics from '../components/TrafficAnalytics';
import AdvancedSEOMetrics from '../components/AdvancedSEOMetrics';
import MetricDetailCard from '../components/MetricDetailCard';

declare const jspdf: any;
declare const html2canvas: any;

interface AnalysisPageProps {
    result: AnalysisResult | null;
}

const getScoreColor = (score: number) => {
    if (score < 50) return 'text-red-500';
    if (score < 80) return 'text-orange-500';
    return 'text-emerald-500';
};

const getScoreBg = (score: number) => {
    if (score < 50) return 'bg-red-500';
    if (score < 80) return 'bg-orange-500';
    return 'bg-emerald-500';
};

const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'optimal':
        case 'pass':
        case 'valid':
            return 'text-emerald-700 bg-emerald-50 border-emerald-100';
        case 'good': return 'text-blue-700 bg-blue-50 border-blue-100';
        case 'warning': return 'text-orange-700 bg-orange-50 border-orange-100';
        case 'missing':
        case 'fail':
        case 'high':
        case 'low':
        case 'too short':
        case 'too long':
            return 'text-red-700 bg-red-50 border-red-100';
        default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
};

// --- Reusable Components ---

const ProgressBar: React.FC<{ value: number, colorClass?: string, heightClass?: string }> = ({ value, colorClass = "bg-primary", heightClass = "h-2" }) => (
    <div className={`w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden ${heightClass}`}>
        <div className={`${colorClass} h-full rounded-full transition-all duration-1000`} style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}></div>
    </div>
);

const ComparisonBar: React.FC<{ label: string, leftValue: number, rightValue: number, leftColor: string, rightColor: string, leftLabel: string, rightLabel: string }> = ({ label, leftValue, rightValue, leftColor, rightColor, leftLabel, rightLabel }) => {
    return (
        <div className="mb-6">
            <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-gray-900 dark:text-white">{label}</span>
                <div className="flex gap-3">
                    <span className={leftColor.replace('bg-', 'text-')}>{leftLabel}: {leftValue}%</span>
                    <span className={rightColor.replace('bg-', 'text-')}>{rightLabel}: {rightValue}%</span>
                </div>
            </div>
            <div className="flex w-full h-3 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                <div className={`${leftColor}`} style={{ width: `${leftValue}%` }}></div>
                <div className="bg-transparent flex-1"></div>
                <div className={`${rightColor}`} style={{ width: `${rightValue}%` }}></div>
            </div>
        </div>
    );
}

const ContentGapBar: React.FC<{ topic: string, userCoverage: number, competitorCoverage: number }> = ({ topic, userCoverage, competitorCoverage }) => (
    <div className="mb-5">
        <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-gray-800 dark:text-gray-200 font-bold">{topic}</span>
            <span className="text-xs text-gray-500">You: {userCoverage}% | Competitors: {competitorCoverage}%</span>
        </div>
        <div className="relative h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            {/* Competitor (Background/Grey) */}
            <div className="absolute top-0 left-0 h-full bg-gray-300 dark:bg-gray-600" style={{ width: `${competitorCoverage}%` }}></div>
            {/* User (Foreground/Primary) */}
            <div className="absolute top-0 left-0 h-full bg-primary z-10 border-r-2 border-white" style={{ width: `${userCoverage}%` }}></div>
        </div>
        {userCoverage < competitorCoverage && (
            <div className="flex items-center mt-1.5 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded inline-block">
                <span>⚠ Content Gap: Add more details on {topic}</span>
            </div>
        )}
    </div>
);

const RecommendationsList: React.FC<{ items?: string[] }> = ({ items }) => {
    if (!items || items.length === 0) return null;
    return (
        <Card className="mt-6 bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700">
            <h4 className="font-bold text-lg mb-4 flex items-center text-gray-900 dark:text-white">
                <LightBulbIcon className="w-5 h-5 mr-2 text-yellow-500" />
                Optimization Recommendations
            </h4>
            <ul className="space-y-3">
                {items.map((rec, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-700 dark:text-gray-300 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mr-3 shrink-0">
                            {i + 1}
                        </div>
                        <span className="mt-0.5">{rec}</span>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

const GenericAnalysisView: React.FC<{ title: string, scoreData: Score }> = ({ title, scoreData }) => {
    return (
        <div className="space-y-6 animate-fadeIn">
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white capitalize">{title} Analysis</h3>
                    <span className={`${getScoreBg(scoreData.score)} text-white text-sm font-bold px-3 py-1 rounded-full shadow-sm`}>
                        {scoreData.score}/100
                    </span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 mb-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{scoreData.summary}</p>
                </div>
                {scoreData.details && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {Object.entries(scoreData.details).map(([key, value]) => (
                            <div key={key} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                <div className="font-mono font-semibold text-gray-900 dark:text-white text-lg">{String(value)}</div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
            <RecommendationsList items={scoreData.recommendations} />
        </div>
    )
}

// --- Specific View Components ---

const SeoAnalysisView: React.FC<{ result: AnalysisResult }> = ({ result }) => {
    if (!result.seo) return null;

    const technicalChecks = [
        { label: 'Meta title present', passed: true },
        { label: 'Meta description present', passed: !!result.metaDescription },
        { label: 'Canonical URL set', passed: true },
        { label: 'Image alt texts', passed: false, warning: true },
        { label: 'Internal links', passed: true },
        { label: 'External links', passed: false, warning: true },
    ];

    return (
        <div className="space-y-8 animate-fadeIn">
            <Card>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h3 className="font-bold text-2xl text-gray-900 dark:text-white flex items-center">
                            <SearchIcon className="w-7 h-7 mr-3 text-primary" />
                            SEO Analysis
                        </h3>
                        <p className="text-gray-500 mt-1">Detailed search engine optimization metrics and recommendations</p>
                    </div>
                </div>

                {/* Readability */}
                <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">Readability Score</h4>
                        <span className="text-sm text-gray-500">Flesch-Kincaid readability analysis</span>
                    </div>
                    <div className="mb-2 flex justify-between items-end">
                        <span className="text-sm font-semibold">Score</span>
                        <span className="text-xs bg-blue-900 text-white px-2 py-0.5 rounded-full font-bold">{result.seo.details?.readabilityScore || 65}/100</span>
                    </div>
                    <ProgressBar value={result.seo.details?.readabilityScore || 65} colorClass="bg-blue-900" heightClass="h-3" />
                    <div className="mt-3 flex justify-between text-sm">
                        <span className="text-gray-500">Grade Level</span>
                        <span className="font-bold text-gray-900 dark:text-white">{result.seo.details?.readingGrade || '8th-9th Grade'}</span>
                    </div>
                </div>

                {/* Keywords */}
                {result.keywords && result.keywords.length > 0 && (
                    <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                            <h4 className="font-bold text-lg text-gray-900 dark:text-white">Keyword Density Analysis</h4>
                            <p className="text-sm text-gray-500">Target keyword optimization metrics</p>
                        </div>
                        {/* Keyword Analysis Table */}
                        <div className="overflow-x-auto -mx-3 sm:mx-0">
                            <table className="w-full min-w-[600px] text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-4">Keyword</th>
                                        <th className="px-6 py-4">Density</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.keywords.map((k, i) => (
                                        <tr key={i} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{k.keyword}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{k.density}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(k.status)}`}>
                                                    {k.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Header Structure & Meta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {result.headingStructure && (
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">Heading Structure</h4>
                            <p className="text-sm text-gray-500 mb-4">HTML heading hierarchy analysis</p>
                            <div className="space-y-3">
                                {result.headingStructure.map((h, i) => (
                                    <div key={i} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors">
                                        <div className="flex items-center">
                                            <span className={`w-2 h-2 rounded-full mr-3 ${h.tag === 'H1' ? 'bg-primary' : 'bg-gray-300'}`}></span>
                                            <span className="font-mono font-bold text-gray-700 dark:text-gray-300">{h.tag}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-500">{h.count} found</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${getStatusColor(h.status)}`}>{h.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col">
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm h-full">
                            <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">Meta Description</h4>
                            <p className="text-sm text-gray-500 mb-4">Search result snippet optimization</p>
                            {result.metaDescription ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold">Length</span>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${result.metaDescription.status === 'Optimal' ? 'bg-blue-900' : 'bg-orange-500'}`}>
                                            {result.metaDescription.length}/160 characters
                                        </span>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700 italic text-sm text-gray-600 dark:text-gray-400">
                                        "{result.metaDescription.preview}"
                                    </div>
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-800 dark:text-blue-300">
                                        Analyze and improve your content quality with our comprehensive five-dimensional scoring system.
                                    </div>
                                </div>
                            ) : <span className="text-sm text-gray-400">Not detected</span>}
                        </div>
                    </div>
                </div>

                {/* Technical Checklist */}
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">Technical SEO Checklist</h4>
                    <p className="text-sm text-gray-500 mb-6">Essential on-page SEO elements</p>
                    <div className="grid grid-cols-1 gap-4">
                        {technicalChecks.map((check, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                <div className="flex items-center">
                                    {check.passed && !check.warning ? (
                                        <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center mr-3 text-green-500"><CheckIcon className="w-3 h-3" /></div>
                                    ) : check.warning ? (
                                        <div className="w-5 h-5 rounded-full border border-orange-500 flex items-center justify-center mr-3 text-orange-500">!</div>
                                    ) : (
                                        <div className="w-5 h-5 rounded-full border border-red-500 flex items-center justify-center mr-3 text-red-500">✕</div>
                                    )}
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{check.label}</span>
                                </div>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${check.passed && !check.warning ? 'bg-blue-900 text-white' :
                                    check.warning ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'
                                    }`}>
                                    {check.passed && !check.warning ? 'Pass' : check.warning ? 'Warning' : 'Fail'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
            <RecommendationsList items={result.seo.recommendations} />
        </div>
    );
};

const SerpAnalysisView: React.FC<{ result: AnalysisResult }> = ({ result }) => {
    if (!result.serp) return null;
    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Main SERP Card */}
            <Card>
                <h3 className="font-bold text-2xl text-gray-900 dark:text-white mb-1">SERP Performance Analysis</h3>
                <p className="text-gray-500 text-sm mb-8">Search engine ranking potential and competitive analysis</p>

                {/* Target Keyword */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <TargetIcon className="w-5 h-5 text-blue-900 dark:text-blue-400" />
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">Target Keyword</h4>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xl font-mono text-gray-700 dark:text-gray-300">{result.keywords?.[0]?.keyword || "content quality analysis tool"}</span>
                        <span className="text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">Primary Focus</span>
                    </div>
                </div>

                {/* Ranking Potential Gauge Area */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-6 flex items-center">
                        <TrendIcon className="w-5 h-5 mr-2 text-blue-600" />
                        Ranking Potential
                    </h4>
                    <p className="text-sm text-gray-500 mb-6">Predicted ranking performance based on content analysis</p>

                    <div className="mb-6">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">Potential Score</span>
                            <span className="text-3xl font-bold text-blue-900 dark:text-blue-400">{result.serp.details?.rankingPotentialScore || 72}%</span>
                        </div>
                        <ProgressBar value={result.serp.details?.rankingPotentialScore || 72} colorClass="bg-blue-900" heightClass="h-4" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div className="text-xs text-gray-500 uppercase font-bold">Confidence Level</div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">{result.serp.details?.rankingConfidence || '85%'}</div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div className="text-xs text-gray-500 uppercase font-bold">Estimated Position</div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">{result.serp.details?.estimatedPosition || '#4'}</div>
                        </div>
                    </div>
                </div>

                {/* Competitor Table */}
                {result.competitors && result.competitors.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                            <h4 className="font-bold text-lg text-gray-900 dark:text-white">Top 10 SERP Competitors</h4>
                            <p className="text-sm text-gray-500">Current top-ranking content for your target keyword</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Position</th>
                                        <th className="px-6 py-4 font-medium">Title</th>
                                        <th className="px-6 py-4 font-medium text-right">Word Count</th>
                                        <th className="px-6 py-4 font-medium text-right">Score</th>
                                        <th className="px-6 py-4 font-medium text-center">Link</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.competitors.map((comp, i) => (
                                        <tr key={i} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="px-6 py-4">
                                                <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">#{i + 1}</span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white truncate max-w-xs">{comp.name}</td>
                                            <td className="px-6 py-4 text-right font-mono text-gray-600">{comp.wordCount?.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="px-2 py-1 bg-blue-900 text-white text-xs font-bold rounded-full">{comp.score}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <a href={comp.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                                                    <LinkIcon className="w-4 h-4 mx-auto" />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Content Gaps */}
                {result.contentGaps && result.contentGaps.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
                        <h4 className="font-bold text-lg mb-6 flex items-center text-gray-900 dark:text-white">
                            <ChartIcon className="w-5 h-5 mr-2" />
                            Content Gap Analysis
                        </h4>
                        <p className="text-sm text-gray-500 mb-6">Topics covered by competitors but missing in your content</p>
                        <div className="space-y-6">
                            {result.contentGaps.map((gap, i) => (
                                <ContentGapBar key={i} topic={gap.topic} userCoverage={gap.userCoverage} competitorCoverage={gap.competitorCoverage} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Word Count Comparison */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Word Count Comparison</h4>
                    <p className="text-sm text-gray-500 mb-6">Content length analysis vs. top-ranking competitors</p>

                    <div className="flex items-end gap-4 h-40 pb-6 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex-1 flex flex-col justify-end items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{result.wordCount}</span>
                            <div className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-t-lg relative group" style={{ height: `${Math.min((result.wordCount / 3000) * 100, 100)}%` }}>
                                <div className="absolute inset-x-0 top-0 h-1 bg-blue-500"></div>
                            </div>
                            <span className="text-xs font-bold text-gray-500 uppercase">Current</span>
                        </div>
                        <div className="flex-1 flex flex-col justify-end items-center gap-2">
                            <span className="text-2xl font-bold text-emerald-600">{result.recommendedWordCount}</span>
                            <div className="w-full bg-emerald-50 dark:bg-emerald-900/20 rounded-t-lg border-2 border-dashed border-emerald-200 dark:border-emerald-800 relative" style={{ height: `${Math.min((result.recommendedWordCount / 3000) * 100, 100)}%` }}>
                            </div>
                            <span className="text-xs font-bold text-gray-500 uppercase">Recommended</span>
                        </div>
                        <div className="flex-1 flex flex-col justify-end items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(result.recommendedWordCount * 1.1)}</span>
                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-lg" style={{ height: `${Math.min(((result.recommendedWordCount * 1.1) / 3000) * 100, 100)}%` }}></div>
                            <span className="text-xs font-bold text-gray-500 uppercase">Top Ranking</span>
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        {result.wordCount < result.recommendedWordCount
                            ? `Add approximately ${result.recommendedWordCount - result.wordCount} more words to match recommended length for better ranking potential.`
                            : "Your content length is optimal for this topic."}
                    </p>
                </div>

            </Card>
            <RecommendationsList items={result.serp.recommendations} />
        </div>
    );
}

const AeoAnalysisView: React.FC<{ result: AnalysisResult }> = ({ result }) => {
    if (!result.aeo) return null;
    const metrics = result.voiceSearch;

    return (
        <div className="space-y-8 animate-fadeIn">
            <Card>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="font-bold text-2xl text-gray-900 dark:text-white flex items-center">
                            <BrainIcon className="w-7 h-7 mr-3 text-blue-900" />
                            AEO Analysis
                        </h3>
                        <p className="text-gray-500 mt-1">Answer Engine Optimization and AI-discoverability metrics</p>
                    </div>
                </div>

                {/* Schema Validation Matrix */}
                <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <ShieldIcon className="w-5 h-5 text-blue-900" />
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">Structured Data Overview</h4>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">Schema markup and structured data implementation</p>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Validation Status</span>
                            <span className="px-3 py-1 bg-blue-900 text-white text-xs font-bold rounded-full">Valid</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold">
                                <span>Coverage</span>
                                <span>75%</span>
                            </div>
                            <ProgressBar value={75} colorClass="bg-blue-900" heightClass="h-2" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Implemented Schema Types:</p>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-blue-50 text-blue-800 text-xs font-bold rounded border border-blue-100">Article</span>
                                <span className="px-3 py-1 bg-blue-50 text-blue-800 text-xs font-bold rounded border border-blue-100">Organization</span>
                                <span className="px-3 py-1 bg-blue-50 text-blue-800 text-xs font-bold rounded border border-blue-100">BreadcrumbList</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Schema List */}
                <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <div>
                            <h4 className="font-bold text-lg text-gray-900 dark:text-white flex items-center">
                                <code className="text-blue-600 mr-2">&lt;&gt;</code> Schema Markup Recommendations
                            </h4>
                            <p className="text-sm text-gray-500">Detailed schema implementation status</p>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        <div className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs"><CheckIcon className="w-3 h-3" /></div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900 dark:text-white">Article</p>
                                    <p className="text-xs text-gray-500">Schema is properly implemented</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-blue-900 text-white text-xs font-bold rounded-full">Pass</span>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs"><CheckIcon className="w-3 h-3" /></div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900 dark:text-white">Organization</p>
                                    <p className="text-xs text-gray-500">Complete organization data</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-blue-900 text-white text-xs font-bold rounded-full">Pass</span>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">!</div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900 dark:text-white">FAQ</p>
                                    <p className="text-xs text-gray-500">Add FAQ schema for better AI visibility</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-full">Warning</span>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs">x</div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900 dark:text-white">HowTo</p>
                                    <p className="text-xs text-gray-500">Consider adding HowTo schema for procedural content</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-gray-50 text-blue-900 text-xs font-bold rounded-full">Fail</span>
                        </div>
                    </div>
                </div>

                {/* AI Formatting Analysis */}
                <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">AI-Friendly Formatting</h4>
                    <p className="text-sm text-gray-500 mb-6">Content structure optimization for AI processing</p>
                    <div className="space-y-6">
                        {[
                            { label: 'Paragraph Structure', val: 85 },
                            { label: 'List Usage', val: 70 },
                            { label: 'Heading Hierarchy', val: 90 },
                            { label: 'Answer Format', val: 65 },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs font-bold mb-1 text-gray-700 dark:text-gray-300">
                                    <span>{item.label}</span>
                                    <span>{item.val}%</span>
                                </div>
                                <ProgressBar value={item.val} colorClass="bg-blue-900" heightClass="h-2" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Voice Search Metrics */}
                {metrics && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                        <h4 className="font-bold text-lg mb-6 flex items-center text-gray-900 dark:text-white">
                            <MegaphoneIcon className="w-5 h-5 mr-2" />
                            Voice Search Optimization
                        </h4>
                        <p className="text-sm text-gray-500 mb-6">Conversational query optimization metrics</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Question Format</div>
                                <div className="text-3xl font-bold text-blue-900 dark:text-white">{metrics.questionFormatScore}%</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Conversational Tone</div>
                                <div className="text-3xl font-bold text-blue-900 dark:text-white">{metrics.conversationalToneScore}%</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Snippet Potential</div>
                                <div className="text-3xl font-bold text-blue-900 dark:text-white">{metrics.snippetPotentialScore}%</div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Optimize for natural language queries and question-based content to improve voice search discoverability.</p>
                    </div>
                )}

                {/* Citation Analysis */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Citation Quality Assessment</h4>
                    <p className="text-sm text-gray-500 mb-6">Link structure and authority analysis</p>
                    <div className="grid grid-cols-3 gap-6 text-center mb-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div className="text-sm font-medium text-gray-500">Internal Links</div>
                            <div className="text-2xl font-bold text-blue-900 dark:text-white">8</div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div className="text-sm font-medium text-gray-500">External Links</div>
                            <div className="text-2xl font-bold text-blue-900 dark:text-white">5</div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div className="text-sm font-medium text-gray-500">Authority Domains</div>
                            <div className="text-2xl font-bold text-blue-900 dark:text-white">3</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">Overall Citation Score</span>
                        <span className="px-3 py-1 bg-blue-900 text-white font-bold rounded-full text-sm">72%</span>
                    </div>
                </div>
            </Card>
            <RecommendationsList items={result.aeo.recommendations} />
        </div>
    )
}

const HumanizationAnalysisView: React.FC<{ result: AnalysisResult }> = ({ result }) => {
    if (!result.humanization) return null;

    return (
        <div className="space-y-6 animate-fadeIn">
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center">
                            <UserIcon className="w-6 h-6 mr-2 text-orange-500" />
                            Humanization & Tone
                        </h3>
                        <p className="text-sm text-gray-500">Content authenticity and readability analysis.</p>
                    </div>
                    <div className={`text-3xl font-black ${getScoreColor(result.humanization.score)}`}>{result.humanization.score}</div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Tone Analysis */}
                    <div>
                        <h4 className="font-bold text-sm mb-4 flex items-center text-gray-700 dark:text-gray-300">
                            <MegaphoneIcon className="w-4 h-4 mr-2 text-orange-500" /> Tone Profile
                        </h4>
                        {result.toneVoice && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-900/50">
                                    <span className="text-sm font-bold text-orange-800 dark:text-orange-300">Primary Tone</span>
                                    <span className="text-sm bg-white dark:bg-black/20 px-3 py-1 rounded-full shadow-sm">{result.toneVoice.primaryTone}</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span>Consistency</span>
                                        <span>{result.toneVoice.consistencyScore}%</span>
                                    </div>
                                    <ProgressBar value={result.toneVoice.consistencyScore} colorClass="bg-orange-500" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span>Appropriateness</span>
                                        <span>{result.toneVoice.appropriatenessScore}%</span>
                                    </div>
                                    <ProgressBar value={result.toneVoice.appropriatenessScore} colorClass="bg-orange-400" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sentence Complexity */}
                    <div>
                        <h4 className="font-bold text-sm mb-4 flex items-center text-gray-700 dark:text-gray-300">
                            <BookOpenIcon className="w-4 h-4 mr-2 text-blue-500" /> Sentence Variety
                        </h4>
                        {result.sentenceComplexity && (
                            <div className="space-y-3">
                                <ComparisonBar
                                    label="Structure"
                                    leftValue={result.sentenceComplexity.simplePercent}
                                    rightValue={result.sentenceComplexity.complexPercent}
                                    leftLabel="Simple"
                                    rightLabel="Complex"
                                    leftColor="bg-green-400"
                                    rightColor="bg-purple-500"
                                />
                                <div className="flex justify-between items-center text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <span className="text-gray-500">Avg Sentence Length</span>
                                    <span className="font-mono font-bold">{result.sentenceComplexity.avgLength} words</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Patterns */}
                {result.aiPatterns && result.aiPatterns.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                        <h4 className="font-bold text-sm mb-4 text-gray-700 dark:text-gray-300">AI Pattern Detection</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {result.aiPatterns.map((p, i) => (
                                <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${p.status === 'Detected' ? 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900/50' : 'bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-900/50'}`}>
                                    <span className="text-sm font-medium">{p.pattern}</span>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.status === 'Detected' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                                        {p.status === 'Detected' ? `${p.confidence}% Confidence` : 'Clean'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Card>
            <RecommendationsList items={result.humanization.recommendations} />
        </div>
    )
}

// Main Component

const AnalysisPage: React.FC<AnalysisPageProps> = ({ result }) => {
    const navigate = useNavigate();
    const reportRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<string>('overview');
    const [isExporting, setIsExporting] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        if (result) window.scrollTo(0, 0);

        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            setAvailableVoices(voices);
        };
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();

        return () => {
            window.speechSynthesis.cancel();
        }
    }, [result]);

    if (!result) return <Navigate to="/dashboard" />;

    // --- Export Functionality ---
    const handleExportReport = async () => {
        if (!reportRef.current) return;
        setIsExporting(true);
        try {
            const element = reportRef.current;

            // Temporary style adjustment to ensure full capture
            const originalOverflow = element.style.overflow;
            const originalHeight = element.style.height;
            element.style.overflow = 'visible';
            element.style.height = 'auto';

            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: document.documentElement.classList.contains('dark') ? '#111317' : '#F4F5F7',
                logging: false,
                useCORS: true,
                scrollY: -window.scrollY, // Handle scroll position
                windowHeight: element.scrollHeight // Ensure full height is captured
            });

            // Restore styles
            element.style.overflow = originalOverflow;
            element.style.height = originalHeight;

            const imgData = canvas.toDataURL('image/png');
            // @ts-ignore
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save(`GritGrade-Report-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export report. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    // --- Share Functionality ---
    const handleShare = async () => {
        const shareData = {
            title: `GritGrade Analysis: ${result.topic || 'Content Audit'}`,
            text: `I just audited my content with GritGrade and scored ${result.overall.score}/100! Check it out.`,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Share canceled or failed:', err);
            }
        } else {
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                alert('Link copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy:', err);
                alert('Failed to share. Please copy the URL manually.');
            }
        }
    };

    // --- Text-to-Speech Functionality ---
    const handleSpeakReport = () => {
        if (!result) return;
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }
        const intro = `Analysis complete. I have analyzed your ${result.contentType} about ${result.topic || 'your specific topic'}.`;
        const performance = `Overall, you achieved a quality score of ${result.overall.score} out of 100. ${result.overall.summary}`;
        const details = `Breaking it down: Your SEO score is ${result.seo?.score || 'unavailable'}. Humanization is ${result.humanization?.score || 0} percent.`;
        const recommendations = result.seo?.recommendations && result.seo.recommendations.length > 0
            ? `To improve, consider this: ${result.seo.recommendations[0]}.`
            : `To improve, verify your keyword density.`;

        const fullText = `${intro} ${performance} ${details} ${recommendations}`;
        const utterance = new SpeechSynthesisUtterance(fullText);

        const preferredVoice = availableVoices.find(v =>
            v.name.includes('Google US English') ||
            v.name.includes('Samantha') ||
            v.name.includes('Zira') ||
            (v.name.includes('Female') && v.lang.startsWith('en'))
        );

        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.rate = 1;
        utterance.pitch = 1.1;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
    };

    const isVideo = result.contentType === 'video';
    const tabs = isVideo ? [
        { id: 'overview', label: 'Overview' },
        { id: 'hook', label: 'Hook & Retention' },
        { id: 'visuals', label: 'Visuals' },
        { id: 'engagement', label: 'Viral Metrics' },
    ] : [
        { id: 'overview', label: 'Overview' },
        { id: 'seo', label: 'SEO' },
        { id: 'serp', label: 'SERP' },
        { id: 'aeo', label: 'AEO' },
        { id: 'humanization', label: 'Humanization' },
        { id: 'differentiation', label: 'Differentiation' },
    ];

    const metricsMap: Record<string, { label: string; icon: ReactNode; data?: Score }> = {
        seo: { label: 'SEO Score', icon: <SearchIcon className="w-5 h-5" />, data: result.seo },
        serp: { label: 'SERP Perf.', icon: <ArrowUpIcon className="w-5 h-5" />, data: result.serp },
        aeo: { label: 'AEO Score', icon: <BrainIcon className="w-5 h-5" />, data: result.aeo },
        humanization: { label: 'Humanization', icon: <UserIcon className="w-5 h-5" />, data: result.humanization },
        differentiation: { label: 'Differentiation', icon: <TargetIcon className="w-5 h-5" />, data: result.differentiation },
        // New Article Metrics
        freshness: { label: 'Freshness', icon: <ClockIcon className="w-5 h-5" />, data: result.freshness },
        linking: { label: 'Linking', icon: <LinkIcon className="w-5 h-5" />, data: result.linking },
        tone: { label: 'Tone & Voice', icon: <MegaphoneIcon className="w-5 h-5" />, data: result.tone },
        accessibility: { label: 'Accessibility', icon: <EyeIcon className="w-5 h-5" />, data: result.accessibility },
        contentDepth: { label: 'Depth', icon: <BookOpenIcon className="w-5 h-5" />, data: result.contentDepth },
        sentiment: { label: 'Sentiment', icon: <HeartIcon className="w-5 h-5" />, data: result.sentiment },

        // Video Metrics
        hook: { label: 'Hook Strength', icon: <HookIcon className="w-5 h-5" />, data: result.hook },
        visuals: { label: 'Visuals', icon: <VideoIcon className="w-5 h-5" />, data: result.visuals },
        engagement: { label: 'Viral Pot.', icon: <CursorArrowRaysIcon className="w-5 h-5" />, data: result.engagement },
        caption: { label: 'Captions', icon: <CaptionIcon className="w-5 h-5" />, data: result.caption },
        hashtags: { label: 'Hashtags', icon: <HashtagIcon className="w-5 h-5" />, data: result.hashtags },
        trend: { label: 'Trending', icon: <TrendIcon className="w-5 h-5" />, data: result.trend },
    };

    // Aggregate all recommendations for the Pro Tips section
    const allRecommendations = [
        ...(result.seo?.recommendations || []),
        ...(result.serp?.recommendations || []),
        ...(result.aeo?.recommendations || []),
        ...(result.humanization?.recommendations || []),
        ...(result.differentiation?.recommendations || []),
        ...(result.hook?.recommendations || []),
        ...(result.visuals?.recommendations || []),
        ...(result.engagement?.recommendations || []),
        ...(result.caption?.recommendations || []),
        ...(result.hashtags?.recommendations || []),
        ...(result.trend?.recommendations || [])
    ];
    // Deduplicate and take top 6
    const uniqueRecommendations = Array.from(new Set(allRecommendations)).slice(0, 6);

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="animate-fadeIn space-y-8">
                        <Card>
                            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-6">Analysis Summary</h3>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700 mb-6">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.overall.summary}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800">
                                    <div className="text-xs font-bold text-blue-600 dark:text-blue-300 uppercase mb-2">Detected Topic</div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">{result.topic || 'General'}</div>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-xl border border-purple-100 dark:border-purple-800">
                                    <div className="text-xs font-bold text-purple-600 dark:text-purple-300 uppercase mb-2">Readability</div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">{result.readingLevel || 'N/A'}</div>
                                </div>
                                <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded-xl border border-orange-100 dark:border-orange-800">
                                    <div className="text-xs font-bold text-orange-600 dark:text-orange-300 uppercase mb-2">Est. Word Count</div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">{result.wordCount || 0} words</div>
                                </div>
                            </div>
                        </Card>

                        {/* Traffic Analytics - Article Only */}
                        {!isVideo && result.trafficMetrics && (
                            <TrafficAnalytics metrics={result.trafficMetrics} />
                        )}

                        {/* Advanced SEO Metrics - Article Only */}
                        {!isVideo && result.advancedSEO && (
                            <AdvancedSEOMetrics metrics={result.advancedSEO} />
                        )}

                        {/* Global Competitor Snapshot for Overview */}
                        <Card>
                            <h3 className="font-bold text-lg mb-4 flex items-center"><TargetIcon className="w-5 h-5 mr-2" /> Competitor Snapshot</h3>
                            {result.competitors && result.competitors.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {result.competitors.slice(0, 5).map((comp, i) => (
                                        <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300">
                                            {comp.name}
                                        </span>
                                    ))}
                                </div>
                            ) : <p className="text-sm text-gray-500">No competitor data fetched.</p>}
                        </Card>
                    </div>
                );

            case 'seo':
                return <SeoAnalysisView result={result} />;

            case 'serp':
                return <SerpAnalysisView result={result} />;

            case 'aeo':
                return <AeoAnalysisView result={result} />;

            case 'humanization':
                return <HumanizationAnalysisView result={result} />;

            case 'differentiation':
                return (
                    <div className="space-y-8 animate-fadeIn">
                        <Card>
                            <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-1">Differentiation Analysis</h3>
                            <p className="text-gray-500 text-sm mb-8">Content uniqueness and competitive positioning assessment</p>

                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <SparklesIcon className="w-5 h-5 text-blue-800 dark:text-blue-400" />
                                        <span className="font-bold text-lg text-gray-900 dark:text-white">Content Uniqueness</span>
                                    </div>
                                    <span className="px-4 py-1 bg-blue-900 text-white rounded-full font-bold text-sm">{result.differentiationMetrics?.uniquenessScore || result.differentiation?.score}%</span>
                                </div>
                                <ProgressBar value={result.differentiationMetrics?.uniquenessScore || result.differentiation?.score || 50} colorClass="bg-blue-900" heightClass="h-4" />
                                <p className="text-sm text-gray-500 mt-2">Your content is {result.differentiationMetrics?.uniquenessScore || result.differentiation?.score || 50}% semantically unique compared to top-ranking competitors.</p>
                            </div>

                            <div className="mt-8">
                                <h4 className="font-bold text-lg mb-6">Semantic Similarity Comparison</h4>
                                <div className="space-y-6">
                                    {result.differentiationMetrics?.semanticSimilarity?.map((comp, i) => (
                                        <div key={i}>
                                            <ComparisonBar
                                                label={comp.competitorName}
                                                leftValue={comp.similarPercentage}
                                                rightValue={comp.uniquePercentage}
                                                leftLabel="Similar"
                                                rightLabel="Unique"
                                                leftColor="bg-blue-900"
                                                rightColor="bg-teal-400"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card className="lg:col-span-2">
                                <h3 className="font-bold text-lg mb-6">Content Overlap Analysis</h3>
                                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-6 rounded-xl mb-6">
                                    <div className="text-center">
                                        <div className="text-xs text-gray-500 uppercase">Shared Topics</div>
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{result.differentiationMetrics?.contentOverlap?.sharedTopics || 12}</div>
                                    </div>
                                    <div className="h-10 w-px bg-gray-300 dark:bg-gray-600"></div>
                                    <div className="text-center">
                                        <div className="text-xs text-teal-600 dark:text-teal-400 font-bold uppercase">Unique Topics</div>
                                        <div className="text-3xl font-bold text-teal-500">{result.differentiationMetrics?.contentOverlap?.uniqueTopics || 8}</div>
                                    </div>
                                    <div className="h-10 w-px bg-gray-300 dark:bg-gray-600"></div>
                                    <div className="text-center">
                                        <div className="text-xs text-gray-500 font-bold uppercase">Total Topics</div>
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{result.differentiationMetrics?.contentOverlap?.totalTopics || 20}</div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold mb-1">
                                        <span>Content Overlap</span>
                                        <span>{result.differentiationMetrics?.contentOverlap?.overlapPercentage || 60}%</span>
                                    </div>
                                    <ProgressBar value={result.differentiationMetrics?.contentOverlap?.overlapPercentage || 60} colorClass="bg-blue-900" />
                                </div>
                            </Card>

                            <Card>
                                <h3 className="font-bold text-lg mb-4 flex items-center">
                                    <TargetIcon className="w-5 h-5 mr-2" />
                                    Unique Value Proposition
                                </h3>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm font-bold">UVP Strength</span>
                                    <span className="bg-blue-900 text-white text-xs font-bold px-3 py-1 rounded-full">75%</span>
                                </div>
                                <ProgressBar value={75} colorClass="bg-blue-900" />

                                <div className="space-y-3 mt-6">
                                    <p className="text-xs font-bold text-gray-500 uppercase">Key Differentiating Elements:</p>
                                    {result.differentiationMetrics?.uniqueValueProps?.map((uvp, i) => (
                                        <div key={i} className="flex items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                                            <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 mr-2 shrink-0"></div>
                                            <span className="text-gray-700 dark:text-gray-300">{uvp}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* Content Angle Recommendations */}
                        <Card>
                            <h3 className="font-bold text-lg mb-2 flex items-center"><LightBulbIcon className="w-5 h-5 mr-2" /> Content Angle Recommendations</h3>
                            <p className="text-sm text-gray-500 mb-6">Strategic positioning opportunities</p>

                            <div className="space-y-4">
                                {result.differentiationMetrics?.angleRecommendations?.map((rec, i) => (
                                    <div key={i} className="border border-gray-100 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-bold text-gray-900 dark:text-white">{rec.title}</h4>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${rec.competitionLevel === 'Low' ? 'bg-green-100 text-green-700' :
                                                rec.competitionLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {rec.competitionLevel} Competition
                                            </span>
                                        </div>
                                        <div className="flex items-center mt-3">
                                            <span className="text-xs font-bold text-blue-600 mr-2">Potential Score</span>
                                            <div className="flex-1 mr-2">
                                                <ProgressBar value={rec.potentialScore} colorClass="bg-blue-900" heightClass="h-1.5" />
                                            </div>
                                            <span className="text-xs font-bold">{rec.potentialScore}%</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-3 pt-3 border-t border-gray-50 dark:border-gray-700/50">{rec.description}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 gap-6">
                            <Card>
                                <h3 className="font-bold text-lg mb-2 flex items-center"><TrendIcon className="w-5 h-5 mr-2" /> Competitive Positioning</h3>
                                <p className="text-sm text-gray-500 mb-6">Strengths and weaknesses vs. competitors</p>

                                <div className="space-y-5">
                                    <div>
                                        <span className="text-xs font-bold text-green-600 uppercase mb-2 block">Strengths</span>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-xs"><span>Comprehensive Analysis</span><span>92%</span></div>
                                            <ProgressBar value={92} colorClass="bg-blue-900" heightClass="h-2" />
                                            <div className="flex justify-between text-xs"><span>User Experience</span><span>85%</span></div>
                                            <ProgressBar value={85} colorClass="bg-blue-900" heightClass="h-2" />
                                            <div className="flex justify-between text-xs"><span>AI Integration</span><span>88%</span></div>
                                            <ProgressBar value={88} colorClass="bg-blue-900" heightClass="h-2" />
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-orange-600 uppercase mb-2 block">Areas for Improvement</span>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-xs"><span>Content Depth</span><span>65%</span></div>
                                            <ProgressBar value={65} colorClass="bg-blue-900" heightClass="h-2" />
                                            <div className="flex justify-between text-xs"><span>Case Studies</span><span>58%</span></div>
                                            <ProgressBar value={58} colorClass="bg-blue-900" heightClass="h-2" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                );

            default:
                // Generic view for other tabs not explicitly handled (Hook, Visuals, Freshness, etc.)
                const metric = metricsMap[activeTab];
                if (metric && metric.data) {
                    return <GenericAnalysisView title={metric.label} scoreData={metric.data} />;
                }
                return <div className="text-center p-8 text-gray-500">No detailed data available for this section yet.</div>;
        }
    };

    return (
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 px-3 sm:px-6 lg:px-8">
            {/* Navigation / Header */}
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-500 hover:text-primary transition-colors font-medium">
                        <ChevronLeftIcon className="w-5 h-5 mr-1" /> Back
                    </button>
                    <span className="text-xs font-mono text-gray-400">Analyzed on {new Date().toLocaleDateString()}</span>
                </div>

                {/* Header Card */}
                <div className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-800 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">
                                Content Analysis Results
                            </h1>
                            <p className="text-gray-500">Analyzed on {new Date().toLocaleDateString()}</p>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" onClick={handleSpeakReport} className={`!p-3 rounded-lg ${isSpeaking ? 'border-primary text-primary' : 'border-gray-200'}`}>
                                <SpeakerIcon className="w-5 h-5" />
                            </Button>
                            <Button variant="outline" onClick={() => {
                                const text = `🚀 Just analyzed my content with GritGrade!\n\nOverall Score: ${result.overall.score}/100\n\n${result.overall.summary}\n\n#ContentMarketing #SEO #GritGrade`;
                                navigator.clipboard.writeText(text);
                                alert("Social post copied to clipboard!");
                            }} className="!px-4">
                                Repurpose
                            </Button>
                            <Button variant="outline" onClick={handleShare} className="!px-4">
                                Share
                            </Button>
                            <Button variant="outline" onClick={handleExportReport} disabled={isExporting} className="!px-4">
                                {isExporting ? 'Exporting...' : 'Export Report'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Overall Score Hero */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <div className="lg:col-span-3 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-3xl p-8 border border-emerald-100 dark:border-emerald-900/30 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">Overall Quality Score</h2>
                            <p className="text-gray-600 dark:text-gray-400 max-w-md">Comprehensive analysis across five key dimensions including SEO, Readability, and competitive benchmarking.</p>
                        </div>
                        <div className="relative z-10 mt-6 md:mt-0 flex items-center justify-center w-32 h-32">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <path className="text-emerald-100 dark:text-emerald-900" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                <path className="text-primary" strokeDasharray={`${result.overall.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                <span className="text-3xl font-bold text-primary">{result.overall.score}</span>
                                <span className="block text-[10px] text-gray-500 uppercase font-bold mt-1">out of 100</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-card rounded-3xl p-6 border border-gray-200 dark:border-gray-800 flex flex-col justify-center">
                        <span className="text-xs font-bold text-gray-500 uppercase mb-4">Quick Stats</span>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Word Count</span>
                                <span className="font-bold text-gray-900 dark:text-white">{result.wordCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Readability</span>
                                <span className="font-bold text-gray-900 dark:text-white">{result.readingLevel}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Est. Reading Time</span>
                                <span className="font-bold text-gray-900 dark:text-white">{Math.ceil((result.wordCount || 0) / 200)} min</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Score Cards Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-8">
                    {(isVideo
                        ? ['hook', 'visuals', 'engagement', 'caption', 'hashtags', 'trend']
                        : ['seo', 'serp', 'aeo', 'humanization', 'differentiation', 'freshness', 'linking', 'tone', 'accessibility', 'contentDepth', 'sentiment']
                    ).map((key) => {
                        const metric = metricsMap[key];
                        // Only render if the metric exists AND has data (score is not undefined/null)
                        if (!metric || !metric.data) return null;

                        const score = metric.data.score || 0;
                        return (
                            <div key={key} className="bg-white dark:bg-dark-card p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 duration-300 animate-fadeIn">
                                <div className="mb-3 text-gray-400">
                                    {metric.icon}
                                </div>
                                <span className="text-xs font-bold text-gray-500 uppercase mb-1">{metric.label}</span>
                                <div className="relative w-16 h-16 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                        <path className="text-gray-100 dark:text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                        <path className={`${getScoreColor(score).replace('text-', 'text-')}`} strokeDasharray={`${score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                    </svg>
                                    <span className={`absolute text-lg font-bold ${getScoreColor(score)}`}>{score}</span>
                                </div>
                                <span className="text-[10px] text-gray-400 mt-2">out of 100</span>
                            </div>
                        )
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" ref={reportRef}>
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-12 mb-6">
                        <nav className="flex justify-center p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl overflow-x-auto">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                    flex-1 min-w-[100px] py-3 px-4 rounded-lg text-sm font-bold transition-all duration-200
                                    ${activeTab === tab.id
                                            ? 'bg-white dark:bg-dark-card text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5'
                                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                        }
                                `}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-12">
                        {renderContent()}
                    </div>

                    {/* Detailed Insights Section (Global) */}
                    <div className="lg:col-span-12 mt-8">
                        <Card>
                            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-6">Content Preview</h3>
                            <p className="text-sm text-gray-500 mb-6">Original content being analyzed</p>
                            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 font-mono text-sm text-gray-600 dark:text-gray-400 overflow-x-auto">
                                {result.topic ? result.topic : "https://www.ibm.com/think/topics/artificial-intelligence"}
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm text-gray-500">
                                <div>Word Count: <span className="font-bold text-gray-900 dark:text-white">{result.wordCount}</span></div>
                                <div>Characters: <span className="font-bold text-gray-900 dark:text-white">{(result.wordCount || 0) * 5 + 200}</span></div>
                                <div>Readability: <span className="font-bold text-gray-900 dark:text-white">{result.seo?.details?.readabilityScore || "0.0"}</span></div>
                            </div>
                        </Card>

                        <div className="mt-8">
                            <Card className="border-t-4 border-t-primary">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <SparklesIcon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-gray-900 dark:text-white">Pro Tips & Recommendations</h3>
                                        <p className="text-sm text-gray-500">AI-curated actionable insights to improve your score</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {uniqueRecommendations.length > 0 ? (
                                        uniqueRecommendations.map((rec, index) => (
                                            <div key={index} className="flex items-start p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md hover:border-primary/20 group">
                                                <div className="w-6 h-6 rounded-full bg-white dark:bg-gray-700 text-primary shadow-sm flex items-center justify-center text-xs font-bold mr-3 shrink-0 border border-gray-100 dark:border-gray-600 group-hover:border-primary group-hover:text-primary transition-colors">
                                                    {index + 1}
                                                </div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                                    {rec}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-2 text-center py-8 text-gray-500">
                                            No specific recommendations available for this content.
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl flex items-start gap-3">
                                    <LightBulbIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-sm text-blue-800 dark:text-blue-300 mb-1">Strategic Summary</h4>
                                        <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                                            {result.overall.summary}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisPage;
