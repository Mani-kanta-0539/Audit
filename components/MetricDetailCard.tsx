import React from 'react';
import Card from './Card';

interface MetricDetailCardProps {
    title: string;
    score: number;
    summary: string;
    details?: Record<string, any>;
    recommendations?: string[];
    icon?: React.ReactNode;
    color?: string;
}

const MetricDetailCard: React.FC<MetricDetailCardProps> = ({
    title,
    score,
    summary,
    details,
    recommendations,
    icon,
    color = 'primary'
}) => {
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
        if (score >= 60) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
    };

    return (
        <Card className="p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {icon && <div className="text-2xl">{icon}</div>}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-base">{title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{summary}</p>
                    </div>
                </div>
                <div className={`px-3 py-1.5 rounded-lg font-bold text-lg ${getScoreColor(score)}`}>
                    {score}
                </div>
            </div>

            {details && Object.keys(details).length > 0 && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-2">Details</p>
                    <div className="space-y-1">
                        {Object.entries(details).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-xs">
                                <span className="text-gray-600 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                <span className="font-semibold text-gray-900 dark:text-white">{String(value)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {recommendations && recommendations.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Recommendations</p>
                    <ul className="space-y-1.5">
                        {recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start text-xs text-gray-700 dark:text-gray-300">
                                <span className="text-primary mr-2 mt-0.5">•</span>
                                <span>{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </Card>
    );
};

export default MetricDetailCard;
