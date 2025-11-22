import React from 'react';
import type { AdvancedSEOMetrics } from '../types';
import Card from './Card';

interface AdvancedSEOMetricsProps {
    metrics: AdvancedSEOMetrics;
}

const AdvancedSEOMetrics: React.FC<AdvancedSEOMetricsProps> = ({ metrics }) => {
    const formatTrend = (trend: 'up' | 'down', change: number) => {
        const isPositive = trend === 'up';
        const color = isPositive ? 'text-green-600' : 'text-red-600';
        const arrow = trend === 'up' ? '↑' : '↓';
        return { color, arrow };
    };

    return (
        <Card className="p-6">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                    <span className="text-2xl mr-2">🔍</span>
                    SEO Metrics
                </h3>
                <p className="text-xs text-gray-500 mt-1">AI-estimated SEO performance indicators</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 sm:gap-6">
                {/* Authority Score */}
                <div className="bg-gradient-to-br from-primary/10 to-blue-50 dark:from-primary/20 dark:to-gray-800 rounded-xl p-5 border border-primary/20">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                        Authority Score
                    </p>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-4xl font-bold text-primary">{metrics.authorityScore.value}</span>
                        <span className="text-sm text-gray-500">/100</span>
                    </div>
                    <p className="text-xs text-gray-500">
                        SEMrush Rank: <span className="font-semibold text-gray-700 dark:text-gray-300">{metrics.authorityScore.rank.toLocaleString()}</span>
                    </p>
                </div>

                {/* Organic Traffic */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Organic Traffic
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {metrics.organicTraffic.value}
                    </p>
                    <p className={`text-xs font-semibold ${formatTrend(metrics.organicTraffic.trend, metrics.organicTraffic.change).color}`}>
                        {formatTrend(metrics.organicTraffic.trend, metrics.organicTraffic.change).arrow}
                        {Math.abs(metrics.organicTraffic.change).toFixed(2)}%
                    </p>
                </div>

                {/* Organic Keywords */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Organic Keywords
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {metrics.organicKeywords.value}
                    </p>
                    <p className={`text-xs font-semibold ${formatTrend(metrics.organicKeywords.trend, metrics.organicKeywords.change).color}`}>
                        {formatTrend(metrics.organicKeywords.trend, metrics.organicKeywords.change).arrow}
                        {Math.abs(metrics.organicKeywords.change).toFixed(2)}%
                    </p>
                </div>

                {/* Paid Keywords */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Paid Keywords
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {metrics.paidKeywords.value}
                    </p>
                    <p className="text-xs text-gray-500">
                        {metrics.paidKeywords.percentage.toFixed(1)}% of traffic
                    </p>
                </div>

                {/* Referring Domains */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Ref. Domains
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {metrics.referringDomains.value}
                    </p>
                    <p className={`text-xs font-semibold ${formatTrend(metrics.referringDomains.trend, metrics.referringDomains.change).color}`}>
                        {formatTrend(metrics.referringDomains.trend, metrics.referringDomains.change).arrow}
                        {Math.abs(metrics.referringDomains.change).toFixed(2)}%
                    </p>
                </div>

                {/* Backlinks */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Backlinks
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {metrics.referringDomains.backlinks}
                    </p>
                    <p className="text-xs text-gray-500">
                        Total inbound links
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default AdvancedSEOMetrics;
