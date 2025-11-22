import React from 'react';
import { TrafficMetrics } from '../types';
import Card from './Card';

interface TrafficAnalyticsProps {
    metrics: TrafficMetrics;
}

const TrafficAnalytics: React.FC<TrafficAnalyticsProps> = ({ metrics }) => {
    const formatTrend = (trend: 'up' | 'down', change: number) => {
        const isPositive = (trend === 'up' && change > 0) || (trend === 'down' && change < 0);
        const color = isPositive ? 'text-green-600' : 'text-red-600';
        const arrow = trend === 'up' ? '↑' : '↓';
        return { color, arrow, isPositive };
    };

    const metricCards = [
        { label: 'Visits', value: metrics.visits.value, change: metrics.visits.change, trend: metrics.visits.trend },
        { label: 'Unique Visitors', value: metrics.uniqueVisitors.value, change: metrics.uniqueVisitors.change, trend: metrics.uniqueVisitors.trend },
        { label: 'Pages / Visit', value: metrics.pagesPerVisit.value.toFixed(2), change: metrics.pagesPerVisit.change, trend: metrics.pagesPerVisit.trend },
        { label: 'Avg. Visit Duration', value: metrics.avgDuration.value, change: metrics.avgDuration.change, trend: metrics.avgDuration.trend },
        { label: 'Bounce Rate', value: `${metrics.bounceRate.value.toFixed(2)}%`, change: metrics.bounceRate.change, trend: metrics.bounceRate.trend },
    ];

    return (
        <Card className="p-6">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                    <span className="text-2xl mr-2">📊</span>
                    Traffic Analytics
                </h3>
                <p className="text-xs text-gray-500 mt-1">Estimated traffic metrics based on content quality analysis</p>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {metricCards.map((metric, idx) => {
                    const { color, arrow } = formatTrend(metric.trend, metric.change);
                    return (
                        <div key={idx} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                {metric.label}
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {metric.value}
                            </p>
                            <p className={`text-xs font-semibold ${color} flex items-center`}>
                                {arrow}{Math.abs(metric.change).toFixed(2)}%
                            </p>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default TrafficAnalytics;
