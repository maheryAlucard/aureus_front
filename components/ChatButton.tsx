import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendChatMessage, ChatMessage } from '../services/geminiService';
import { analytics } from '../utils/analytics';

const SUGGESTED_QUESTIONS = [
  'Quels sont vos tarifs ?',
  'Comment fonctionne votre processus ?',
  'Quelle division me convient le mieux ?',
  'Avez-vous des exemples de projets ?'
];

const CHAT_STORAGE_KEY = 'aureus_chat_history';
const CHAT_TIMESTAMP_KEY = 'aureus_chat_timestamp';

export const ChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Load chat history from localStorage
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Only restore if less than 24 hours old
        const timestamp = localStorage.getItem(CHAT_TIMESTAMP_KEY);
        if (timestamp && Date.now() - parseInt(timestamp) < 24 * 60 * 60 * 1000) {
          return parsed;
        }
      } catch (e) {
        console.error('Error loading chat history:', e);
      }
    }
    return [{
      role: 'assistant',
      content: 'Bonjour ! Je suis l\'assistant IA d\'Aureus. Comment puis-je vous aider aujourd\'hui ?'
    }];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasTriggeredProactive, setHasTriggeredProactive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const proactiveTriggerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
      localStorage.setItem(CHAT_TIMESTAMP_KEY, Date.now().toString());
    }
  }, [messages]);

  // Proactive chat trigger after 30 seconds
  useEffect(() => {
    if (!isOpen && !hasTriggeredProactive) {
      proactiveTriggerRef.current = setTimeout(() => {
        const hasInteracted = localStorage.getItem('aureus_chat_interacted');
        if (!hasInteracted) {
          // Show proactive message
          setHasTriggeredProactive(true);
          analytics.trackChatInteraction('proactive_trigger');
        }
      }, 30000); // 30 seconds
    }

    return () => {
      if (proactiveTriggerRef.current) {
        clearTimeout(proactiveTriggerRef.current);
      }
    };
  }, [isOpen, hasTriggeredProactive]);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isOpen && !hasTriggeredProactive) {
        setHasTriggeredProactive(true);
        analytics.trackChatInteraction('exit_intent_trigger');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [isOpen, hasTriggeredProactive]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
      localStorage.setItem('aureus_chat_interacted', 'true');
      analytics.trackChatInteraction('chat_opened', messages.length);
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: textToSend
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await sendChatMessage(userMessage.content, messages);
      setIsTyping(false);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response
      };
      setMessages(prev => [...prev, assistantMessage]);
      analytics.trackChatInteraction('message_sent', messages.length + 1);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Désolé, une erreur s\'est produite. Veuillez réessayer.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Proactive Notification */}
      {hasTriggeredProactive && !isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="right-6 bottom-24 z-40 fixed bg-[#0a0a16] shadow-2xl p-4 border border-blue-500/20 rounded-xl max-w-xs"
        >
          <div className="flex items-start space-x-3">
            <Sparkles className="mt-0.5 w-5 h-5 text-blue-400 shrink-0" />
            <div className="flex-1">
              <p className="mb-1 font-medium text-white text-sm">Besoin d'aide ?</p>
              <p className="mb-2 text-gray-400 text-xs">Posez-moi vos questions sur nos services !</p>
              <button
                onClick={() => setIsOpen(true)}
                className="font-medium text-blue-400 hover:text-blue-300 text-xs"
              >
                Ouvrir le chat →
              </button>
            </div>
            <button
              onClick={() => setHasTriggeredProactive(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="group right-6 bottom-6 z-50 fixed flex justify-center items-center bg-gradient-to-r from-cyan-500 hover:from-cyan-400 to-blue-600 hover:to-blue-500 shadow-2xl rounded-full w-14 h-14 text-white transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && (
          <span className="-top-1 -right-1 absolute bg-green-400 border-[#050510] border-2 rounded-full w-3 h-3 animate-pulse" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="right-6 bottom-24 z-50 fixed flex flex-col bg-[#0a0a16] shadow-2xl backdrop-blur-xl border border-white/10 rounded-2xl w-96 h-[600px] overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center bg-gradient-to-r from-cyan-500/10 to-blue-600/10 p-4 border-white/10 border-b">
              <div className="flex items-center space-x-3">
                <div className="flex justify-center items-center bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full w-10 h-10">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Assistant Aureus</h3>
                  <p className="text-gray-400 text-xs">En ligne</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 space-y-4 p-4 overflow-y-auto">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                        : 'bg-white/5 text-gray-200 border border-white/10'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/5 px-4 py-2 border border-white/10 rounded-2xl text-gray-200">
                    <div className="flex items-center space-x-1">
                      <span className="bg-gray-400 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="bg-gray-400 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="bg-gray-400 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              {isLoading && !isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/5 px-4 py-2 border border-white/10 rounded-2xl text-gray-200">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </motion.div>
              )}
              
              {/* Suggested Questions */}
              {messages.length === 1 && !isLoading && (
                <div className="space-y-2">
                  <p className="font-medium text-gray-400 text-xs">Questions suggérées :</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_QUESTIONS.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="bg-white/5 hover:bg-white/10 px-3 py-1.5 border border-white/10 rounded-lg text-gray-300 hover:text-white text-xs transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-[#050510]/50 p-4 border-white/10 border-t">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  disabled={isLoading}
                  className="flex-1 bg-white/5 disabled:opacity-50 px-4 py-3 border border-white/10 focus:border-cyan-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white transition-all placeholder-gray-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="flex justify-center items-center bg-gradient-to-r from-cyan-500 hover:from-cyan-400 to-blue-600 hover:to-blue-500 disabled:opacity-50 rounded-xl w-11 h-11 text-white transition-all disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-gray-500 text-xs text-center">
                Propulsé par Gemini AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

