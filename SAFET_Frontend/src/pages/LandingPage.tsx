import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import {Shield,Heart,Thermometer,Droplets,Wind,Activity,Check,ArrowRight,Building2,Timer,BadgeCheck,Menu,X,Sun,Moon} from 'lucide-react';
import Carousel from "./Carousel"
import img1 from "../assets/logo.png"
import ParallaxSection from '../components/ParallaxSection'
import video from "../assets/backgroundmp.mp4"
import { useNavigate } from 'react-router-dom';
import { AnimatedTestimonials } from '../components/ui/animated-testimonials';

const testimonials = [
  {
    quote: "Configured the hardware and streamlined the process for real-time communication,enabling seamless connectivity.",
    name: "Kamallochan Das",
    designation: "IoT Developer",
    src: img1,
  },
  {
    quote: "Designed and developed interactive user interfaces, optimizing performance and enhancing user experience.",
    name: "Soham Ghosh",
    designation: "Frontend Developer",
    src: img1,
  },
  {
    quote: "Designed the AI model for predicting params and algorithms for monitoring and lodging the status.",
    name: "Ashish Kumar Samantaray",
    designation: "Backend Algorithm and AI developer",
    src: img1,
  },
  {
    quote: "Improvised the frontend and connected the frontend with mongo using socket.",
    name: "Pratyush Samantara",
    designation: "Fullstack developer",
    src: img1,
  },
  {
    quote: "Researched over existing practices and extracted information over the devices.",
    name: "Swayam Routray",
    designation: "Web scraping and data extraction",
    src: img1,
  },
  {
    quote: "Built backend with Spring Boot, MongoDB, and optimized alerts, notifications, and system reliability." ,
    name: "Anubhav Jaiswal",
    designation: "Backend & Real-time System Integration Engineer",
    src: img1,
  },
];

export default function LandingPage() {
    const navigate = useNavigate();
  useEffect(()=>{
      const lenis = new Lenis({
        autoRaf: true,
      });
      lenis.on('scroll', (e) => {
        console.log(e);
      });
  })
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const handleEnterDashBoard=()=>{
    navigate("/auth")
  }

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm fixed w-full z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={img1} className="h-8 w-8 text-blue-600 dark:text-blue-400"/>
              <span className="ml-2 text-xl font-bold text-blue-900 dark:text-white">SAFE-T</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Features</a>
              <a href="#benefits" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Benefits</a>
              <a href="#integration" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Integration</a>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={handleEnterDashBoard} className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                Enter Dashboard
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-800">
              <a href="#features" className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Features</a>
              <a href="#benefits" className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Benefits</a>
              <a href="#integration" className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Integration</a>
              <button onClick={handleEnterDashBoard} className="w-full text-left px-3 py-2 text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600">
                Enter Dashboard
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center bg-blue-900 dark:bg-gray-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90 dark:from-gray-900/90 dark:to-gray-800/90">
          {/* <img
            src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80"
            alt="Industrial worker background"
            className="w-full h-full object-cover mix-blend-overlay"
          /> */}
          <video src={video} className="w-full h-full object-cover mix-blend-overlay" autoPlay loop muted></video>
        </div>
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Protecting What Matters Most: Your Workforce
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 dark:text-gray-300">
              SAFE-T is the next generation wearable that revolutionizes workplace safety through real-time health monitoring and environmental sensing.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={handleEnterDashBoard}  className="bg-yellow-500 text-blue-900 dark:text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors flex items-center gap-2">
                Enter Dashboard <ArrowRight size={20} />
              </button>
              <a
                href="#features"
                className="border-2 border-white dark:border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <a href="#features" className="text-white/80 dark:text-gray-400 hover:text-white dark:hover:text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Complete Health & Safety Monitoring
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Advanced sensors provide comprehensive real-time monitoring of both worker health and environmental conditions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: "Heart Rate Monitoring", desc: "Continuous cardiovascular tracking" },
              { icon: Activity, title: "SpO2 Levels", desc: "Real-time blood oxygen monitoring" },
              { icon: Thermometer, title: "Body Temperature", desc: "Precise temperature tracking" },
              { icon: Wind, title: "Air Quality Index", desc: "Environmental air quality sensing" },
              { icon: Droplets, title: "Humidity Levels", desc: "Ambient moisture detection" },
              { icon: Shield, title: "Hazard Alerts", desc: "Immediate danger notifications" },
            ].map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <feature.icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Transform Workplace Safety
              </h2>
              <div className="space-y-4">
                {[
                  "Prevent accidents before they happen",
                  "Reduce workplace injuries by up to 65%",
                  "Improve emergency response time by 78%",
                  "Decrease insurance premiums",
                  "Boost worker confidence and morale",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="text-green-500 dark:text-green-400 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-900 dark:bg-gray-800 text-white py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "45%", label: "Reduction in Accidents" },
              { value: "24/7", label: "Real-time Monitoring" },
              { value: "15min", label: "Average Response Time" },
              { value: "98%", label: "Customer Satisfaction" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-200 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Integration Section */}
      <section id="integration" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Seamless Integration
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              SAFE-T works with your existing safety systems and protocols
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Building2, title: "Enterprise Ready", desc: "Compatible with major safety management systems" },
              { icon: Timer, title: "Quick Setup", desc: "Deploy across your workforce in under 48 hours" },
              { icon: BadgeCheck, title: "Certified", desc: "Meets international safety standards" },
            ].map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm text-center transition-all duration-300">
                <feature.icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Parallax section */}
      <ParallaxSection/>
      {/* CTA Section */}
      <section className="bg-blue-900 dark:bg-gray-900 text-white py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Workplace Safety?
          </h2>
          <p className="text-xl text-blue-100 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join industry leaders who trust SAFE-T to protect their most valuable asset - their workforce.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={handleEnterDashBoard} className="bg-yellow-500 text-blue-900 dark:text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors flex items-center gap-2">
              Enter Dashboard <ArrowRight size={20} />
            </button>
            <button className="border-2 border-white dark:border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              View Pricing
            </button>
          </div>
        </div>
      </section>
      {/* carousel section */}
      {/*<Carousel/>*/}
      <div className="bg-white dark:bg-black min-h-screen flex items-center justify-center">
          <AnimatedTestimonials testimonials={testimonials} autoplay/>
        </div>
      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>

            </div>
            <div>

            </div>
            <div>

            </div>
            <div>

            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>&copy; 2025 SAFE-T. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}