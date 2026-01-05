import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minus, Loader2 } from 'lucide-react';
import axios from 'axios';

const ChatBox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Bonjour ! Comment puis-je vous aider aujourd'hui ?", sender: 'ai' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setIsMinimized(false);
    };

    const toggleMinimize = (e) => {
        e.stopPropagation();
        setIsMinimized(!isMinimized);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputText,
            sender: 'user',
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            // Format history for the backend (excluding the welcome message and limiting context)
            const history = messages
                .filter(msg => msg.id !== 1)
                .slice(-5); // Keep last 5 messages for context

            // Use relative URL - Vite proxy should handle /api -> http://localhost:5000/api
            // Adjust if you are not using proxy or have different port
            const response = await axios.post('http://localhost:5000/api/chat', {
                message: userMessage.text,
                history: history
            });

            const aiMessage = {
                id: Date.now() + 1,
                text: response.data.response,
                sender: 'ai',
            };
            setMessages((prev) => [...prev, aiMessage]);

        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = {
                id: Date.now() + 1,
                text: "Désolé, je rencontre des difficultés pour répondre pour le moment. Veuillez réessayer plus tard.",
                sender: 'ai',
                isError: true,
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={toggleChat}
                className="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all z-50 animate-bounce-subtle"
                aria-label="Ouvrir le chat"
            >
                <MessageCircle size={28} />
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 transition-all duration-300 border border-gray-200 dark:border-gray-700 ${isMinimized ? 'h-14' : 'h-[500px]'}`}>

            {/* Header */}
            <div
                className="bg-indigo-600 p-4 text-white flex justify-between items-center cursor-pointer"
                onClick={() => !isMinimized && setIsMinimized(true)}
            >
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <MessageCircle size={18} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">Assistant KolieShop</h3>
                        <span className="text-xs text-indigo-100 flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                            En ligne
                        </span>
                    </div>
                </div>
                <div className="flex items-center space-x-1">
                    <button
                        onClick={toggleMinimize}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <Minus size={18} />
                    </button>
                    <button
                        onClick={toggleChat}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            {!isMinimized && (
                <>
                    <div className="p-4 h-[380px] overflow-y-auto bg-gray-50 dark:bg-gray-900 scrollbar-thin">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.sender === 'ai' && (
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-2 self-end mb-1">
                                        <MessageCircle size={14} className="text-indigo-600 dark:text-indigo-300" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                            ? 'bg-indigo-600 text-white rounded-br-none'
                                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none shadow-sm'
                                        } ${msg.isError ? 'text-red-500' : ''}`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start mb-4">
                                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-2 self-end mb-1">
                                    <MessageCircle size={14} className="text-indigo-600 dark:text-indigo-300" />
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-none border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 absolute bottom-0 w-full">
                        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Posez une question..."
                                className="flex-1 p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !inputText.trim()}
                                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatBox;
