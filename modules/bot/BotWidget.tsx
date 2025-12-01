import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot as BotIcon, Loader2, Search, User, Phone, Mail, AlertCircle, Menu, ArrowLeft, UserPlus } from 'lucide-react';
import { sendMessageToBot } from '../../services/geminiService';
import { ChatMessage, ClientStatus } from '../../types';
import { Card, Button, Badge } from '../../components/UI';
import { useStore } from '../../store';

// --- Widget Component (For Client Websites) ---
export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setConversations, conversations, botConfig } = useStore();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'model', text: botConfig.welcomeMessage, timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update welcome message if config changes (only if chat hasn't started)
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'init') {
        setMessages([{ 
            id: 'init', 
            role: 'model', 
            text: botConfig.welcomeMessage, 
            timestamp: Date.now() 
        }]);
    }
  }, [botConfig.welcomeMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate adding this conversation to the Dashboard if it's a new interaction
      if (messages.length === 1) {
          const newConv = {
              id: Date.now(),
              name: 'Visitor #' + Math.floor(Math.random() * 1000),
              msg: userMsg.text,
              time: 'Just now',
              unread: true,
              status: 'New Lead',
              email: 'N/A',
              phone: 'N/A'
          };
          setConversations([newConv, ...conversations]);
      }

      const responseStream = await sendMessageToBot(userMsg.text);
      
      let botText = '';
      const botMsgId = (Date.now() + 1).toString();
      
      // Initial bot message placeholder
      setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '', timestamp: Date.now() }]);

      for await (const chunk of responseStream) {
        const chunkText = chunk.text;
        if (chunkText) {
          botText += chunkText;
          
          // Update the last message with accumulated text
          setMessages(prev => prev.map(msg => 
            msg.id === botMsgId ? { ...msg, text: botText } : msg
          ));
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: 'err', role: 'model', text: 'Sorry, I encountered an error.', timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[320px] sm:w-[350px] h-[500px] bg-white dark:bg-card-dark rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-border-dark animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div 
            className="p-4 flex items-center justify-between text-white transition-colors"
            style={{ backgroundColor: botConfig.botColor || '#00AEEF' }}
          >
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <BotIcon size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{botConfig.botName}</h3>
                <p className="text-xs text-white/80">Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-[#1a1a1a]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-900 dark:text-purple-100 rounded-tr-none shadow-sm' 
                    : 'bg-green-100 dark:bg-green-900/50 text-green-900 dark:text-green-100 border border-green-200 dark:border-green-900 rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 p-3 rounded-2xl rounded-tl-none shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-green-600 dark:text-green-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white dark:bg-card-dark border-t border-gray-100 dark:border-border-dark flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-gray-100 dark:bg-[#333] border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: botConfig.botColor || '#00AEEF' }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 text-white rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-105"
        style={{ backgroundColor: botConfig.botColor || '#00AEEF' }}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

// --- Bot Dashboard Page (For Business Owner) ---
export const BotDashboard: React.FC = () => {
  const [isMobileListOpen, setIsMobileListOpen] = useState(true); 
  const [selectedId, setSelectedId] = useState<number | string>(101);
  
  // Use global store for conversations and clients
  const { conversations, addClient, clients, updateConversationStatus } = useStore();

  const activeConversation = conversations.find(c => c.id === selectedId) || conversations[0];

  const handleAddToCRM = () => {
    if (!activeConversation) return;

    // Check for duplicate email in CRM (if email exists)
    if (activeConversation.email !== 'N/A') {
        const exists = clients.some(c => 
            c.email.toLowerCase() === activeConversation.email.toLowerCase()
        );

        if (exists) {
            alert('This lead is already in your CRM!');
            return;
        }
    }

    // Generate placeholder email for visitors if needed
    const clientEmail = activeConversation.email !== 'N/A' 
        ? activeConversation.email 
        : `lead-${activeConversation.id}@inquiry.com`;

    addClient({
        id: Date.now().toString(),
        name: activeConversation.name,
        email: clientEmail,
        phone: activeConversation.phone !== 'N/A' ? activeConversation.phone : '',
        status: ClientStatus.LEAD,
        source: 'Bot',
        createdAt: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${activeConversation.name}&background=random`,
        description: `Imported from Bot. Last message: ${activeConversation.msg}`
    });
    
    updateConversationStatus(activeConversation.id, 'Contacted');
    alert(`${activeConversation.name} added to CRM successfully!`);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] md:h-[calc(100vh-120px)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary-light dark:text-txt-primary-dark">Inbox & Leads</h1>
          <p className="text-txt-secondary-light dark:text-txt-secondary-dark hidden md:block">Manage AI conversations and potential clients.</p>
        </div>
        <div className="lg:hidden flex gap-2">
             <Button size="sm" variant={isMobileListOpen ? 'primary' : 'secondary'} onClick={() => setIsMobileListOpen(true)}>List</Button>
             <Button size="sm" variant={!isMobileListOpen ? 'primary' : 'secondary'} onClick={() => setIsMobileListOpen(false)}>Chat</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 relative">
        {/* Conversation List */}
        <Card className={`flex flex-col h-full border-r-0 lg:border-r rounded-r-none lg:rounded-r-xl lg:flex ${isMobileListOpen ? 'flex' : 'hidden'} absolute inset-0 lg:static z-10`}>
          <div className="p-4 border-b border-border-light dark:border-border-dark">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-secondary-light dark:text-txt-secondary-dark w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search leads..." 
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg text-sm text-txt-primary-light dark:text-txt-primary-dark outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((c) => (
              <div 
                key={c.id} 
                onClick={() => {
                    setSelectedId(c.id);
                    setIsMobileListOpen(false);
                }}
                className={`p-4 border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-all ${
                    selectedId === c.id 
                    ? 'border-l-4 border-l-primary-500 pl-3 bg-transparent' 
                    : 'border-l-4 border-l-transparent pl-4'
                }`}
              >
                <div className="flex justify-between mb-1">
                  <span className={`font-medium text-sm ${
                    c.unread 
                    ? 'text-gray-900 dark:text-white font-bold' 
                    : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {c.name}
                  </span>
                  <span className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">{c.time}</span>
                </div>
                <p className={`text-xs truncate mb-2 ${
                  c.unread 
                  ? 'text-gray-900 dark:text-gray-100 font-medium' 
                  : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {c.msg}
                </p>
                <div className="flex justify-between items-center">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        c.status === 'New Lead' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-200' : 
                        c.status === 'Booked' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                        {c.status}
                    </span>
                    {c.unread && <span className="w-2 h-2 rounded-full bg-primary-500"></span>}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Chat Details */}
        <Card className={`lg:col-span-2 flex-col h-full rounded-l-none lg:rounded-l-xl border-l-0 ${!isMobileListOpen ? 'flex' : 'hidden lg:flex'}`}>
           {activeConversation ? (
               <>
                <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-white dark:bg-card-dark">
                    <div className="flex items-center gap-3">
                    <button 
                        className="lg:hidden p-2 -ml-2 text-txt-secondary-light dark:text-txt-secondary-dark hover:bg-gray-100 dark:hover:bg-white/5 rounded-full" 
                        onClick={() => setIsMobileListOpen(true)}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold">
                        {activeConversation.name[0]}
                    </div>
                    <div>
                        <h3 className="font-bold text-txt-primary-light dark:text-txt-primary-dark">{activeConversation.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                        <span className="flex items-center gap-1"><Mail size={10} /> {activeConversation.email}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1"><Phone size={10} /> {activeConversation.phone}</span>
                        </div>
                    </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" size="sm" onClick={handleAddToCRM} className="flex items-center gap-2">
                            <UserPlus size={14} /> <span className="hidden sm:inline">Add to CRM</span>
                        </Button>
                        <Button size="sm">Take Over</Button>
                    </div>
                </div>
                
                <div className="flex-1 p-4 sm:p-6 bg-gray-50 dark:bg-[#1a1a1a] overflow-y-auto space-y-4">
                    <div className="flex justify-center mb-4">
                        <span className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded-full">Today</span>
                    </div>
                    
                    <div className="flex justify-start">
                    <div className="bg-purple-100 dark:bg-purple-900/50 text-purple-900 dark:text-purple-100 p-3 rounded-2xl rounded-tl-none max-w-[85%] sm:max-w-md text-sm shadow-sm">
                        {activeConversation.msg}
                    </div>
                    </div>
                    
                    <div className="flex justify-end">
                    <div className="bg-green-100 dark:bg-green-900/50 text-green-900 dark:text-green-100 p-3 rounded-2xl rounded-tr-none max-w-[85%] sm:max-w-md text-sm shadow-sm flex items-start gap-2">
                        <BotIcon size={14} className="mt-1 shrink-0 opacity-50" />
                        <div>
                            Hi {activeConversation.name.split(' ')[0]}! Thanks for reaching out. Our packages start at $80.
                        </div>
                    </div>
                    </div>
                </div>
                
                <div className="p-4 bg-white dark:bg-card-dark border-t border-border-light dark:border-border-dark">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#333] rounded-full px-4 py-2">
                        <input 
                            type="text" 
                            placeholder="Type a reply..." 
                            className="flex-1 bg-transparent outline-none text-sm text-txt-primary-light dark:text-txt-primary-dark placeholder-gray-500"
                        />
                        <button className="p-1.5 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors">
                            <Send size={16} />
                        </button>
                    </div>
                </div>
               </>
           ) : (
               <div className="flex-1 flex items-center justify-center text-txt-secondary-light dark:text-txt-secondary-dark">
                   Select a conversation to view details
               </div>
           )}
        </Card>
      </div>
    </div>
  );
};