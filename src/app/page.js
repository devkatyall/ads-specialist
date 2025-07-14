import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

// Main App component for the homepage
export default function page() {
  return (
    // Main wrapper div for the entire application
    // <div className="text-gray-800">
    //   <div className="bg-black text-center py-4 italic font-medium text-white">
    //     Adgenius is still in beta and improving everyday. Feel free to{" "}
    //     <a href="mailto:devkatyal@protonmail.com" className="text-green-600">
    //       email me
    //     </a>{" "}
    //     for any suggestions.
    //   </div>
    //   {/* Header section of the page */}
    //   <header className="bg-white shadow-sm py-4 px-6 md:px-12 lg:px-24 sticky top-0 z-50">
    //     <nav className="container mx-auto flex justify-between items-center">
    //       {/* Logo/Brand Name with styling */}
    //       <a
    //         href="#"
    //         className="text-2xl font-bold text-indigo-700 rounded-md p-2 hover:bg-indigo-50 transition duration-300"
    //       >
    //         AdGenius
    //       </a>

    //       {/* Navigation Links for desktop view */}
    //       {/* <div className="hidden md:flex space-x-8">
    //         <a
    //           href="#"
    //           className="text-gray-600 hover:text-indigo-700 font-medium transition duration-300 rounded-md p-2"
    //         >
    //           Home
    //         </a>
    //         <a
    //           href="#"
    //           className="text-gray-600 hover:text-indigo-700 font-medium transition duration-300 rounded-md p-2"
    //         >
    //           Features
    //         </a>
    //         <a
    //           href="#"
    //           className="text-gray-600 hover:text-indigo-700 font-medium transition duration-300 rounded-md p-2"
    //         >
    //           Pricing
    //         </a>
    //         <a
    //           href="#"
    //           className="text-gray-600 hover:text-indigo-700 font-medium transition duration-300 rounded-md p-2"
    //         >
    //           About Us
    //         </a>
    //         <a
    //           href="#"
    //           className="text-gray-600 hover:text-indigo-700 font-medium transition duration-300 rounded-md p-2"
    //         >
    //           Contact
    //         </a>
    //       </div> */}

    //       {/* Call to Action Button for desktop view */}
    //       <a
    //         href="/dashboard"
    //         className="hidden md:block bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-cyan-600 transition duration-300 shadow-lg"
    //       >
    //         Get Started Free
    //       </a>

    //       {/* Mobile Menu Button (Hamburger Icon) for smaller screens */}
    //       <button className="md:hidden text-gray-600 hover:text-indigo-700 focus:outline-none">
    //         <svg
    //           className="w-7 h-7"
    //           fill="none"
    //           stroke="currentColor"
    //           viewBox="0 0 24 24"
    //           xmlns="http://www.w3.org/2000/svg"
    //         >
    //           <path
    //             strokeLinecap="round"
    //             strokeLinejoin="round"
    //             strokeWidth="2"
    //             d="M4 6h16M4 12h16m-7 6h7"
    //           ></path>
    //         </svg>
    //       </button>
    //     </nav>
    //   </header>

    //   {/* Hero Section: Main headline and call to action */}
    //   <section className="bg-gradient-to-r from-cyan-600 to-green-600 text-white py-20 md:py-32 text-center relative overflow-hidden rounded-b-3xl shadow-xl">
    //     {/* Decorative background circles */}
    //     <div className="absolute top-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
    //     <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>{" "}
    //     {/* Corrected translate-y for better visual */}
    //     <div className="container mx-auto max-w-6xl px-6 md:px-12 lg:px-24 relative z-10">
    //       <h1 className="text-4xl md:text-6xl font-extrabold leading-tighter tracking-tight mb-6 animate-fade-in-up">
    //         An AI powered tool made just for performance marketers
    //       </h1>
    //       <p className="text-lg md:text-lg mb-10 max-w-4xl mx-auto opacity-70 animate-fade-in">
    //         Adgenius helps you save time by building atleast 2 ad groups,
    //         different types of keywords, ad copy that does not sound AI at all
    //         and over 100+ negative keywords avoiding any unqualified click your
    //         campaign could get.
    //       </p>
    //       <div className="flex flex-col sm:flex-row justify-center items-center gap-10">
    //         <a
    //           href="#"
    //           className="bg-white text-indigo-700 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition duration-300 shadow-lg transform hover:scale-105"
    //         >
    //           Let's Start
    //         </a>
    //         <a href="#learn">Learn More</a>
    //       </div>
    //     </div>
    //   </section>

    //   {/* Features Section: Highlights key functionalities of the platform */}
    //   <section id="learn" className="py-16 md:py-24 bg-white">
    //     <div className="container mx-auto px-6 md:px-12 lg:px-24">
    //       <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-indigo-800">
    //         Key Features Designed for Your Success ( Comming Soon..)
    //       </h2>
    //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    //         {/* Feature 1: AI-Powered Optimization */}
    //         <div className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
    //           <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-6">
    //             <svg
    //               className="w-8 h-8"
    //               fill="none"
    //               stroke="currentColor"
    //               viewBox="0 0 24 24"
    //               xmlns="http://www.w3.org/2000/svg"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 strokeWidth="2"
    //                 d="M9.75 17L9 20l-1 1h8l-1-1l-.75-3M3 13h18M5 17h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    //               ></path>
    //             </svg>
    //           </div>
    //           <h3 className="text-xl font-semibold mb-4 text-indigo-700">
    //             AI-Powered Optimization
    //           </h3>
    //           <p className="text-gray-600">
    //             Our intelligent algorithms continuously analyze your campaigns,
    //             automatically adjusting bids and targeting for maximum ROI.
    //           </p>
    //         </div>

    //         {/* Feature 2: Precise Audience Targeting */}
    //         <div className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
    //           <div className="flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-6">
    //             <svg
    //               className="w-8 h-8"
    //               fill="none"
    //               stroke="currentColor"
    //               viewBox="0 0 24 24"
    //               xmlns="http://www.w3.org/2000/svg"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 strokeWidth="2"
    //                 d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M17 20v-2c0-.134-.01-.265-.03-.395M12 18h.01M5 20h2v-2a3 3 0 00-5.356-1.857M5 20v-2c0-.134-.01-.265-.03-.395M12 12a3 3 0 100-6 3 3 0 000 6zm-5-2a3 3 0 100-6 3 3 0 000 6zm10 0a3 3 0 100-6 3 3 0 000 6z"
    //               ></path>
    //             </svg>
    //           </div>
    //           <h3 className="text-xl font-semibold mb-4 text-indigo-700">
    //             Precise Audience Targeting
    //           </h3>
    //           <p className="text-gray-600">
    //             Reach your ideal customers with advanced demographic, interest,
    //             and behavioral targeting options.
    //           </p>
    //         </div>

    //         {/* Feature 3: Real-time Performance Analytics */}
    //         <div className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
    //           <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full mb-6">
    //             <svg
    //               className="w-8 h-8"
    //               fill="none"
    //               stroke="currentColor"
    //               viewBox="0 0 24 24"
    //               xmlns="http://www.w3.org/2000/svg"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 strokeWidth="2"
    //                 d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
    //               ></path>
    //             </svg>
    //           </div>
    //           <h3 className="text-xl font-semibold mb-4 text-indigo-700">
    //             Real-time Performance Analytics
    //           </h3>
    //           <p className="text-gray-600">
    //             Monitor your ad spend and performance with intuitive dashboards
    //             and detailed reports, updated in real-time.
    //           </p>
    //         </div>

    //         {/* Feature 4: Smart Budget Management */}
    //         <div className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
    //           <div className="flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-6">
    //             <svg
    //               className="w-8 h-8"
    //               fill="none"
    //               stroke="currentColor"
    //               viewBox="0 0 24 24"
    //               xmlns="http://www.w3.org/2000/svg"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 strokeWidth="2"
    //                 d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.592 1L21 12h-3.812c-.669 1.442-2.017 2.5-3.712 2.5H12c-1.695 0-3.043-1.058-3.712-2.5H3L1 10.402A8.013 8.013 0 0112 8z"
    //               ></path>
    //             </svg>
    //           </div>
    //           <h3 className="text-xl font-semibold mb-4 text-indigo-700">
    //             Smart Budget Management
    //           </h3>
    //           <p className="text-gray-600">
    //             Set and forget your budget. Our system ensures optimal spend
    //             across channels to maximize your returns.
    //           </p>
    //         </div>

    //         {/* Feature 5: Cross-Platform Integration */}
    //         <div className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
    //           <div className="flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-6">
    //             <svg
    //               className="w-8 h-8"
    //               fill="none"
    //               stroke="currentColor"
    //               viewBox="0 0 24 24"
    //               xmlns="http://www.w3.org/2000/svg"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 strokeWidth="2"
    //                 d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    //               ></path>
    //             </svg>
    //           </div>
    //           <h3 className="text-xl font-semibold mb-4 text-indigo-700">
    //             Cross-Platform Integration
    //           </h3>
    //           <p className="text-gray-600">
    //             Seamlessly manage campaigns across Google Ads, Facebook,
    //             Instagram, and more from a single dashboard.
    //           </p>
    //         </div>

    //         {/* Feature 6: Dedicated Support */}
    //         <div className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
    //           <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-6">
    //             <svg
    //               className="w-8 h-8"
    //               fill="none"
    //               stroke="currentColor"
    //               viewBox="0 0 24 24"
    //               xmlns="http://www.w3.org/2000/svg"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 strokeWidth="2"
    //                 d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    //               ></path>
    //             </svg>
    //           </div>
    //           <h3 className="text-xl font-semibold mb-4 text-indigo-700">
    //             Dedicated Support
    //           </h3>
    //           <p className="text-gray-600">
    //             Our team of ad experts is here to provide personalized support
    //             and guidance whenever you need it.
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   </section>

    //   {/* Testimonials Section: Displays client feedback */}
    //   <section className="bg-indigo-50 py-16 md:py-24">
    //     <div className="container mx-auto px-6 md:px-12 lg:px-24">
    //       <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-indigo-800">
    //         What Our Clients Say
    //       </h2>
    //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    //         {/* Testimonial 1 */}
    //         <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center text-center hover:shadow-lg transition duration-300">
    //           {/* Corrected img tag: self-closing and className */}
    //           <img
    //             src="https://placehold.co/80x80/6366f1/ffffff?text=JD"
    //             alt="Client Avatar"
    //             className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-indigo-200"
    //           />
    //           <p className="text-lg italic text-gray-700 mb-4">
    //             "AdGenius transformed our ad campaigns! We saw a 30% increase in
    //             ROI within the first month. Highly recommend!"
    //           </p>
    //           <p className="font-semibold text-indigo-700">
    //             - Jane Doe, Marketing Manager
    //           </p>
    //         </div>
    //         {/* Testimonial 2 */}
    //         <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center text-center hover:shadow-lg transition duration-300">
    //           {/* Corrected img tag: self-closing and className */}
    //           <img
    //             src="https://placehold.co/80x80/6366f1/ffffff?text=AS"
    //             alt="Client Avatar"
    //             className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-indigo-200"
    //           />
    //           <p className="text-lg italic text-gray-700 mb-4">
    //             "The AI optimization is a game-changer. Our team can now focus
    //             on strategy instead of manual adjustments."
    //           </p>
    //           <p className="font-semibold text-indigo-700">
    //             - Alex Smith, Small Business Owner
    //           </p>
    //         </div>
    //         {/* Testimonial 3 */}
    //         <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center text-center hover:shadow-lg transition duration-300">
    //           {/* Corrected img tag: self-closing and className */}
    //           <img
    //             src="https://placehold.co/80x80/6366f1/ffffff?text=CM"
    //             alt="Client Avatar"
    //             className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-indigo-200"
    //           />
    //           <p className="text-lg italic text-gray-700 mb-4">
    //             "Exceptional support and powerful analytics. AdGenius is an
    //             indispensable tool for our agency."
    //           </p>
    //           <p className="font-semibold text-indigo-700">
    //             - Chris Miller, Agency Director
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   </section>

    //   {/* Call to Action Section: Encourages user to start using the platform */}
    //   <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16 md:py-24 text-center rounded-t-3xl shadow-xl">
    //     <div className="container mx-auto px-6 md:px-12 lg:px-24">
    //       <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
    //         Ready to Boost Your Ad Performance?
    //       </h2>
    //       <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto opacity-90">
    //         Join hundreds of businesses already seeing incredible results with
    //         AdGenius.
    //       </p>
    //       <a
    //         href="#"
    //         className="bg-white text-purple-700 px-10 py-5 rounded-full font-bold text-xl hover:bg-gray-100 transition duration-300 shadow-lg transform hover:scale-105"
    //       >
    //         Get Started Today
    //       </a>
    //     </div>
    //   </section>

    //   {/* Footer section with company info, quick links, and contact details */}
    //   <footer className="bg-gray-800 text-gray-300 py-10 px-6 md:px-12 lg:px-24">
    //     <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
    //       {/* Company Info and Social Media Links */}
    //       <div>
    //         <h3 className="text-xl font-bold text-white mb-4">AdGenius</h3>
    //         <p className="text-gray-400">
    //           Amplify Your Digital Ad Performance.
    //         </p>
    //         <div className="flex justify-center md:justify-start space-x-4 mt-4">
    //           {/* Social Media Icons (Placeholder SVGs) - Corrected className */}
    //           <a
    //             href="#"
    //             className="text-gray-400 hover:text-white transition duration-300"
    //           >
    //             <svg
    //               className="w-6 h-6"
    //               fill="currentColor"
    //               viewBox="0 0 24 24"
    //               aria-hidden="true"
    //             >
    //               <path
    //                 fillRule="evenodd"
    //                 d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22H12c5.523 0 10-4.477 10-10z"
    //                 clipRule="evenodd"
    //               />
    //             </svg>
    //           </a>
    //           <a
    //             href="#"
    //             className="text-gray-400 hover:text-white transition duration-300"
    //           >
    //             <svg
    //               className="w-6 h-6"
    //               fill="currentColor"
    //               viewBox="0 0 24 24"
    //               aria-hidden="true"
    //             >
    //               <path
    //                 fillRule="evenodd"
    //                 d="M12.315 2c2.43 0 2.784.002 3.797.048.843.04 1.15.137 1.504.237.664.187 1.246.393 1.786.933.54.54.746 1.122.933 1.786.1.354.197.661.237 1.504.045 1.013.048 1.371.048 3.797s-.002 2.784-.048 3.797c-.04.843-.137 1.15-.237 1.504-.187.664-.393 1.246-.933 1.786-.54.54-.746 1.122-.933 1.786-.1-.354-.197-.661-.237-1.504-.045-1.013-.048-1.371-.048-3.797s.002-2.784.048-3.797c.04-.843.137-1.15.237-1.504.187-.664.393-1.246.933-1.786.54-.54 1.122-.746 1.786-.933.354-.1.661-.197 1.504-.237C9.535 2.002 9.893 2 12.315 2zm0 0c-2.43 0-2.784.002-3.797.048-.843.04-1.15.137-1.504.237-.664.187-1.246.393-1.786.933-.54.54-.746 1.122-.933 1.786-.1-.354-.197-.661-.237-1.504-.045-1.013-.048-1.371-.048-3.797s.002-2.784.048-3.797c.04-.843.137-1.15.237-1.504.187-.664.393-1.246.933-1.786.54.54 1.122.746 1.786.933.354.1.661.197 1.504.237 1.013.045 1.371.048 3.797.048s2.784-.002 3.797-.048c.843-.04 1.15-.137 1.504-.237.664-.187 1.246-.393 1.786-.933.54-.54.746-1.122.933-1.786.1-.354.197-.661-.237-1.504.045-1.013.048-1.371.048-3.797s-.002-2.784-.048-3.797c-.04-.843-.137-1.15-.237-1.504-.187-.664-.393-1.246-.933-1.786-.54-.54-1.122-.746-1.786-.933-.354-.1-.661-.197-1.504-.237-.996-.045-1.354-.048-3.782-.048zm0 6.838a5.162 5.162 0 100 10.324 5.162 5.162 0 000-10.324zm0 1.378a3.784 3.784 0 110 7.568 3.784 3.784 0 010-7.568z"
    //                 clipRule="evenodd"
    //               />
    //             </svg>
    //           </a>
    //           <a
    //             href="#"
    //             className="text-gray-400 hover:text-white transition duration-300"
    //           >
    //             <svg
    //               className="w-6 h-6"
    //               fill="currentColor"
    //               viewBox="0 0 24 24"
    //               aria-hidden="true"
    //             >
    //               <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012 10.76v.055a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.235a11.65 11.65 0 006.29 1.84"></path>
    //             </svg>
    //           </a>
    //           <a
    //             href="#"
    //             className="text-gray-400 hover:text-white transition duration-300"
    //           >
    //             <svg
    //               className="w-6 h-6"
    //               fill="currentColor"
    //               viewBox="0 0 24 24"
    //               aria-hidden="true"
    //             >
    //               <path
    //                 fillRule="evenodd"
    //                 d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.163 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.004.07 1.532 1.03 1.532 1.03.892 1.529 2.341 1.089 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.116-4.555-4.949 0-1.092.39-1.983 1.029-2.675-.103-.253-.446-1.266.098-2.64 0 0 .84-.268 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.701.116 2.503.337 1.909-1.293 2.747-1.025 2.747-1.025.546 1.373.202 2.387.099 2.64.64.692 1.029 1.583 1.029 2.675 0 3.841-2.339 4.69-4.566 4.934.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.576.687.479C19.137 20.163 22 16.416 22 12c0-5.523-4.477-10-10-10z"
    //                 clipRule="evenodd"
    //               />
    //             </svg>
    //           </a>
    //         </div>
    //       </div>

    //       {/* Quick Links navigation */}
    //       <div>
    //         <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
    //         <ul className="space-y-2">
    //           <li>
    //             <a
    //               href="#"
    //               className="text-gray-400 hover:text-white transition duration-300"
    //             >
    //               Features
    //             </a>
    //           </li>
    //           <li>
    //             <a
    //               href="#"
    //               className="text-gray-400 hover:text-white transition duration-300"
    //             >
    //               Pricing
    //             </a>
    //           </li>
    //           <li>
    //             <a
    //               href="#"
    //               className="text-gray-400 hover:text-white transition duration-300"
    //             >
    //               Case Studies
    //             </a>
    //           </li>
    //           <li>
    //             <a
    //               href="#"
    //               className="text-gray-400 hover:text-white transition duration-300"
    //             >
    //               Blog
    //             </a>
    //           </li>
    //           <li>
    //             <a
    //               href="#"
    //               className="text-gray-400 hover:text-white transition duration-300"
    //             >
    //               FAQ
    //             </a>
    //           </li>
    //         </ul>
    //       </div>

    //       {/* Contact Information */}
    //       <div>
    //         <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
    //         <p className="text-gray-400">123 AdTech Avenue, Suite 100</p>
    //         <p className="text-gray-400">Digital City, CA 90210</p>
    //         <p className="text-gray-400 mt-2">
    //           Email:{" "}
    //           <a
    //             href="mailto:info@adgenius.com"
    //             className="hover:text-white transition duration-300"
    //           >
    //             info@adgenius.com
    //           </a>
    //         </p>
    //         <p className="text-gray-400">
    //           Phone:{" "}
    //           <a
    //             href="tel:+15551234567"
    //             className="hover:text-white transition duration-300"
    //           >
    //             +1 (555) 123-4567
    //           </a>
    //         </p>
    //       </div>
    //     </div>
    //     <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500">
    //       &copy; {new Date().getFullYear()} AdGenius. All rights reserved.
    //     </div>
    //   </footer>
    // </div>
    <div className="">
      <div className="bg-black text-center py-4 italic font-medium text-white">
        Adgenius is still in beta and improving everyday. Feel free to{" "}
        <a href="mailto:devkatyal@protonmail.com" className="text-green-600">
          email me
        </a>{" "}
        for any suggestions.
      </div>
      {/* Header section of the page */}
      <header className="bg-white shadow-sm py-4 px-6 md:px-12 lg:px-24 sticky top-0 z-50">
        <nav className="container mx-auto flex justify-between items-center">
          {/* Logo/Brand Name with styling */}
          <a
            href="#"
            className="text-2xl font-bold text-indigo-700 rounded-md p-2 hover:bg-indigo-50 transition duration-300"
          >
            AdGenius
          </a>

          {/* Navigation Links for desktop view */}
          <div className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-gray-600 hover:text-indigo-700 font-medium transition duration-300 rounded-md p-2"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-indigo-700 font-medium transition duration-300 rounded-md p-2"
            >
              Features
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-indigo-700 font-medium transition duration-300 rounded-md p-2"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-indigo-700 font-medium transition duration-300 rounded-md p-2"
            >
              About Us
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-indigo-700 font-medium transition duration-300 rounded-md p-2"
            >
              Contact
            </a>
          </div>

          {/* Call to Action Button for desktop view */}
          <Link
            href={"/dashboard"}
            className="flex gap-2 items-center text-lg bg-white p-4 pl-3 border-1 border-black hover:scale-[1.08] transition-all"
          >
            <ArrowRight className="rotate-[-40deg]" />
            Get started for free
          </Link>

          {/* Mobile Menu Button (Hamburger Icon) for smaller screens */}
          <button className="md:hidden text-gray-600 hover:text-indigo-700 focus:outline-none">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </nav>
      </header>

      <section className="py-20 md:py-32 container mx-auto">
        <h1 className="text-6xl font-medium max-w-3xl mb-3">
          An AI powered tool made just for{" "}
          <span className="text-green-500">performance</span> marketers!
        </h1>
        <p className="text-muted-foreground max-w-2xl px-2 mb-6">
          a tool made just to make marketers job easy! Saving marketers time of
          keyword research, ad copy and theme generation and most importantly
          negative keywords.
        </p>
        <div className="px-2 flex items-center gap-10">
          <Link
            href={"/dashboard/create/google-ads"}
            className="flex gap-2 items-center text-lg bg-white p-4 pl-3 border-1 border-black hover:scale-[1.08] transition-all"
          >
            <ArrowRight className="rotate-[-40deg]" />
            Build a campaign
          </Link>
          <Link className=" text-lg " href={"#key-features"}>
            Learn more
          </Link>
        </div>
      </section>

      <section className="container mx-auto text-center ">
        <h2 className="text-2xl">Why would you wanna use this tool?</h2>
      </section>
    </div>
  );
}
