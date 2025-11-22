
import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { UserProfile, HistoricAnalysisResult } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import { UserIcon } from '../components/icons/UserIcon';
import { ChartIcon } from '../components/icons/ChartIcon';
import { TargetIcon } from '../components/icons/TargetIcon';
import { SparklesIcon } from '../components/icons/SparklesIcon';

interface ProfilePageProps {
  history: HistoricAnalysisResult[];
}

// --- Custom Components for Graphs ---

const ScoreHistoryChart: React.FC<{ data: HistoricAnalysisResult[] }> = ({ data }) => {
    const chartData = [...data].reverse().slice(-10);
    
    if (chartData.length < 2) return <div className="h-40 flex items-center justify-center text-gray-400 text-sm italic">Need at least 2 audits to show trend.</div>;

    const maxScore = 100;
    const height = 150;
    
    const points = chartData.map((item, index) => {
        const x = (index / (chartData.length - 1)) * 100;
        const y = height - (item.overall.score / maxScore) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="w-full h-[150px] relative mt-4">
            <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <line x1="0" y1={height} x2="100" y2={height} stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="1" />
                <line x1="0" y1={height/2} x2="100" y2={height/2} stroke="currentColor" className="text-gray-100 dark:text-gray-800" strokeWidth="1" strokeDasharray="2" />
                
                <polyline
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    points={points}
                    vectorEffect="non-scaling-stroke"
                />
                
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                </defs>

                {chartData.map((item, index) => {
                     const x = (index / (chartData.length - 1)) * 100;
                     const y = height - (item.overall.score / maxScore) * height;
                     return (
                         <circle 
                            key={item.id} 
                            cx={x} 
                            cy={y} 
                            r="2"
                            className="fill-white stroke-primary"
                            strokeWidth="0.5"
                         />
                     )
                })}
            </svg>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Oldest</span>
                <span>Latest</span>
            </div>
        </div>
    )
};

const SkillRadar: React.FC<{ history: HistoricAnalysisResult[] }> = ({ history }) => {
    const getAvg = (key: string) => {
        const validItems = history.filter(h => h[key as keyof HistoricAnalysisResult] && (h[key as keyof HistoricAnalysisResult] as any).score > -1);
        if (!validItems.length) return 0;
        return validItems.reduce((acc, curr) => acc + (curr[key as keyof HistoricAnalysisResult] as any).score, 0) / validItems.length;
    };

    const skills = [
        { label: 'Tech SEO', val: getAvg('seo') },
        { label: 'Creative', val: getAvg('humanization') },
        { label: 'Viral', val: getAvg('engagement') },
        { label: 'Authority', val: getAvg('differentiation') },
        { label: 'Structure', val: getAvg('accessibility') },
    ];

    const size = 200;
    const center = size / 2;
    const radius = 80;
    const angleStep = (Math.PI * 2) / skills.length;

    const points = skills.map((skill, i) => {
        const value = skill.val || 50;
        const dist = (value / 100) * radius;
        const angle = i * angleStep - Math.PI / 2;
        const x = center + Math.cos(angle) * dist;
        const y = center + Math.sin(angle) * dist;
        return `${x},${y}`;
    }).join(' ');

    const outerPoints = skills.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = center + Math.cos(angle) * radius;
        const y = center + Math.sin(angle) * radius;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="flex flex-col items-center">
             <svg width={size} height={size} className="overflow-visible">
                <polygon points={outerPoints} fill="none" stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="1" />
                <polygon points={points} fill="rgba(59, 130, 246, 0.2)" stroke="#3B82F6" strokeWidth="2" />
                
                {skills.map((skill, i) => {
                     const angle = i * angleStep - Math.PI / 2;
                     const x = center + Math.cos(angle) * (radius + 20);
                     const y = center + Math.sin(angle) * (radius + 10);
                     return (
                         <text 
                            key={i} 
                            x={x} 
                            y={y} 
                            textAnchor="middle" 
                            dominantBaseline="middle" 
                            className="text-[10px] uppercase font-bold fill-gray-500 dark:fill-gray-400"
                         >
                             {skill.label}
                         </text>
                     )
                })}
             </svg>
             <p className="text-xs text-gray-400 mt-2 text-center">Based on your audit history averages</p>
        </div>
    )
}

const ProfilePage: React.FC<ProfilePageProps> = ({ history }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<UserProfile>({
    displayName: auth.currentUser?.displayName || '',
    role: 'Content Creator',
    niche: '',
    platform: 'Blog/Website',
    goal: 'Increase Traffic',
    experience: 'Beginner',
    bio: '',
    photoURL: auth.currentUser?.photoURL || ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
            setFormData(docSnap.data() as UserProfile);
        } else {
            setIsEditing(true);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setIsEditing(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, photoURL: reader.result as string }));
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    try {
        const profileData = {
          ...formData,
          photoURL: formData.photoURL?.length > 2000 ? null : formData.photoURL
        };
        
        // Save full data (including large image) to Firestore
        await setDoc(doc(db, 'users', auth.currentUser.uid), formData);
        
        // Update Auth profile with just display name
        await updateProfile(auth.currentUser, {
             displayName: formData.displayName
        });

        setProfile(formData);
        setIsEditing(false);
    } catch (e) {
        console.error("Error saving profile", e);
        alert("Failed to save profile. Please try again.");
    }
  };

  if (loading) return <div className="flex justify-center p-10"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  if (isEditing) {
    return (
        // FIX: pt-40 for definitive top padding
        <div className="container mx-auto max-w-2xl px-6 pb-12 pt-40">
            <Card className="bg-white dark:bg-dark-card">
                <div className="text-center mb-8">
                    <div className="relative inline-block mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center overflow-hidden border-2 border-primary">
                            {formData.photoURL ? (
                                <img src={formData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-12 h-12" />
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-bold">Change</span>
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleFileChange}
                        />
                    </div>

                    <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                        {profile ? 'Edit Profile' : 'Build Your Creator Profile'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Tell us about yourself so GritGrade can provide deeper insights.
                    </p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
                        <input 
                            type="text" 
                            value={formData.displayName} 
                            onChange={e => setFormData({...formData, displayName: e.target.value})}
                            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary Role</label>
                            <select 
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value})}
                                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                            >
                                <option>Content Creator</option>
                                <option>SEO Specialist</option>
                                <option>Digital Marketer</option>
                                <option>Business Owner</option>
                                <option>Student/Learner</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content Niche</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Tech, Health, Gaming..."
                                value={formData.niche}
                                onChange={e => setFormData({...formData, niche: e.target.value})}
                                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary Platform</label>
                            <select 
                                value={formData.platform}
                                onChange={e => setFormData({...formData, platform: e.target.value})}
                                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                            >
                                <option>Blog/Website</option>
                                <option>YouTube</option>
                                <option>Instagram/TikTok</option>
                                <option>LinkedIn/Medium</option>
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Main Goal</label>
                             <select 
                                value={formData.goal}
                                onChange={e => setFormData({...formData, goal: e.target.value})}
                                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                            >
                                <option>Increase Traffic/Views</option>
                                <option>Improve Engagement</option>
                                <option>Drive Sales/Conversions</option>
                                <option>Build Brand Authority</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Bio / Mission</label>
                        <textarea 
                            rows={3}
                            value={formData.bio}
                            onChange={e => setFormData({...formData, bio: e.target.value})}
                            placeholder="I create content to help..."
                            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                        />
                    </div>

                    <div className="flex space-x-4 pt-4">
                        {profile && (
                            <Button variant="secondary" onClick={() => setIsEditing(false)} className="flex-1">Cancel</Button>
                        )}
                        <Button onClick={handleSave} className="flex-1">Save Profile</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
  }
  
  const totalAudits = history.length;
  const avgScore = totalAudits > 0 ? Math.round(history.reduce((a, b) => a + b.overall.score, 0) / totalAudits) : 0;
  const videoCount = history.filter(h => h.contentType === 'video').length;
  const articleCount = totalAudits - videoCount;

  return (
    // FIX: pt-40 for definitive top padding
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-12 pt-40">
        
        {/* Profile Header */}
        <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 mb-8 text-white overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-3xl font-bold shadow-lg border-4 border-gray-800 overflow-hidden">
                        {profile?.photoURL ? (
                            <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span>{profile?.displayName?.charAt(0) || 'U'}</span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-display font-bold">{profile?.displayName}</h1>
                        <div className="flex items-center gap-3 text-gray-300 mt-1">
                            <span className="px-2 py-0.5 rounded bg-white/10 text-xs uppercase tracking-wider font-semibold">{profile?.role}</span>
                            <span className="text-sm">•</span>
                            <span className="text-sm">{profile?.niche}</span>
                        </div>
                        <p className="text-gray-400 text-sm mt-2 max-w-md">{profile?.bio || "No bio set yet."}</p>
                    </div>
                </div>
                <Button variant="secondary" onClick={() => setIsEditing(true)} className="bg-white/10 hover:bg-white/20 text-white border-none">
                    Edit Profile
                </Button>
             </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="space-y-8">
                <Card>
                    <h2 className="font-display font-bold text-lg mb-4 flex items-center">
                        <TargetIcon className="w-5 h-5 mr-2 text-primary" />
                        Creator Strategy
                    </h2>
                    <div className="space-y-4">
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="text-xs text-gray-500 uppercase mb-1">Primary Platform</div>
                            <div className="font-semibold">{profile?.platform}</div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="text-xs text-gray-500 uppercase mb-1">Main Goal</div>
                            <div className="font-semibold text-primary dark:text-primary-dark">{profile?.goal}</div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="text-xs text-gray-500 uppercase mb-1">Content Mix</div>
                            <div className="flex gap-2 mt-1">
                                <div className="flex-1 h-2 bg-blue-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{width: `${(articleCount/totalAudits)*100 || 0}%`}}></div>
                                </div>
                                <div className="flex-1 h-2 bg-pink-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-pink-500" style={{width: `${(videoCount/totalAudits)*100 || 0}%`}}></div>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs mt-1 text-gray-500">
                                <span>Text: {articleCount}</span>
                                <span>Video: {videoCount}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <h2 className="font-display font-bold text-lg mb-4 flex items-center">
                        <SparklesIcon className="w-5 h-5 mr-2 text-purple-500" />
                        Content DNA
                    </h2>
                    {history.length > 0 ? (
                        <SkillRadar history={history} />
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-8">Complete more audits to generate your Content DNA.</p>
                    )}
                </Card>
            </div>

            <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
                        <div className="text-blue-100 text-sm font-medium mb-1">Total Audits</div>
                        <div className="text-4xl font-bold">{totalAudits}</div>
                    </Card>
                    <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none">
                        <div className="text-emerald-100 text-sm font-medium mb-1">Avg Score</div>
                        <div className="text-4xl font-bold">{avgScore}</div>
                    </Card>
                     <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none">
                        <div className="text-purple-100 text-sm font-medium mb-1">Top Skill</div>
                        <div className="text-xl font-bold mt-2 truncate">
                             {history.length > 0 ? 'Coming Soon' : 'N/A'}
                        </div>
                    </Card>
                </div>

                <Card>
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="font-display font-bold text-lg flex items-center">
                            <ChartIcon className="w-5 h-5 mr-2 text-green-500" />
                            Performance Trend
                        </h2>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Your Overall Score over your last 10 audits.</p>
                    
                    {history.length > 0 ? (
                        <ScoreHistoryChart data={history} />
                    ) : (
                        <div className="h-40 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                            No history data available.
                        </div>
                    )}
                </Card>

                <Card className="bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/30">
                    <h3 className="font-bold text-lg text-orange-800 dark:text-orange-300 mb-2">🎯 Focus for {profile?.niche || 'Your Niche'}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Since your goal is to <strong>{profile?.goal}</strong> on <strong>{profile?.platform}</strong>, we recommend prioritizing:
                    </p>
                    <ul className="mt-4 space-y-2 text-sm">
                        {profile?.platform?.includes('Video') || profile?.platform?.includes('Instagram') ? (
                             <>
                                <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>Focus heavily on <strong>Hook Strength</strong> (first 3 seconds).</li>
                                <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>Ensure visual pacing changes every 3-5 seconds.</li>
                             </>
                        ) : (
                             <>
                                <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>Prioritize <strong>SEO Headers</strong> and Keyword Density.</li>
                                <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>Improve Readability scores for better retention.</li>
                             </>
                        )}
                        <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>Maintain consistency in your <strong>{profile?.role}</strong> voice.</li>
                    </ul>
                </Card>
            </div>
        </div>
    </div>
  );
};

export default ProfilePage;
