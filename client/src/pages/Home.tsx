import { Link } from "wouter";
import { FilePlus2, FileText, FileOutput, FileSearch, Edit, Lock, Download, Users, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Home: React.FC = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 via-indigo-50 to-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Decoration Elements */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient-text">
                PDFCore Tools
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-10 leading-relaxed">
              Powerful PDF tools that are <span className="text-green-600 font-semibold">100% free</span> with no limitations. 
              Edit, convert, compress, and manage your PDFs easily with our intuitive web-based tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 btn-animation">
                  Get Started Now
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" className="bg-white border-blue-200 text-blue-700 hover:text-blue-800 hover:bg-blue-50 px-8 py-3 rounded-lg text-lg shadow-sm hover:shadow transition-all duration-300 hover-card-lift">
                  Explore Features
                </Button>
              </a>
            </div>
            
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium animate-pulse-slow">
              <svg className="h-4 w-4 mr-1.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Free Forever - No Ads - No Registration Required</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">All the PDF Tools You Need</h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-500">
              Our comprehensive suite of PDF tools helps you work with documents quickly and efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm border border-blue-200 hover:shadow-md transition-all duration-300 hover-card-lift">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-blue-500 text-white mr-4">
                  <FilePlus2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Merge PDFs</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Combine multiple PDF files into a single document - perfect for creating reports, portfolios, or ebooks from separate files in seconds.
              </p>
              <Link href="/merge">
                <a className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                  Try Now
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </Link>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-sm border border-purple-200 hover:shadow-md transition-all duration-300 hover-card-lift">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-purple-500 text-white mr-4">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Split PDF</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Separate PDF pages into individual files or extract specific pages - ideal for sharing specific sections from large documents or presentations.
              </p>
              <Link href="/split">
                <a className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium">
                  Try Now
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </Link>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-sm border border-green-200 hover:shadow-md transition-all duration-300 hover-card-lift">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-green-500 text-white mr-4">
                  <FileOutput className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Compress PDF</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Reduce file size while maintaining quality - optimize PDFs for email sharing or website uploads without sacrificing readability.
              </p>
              <Link href="/compress">
                <a className="inline-flex items-center text-green-600 hover:text-green-800 font-medium">
                  Try Now
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </Link>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 shadow-sm border border-amber-200 hover:shadow-md transition-all duration-300 hover-card-lift">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-amber-500 text-white mr-4">
                  <FileSearch className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Convert PDF</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Transform PDFs to Word, Excel, HTML, JPG and vice versa - seamlessly switch between formats to edit content or extract information.
              </p>
              <Link href="/convert">
                <a className="inline-flex items-center text-amber-600 hover:text-amber-800 font-medium">
                  Try Now
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </Link>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 shadow-sm border border-indigo-200 hover:shadow-md transition-all duration-300 hover-card-lift">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-indigo-500 text-white mr-4">
                  <Edit className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Edit PDF</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Modify text, add images, and annotate PDFs - make quick corrections, highlight important information, or add custom comments to any document.
              </p>
              <Link href="/edit">
                <a className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
                  Try Now
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </Link>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 shadow-sm border border-red-200 hover:shadow-md transition-all duration-300 hover-card-lift">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-red-500 text-white mr-4">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Secure PDF</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Encrypt, unlock, add passwords and digital signatures - protect sensitive documents or remove security from PDFs when needed.
              </p>
              <Link href="/secure">
                <a className="inline-flex items-center text-red-600 hover:text-red-800 font-medium">
                  Try Now
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-tr from-indigo-50 via-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Why Choose PDFCore Tools?</h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-500">
              Our commitment to providing high-quality, free PDF tools sets us apart.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center hover-card-lift">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-6">
                <Download className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% Free</h3>
              <p className="text-gray-600">
                All tools are completely free to use with no hidden fees, subscriptions, or usage limitations.
              </p>
            </div>
            
            {/* Benefit 2 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center hover-card-lift">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-purple-100 mb-6">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No Registration</h3>
              <p className="text-gray-600">
                Start using our tools instantly without creating an account or providing any personal information.
              </p>
            </div>
            
            {/* Benefit 3 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center hover-card-lift">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-6">
                <Globe className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Privacy Focused</h3>
              <p className="text-gray-600">
                Your files are processed locally in your browser and never uploaded to any server, ensuring complete privacy.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your PDFs?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust PDFCore Tools for all their PDF needs.
          </p>
          <Link href="/dashboard">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 btn-animation">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;