'use client';

import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { AuthenticatedShell } from '@/components/authenticated-shell';
import { useAuth } from '@/components/auth-provider';
import { Button, Spinner } from '@/components/ui';
import { api } from '@/lib/api-client';
import {
    Send,
    Bot,
    User,
    ArrowLeft,
    Trash2,
    Phone,
    Sparkles,
    Heart,
    Shield,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type ChatMode = 'mother' | 'partner';

interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    mode: ChatMode;
    suggestedActions?: string[];
}

interface ChatbotResponse {
    message: string;
    isEmergency: boolean;
    escalationGuidance?: string;
    suggestedActions?: string[];
    sessionId: string;
}

interface SessionInfo {
    id: string;
    mode: string;
    startedAt: string;
    endedAt: string | null;
    messageCount: number;
}

interface HistoryMessage {
    id: string;
    sender: 'user' | 'bot' | 'system';
    text: string;
    timestamp: string;
}

// ─── Config ──────────────────────────────────────────────────────────────────

const MODE_CONFIG: Record<ChatMode, {
    labelKey: string;
    icon: React.ElementType;
    descKey: string;
    color: string;
    bg: string;
    badgeVariant: 'primary' | 'razzmatazz' | 'gold';
    placeholderKey: string;
}> = {
    mother: {
        labelKey: 'motherMode',
        icon: Heart,
        descKey: 'motherModeDesc',
        color: 'text-razzmatazz-600 dark:text-razzmatazz-400',
        bg: 'bg-razzmatazz-50 dark:bg-razzmatazz-900/30',
        badgeVariant: 'razzmatazz',
        placeholderKey: 'motherPlaceholder',
    },
    partner: {
        labelKey: 'partnerMode',
        icon: Shield,
        descKey: 'partnerModeDesc',
        color: 'text-gold-600 dark:text-gold-400',
        bg: 'bg-gold-50 dark:bg-gold-900/30',
        badgeVariant: 'gold',
        placeholderKey: 'partnerPlaceholder',
    },
};

const SUGGESTED_ACTIONS: Record<ChatMode, string[]> = {
    mother: [
        'What should I eat during my third trimester?',
        'Is back pain normal at 30 weeks?',
        'How can I improve my sleep?',
        'What exercises are safe now?',
    ],
    partner: [
        'How can I help with her back pain?',
        'What should I pack in the hospital bag?',
        'How to prepare for labor as a partner?',
        'Tips for supporting her emotionally',
    ],
};

// ─── Chat Page Content ──────────────────────────────────────────────────────

function ChatPageContent() {
    const t = useTranslations('chat');
    const { user, getDashboardUrl, isMother, isPartner } = useAuth();
    const [dashboardUrl, setDashboardUrl] = useState<string>('/mother');

    // Fetch dashboard URL
    useEffect(() => {
        if (user?.roles) {
            getDashboardUrl(user.roles).then(setDashboardUrl);
        }
    }, [user?.roles, getDashboardUrl]);

    // Auto-detect chat mode from user roles — mother gets mother mode, partner gets partner mode
    const mode: ChatMode = isMother ? 'mother' : 'partner';

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Load latest session history on mount
    const fetchLatestSession = useCallback(async () => {
        setLoadingHistory(true);
        try {
            const data = await api.get<{ sessions: SessionInfo[] }>(`/chat?mode=${mode}`);
            if (data.sessions && data.sessions.length > 0) {
                const latest = data.sessions[0];
                setSessionId(latest.id);
                const historyData = await api.get<{ sessionId: string; messages: HistoryMessage[] }>(`/chat?sessionId=${latest.id}`);
                const mapped: ChatMessage[] = (historyData.messages || []).map((m) => ({
                    id: m.id,
                    text: m.text,
                    sender: m.sender === 'user' ? 'user' : 'bot',
                    timestamp: new Date(m.timestamp),
                    mode,
                }));
                setMessages(mapped);
            } else {
                setSessionId(null);
                setMessages([]);
            }
        } catch (err) {
            console.error('Failed to fetch chat history:', err);
        } finally {
            setLoadingHistory(false);
        }
    }, [mode]);

    useEffect(() => {
        fetchLatestSession();
    }, [fetchLatestSession]);

    const handleSend = useCallback(async (text: string) => {
        if (!text.trim() || isTyping) return;
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            text: text.trim(),
            sender: 'user',
            timestamp: new Date(),
            mode,
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const data = await api.post<ChatbotResponse>('/chat', {
                message: text.trim(),
                sessionId: sessionId ?? undefined,
                mode,
            });
            setSessionId(data.sessionId);
            const botMsg: ChatMessage = {
                id: data.sessionId + '-' + Date.now(),
                text: data.message,
                sender: 'bot',
                timestamp: new Date(),
                mode,
                suggestedActions: data.suggestedActions,
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            console.error('Failed to send message:', err);
            const errMsg: ChatMessage = {
                id: Date.now().toString() + '-err',
                text: t('errorSendingMessage'),
                sender: 'bot',
                timestamp: new Date(),
                mode,
            };
            setMessages(prev => [...prev, errMsg]);
        } finally {
            setIsTyping(false);
        }
    }, [mode, sessionId, isTyping, t]);

    const handleActionClick = (action: string) => {
        handleSend(action);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(input);
        }
    };

    const handleClearChat = () => {
        setMessages([]);
        setSessionId(null);
        inputRef.current?.focus();
    };

    const modeConfig = MODE_CONFIG[mode];
    const ModeIcon = modeConfig.icon;

    return (
        <AuthenticatedShell>
            <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <div>
                        <Link
                            href={dashboardUrl}
                            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1 mb-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t('backToDashboard')}
                        </Link>
                        <h1 className="text-2xl lg:text-3xl font-display font-bold text-velvet-900 dark:text-surface-100 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-gold-500" />
                            {t('aiAssistant')}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {messages.length > 0 && (
                            <Button variant="outline" size="sm" onClick={handleClearChat} className="flex items-center gap-1">
                                <Trash2 className="w-4 h-4" />
                                {t('clear')}
                            </Button>
                        )}
                        {/* Mode badge — read-only, auto-detected from user role */}
                        <div className={`
                            flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border
                            ${modeConfig.bg} ${modeConfig.color} border-current/20
                        `}>
                            <ModeIcon className="w-4 h-4" />
                            {t(modeConfig.labelKey as any)}
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-white dark:bg-velvet-900 rounded-2xl border border-surface-200 dark:border-velvet-700 shadow-soft flex flex-col overflow-hidden">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                        {loadingHistory ? (
                            <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                <Spinner className="w-8 h-8 text-primary-500" />
                                <p className="text-surface-500 dark:text-surface-400 mt-3 text-sm">{t('loading')}</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center mb-4">
                                    <Bot className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                                </div>
                                <h2 className="text-xl font-display font-bold text-velvet-900 dark:text-surface-100 mb-2">
                                    {t('howCanIHelp')}
                                </h2>
                                <p className="text-surface-500 dark:text-surface-400 mb-6 max-w-md">
                                    {t('welcomeDescription')}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                                    {SUGGESTED_ACTIONS[mode].map((action, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleActionClick(action)}
                                            className="text-left px-4 py-3 rounded-xl border border-surface-200 dark:border-velvet-700 text-sm text-velvet-700 dark:text-surface-300 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
                                        >
                                            {action}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <MessageBubble
                                    key={msg.id}
                                    message={msg}
                                    onActionClick={handleActionClick}
                                    t={t}
                                />
                            ))
                        )}
                        {isTyping && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Emergency Callout */}
                    <div className="px-4 py-2 bg-danger-50 dark:bg-danger-900/20 border-t border-danger-100 dark:border-danger-800 flex items-center justify-center gap-2">
                        <Phone className="w-4 h-4 text-danger-600" />
                        <span className="text-xs text-danger-600 dark:text-danger-400 font-medium">
                            {t('emergencyDisclaimer')}
                        </span>
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-surface-200 dark:border-velvet-700">
                        <div className="flex items-center gap-3">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={t(modeConfig.placeholderKey as any)}
                                className="flex-1 px-4 py-3 rounded-xl border border-surface-200 dark:border-velvet-700 bg-surface-50 dark:bg-velvet-800 text-velvet-900 dark:text-surface-100 placeholder:text-surface-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                            />
                            <button
                                onClick={() => handleSend(input)}
                                disabled={!input.trim()}
                                className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-glow"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedShell>
    );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export default function ChatPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Spinner className="w-8 h-8" />
            </div>
        }>
            <ChatPageContent />
        </Suspense>
    );
}

// ─── Message Bubble ─────────────────────────────────────────────────────────

function MessageBubble({
    message,
    onActionClick,
    t,
}: {
    message: ChatMessage;
    onActionClick: (action: string) => void;
    t: ReturnType<typeof import('next-intl').useTranslations<string>>;
}) {
    const isUser = message.sender === 'user';
    const modeConfig = MODE_CONFIG[message.mode];
    const ModeIcon = modeConfig.icon;

    const renderText = (text: string) => {
        return text.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="text-velvet-900 dark:text-surface-100">{part.slice(2, -2)}</strong>;
            }
            return part.split('\n').map((line, j, arr) => (
                <React.Fragment key={`${i}-${j}`}>
                    {line}
                    {j < arr.length - 1 && <br />}
                </React.Fragment>
            ));
        });
    };

    return (
        <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`
        w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold
        ${isUser
                    ? 'bg-razzmatazz-100 dark:bg-razzmatazz-800 text-razzmatazz-600'
                    : `${modeConfig.bg} ${modeConfig.color}`
                }
      `}>
                {isUser ? <User className="w-4 h-4" /> : <ModeIcon className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`
          px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isUser
                        ? 'bg-razzmatazz-500 text-white rounded-tr-md'
                        : 'bg-surface-100 dark:bg-velvet-800 text-velvet-800 dark:text-surface-200 rounded-tl-md'
                    }
        `}>
                    {renderText(message.text)}
                </div>

                {/* Suggested Actions */}
                {!isUser && message.suggestedActions && message.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {message.suggestedActions.map((action) => (
                            <button
                                key={action}
                                onClick={() => onActionClick(action)}
                                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-velvet-800 border border-surface-200 dark:border-velvet-700 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-300 dark:hover:border-primary-700 transition-all"
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                )}

                {/* Timestamp */}
                <p className={`text-xs text-surface-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
                    {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>
    );
}

// ─── Typing Indicator ───────────────────────────────────────────────────────

function TypingIndicator() {
    return (
        <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-600" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-surface-100 dark:bg-velvet-800">
                <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    );
}