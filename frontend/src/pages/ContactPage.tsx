import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Send, Sparkles, Loader2, CheckCircle, Clock, Mail, ArrowRight } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

export default function ContactPage() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              {t('contact.pageTitle')}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {t('contact.pageSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Chatbot Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Left: Contact Form (2 columns) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Chatbot temporarily disabled */}
              {/* <ContactChatbot /> */}
              <FallbackContactOptions />
            </div>

            {/* Right: What to Expect (1 column, sticky) */}
            <div className="lg:sticky lg:top-24">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    {t('contact.whatToExpectTitle')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {(t('contact.discussionTopics', { returnObjects: true }) as string[]).map((topic, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{t('contact.responseTime')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Contact-specific chatbot component with inactivity detection and state tracking
function ContactChatbot() {
  const { t, i18n } = useTranslation();
  const [sessionId] = useState(() => generateSessionId());
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // State tracking from backend
  const [isQualified, setIsQualified] = useState(false);
  const [emailsSent, setEmailsSent] = useState(false);
  const [conversationActive, setConversationActive] = useState(true);
  const [conversationClosed, setConversationClosed] = useState(false);

  // Inactivity tracking (10 minutes - research-validated industry standard)
  const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes
  const [lastMessageTime, setLastMessageTime] = useState(Date.now());

  // Initial greeting (contact-specific)
  useEffect(() => {
    setMessages([{ role: 'assistant', content: t('contact.greeting') }]);
  }, [i18n.language, t]);

  // Update lastMessageTime whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      setLastMessageTime(Date.now());
    }
  }, [messages]);

  // Inactivity timer (10 minutes)
  useEffect(() => {
    if (!conversationActive || conversationClosed || !isQualified || emailsSent) {
      return; // Don't run timer if conversation is inactive or already handled
    }

    const timer = setInterval(() => {
      const timeSinceLastMessage = Date.now() - lastMessageTime;

      if (timeSinceLastMessage >= INACTIVITY_TIMEOUT) {
        // Send inactivity signal to backend
        sendInactivitySignal();
        setConversationActive(false);
        clearInterval(timer);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(timer);
  }, [lastMessageTime, conversationActive, conversationClosed, isQualified, emailsSent]);

  // Tab close detection (visibilitychange + pagehide for 91% reliability)
  useEffect(() => {
    if (!conversationActive || conversationClosed) {
      return;
    }

    let beaconSent = false;

    // Primary: visibilitychange event (90-95% reliable on desktop)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !beaconSent) {
        if (isQualified && conversationActive) {
          const data = JSON.stringify({
            sessionId,
            message: '__CLOSE_SIGNAL__',
            language: i18n.language,
            agentType: 'contact'
          });
          navigator.sendBeacon('/api/chat', data);
          beaconSent = true;
        }
      }
    };

    // Fallback: pagehide event (works better on mobile iOS/Android)
    const handlePageHide = () => {
      if (!beaconSent && isQualified && conversationActive) {
        const data = JSON.stringify({
          sessionId,
          message: '__CLOSE_SIGNAL__',
          language: i18n.language,
          agentType: 'contact'
        });
        navigator.sendBeacon('/api/chat', data);
        beaconSent = true;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [conversationActive, conversationClosed, isQualified, sessionId, i18n.language]);

  const sendInactivitySignal = async () => {
    try {
      const response = await apiRequest('POST', '/api/chat', {
        sessionId,
        message: '__INACTIVITY_SIGNAL__',
        language: i18n.language,
        agentType: 'contact'
      });

      const data = await response.json();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response
      }]);
      setConversationClosed(true);
    } catch (error) {
      console.error('Error sending inactivity signal:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || conversationClosed) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await apiRequest('POST', '/api/chat', {
        sessionId,
        message: userMessage,
        language: i18n.language,
        agentType: 'contact' // Use contact agent
      });

      const data = await response.json();

      const assistantContent = data.response || t('chatbot.error');

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: assistantContent
      }]);

      // Update state from metadata
      if (data.metadata) {
        if (data.metadata.is_qualified !== undefined) {
          setIsQualified(data.metadata.is_qualified);
        }
        if (data.metadata.emails_sent !== undefined) {
          setEmailsSent(data.metadata.emails_sent);
        }
        if (data.metadata.conversation_closed) {
          setConversationClosed(true);
          setConversationActive(false);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: t('chatbot.error')
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground border-b border-primary-dark">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-primary-foreground">{t('contact.chatbotHeader')}</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto" data-testid="chatbot-messages-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg whitespace-pre-wrap ${message.role === 'user'
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
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && !conversationClosed && handleSend()}
              placeholder={conversationClosed ? t('chatbot.conversationClosed') : t('chatbot.placeholder')}
              className="flex-1 px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="input-contact-chatbot-message"
              disabled={isLoading || conversationClosed}
            />
            <Button
              onClick={handleSend}
              size="lg"
              className="px-6"
              data-testid="button-send-contact-message"
              disabled={isLoading || !input.trim() || conversationClosed}
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
      </CardContent>
    </Card>
  );
}

// Fallback contact options for users who prefer traditional methods
function FallbackContactOptions() {
  const { t, i18n } = useTranslation();
  const [fallbackEmail, setFallbackEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fallbackEmail.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Call backend API
      const response = await apiRequest('POST', '/api/contact/email', {
        email: fallbackEmail,
        language: i18n.language
      });

      const data = await response.json();

      // Handle success
      if (data.success) {
        setSubmitted(true);
        setFallbackEmail('');

        // Auto-reset success state after 3 seconds
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        console.error('Email submission failed:', data.message);
      }

    } catch (error) {
      console.error('Error submitting email:', error);
      // Keep email in field so user can retry

    } finally {
      // Always reset loading state
      setIsSubmitting(false);
    }
  };

  const handleEmailDirect = () => {
    // TODO: Replace with actual email address
    window.location.href = 'mailto:contact@arautomation.com';
  };

  return (
    <div className="space-y-6">
      {/* Contact Form */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Get in touch with us for a personalized consultation
            </h3>
            <p className="text-sm text-muted-foreground">
              Do you want to talk more about what automation and agentic workflows would mean for you and your business?
            </p>
          </div>

          <form onSubmit={handleFallbackSubmit} className="space-y-4">
            <div className="flex gap-3">
              <input
                type="email"
                value={fallbackEmail}
                onChange={(e) => setFallbackEmail(e.target.value)}
                placeholder="your.email@company.com"
                className="flex-1 px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground disabled:opacity-50"
                disabled={isSubmitting || submitted}
                required
              />
              <Button
                type="submit"
                size="lg"
                className="px-6"
                disabled={isSubmitting || submitted || !fallbackEmail.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : submitted ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Sent!
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Email Direct Option */}
      <Card className="border-dashed bg-accent/50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3 text-center sm:text-left">
              <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Prefer to email us directly?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Skip the form and send us an email the traditional way
                </p>
              </div>
            </div>
            <Button
              onClick={handleEmailDirect}
              variant="outline"
              size="lg"
              className="whitespace-nowrap"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Us Directly
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
