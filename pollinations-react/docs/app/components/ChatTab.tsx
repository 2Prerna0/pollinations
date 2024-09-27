import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { usePollinationsChat } from '@pollinations/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface TextModel {
  name: string;
  type: 'chat' | 'completion';
  censored: boolean;
}

interface ChatTabProps {
  textModels: TextModel[];
  selectedTextModel: string;
  setSelectedTextModel: (model: string) => void;
}

const ChatTab: React.FC<ChatTabProps> = ({ textModels, selectedTextModel, setSelectedTextModel }) => {
  const [chatPrompt, setChatPrompt] = useState("");
  const [systemMessage, setSystemMessage] = useState<string>("You are a helpful AI assistant.");
  const [chatSeed, setChatSeed] = useState<number>(42);
  const [chatModel, setChatModel] = useState<string>('openai');

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { sendUserMessage, messages } = usePollinationsChat([
    { role: "system", content: systemMessage }
  ], {
    seed: chatSeed,
    model: chatModel
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (chatPrompt.trim()) {
      sendUserMessage(chatPrompt);
      setChatPrompt('');
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const getChatCode = (): string => {
    return `
import React, { useState, useRef, useEffect } from 'react';
import { usePollinationsChat } from '@pollinations/react';
import ReactMarkdown from 'react-markdown';

const ChatComponent: React.FC = () => {
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { sendUserMessage, messages } = usePollinationsChat([
    { role: "system", content: "${systemMessage}" }
  ], { 
    seed: ${chatSeed},
    model: '${chatModel}'
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      sendUserMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={\`flex \${msg.role === 'user' ? 'justify-end' : 'justify-start'}\`}>
            <div className={\`max-w-[70%] p-3 rounded-lg \${
              msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
            }\`}>
              {msg.role === 'user' ? '🐦' : '🌸'} <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="w-full p-2 border rounded-lg"
        />
        <button onClick={handleSend} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
    `;
  };

  return (
    <Card className="bg-slate-800 text-slate-100">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
        <CardDescription>Chat with Pollinations' AI</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div>
            <Label htmlFor="systemMessage">System Message</Label>
            <Input
              id="systemMessage"
              value={systemMessage}
              onChange={(e) => setSystemMessage(e.target.value)}
              className="bg-slate-700 text-slate-100"
            />
          </div>
          <div>
            <Label htmlFor="chatSeed">Seed</Label>
            <Input
              id="chatSeed"
              type="number"
              value={chatSeed}
              onChange={(e) => setChatSeed(Math.max(1, Number(e.target.value)))}
              min={1}
              className="bg-slate-700 text-slate-100"
            />
          </div>
          <div>
            <Label htmlFor="chatModel">Model</Label>
            <Select
              value={chatModel}
              onValueChange={setChatModel}
            >
              <SelectTrigger id="chatModel" className="bg-slate-700 text-slate-100">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 text-slate-100">
                {textModels.map((model) => (
                  <SelectItem key={model.name} value={model.name}>{model.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div ref={chatContainerRef} className="h-64 overflow-y-auto bg-slate-700 p-4 rounded-md space-y-4">
            {messages.map((msg: any, index: number) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                  }`}>
                  {msg.role === 'user' ? '🐦' : '🌸'} <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <Textarea
              value={chatPrompt}
              onChange={(e) => setChatPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="bg-slate-700 text-slate-100 flex-grow"
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Code Preview:</h3>
            <div className="relative">
              <SyntaxHighlighter language="typescript" style={oneDark} className="rounded-md">
                {getChatCode()}
              </SyntaxHighlighter>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(getChatCode())}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatTab;

