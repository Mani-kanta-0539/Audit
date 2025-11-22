
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HistoricAnalysisResult, AnalysisResult } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';

interface HistoryPageProps {
  history: HistoricAnalysisResult[];
  setCurrentAnalysis: (result: AnalysisResult) => void;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ history, setCurrentAnalysis, deleteHistoryItem, clearHistory }) => {
  const navigate = useNavigate();

  const handleViewReport = (result: HistoricAnalysisResult) => {
    setCurrentAnalysis(result);
    navigate('/analysis');
  };

  const getScoreColor = (score: number) => {
    if (score < 50) return 'bg-error/20 text-error';
    if (score < 80) return 'bg-warning/20 text-warning';
    return 'bg-accent/20 text-accent';
  };

  const truncateQuery = (query: string, length = 100) => {
    if (query.startsWith('http')) return query;
    return query.length > length ? `${query.substring(0, length)}...` : query;
  };

  return (
    // FIX: pt-40 for definitive top padding clearance
    <div className="container mx-auto max-w-4xl px-3 sm:px-6 lg:px-8 pb-8 sm:pb-12 pt-20 sm:pt-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-light-text dark:text-dark-text">
          Audit History
        </h1>
        {history.length > 0 && (
          <Button variant="secondary" onClick={() => { if (confirm('Are you sure you want to clear all history? This cannot be undone.')) clearHistory() }}>
            Clear History
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <Card className="text-center">
          <h2 className="text-2xl font-bold mb-2">No Audits Yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your past analysis reports will appear here.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Start a New Analysis
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {history.map((item) => (
            <Card key={item.id} className="!p-4 sm:!p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 mb-4 sm:mb-0 sm:pr-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider ${item.contentType === 'video' ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                      {item.contentType === 'video' ? 'Video' : 'Article'}
                    </span>
                  </div>
                  <p className={`font-mono text-sm break-all ${item.query.startsWith('http') ? 'text-primary dark:text-primary-dark' : 'text-gray-600 dark:text-gray-400'}`}>{truncateQuery(item.query)}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end sm:space-y-2">
                  <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                    <span className="font-semibold">Overall Score:</span>
                    <span className={`px-3 py-1 text-lg font-bold rounded-full ${getScoreColor(item.overall.score)}`}>
                      {item.overall.score}
                    </span>
                  </div>
                  <div className="flex space-x-2 self-stretch">
                    <Button variant="secondary" onClick={() => deleteHistoryItem(item.id)} className="flex-1 !px-3 !py-2">Delete</Button>
                    <Button onClick={() => handleViewReport(item)} className="flex-1 !px-3 !py-2">View Report</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
