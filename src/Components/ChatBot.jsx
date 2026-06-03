import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const ChatBot = ({ darkMode, user, expenses, addExpenseDirect, updateExpenseDirect, deleteExpenseDirect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! I'm FinVue AI. How can I help you manage your expenses today?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input.trim(), sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: userMessage.text,
                    user,
                    expenses
                })
            });
            
            const data = await res.json();
            
            if (res.ok) {
                let aiResponseText = data.response;
                
                // Parse for actions
                const actionRegex = /\[ACTION:\s*({.*?})\s*\]/s;
                const match = aiResponseText.match(actionRegex);
                
                if (match) {
                    try {
                        const actionData = JSON.parse(match[1]);
                        aiResponseText = aiResponseText.replace(actionRegex, '').trim();
                        
                        if (actionData.type === 'ADD_EXPENSE') {
                            await addExpenseDirect(actionData.payload);
                        } else if (actionData.type === 'UPDATE_EXPENSE') {
                            await updateExpenseDirect(actionData.payload);
                        } else if (actionData.type === 'DELETE_EXPENSE') {
                            await deleteExpenseDirect(actionData.payload.id);
                        }
                    } catch (e) {
                        console.error("Failed to parse action JSON", e);
                    }
                }
                
                if (!aiResponseText) {
                    aiResponseText = "Done! I've updated your expenses.";
                }

                setMessages(prev => [...prev, { id: Date.now() + 1, text: aiResponseText, sender: 'ai' }]);
            } else {
                toast.error(data.response || "Failed to get AI response");
                setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sorry, I encountered an error. Please try again.", sender: 'ai' }]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            toast.error("Failed to connect to AI");
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sorry, I couldn't reach the server. Please check your connection.", sender: 'ai' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button Container */}
            <div className="fixed sm:bottom-8 sm:right-8 bottom-[90px] right-4 z-50 flex items-center gap-3">
                
                {/* AI Helper Text Bubble */}
                {!isOpen && (
                    <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg border text-sm font-bold ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-indigo-400 shadow-black/40' : 'bg-white border-indigo-100 text-indigo-600 shadow-indigo-500/20'
                    }`}>
                        <span>Ask AI ✨</span>
                        {/* Right-pointing triangle */}
                        <div className={`absolute right-[72px] w-2 h-2 rotate-45 border-t border-r hidden sm:block ${
                            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-indigo-100'
                        }`} style={{ borderBottom: 'none', borderLeft: 'none', marginTop: '1px' }}></div>
                    </div>
                )}

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-3 sm:p-4 rounded-full shadow-2xl transition-colors flex items-center justify-center relative ${
                        isOpen 
                        ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/40' 
                        : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-purple-500/40'
                    }`}
                    aria-label="Toggle AI Chat"
                >
                    {isOpen ? (
                        <svg className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className={`fixed sm:bottom-28 sm:right-8 bottom-[160px] left-4 right-4 sm:left-auto z-50 sm:w-[400px] h-[450px] sm:h-[550px] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-fadeIn border ${
                    darkMode ? 'bg-slate-900 border-slate-700/80 shadow-black/50' : 'bg-white border-slate-200 shadow-slate-200/80'
                }`}>
                    {/* Header */}
                    <div className={`px-5 py-4 border-b flex items-center gap-3 ${darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-slate-800'}`}>FinVue AI</h3>
                            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Always here to help</p>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className={`flex-1 overflow-y-auto p-4 flex flex-col gap-4 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                                    msg.sender === 'user'
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-none shadow-md shadow-emerald-500/20'
                                    : darkMode
                                        ? 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                                        : 'bg-slate-100 text-slate-700 rounded-bl-none border border-slate-200'
                                }`}>
                                    <div className="whitespace-pre-wrap">{msg.text}</div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm rounded-bl-none border ${
                                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                                }`}>
                                    <div className="flex gap-1.5 items-center h-4">
                                        <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className={`p-4 border-t ${darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <form onSubmit={handleSend} className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about your expenses..."
                                className={`w-full pl-4 pr-12 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                                    darkMode 
                                    ? 'bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:bg-slate-800' 
                                    : 'bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white'
                                }`}
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className={`absolute right-2 p-1.5 rounded-lg transition-colors ${
                                    !input.trim() || isLoading
                                    ? (darkMode ? 'text-slate-600' : 'text-slate-400')
                                    : 'text-emerald-500 hover:bg-emerald-500/10'
                                }`}
                            >
                                <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot;
