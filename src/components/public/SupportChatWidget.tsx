import React, { useState } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  PhoneCall, 
  Mail, 
  ShieldCheck, 
  Bot, 
  User, 
  ChevronDown, 
  HelpCircle,
  Clock
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  actions?: { label: string; action: () => void }[];
}

export const SupportChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: 'Namaste! Welcome to TruckSetu 24x7 Logistics Support. How can we assist with your truck booking or active consignment today?',
      time: 'Just now'
    }
  ]);

  const quickPrompts = [
    'How do tolls work on my booking?',
    'What is the cancellation policy?',
    'How do I add a loading helper?',
    'Where do I find my GST invoice?'
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMsg('');

    // Generate smart context-aware automated response
    setTimeout(() => {
      let replyText = 'Thank you for reaching out! A logistics duty officer is available at toll-free 1800 209 8899.';
      const lower = text.toLowerCase();

      if (lower.includes('toll')) {
        replyText = 'Tolls and state entry taxes are NEVER hidden or bundled into your initial base estimate. Fastag toll charges are paid at actual plaza rates or settled with your pilot based on toll receipts.';
      } else if (lower.includes('cancel')) {
        replyText = 'Cancellation is 100% FREE within 5 minutes of driver assignment. After 5 minutes, if the driver has already mobilized toward pickup, a nominal fee of ₹100 applies to compensate the driver.';
      } else if (lower.includes('helper') || lower.includes('labor')) {
        replyText = 'You can add "Driver Helper Needed" during checkout for a flat ₹350 fee. The driver will assist with ground-floor loading and unloading of household or commercial crates.';
      } else if (lower.includes('gst') || lower.includes('invoice')) {
        replyText = 'All TruckSetu trips provide SAC 996511 GST Tax Invoices. You can preview and download your official invoice directly from the Live Consignment Tracking screen or Admin portal.';
      } else if (lower.includes('track') || lower.includes('where is')) {
        replyText = 'You can track your vehicle live on the "Track Trip" page in the navigation bar. Check driver contact, ETA, and your 4-digit pickup verification OTP there.';
      }

      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botReply]);
    }, 700);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating launcher trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-950 hover:bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-800 transition hover:scale-105 group"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-amber-400 group-hover:rotate-6 transition" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-pulse"></span>
          </div>
          <span className="text-xs font-bold font-display pr-1 hidden sm:inline">24x7 Help Desk</span>
        </button>
      )}

      {/* Chat Widget Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 sm:w-96 overflow-hidden flex flex-col max-h-[520px] animate-in fade-in slide-in-from-bottom-6">
          {/* Header */}
          <div className="bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                TS
              </div>
              <div>
                <h4 className="text-xs font-bold font-display text-white">TruckSetu Support Desk</h4>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Online • Avg reply: 1 min</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Contact Bar */}
          <div className="bg-slate-900 px-4 py-2 text-[11px] text-slate-300 flex items-center justify-between border-b border-slate-800">
            <a 
              href="tel:18002098899" 
              className="flex items-center gap-1 text-amber-400 hover:underline font-bold"
            >
              <PhoneCall className="w-3 h-3" /> 1800 209 8899
            </a>
            <span className="text-slate-500">|</span>
            <a 
              href="mailto:support@trucksetu.com" 
              className="flex items-center gap-1 text-slate-300 hover:text-white"
            >
              <Mail className="w-3 h-3 text-amber-400" /> support@trucksetu.com
            </a>
          </div>

          {/* Message History */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-tl-none'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                  <span className="text-[9px] opacity-60 block text-right mt-1">{m.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick FAQ Suggestion Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(prompt)}
                className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 rounded-lg whitespace-nowrap transition border border-slate-200"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask about fares, OTP, tolls, or tracking..."
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="p-2 bg-slate-950 hover:bg-slate-900 text-amber-400 rounded-xl transition shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
