"use client";

import Link from 'next/link'

export default function VideoWelcome() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome to Video Chat</h1>
        <Link 
          href="/video-chat"
          className="block w-full bg-blue-500 text-white text-center py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Start Video Chat
        </Link>
      </div>
    </div>
  );
}