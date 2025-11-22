# 🚀 GritGrade - Content Quality Audit Tool

> **Transform your content strategy with AI-powered analysis**  
> Comprehensive SEO, AEO, and content quality auditing platform for modern creators and marketers.

[![Made with React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-10.x-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Deploy Status](https://github.com/Mani-kanta-0539/Audit/actions/workflows/deploy.yml/badge.svg)](https://github.com/Mani-kanta-0539/Audit/actions/workflows/deploy.yml)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Usage Guide](#-usage-guide)
- [Features Breakdown](#-features-breakdown)
- [Mobile Responsive](#-mobile-responsive)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**GritGrade** is an all-in-one content quality audit platform that helps content creators, SEO professionals, and digital marketers optimize their content for both search engines and AI-powered answer engines. Powered by Google Gemini AI, GritGrade provides comprehensive analysis across multiple dimensions including SEO, SERP performance, AEO optimization, content humanization, and competitive differentiation.

### Why GritGrade?

- ✅ **Unified Analysis** - Audit articles, video scripts, and SEO from one platform
- ✅ **AI-Powered Insights** - Google Gemini 2.5 Flash for accurate content analysis
- ✅ **Real-time Results** - Get comprehensive reports in under 60 seconds
- ✅ **Competitor Intelligence** - Compare your content against top-ranking competitors
- ✅ **Progress Tracking** - Monitor content improvements over time
- ✅ **Mobile Responsive** - Fully optimized for all devices

---

## ✨ Key Features

### 🔍 Content Analysis

#### **Article Auditing**
- **SEO Analysis** - Keyword density, readability, meta descriptions, heading structure
- **SERP Performance** - Ranking potential, estimated position, competitor comparison
- **AEO Optimization** - Voice search readiness, schema markup, AI-friendly formatting
- **Humanization Score** - AI pattern detection, natural flow, tone consistency
- **Differentiation Metrics** - Content uniqueness, semantic similarity, value proposition

#### **Video Script Analysis**
- **Hook Strength** - Opening impact and retention potential
- **Visual Pacing** - Scene transitions and engagement factors
- **Viral Potential** - Trend alignment and shareability metrics
- **Caption Quality** - Accessibility and engagement optimization
- **Hashtag Strategy** - Trending tags and discoverability

### 📊 Advanced Analytics

- **Traffic Metrics** - Visits, unique visitors, bounce rate, session duration (AI-estimated)
- **SEO Performance** - Authority score, organic traffic, keyword rankings
- **Backlink Analysis** - Referring domains, backlink quality, link profile
- **Competitive Insights** - Real-time competitor data and gap analysis
- **Progress Tracking** - Historical data, improvement trends, goal setting

### 🎨 User Experience

- **Dark/Light Mode** - Full theme support with system preference detection
- **Mobile Navigation** - Hamburger menu with smooth animations
- **Responsive Design** - Optimized for phones, tablets, and desktops
- **Export Reports** - Download comprehensive PDF audit reports
- **Share Results** - Social sharing and collaboration features
- **Text-to-Speech** - Audio report summaries

---

## 🛠️ Technology Stack

### Frontend
- **React 18.x** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Vite** - Fast build tool and dev server

### Backend & Services
- **Firebase Authentication** - Secure user management
- **Firebase Firestore** - Real-time NoSQL database
- **Google Gemini AI** - Advanced content analysis
- **SERP API** - Competitor data fetching

### Additional Tools
- **jsPDF** - PDF report generation
- **html2canvas** - Screenshot capture for reports
- **PostCSS** - CSS processing
- **Autoprefixer** - Browser compatibility

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Firebase Project** with Authentication and Firestore enabled
- **Google Gemini API Key**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/gritgrade-audit-tool.git
cd gritgrade-audit-tool
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google Gemini API
API_KEY=your_gemini_api_key

# SERP API (Optional)
SERP_API_KEY=your_serp_api_key
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

---

## 📖 Usage Guide

### 1. **Sign Up / Log In**
- Create an account or log in with existing credentials
- Authentication handled securely via Firebase

### 2. **Run an Audit**
- Navigate to the **Workspace** (Dashboard)
- Choose content type: **Article** or **Video**
- Paste your content or URL
- Enter target keywords (optional)
- Select analysis dimensions
- Click **Run Audit**

### 3. **View Results**
- Overall quality score (0-100)
- Detailed scores across all dimensions
- Visual charts and graphs
- Actionable recommendations
- Competitor comparison

### 4. **Export & Share**
- Export as PDF report
- Share via social media
- Copy shareable link
- Listen to audio summary

### 5. **Track Progress**
- View **Analytics** page for trends
- Set improvement goals
- Monitor historical performance
- Compare with benchmarks

---

## 🎨 Features Breakdown

### Dashboard (Workspace)

**Content Input Options:**
- Direct text input (up to 15,000 characters)
- URL analysis for live content
- Keyword targeting
- Platform selection (YouTube, Instagram, TikTok for videos)

**Dimension Selection:**
Choose which metrics to analyze:
- SEO Analysis
- SERP Performance
- AEO Optimization
- Humanization & Tone
- Differentiation
- Freshness, Linking, Accessibility
- Content Depth & Sentiment

### Analysis Page

**Comprehensive Reports:**
- **Overview** - Summary and key metrics
- **SEO** - Keyword density, readability, heading structure, meta tags
- **SERP** - Ranking potential, competitor analysis, word count comparison
- **AEO** - Voice search optimization, schema markup, citation quality
- **Humanization** - AI pattern detection, sentence variety, tone analysis
- **Differentiation** - Content uniqueness, semantic comparison, angle recommendations

**Visual Elements:**
- Progress bars and charts
- Score cards with circular indicators
- Comparison tables
- Recommendation lists
- Trend arrows and percentages

### Traffic Analytics

**AI-Estimated Metrics:**
- Total visits
- Unique visitors
- Pages per visit
- Average visit duration
- Bounce rate

*Each metric includes trend indicators and percentage changes*

### Advanced SEO Metrics

**Performance Indicators:**
- Authority Score (0-100 with rank)
- Organic Traffic (monthly estimates)
- Organic Keywords (ranking count)
- Paid Keywords (advertising presence)
- Referring Domains (backlink sources)
- Total Backlinks (link profile size)

### Progress Tracking

**Historical Analysis:**
- Line charts showing score trends
- Calendar view of audit history
- Goal setting and tracking
- Competitor comparison over time
- Performance insights

### Audit History

**Saved Reports:**
- All previous audits stored
- Quick access to any report
- Delete unwanted entries
- Re-run audits with same parameters

---

## 📱 Mobile Responsive

GritGrade is **fully optimized for mobile devices**:

### Mobile Features
- ✅ Hamburger navigation menu
- ✅ Touch-friendly buttons (44px+ targets)
- ✅ Horizontal scrolling tables
- ✅ Responsive text sizing
- ✅ Progressive padding system
- ✅ Optimized grid layouts

### Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md)
- **Desktop**: > 1024px (lg)

### Mobile Optimizations
- Reduced padding: `px-3` on mobile vs `px-8` on desktop
- Progressive top spacing: `pt-20 sm:pt-32 md:pt-40`
- Stacking grids: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3`
- Smaller text: `text-3xl sm:text-5xl md:text-7xl`

---

## 🔧 Environment Variables

Required environment variables for the project:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID | Yes |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | Yes |
| `API_KEY` | Google Gemini API key | Yes |
| `SERP_API_KEY` | SERP API key (optional) | No |

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain mobile responsiveness
- Add comments for complex logic
- Test on multiple devices

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** - For powerful content analysis
- **Firebase** - For authentication and database
- **Tailwind CSS** - For beautiful, responsive UI
- **React Community** - For amazing tools and libraries

---

## 📞 Support

For issues, questions, or feature requests:
- 🐛 [Open an Issue](https://github.com/yourusername/gritgrade-audit-tool/issues)
- 💬 [Discussions](https://github.com/yourusername/gritgrade-audit-tool/discussions)
- 📧 Email: support@gritgrade.com

---

<div align="center">
  
**Made with ❤️ by the GritGrade Team**

[Website](https://gritgrade.com) • [Documentation](https://docs.gritgrade.com) • [Blog](https://blog.gritgrade.com)

</div>
