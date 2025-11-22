
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { collection, query, orderBy, getDocs, addDoc, deleteDoc, writeBatch, serverTimestamp, doc } from 'firebase/firestore';
import { auth, db } from './firebase';

import DashboardPage from './pages/DashboardPage';
import AnalysisPage from './pages/AnalysisPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import ProgressPage from './pages/ProgressPage';
import OnboardingPage from './pages/OnboardingPage';
import Header from './components/Header';
import { AnalysisResult, HistoricAnalysisResult } from './types';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import RegistrationPage from './pages/RegistrationPage';

// Wrapper component to handle conditional Header rendering
const MainLayout: React.FC<{
  children: React.ReactNode;
  theme: string;
  toggleTheme: () => void;
  isAuthenticated: boolean;
  logout: () => void;
}> = ({ children, theme, toggleTheme, isAuthenticated, logout }) => {
  const location = useLocation();
  
  // Routes where the header should be hidden
  const hideHeaderRoutes = ['/onboarding', '/login', '/register'];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen font-sans bg-light-bg dark:bg-dark-bg">
      {shouldShowHeader && (
        <Header theme={theme} toggleTheme={toggleTheme} isAuthenticated={isAuthenticated} logout={logout} />
      )}
      <main>
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoricAnalysisResult[]>([]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      if (currentUser) {
        try {
          const historyCollection = collection(db, 'history', currentUser.uid, 'items');
          const q = query(historyCollection, orderBy('timestamp', 'desc'));
          const querySnapshot = await getDocs(q);
          const userHistory = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              ...data,
              id: doc.id,
              timestamp: data.timestamp?.toDate().getTime() || Date.now(),
            } as HistoricAnalysisResult;
          });
          setHistory(userHistory);
        } catch (error) {
          console.error("Failed to fetch history from Firestore", error);
        }
      } else {
        setHistory([]);
      }
    };

    fetchHistory();
  }, [currentUser]);


  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const addAnalysisToHistory = async (result: AnalysisResult, query: string) => {
    if (!currentUser) return;
    try {
      const historyCollection = collection(db, 'history', currentUser.uid, 'items');
      const newDocRef = await addDoc(historyCollection, {
        ...result,
        query,
        timestamp: serverTimestamp(),
      });
      setHistory(prevHistory => [{
        ...result,
        id: newDocRef.id,
        timestamp: Date.now(),
        query,
      }, ...prevHistory]);
    } catch (error) {
      console.error("Error adding document to Firestore: ", error);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    if (!currentUser) return;
    try {
        const docRef = doc(db, 'history', currentUser.uid, 'items', id);
        await deleteDoc(docRef);
        setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
    } catch (error) {
        console.error("Error deleting document from Firestore: ", error);
    }
  }

  const clearHistory = async () => {
    if (!currentUser) return;
    try {
        const historyCollection = collection(db, 'history', currentUser.uid, 'items');
        const querySnapshot = await getDocs(historyCollection);
        const batch = writeBatch(db);
        querySnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        setHistory([]);
    } catch (error) {
        console.error("Error clearing history from Firestore: ", error);
    }
  }

  const isAuthenticated = !!currentUser;

  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <MainLayout theme={theme} toggleTheme={toggleTheme} isAuthenticated={isAuthenticated} logout={logout}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            
            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/dashboard" element={<DashboardPage setCurrentAnalysis={setCurrentAnalysis} addAnalysisToHistory={addAnalysisToHistory} history={history} />} />
              <Route path="/analysis" element={<AnalysisPage result={currentAnalysis} />} />
              <Route path="/history" element={<HistoryPage history={history} setCurrentAnalysis={setCurrentAnalysis} deleteHistoryItem={deleteHistoryItem} clearHistory={clearHistory} />} />
              <Route path="/profile" element={<ProfilePage history={history} />} />
              <Route path="/progress" element={<ProgressPage history={history} />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </MainLayout>
    </HashRouter>
  );
};

export default App;
