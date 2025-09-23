
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 flex flex-col items-center justify-center font-sans">
      <header className="w-full flex flex-col items-center py-10">
        <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">Mahi-7b</h1>
        <p className="text-lg text-gray-300 mb-6">Inspired by OpenAI. Powered by Llama2-7b.</p>
        <div className="flex gap-6">
          <a
            href="/chat"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all text-lg"
          >
            Chat with Mahi-7b
          </a>
          <a
            href="https://huggingface.co/your-mahi-7b-model"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all text-lg"
          >
            Download Model
          </a>
        </div>
      </header>
      <main className="flex flex-col items-center w-full max-w-2xl px-4">
        <section className="bg-white/5 rounded-xl p-8 w-full mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Subscription Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
              <span className="text-xl font-bold text-white">Basic</span>
              <span className="text-gray-400">₹0</span>
              <span className="text-xs text-gray-500 mt-2">Summarize business reports</span>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
              <span className="text-xl font-bold text-white">Plus</span>
              <span className="text-gray-400">₹250</span>
              <span className="text-xs text-gray-500 mt-2">Word, PPT, Excel generation</span>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
              <span className="text-xl font-bold text-white">Pro</span>
              <span className="text-gray-400">₹750</span>
              <span className="text-xs text-gray-500 mt-2">Advanced summarization</span>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
              <span className="text-xl font-bold text-white">Enterprise</span>
              <span className="text-gray-400">Custom</span>
              <span className="text-xs text-gray-500 mt-2">Custom solutions</span>
            </div>
          </div>
        </section>
        <section className="bg-white/5 rounded-xl p-8 w-full shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">About Mahi-7b</h2>
          <p className="text-gray-300 text-base">
            Mahi-7b is designed to summarize business reports and instantly generate Word, PowerPoint, or Excel documents to help you work smarter and faster.
          </p>
        </section>
      </main>
      <footer className="mt-10 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} MahiLLM. Inspired by OpenAI.
      </footer>
    </div>
  );
}
