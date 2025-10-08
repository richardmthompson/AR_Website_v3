import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Sparkles } from 'lucide-react';

export default function InlineChatbot() {
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; content: string }[]>([
    { role: 'bot', content: "Hi, I'm Max. What task would you love to have done automatically, quickly, and with no effort on your part?" },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: "Thanks for sharing! Let me help you find the right automation solution. Which industry best describes your business?" },
      ]);
    }, 1000);
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
                <div className="font-semibold text-foreground">Chat to Max</div>
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
          </div>

          <div className="p-4 border-t border-card-border bg-background">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message here..."
                className="flex-1 px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
                data-testid="input-inline-chatbot-message"
              />
              <Button 
                onClick={handleSend} 
                size="lg"
                className="px-6"
                data-testid="button-send-inline-message"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Your information is secure and will only be used to provide you with automation solutions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
