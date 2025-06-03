
"use client";

import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Paperclip, ArrowRight, Image as ImageIcon, FileText, Loader2, MapPin, Mic } from "lucide-react";
import React, { useState, useEffect, useRef, use } from "react";
import type { Message } from "@/models";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const baseTimestamp = new Date('2024-07-30T12:00:00.000Z'); // A fixed point in time

const mockMessagesData: Message[] = [
  { messageId: 'm1', senderRef: 'user2', receiverRef: 'user1', content: 'مرحباً! لدي استفسار بخصوص الحجز رقم #EXP123.', timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 50) },
  { messageId: 'm2', senderRef: 'user1', receiverRef: 'user2', content: 'أهلاً بك! تفضل بسؤالك. كيف يمكنني مساعدتك اليوم؟', timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 45) },
  { messageId: 'm3', senderRef: 'user2', receiverRef: 'user1', content: 'هل يمكن تعديل عدد الضيوف؟ كنا شخصين ونريد إضافة شخص ثالث.', timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 20) },
  { messageId: 'm4', senderRef: 'user1', receiverRef: 'user2', content: 'نعم، يمكن ذلك قبل 24 ساعة من موعد التجربة. سأقوم بتحديث الحجز. هل هناك أي شيء آخر؟', timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 10) },
  { messageId: 'm5', senderRef: 'user2', receiverRef: 'user1', content: 'شكراً جزيلاً! هذا كل شيء.', timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 5) },
  { messageId: 'm6', senderRef: 'user1', receiverRef: 'user2', content: 'على الرحب والسعة! نتطلع لاستقبالكم.', timestamp: new Date(baseTimestamp.getTime() - 1000 * 60 * 2) },
];

const currentUser = { uid: 'user1', displayName: "أنا", photoUrl: "https://placehold.co/40x40.png?text=Me&font=belleza" }; 
const otherUser = { uid: 'user2', displayName: "أحمد المضيف", photoUrl: "https://placehold.co/40x40.png?text=Host&font=belleza" };

interface PageResolvedParams {
  chatId: string;
}
interface ChatPageProps {
  params: Promise<PageResolvedParams>;
}

interface ChatMessage extends Message {
  type?: 'text' | 'file_upload_pending' | 'image_upload_pending' | 'location_shared' | 'voice_message';
  fileName?: string;
  mediaUrl?: string; // For location link or voice file
  duration?: string; // For voice message
}


export default function ChatPage({ params: paramsPromise }: ChatPageProps) {
  const resolvedParams = use(paramsPromise);
  const { chatId } = resolvedParams; 
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessagesData);
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
  const [formattedTimestamps, setFormattedTimestamps] = useState<Record<string, string>>({});
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
    const msg: ChatMessage = {
      messageId: `msg-${Date.now()}`,
      senderRef: currentUser.uid,
      receiverRef: otherUser.uid,
      bookingRef: chatId.startsWith('booking-') ? chatId.substring(8) : undefined,
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
    };
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = event.target.files?.[0];
    if (file) {
      const pendingMessageId = `pending-${type}-${Date.now()}`;
      const pendingMessage: ChatMessage = {
        messageId: pendingMessageId,
        senderRef: currentUser.uid,
        receiverRef: otherUser.uid,
        content: `جاري إرسال ${type === 'image' ? 'الصورة' : 'الملف'}: ${file.name}`,
        timestamp: new Date(),
        type: type === 'image' ? 'image_upload_pending' : 'file_upload_pending',
        fileName: file.name,
      };
      setMessages(prevMessages => [...prevMessages, pendingMessage]);
      toast({
        title: `تم اختيار ${type === 'image' ? 'صورة' : 'ملف'}`,
        description: `${file.name} - سيتم الإرسال (محاكاة).`,
      });
      event.target.value = ""; 
      
      setTimeout(() => {
        setMessages(prevMessages => prevMessages.map(m => 
          m.messageId === pendingMessageId 
          ? {...m, content: `${type === 'image' ? 'الصورة' : 'الملف'} "${file.name}" تم إرسالها بنجاح (محاكاة).`, type: 'text' } // Change type after "upload"
          : m
        ));
      }, 2000);
    }
  };

  const handleSimulatedAction = (actionType: 'location' | 'voice') => {
    const actionId = `sim-${actionType}-${Date.now()}`;
    let initialContent = "";
    let toastTitle = "";
    let toastDescription = "";

    if (actionType === 'location') {
      initialContent = "جاري تحديد الموقع...";
      toastTitle = "مشاركة الموقع";
      toastDescription = "جاري طلب إذن الموقع... (محاكاة)";
    } else { // voice
      initialContent = "جاري بدء التسجيل الصوتي...";
      toastTitle = "تسجيل صوتي";
      toastDescription = "جاري بدء التسجيل... (محاكاة)";
    }

    const pendingMessage: ChatMessage = {
      messageId: actionId,
      senderRef: currentUser.uid,
      receiverRef: otherUser.uid,
      content: initialContent,
      timestamp: new Date(),
      type: 'text', // Treat as text initially or a new specific pending type
    };
    setMessages(prev => [...prev, pendingMessage]);
    toast({ title: toastTitle, description: toastDescription });

    setTimeout(() => {
      let finalContent = "";
      let finalToastDescription = "";
      let finalType: ChatMessage['type'] = 'text';
      let finalMediaUrl: string | undefined = undefined;
      let finalDuration: string | undefined = undefined;

      if (actionType === 'location') {
        finalContent = "تمت مشاركة الموقع بنجاح.";
        finalMediaUrl = `https://maps.example.com/?lat=${(Math.random()*90).toFixed(6)}&lng=${(Math.random()*180).toFixed(6)}`;
        finalType = 'location_shared';
        finalToastDescription = "تمت مشاركة الموقع (محاكاة).";
      } else { // voice
        const durationSeconds = Math.floor(Math.random() * 50) + 10; // 10-60 seconds
        finalDuration = `0:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
        finalContent = `تسجيل صوتي (${finalDuration})`;
        finalMediaUrl = `#`; // Placeholder for voice file
        finalType = 'voice_message';
        finalToastDescription = "تم إرسال التسجيل الصوتي (محاكاة).";
      }

      setMessages(prev => prev.map(m => 
        m.messageId === actionId 
        ? {...m, content: finalContent, type: finalType, mediaUrl: finalMediaUrl, duration: finalDuration }
        : m
      ));
      toast({ title: toastTitle, description: finalToastDescription });
    }, 2500);
  };


  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader />
      <div className="border-b p-3 sm:p-4 flex items-center gap-3 bg-card sticky top-16 z-40 shadow-sm">
        <Button variant="ghost" size="icon" className="md:hidden" asChild>
            <Link href="/my-bookings"> 
                <ArrowRight className="h-5 w-5" />
            </Link>
        </Button>
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-primary/30">
          <AvatarImage src={otherUser.photoUrl} alt={otherUser.displayName} />
          <AvatarFallback className="font-headline">{otherUser.displayName.slice(0,2)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold font-body text-base sm:text-lg">{otherUser.displayName}</h2>
          <p className="text-xs text-green-500">متصل الآن</p>
        </div>
        {chatId.startsWith('booking-') &&
            <Button variant="outline" size="sm" className="mr-auto font-body text-xs" asChild>
                <Link href={`/experiences/${chatId.substring(8)}`}>عرض تفاصيل الحجز</Link>
            </Button>
        }
      </div>

      <ScrollArea className="flex-1 bg-gradient-to-b from-background to-muted/10" viewportRef={scrollAreaViewportRef}>
        <div className="p-4 sm:p-6 space-y-4">
            {messages.map((msg) => (
            <div
                key={msg.messageId}
                className={`flex ${msg.senderRef === currentUser.uid ? "justify-end" : "justify-start"}`}
            >
                <div className={`max-w-[70%] sm:max-w-[60%] px-4 py-3 rounded-2xl shadow-md ${
                    msg.senderRef === currentUser.uid
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-card text-card-foreground rounded-bl-none border"
                }`}
                >
                {msg.type === 'file_upload_pending' || msg.type === 'image_upload_pending' ? (
                    <div className="flex items-center">
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        <span className="text-sm font-body italic">{msg.content}</span>
                    </div>
                ) : msg.type === 'location_shared' && msg.mediaUrl ? (
                    <a href={msg.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-body underline hover:opacity-80 flex items-center">
                        <MapPin className="ml-2 h-4 w-4" /> {msg.content}
                    </a>
                ) : msg.type === 'voice_message' ? (
                    <div className="flex items-center text-sm font-body">
                        <Mic className="ml-2 h-4 w-4" /> {msg.content}
                        {msg.mediaUrl && <Button variant="link" size="sm" asChild className="p-0 h-auto mr-2"><a href={msg.mediaUrl} target="_blank" rel="noopener noreferrer">(تشغيل)</a></Button>}
                    </div>
                ) : (
                    <p className="text-sm font-body break-words whitespace-pre-wrap">{msg.content}</p>
                )}
                <p className={`text-[0.7rem] mt-1.5 ${msg.senderRef === currentUser.uid ? 'text-primary-foreground/70 text-left' : 'text-muted-foreground text-right'}`}>
                    {formattedTimestamps[msg.messageId] || new Date(msg.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                </p>
                </div>
            </div>
            ))}
        </div>
      </ScrollArea>

      <div className="border-t p-3 sm:p-4 bg-card sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 sm:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Paperclip className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="sr-only">إرفاق</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="font-body w-56" dir="rtl">
              <DropdownMenuItem onSelect={() => imageInputRef.current?.click()}>
                <ImageIcon className="ml-2 h-4 w-4 text-blue-500" />
                إرفاق صورة
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => fileInputRef.current?.click()}>
                <FileText className="ml-2 h-4 w-4 text-green-500" />
                إرفاق ملف
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => handleSimulatedAction('location')}>
                <MapPin className="ml-2 h-4 w-4 text-orange-500" />
                مشاركة الموقع (محاكاة)
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleSimulatedAction('voice')}>
                <Mic className="ml-2 h-4 w-4 text-purple-500" />
                تسجيل صوتي (محاكاة)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <input 
            type="file" 
            ref={imageInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={(e) => handleFileSelect(e, 'image')}
          />
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={(e) => handleFileSelect(e, 'file')}
          />
          <Input
            type="text"
            placeholder="اكتب رسالتك هنا..."
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

