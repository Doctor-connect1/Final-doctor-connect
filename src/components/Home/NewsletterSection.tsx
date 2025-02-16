'use client';
import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email');
      return;
    }

    try {
      setStatus('loading');
      
      // Replace this with your actual API endpoint
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      setStatus('success');
      setMessage('Thank you for subscribing!');
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);

    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#101828] mb-8">
            Subscribe to our newsletter
          </h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <div className="flex-1">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-full border ${
                  status === 'error' 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-[#D0D5DD] focus:ring-teal-600'
                } focus:outline-none focus:ring-2 focus:border-transparent bg-white transition-colors`}
                disabled={status === 'loading'}
                required
              />
              {message && (
                <p className={`mt-2 text-sm ${
                  status === 'error' ? 'text-red-600' : 'text-teal-600'
                }`}>
                  {message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className={`px-8 py-3 rounded-full whitespace-nowrap transition-all duration-200 ${
                status === 'loading'
                  ? 'bg-teal-400 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700'
              } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
            >
              {status === 'loading' ? (
                <div className="flex items-center justify-center">
                  <svg 
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Subscribing...
                </div>
              ) : (
                'Subscribe'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
} 