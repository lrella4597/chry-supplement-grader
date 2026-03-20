"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_GOALS = [
  "Better sleep",
  "More energy",
  "Reduce stress",
  "Improve focus",
  "Muscle recovery",
  "Joint health",
  "General wellness",
  "Gut health",
];

export default function RecommendPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(content: string) {
    if (!content.trim()) return;

    const userMessage: Message = { role: "user", content: content.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setStarted(true);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get response");
      setMessages([...updatedMessages, { role: "assistant", content: data.message }]);
    } catch {
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "Sorry, I had trouble processing that. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleQuickGoal(goal: string) {
    sendMessage(`I'm looking for help with: ${goal}`);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl sm:text-5xl mb-3">
          <span className="text-text">Find Your </span>
          <span className="text-dog">Match</span>
        </h1>
        <p className="text-text-muted max-w-lg mx-auto">
          Tell us your goals, preferences, and concerns. Our AI advisor will
          recommend the best supplements for you — backed by clinical research.
        </p>
      </div>

      {/* Quick start goals */}
      {!started && (
        <div className="mb-8 animate-fade-up">
          <p className="text-sm font-medium text-text-secondary text-center mb-4">
            What are you looking for?
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {QUICK_GOALS.map((goal) => (
              <button
                key={goal}
                onClick={() => handleQuickGoal(goal)}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-border text-text-secondary hover:border-dog/30 hover:text-dog transition-all"
              >
                {goal}
              </button>
            ))}
          </div>
          <div className="text-center mt-6">
            <p className="text-xs text-text-dim">
              Or type anything below — your goals, allergies, what you&apos;re
              currently taking, what you want to avoid.
            </p>
          </div>
        </div>
      )}

      {/* Chat messages */}
      <div className="space-y-4 mb-6 min-h-[200px]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-up`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3.5 ${
                msg.role === "user"
                  ? "bg-dog text-white rounded-br-md"
                  : "bg-white border border-border text-text rounded-bl-md"
              }`}
            >
              {msg.role === "assistant" ? (
                <div
                  className="text-sm leading-relaxed prose prose-sm max-w-none [&_p]:mb-2 [&_ul]:mb-2 [&_li]:mb-1 [&_strong]:text-text [&_h3]:font-display [&_h3]:text-lg [&_h3]:mt-3 [&_h3]:mb-1"
                  dangerouslySetInnerHTML={{
                    __html: formatMarkdown(msg.content),
                  }}
                />
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-fade-up">
            <div className="bg-white border border-border rounded-2xl rounded-bl-md px-5 py-4">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-text-dim animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-text-dim animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-text-dim animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="sticky bottom-4">
        <div className="flex gap-2 bg-white border border-border rounded-2xl p-2 shadow-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              started
                ? "Tell me more about what you need..."
                : "Describe your goals, concerns, allergies..."
            }
            className="flex-1 px-4 py-3 text-sm text-text bg-transparent focus:outline-none placeholder:text-text-dim"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-dog text-white font-semibold px-6 py-3 rounded-xl hover:bg-dog-bright transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        <p className="text-[10px] text-text-dim text-center mt-2">
          Not medical advice. Always consult your healthcare provider before
          starting supplements.
        </p>
      </form>
    </div>
  );
}

// Simple markdown to HTML converter for the chat
function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/^## (.*$)/gm, "<h3>$1</h3>")
    .replace(/^- (.*$)/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>")
    .replace(/^(.+)$/gm, (match) => {
      if (match.startsWith("<")) return match;
      return match;
    });
}
