import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowUp,
  Bot,
  BrainCircuit,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  MessageCircle,
  Sparkles,
  X,
} from 'lucide-react';
import { aiService } from '@/services/index.js';
import { useAuthStore } from '@/store/auth-store.js';

const clampRole = (role) => (['admin', 'customer'].includes(role) ? role : 'guest');

const getRouteLabel = (path) => {
  if (path.startsWith('/admin')) return 'admin workflow';
  if (path.startsWith('/dashboard')) return 'customer workspace';
  if (path.startsWith('/gpus')) return 'GPU marketplace';
  if (path.startsWith('/enquiry')) return 'GPU enquiry';
  if (path.startsWith('/blog')) return 'blog';
  return 'site';
};

const getStarterPrompts = ({ path, role }) => {
  if (role === 'admin' && path.startsWith('/admin/enquiries')) {
    return ['How should I evaluate this lead?', 'Draft a customer reply', 'What details are missing?'];
  }

  if (role === 'admin' && path.startsWith('/admin/blog')) {
    return ['Improve blog SEO', 'Suggest metadata checks', 'What should I review before publish?'];
  }

  if (role === 'admin') {
    return ['Guide admin workflow', 'Improve package copy', 'Review enquiry process'];
  }

  if (role === 'customer') {
    return ['Where is my GPU access?', 'What details should I provide?', 'Explain workspace setup'];
  }

  if (path.startsWith('/gpus')) {
    return ['Help me choose a GPU', 'Explain pricing fit', 'Prepare enquiry text'];
  }

  if (path.startsWith('/enquiry')) {
    return ['Improve my enquiry', 'What details are missing?', 'Explain approval flow'];
  }

  return ['Find the right GPU', 'How rentals work', 'Contact the team'];
};

const createWelcomeMessage = ({ path, role }) => ({
  id: 'welcome',
  role: 'assistant',
  content:
    role === 'admin'
      ? 'I can help with enquiries, GPU package copy, blog SEO, and admin workflow decisions.'
      : `I can help you move through the ${getRouteLabel(path)}, choose GPU capacity, and prepare a clear request.`,
  actions: [],
});

export function UniversalAiAssistant() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const role = clampRole(user?.role);
  const path = location.pathname;
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => [createWelcomeMessage({ path, role })]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState('');
  const inputRef = useRef(null);
  const threadRef = useRef(null);
  const starterPrompts = useMemo(() => getStarterPrompts({ path, role }), [path, role]);

  useEffect(() => {
    const thread = threadRef.current;
    if (!thread) return;

    thread.scrollTo({
      top: thread.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isLoading]);

  const openAssistant = () => {
    setIsOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 80);
  };

  const sendMessage = async (presetMessage) => {
    const message = String(presetMessage || input).trim();
    if (!message || isLoading) return;

    setInput('');
    setError('');
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      actions: [],
    };
    setMessages((current) => [...current, userMessage]);
    setIsLoading(true);

    try {
      const response = await aiService.siteAssistant({
        message,
        history: messages
          .filter((item) => item.role === 'user' || item.role === 'assistant')
          .slice(-6)
          .map((item) => ({
            role: item.role,
            content: item.content,
          })),
        context: {
          path,
          role,
          pageTitle: document.title,
        },
      });

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.answer,
          actions: response.actions || [],
        },
      ]);
    } catch (requestError) {
      setError(requestError.message || 'Assistant is unavailable right now.');
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: 'assistant',
          content:
            'I could not reach the assistant service. You can still use the GPU marketplace or enquiry page directly.',
          actions: [
            { label: 'GPU Marketplace', href: '/gpus' },
            { label: 'Request GPU', href: '/enquiry' },
          ],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const copyMessage = async (message) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedMessageId(message.id);
      window.setTimeout(() => setCopiedMessageId(''), 1600);
    } catch {
      setError('Could not copy this reply.');
    }
  };

  return (
    <div className={`universal-ai ${isOpen ? 'universal-ai-open' : ''}`}>
      {isOpen && (
        <section className="universal-ai-panel" aria-label="Universal AI assistant">
          <header className="universal-ai-header">
            <div className="universal-ai-title">
              <span className="universal-ai-avatar" aria-hidden="true">
                <BrainCircuit className="h-5 w-5" />
              </span>
              <div>
                <p>iTernity AI</p>
                <span>{getRouteLabel(path)}</span>
              </div>
            </div>
            <button
              type="button"
              className="universal-ai-icon-button"
              aria-label="Close assistant"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="universal-ai-prompts" aria-label="Suggested prompts">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                disabled={isLoading}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>

          <div ref={threadRef} className="universal-ai-thread" aria-live="polite">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`universal-ai-message universal-ai-message-${message.role}`}
              >
                {message.role === 'assistant' && (
                  <Bot className="universal-ai-message-icon h-4 w-4" aria-hidden="true" />
                )}
                <div className="universal-ai-bubble">
                  {message.role === 'assistant' && message.id !== 'welcome' && (
                    <button
                      type="button"
                      className="universal-ai-copy"
                      aria-label="Copy assistant reply"
                      onClick={() => copyMessage(message)}
                    >
                      {copiedMessageId === message.id ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                  <p>{message.content}</p>
                  {message.actions?.length > 0 && (
                    <div className="universal-ai-actions">
                      {message.actions.map((action) => (
                        <Link key={`${message.id}-${action.href}`} to={action.href}>
                          <span>{action.label}</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
            {isLoading && (
              <div className="universal-ai-loading">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Thinking through the workflow...</span>
              </div>
            )}
          </div>

          <form className="universal-ai-input-row" onSubmit={handleSubmit}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about GPU choice, enquiry flow, admin tasks..."
              rows={2}
              maxLength={2000}
            />
            <button type="submit" aria-label="Send message" disabled={!input.trim() || isLoading}>
              <ArrowUp className="h-4 w-4" />
            </button>
          </form>
          {error && <p className="universal-ai-error">{error}</p>}
        </section>
      )}

      <button
        type="button"
        className="universal-ai-trigger"
        aria-label={isOpen ? 'AI assistant is open' : 'Open AI assistant'}
        aria-expanded={isOpen}
        onClick={isOpen ? () => setIsOpen(false) : openAssistant}
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>
    </div>
  );
}
