export default function Home() {
  return (
    <main className="flex min-h-screen bg-zinc-950 text-white">
      <div className="flex flex-col w-full max-w-4xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">🎮 Studio Assistant</h1>
          <p className="text-zinc-400 mt-2">
            AI-powered internal assistant for narrative & design teams
          </p>
        </header>

        <div className="flex-1 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-500 text-sm">Chat interface coming next...</p>
        </div>
      </div>
    </main>
  );
}
