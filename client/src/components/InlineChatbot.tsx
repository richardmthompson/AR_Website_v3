import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

export default function InlineChatbot() {
  const { t, i18n } = useTranslation();
  const [sessionId] = useState(() => generateSessionId());
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const greeting = i18n.language === 'de' 
      ? "Hi, ich bin Max. Welche Aufgabe würden Sie gerne automatisch, schnell und ohne Aufwand erledigen lassen?"
      : "Hi, I'm Max. What task would you love to have done automatically, quickly, and with no effort on your part?";
    
    setMessages([{ role: 'assistant', content: greeting }]);
  }, [i18n.language]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await apiRequest('POST', '/api/chat', { 
        sessionId, 
        message: userMessage,
        language: i18n.language 
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message.content 
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Please try again in a moment." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 lg:py-24 bg-gradient-to-br from-accent-cream/20 to-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card border border-card-border rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary/5 p-4 border-b border-card-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-foreground">{t('chatbot.header')}</div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4 max-h-96 overflow-y-auto" data-testid="chatbot-messages-container">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent text-accent-foreground'
                  }`}
                  data-testid={`message-${message.role}-${index}`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-accent text-accent-foreground p-4 rounded-lg flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('chatbot.thinking')}</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-card-border bg-background">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder={t('chatbot.placeholder')}
                className="flex-1 px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
                data-testid="input-inline-chatbot-message"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSend} 
                size="lg"
                className="px-6"
                data-testid="button-send-inline-message"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('chatbot.sending')}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {t('chatbot.send')}
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              {t('chatbot.securityNote')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
