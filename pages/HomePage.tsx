import React from 'react';
import { NavLink } from 'react-router-dom';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { LightningIcon } from '../components/icons/LightningIcon';
import { ChartIcon } from '../components/icons/ChartIcon';
import { ShieldIcon } from '../components/icons/ShieldIcon';
import { TargetIcon } from '../components/icons/TargetIcon';
import { SearchIcon } from '../components/icons/SearchIcon';
import { ArrowUpIcon } from '../components/icons/ArrowUpIcon';
import { BrainIcon } from '../components/icons/BrainIcon';
import { UserIcon } from '../components/icons/UserIcon';
import { VideoIcon } from '../components/icons/VideoIcon';

const HomePage: React.FC = () => {

    return (
        <div className="bg-light-bg dark:bg-dark-bg font-sans">

            {/* Hero Section - Dark & Vibrant */}
            <section className="relative bg-midnight text-white pt-20 pb-16 sm:pt-32 sm:pb-20 md:pt-40 md:pb-32 overflow-hidden">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>

                <div className="container mx-auto px-3 sm:px-4 relative z-10 text-center">
                    <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-sm font-semibold tracking-wide text-secondary-light">
                        ✨ New: Short-Form Video Analysis Added
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-4 sm:mb-6 leading-tight tracking-tight">
                        Marketing Magic.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-300">Zero Friction.</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10 leading-relaxed px-2">
                        Audit Articles, Video Scripts, SEO, and Viral Potential from just one platform.
                        The all-in-one toolkit for modern creators.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <div className="relative w-full max-w-md">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-6 py-4 rounded-full bg-white text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary/50 shadow-lg"
                            />
                            <div className="hidden sm:block absolute right-1.5 top-1.5">
                                <NavLink to="/register">
                                    <Button size="sm">Get Started</Button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="sm:hidden w-full max-w-md">
                            <NavLink to="/register">
                                <Button className="w-full">Get Started Free</Button>
                            </NavLink>
                        </div>
                    </div>

                    <div className="mt-6 text-sm text-gray-400">
                    </div>
                </div>

                {/* Dashboard Preview Visual (GIF Container) */}
                <div className="mt-12 sm:mt-16 mx-auto max-w-5xl px-3 sm:px-4">
                    <div className="rounded-xl bg-white/5 backdrop-blur-sm p-2 border border-white/10 shadow-2xl">
                        <div className="rounded-lg overflow-hidden bg-midnight-lighter aspect-[16/9] relative flex items-center justify-center border border-white/5 group">
                            {/* 
                        INSTRUCTIONS FOR USER: 
                        1. Name your file "dashboard-demo.gif"
                        2. Put it in the "public" folder of your project.
                    */}
                            <video
                                src="/demo.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose GritGrade Section */}
            <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-dark-bg dark:to-midnight">
                <div className="container mx-auto px-3 sm:px-4">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
                        {/* Left Side - Text Content */}
                        <div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-midnight dark:text-white mb-4 sm:mb-6">
                                Why Choose GritGrade?
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                Content creators and SEO professionals trust GritGrade to optimize their content strategy and outperform competitors.
                            </p>

                            {/* Feature List */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 font-medium">Unified analysis across 5 critical dimensions</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 font-medium">Real-time competitor insights</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 font-medium">Actionable recommendations prioritized by impact</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 font-medium">Track content improvements over time</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 font-medium">Export detailed audit reports</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 font-medium">Save unlimited content analyses</p>
                                </div>
                            </div>

                            <NavLink to="/register">
                                <Button size="lg">Start Auditing Now</Button>
                            </NavLink>
                        </div>

                        {/* Right Side - Feature Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {/* Instant Card */}
                            <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 sm:p-8 border border-blue-200 dark:border-blue-800 hover:shadow-xl hover:scale-105 transition-all duration-300">
                                <div className="w-11 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                                    <LightningIcon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-midnight dark:text-white mb-3">Instant</h3>
                                <p className="text-gray-600 dark:text-gray-400">Real-time analysis in under 60 seconds</p>
                            </div>

                            {/* Accurate Card */}
                            <div className="group relative bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-8 border border-green-200 dark:border-green-800 hover:shadow-xl hover:scale-105 transition-all duration-300">
                                <div className="w-11 h-14 bg-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                                    <ChartIcon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-midnight dark:text-white mb-3">Accurate</h3>
                                <p className="text-gray-600 dark:text-gray-400">AI-powered insights you can trust</p>
                            </div>

                            {/* Secure Card */}
                            <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800 hover:shadow-xl hover:scale-105 transition-all duration-300">
                                <div className="w-11 h-14 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                                    <ShieldIcon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-midnight dark:text-white mb-3">Secure</h3>
                                <p className="text-gray-600 dark:text-gray-400">Your content data is always protected</p>
                            </div>

                            {/* Actionable Card */}
                            <div className="group relative bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-8 border border-orange-200 dark:border-orange-800 hover:shadow-xl hover:scale-105 transition-all duration-300">
                                <div className="w-11 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                                    <TargetIcon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-midnight dark:text-white mb-3">Actionable</h3>
                                <p className="text-gray-600 dark:text-gray-400">Clear steps to improve your content</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bento Grid Features Section */}
            <section className="py-16 sm:py-24 bg-light-bg dark:bg-dark-bg">
                <div className="container mx-auto px-3 sm:px-4">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
                            One Platform. <span className="text-primary">Endless Potential.</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-3">
                            We've combined SEO analysis, script doctoring, and trend spotting into a single, powerful workspace.
                        </p>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">

                        {/* Card 1: Large Left - SEO */}
                        <div className="md:col-span-2 bg-white dark:bg-midnight-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all group overflow-hidden relative">
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
                                    <SearchIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2 dark:text-white">SEO & Content Audit</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                                    Deep dive into keyword density, SERP intent, and readability. Fix issues before you hit publish.
                                </p>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300">Keywords</span>
                                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300">Links</span>
                                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300">Metadata</span>
                                </div>
                            </div>
                            <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-green-50 to-transparent dark:from-green-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>

                        {/* Card 2: Right Top - AI */}
                        <div className="bg-midnight text-white rounded-3xl p-8 shadow-lg relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-white">
                                    <BrainIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">AI-Ready</h3>
                                <p className="text-gray-300 text-sm">
                                    Optimize for Answer Engines (AEO) and Chat Search.
                                </p>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                        </div>

                        {/* Card 3: Left Bottom - Video */}
                        <div className="bg-secondary text-white rounded-3xl p-8 shadow-lg relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-white">
                                    <VideoIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Viral Video Scripts</h3>
                                <p className="text-white/80 text-sm">
                                    Analyze hooks, pacing, and visual potential for Shorts & Reels.
                                </p>
                            </div>
                            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-transparent to-black/20"></div>
                        </div>

                        {/* Card 4: Large Right - Competitors */}
                        <div className="md:col-span-2 bg-white dark:bg-midnight-card rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-6 text-orange-600 dark:text-orange-400">
                                    <TargetIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2 dark:text-white">Competitive Intelligence</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    See exactly how you stack up against the top results in your niche.
                                </p>

                                {/* Simulated Chart */}
                                <div className="mt-6 h-24 flex items-end gap-4 opacity-50">
                                    <div className="w-1/4 h-1/2 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                                    <div className="w-1/4 h-3/4 bg-gray-300 dark:bg-gray-600 rounded-t-lg"></div>
                                    <div className="w-1/4 h-full bg-primary rounded-t-lg shadow-lg shadow-primary/30"></div>
                                    <div className="w-1/4 h-2/3 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-24 bg-midnight text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="container mx-auto px-3 sm:px-4 relative z-10">
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold mb-6 sm:mb-8">
                        Start your growth engine.
                    </h2>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                        Join thousands of marketers who are creating better content, faster.
                    </p>
                    <div className="flex justify-center gap-4">
                        <NavLink to="/register">
                            <Button size="lg">Get Started for Free</Button>
                        </NavLink>
                        <NavLink to="/login">
                            <Button size="lg" variant="outline" className="border-gray-600 text-white hover:border-white hover:text-white">
                                Log In
                            </Button>
                        </NavLink>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default HomePage;