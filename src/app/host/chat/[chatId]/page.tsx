
"use client";

import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Paperclip, ArrowRight } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import type { Message } from "@/models";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

const baseTimestamp = new Date('2024-07-30T12:00:00.000Z'); // A fixed point in time

const mockHostMessages: Message[] = [
  { messageId: 'hm1', senderRef: 'clientUserX', receiverRef: 'hostUserY', content: 'مرحباً أيها المضيف، لدي سؤال بخصوص تجربتك "رحلة سفاري".', timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 60) },
  { messageId: 'hm2', senderRef: 'hostUserY', receiverRef: 'clientUserX', content: 'أهلاً بك! تفضل، كيف يمكنني مساعدتك بخصوص رحلة السفاري؟', timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 55) },
  { messageId: 'hm3', senderRef: 'clientUserX', receiverRef: 'hostUserY', content: 'هل التجربة مناسبة للأطفال بعمر 8 سنوات؟', timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 30) },
  { messageId: 'hm4', senderRef: 'hostUserY', receiverRef: 'clientUserX', content: 'نعم، التجربة مناسبة وآمنة للأطفال فوق 6 سنوات. نوفر مقاعد خاصة لهم.', timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 25) },
];

const currentHost = { uid: 'hostUserY', displayName: "أنا (المضيف)", photoUrl: "https://placehold.co/40x40.png?text=Me&font=belleza" }; 
const clientUser = { uid: 'clientUserX', displayName: "فهد العميل", photoUrl: "https://placehold.co/40x40.png?text=Client&font=belleza" };

interface HostChatPageProps {
  params: { chatId: string };
}

export default function HostChatPage({ params }: HostChatPageProps) {
  const { chatId } = params; 
  const [messages, setMessages] = useState<Message[]>(mockHostMessages);
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
  const [formattedTimestamps, setFormattedTimestamps] = useState<Record<string, string>>({});

  useEffect(() => {
    const newFormattedTimestamps: Record<string, string> = {};
    messages.forEach(msg => {
      newFormattedTimestamps[msg.messageId] = new Date(msg.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    });
    setFormattedTimestamps(newFormattedTimestamps);
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollAreaViewportRef.current) {
      scrollAreaViewportRef.current.scrollTop = scrollAreaViewportRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, formattedTimestamps]);

  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, []);


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    const msg: Message = {
      messageId: `hm${messages.length + 1}`,
      senderRef: currentHost.uid,
      receiverRef: clientUser.uid, 
      bookingRef: chatId.startsWith('booking-') ? chatId.substring(8) : undefined,
      content: newMessage,
      timestamp: new Date(),
    };
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader /> 
      <div className="border-b p-3 sm:p-4 flex items-center gap-3 bg-card sticky top-16 z-40 shadow-sm">
         <Button variant="ghost" size="icon" className="md:hidden" asChild>
            <Link href="/host/bookings"> 
                <ArrowRight className="h-5 w-5" />
            </Link>
        </Button>
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-primary/30">
          <AvatarImage src={clientUser.photoUrl} alt={clientUser.displayName} />
          <AvatarFallback className="font-headline">{clientUser.displayName.slice(0,2)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold font-body text-base sm:text-lg">{clientUser.displayName}</h2>
          <p className="text-xs text-muted-foreground">العميل</p>
        </div>
         {chatId.startsWith('booking-') &&
            <Button variant="outline" size="sm" className="mr-auto font-body text-xs" asChild>
                <Link href={`/host/bookings?bookingId=${chatId.substring(8)}`}>عرض تفاصيل الحجز</Link>
            </Button>
        }
      </div>

      <ScrollArea className="flex-1 bg-gradient-to-b from-background to-muted/10" viewportRef={scrollAreaViewportRef}>
        <div className="p-4 sm:p-6 space-y-4">
            {messages.map((msg) => (
            <div
                key={msg.messageId}
                className={`flex ${msg.senderRef === currentHost.uid ? "justify-end" : "justify-start"}`}
            >
                <div className={`max-w-[70%] sm:max-w-[60%] px-4 py-3 rounded-2xl shadow-md ${
                    msg.senderRef === currentHost.uid
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-card text-card-foreground rounded-bl-none border"
                }`}
                >
                <p className="text-sm font-body break-words whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-[0.7rem] mt-1.5 ${msg.senderRef === currentHost.uid ? 'text-primary-foreground/70 text-left' : 'text-muted-foreground text-right'}`}>
                   {formattedTimestamps[msg.messageId] || ''}
                </p>
                </div>
            </div>
            ))}
        </div>
      </ScrollArea>

      <div className="border-t p-3 sm:p-4 bg-card sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 sm:gap-3">
          <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Paperclip className="h-5 w-5 sm:h-6 sm:w-6" />
             <span className="sr-only">إرفاق ملف</span>
          </Button>
          <Input
            type="text"
            placeholder="اكتب ردك هنا..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 h-11 sm:h-12 rounded-full px-4 text-base font-body bg-input focus:bg-background"
            autoComplete="off"
          />
          <Button type="submit" size="icon" className="rounded-full w-11 h-11 sm:w-12 sm:h-12 shrink-0">
            <Send className="h-5 w-5 sm:h-6 sm:w-6" />
             <span className="sr-only">إرسال</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
