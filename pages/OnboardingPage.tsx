
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Button from '../components/Button';
import Card from '../components/Card';
import { SparklesIcon } from '../components/icons/SparklesIcon';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    role: '',
    platform: '',
    goal: '',
    experience: ''
  });

  const questions = [
    {
      key: 'role',
      title: "What best describes your role?",
      options: [
        "Content Creator / Influencer",
        "SEO Specialist / Marketer",
        "Business Owner / Entrepreneur",
        "Student",
        "Freelance Writer"
      ]
    },
    {
      key: 'platform',
      title: "What is your primary content focus?",
      options: [
        "Blog Posts & Website Copy",
        "YouTube / Long-form Video",
        "Instagram Reels / TikTok (Short-form)",
        "LinkedIn / Professional Articles",
        "Academic / Technical Writing"
      ]
    },
    {
      key: 'goal',
      title: "What is your main goal right now?",
      options: [
        "Increase Organic Traffic (SEO)",
        "Go Viral / Boost Engagement",
        "Drive Sales & Conversions",
        "Build Brand Authority",
        "Improve Writing Quality"
      ]
    },
    {
      key: 'experience',
      title: "How experienced are you with content optimization?",
      options: [
        "Beginner (I'm just starting)",
        "Intermediate (I know the basics)",
        "Advanced (I do this daily)",
        "Pro / Agency Level"
      ]
    }
  ];

  const handleOptionSelect = (value: string) => {
    const currentKey = questions[step].key;
    setFormData(prev => ({ ...prev, [currentKey]: value }));
  };

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Final Step - Save to Firestore
      setIsLoading(true);
      if (auth.currentUser) {
        try {
          await setDoc(doc(db, 'users', auth.currentUser.uid), {
            ...formData,
            onboardingCompleted: true,
            photoURL: auth.currentUser.photoURL || ''
          }, { merge: true });
          navigate('/dashboard');
        } catch (error) {
          console.error("Error saving onboarding data:", error);
          // Proceed anyway to avoid blocking user
          navigate('/dashboard');
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const progress = ((step + 1) / questions.length) * 100;
  const currentQuestion = questions[step];
  const isSelected = (option: string) => formData[currentQuestion.key as keyof typeof formData] === option;

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Logo */}
      <div className="mb-8 flex items-center space-x-2 z-10">
         <SparklesIcon className="w-8 h-8 text-primary" />
         <span className="text-2xl font-display font-bold text-gray-900 dark:text-white">GritGrade</span>
      </div>

      <Card className="max-w-2xl w-full z-10 !p-8 md:!p-12 shadow-2xl border-none">
         {/* Progress Bar */}
         <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full mb-8 overflow-hidden">
            <div 
                className="bg-primary h-full transition-all duration-500 ease-out rounded-full" 
                style={{ width: `${progress}%` }}
            ></div>
         </div>

         <div className="text-center mb-10">
            <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">Step {step + 1} of {questions.length}</span>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {currentQuestion.title}
            </h1>
         </div>

         <div className="space-y-3 mb-10">
            {currentQuestion.options.map((option) => (
                <button
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full p-5 text-left rounded-xl border-2 transition-all duration-200 flex items-center group ${
                        isSelected(option)
                            ? 'border-primary bg-primary/5 shadow-md'
                            : 'border-gray-100 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${
                        isSelected(option) ? 'border-primary bg-primary' : 'border-gray-300 group-hover:border-primary'
                    }`}>
                        {isSelected(option) && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>
                    <span className={`text-lg font-medium ${
                        isSelected(option) ? 'text-primary dark:text-primary-light' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                        {option}
                    </span>
                </button>
            ))}
         </div>

         <div className="flex justify-end">
            <Button 
                onClick={handleNext} 
                disabled={!formData[currentQuestion.key as keyof typeof formData] || isLoading}
                size="lg"
                className="px-12"
            >
                {isLoading ? 'Setting up...' : (step === questions.length - 1 ? 'Finish' : 'Continue')}
            </Button>
         </div>
      </Card>
    </div>
  );
};

export default OnboardingPage;
