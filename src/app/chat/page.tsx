import React from "react";

export default function ChatPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
      <h1 className="text-4xl font-bold text-white mb-4">Chat with Mahi-7b</h1>
      <p className="text-lg text-gray-300 mb-8">Summarize business reports and generate instant documents.</p>
      {/* Chat UI will be implemented here */}
      <div className="bg-white/10 rounded-xl p-8 w-full max-w-xl shadow-lg">
        <p className="text-gray-400">Chat functionality coming soon...</p>
      </div>
    </div>
  );
}
