
"use client";

import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Paperclip, ArrowRight, Image as ImageIcon, FileText, Loader2, MapPin, Mic, Square, Play } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
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
import { cn } from "@/lib/utils";


const baseTimestamp = new Date('2024-07-30T12:00:00.000Z'); 

const mockHostMessagesData: Message[] = [
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

interface ChatMessage extends Message {
  type?: 'text' | 'file_upload_pending' | 'image_upload_pending' | 'location_shared' | 'audio';
  fileName?: string;
  mediaUrl?: string;
  duration?: number; // Duration in seconds for audio
}

export default function HostChatPage({ params }: HostChatPageProps) {
  const { chatId } = params; 
  const [messages, setMessages] = useState<ChatMessage[]>(mockHostMessagesData);
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
  const [formattedTimestamps, setFormattedTimestamps] = useState<Record<string, string>>({});

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);


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

  // Cleanup Object URLs
  useEffect(() => {
    return () => {
      messages.forEach(msg => {
        if (msg.type === 'audio' && msg.mediaUrl && msg.mediaUrl.startsWith('blob:')) {
          URL.revokeObjectURL(msg.mediaUrl);
        }
      });
    };
  }, [messages]);


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    const msg: ChatMessage = {
      messageId: `msg-${Date.now()}`,
      senderRef: currentHost.uid,
      receiverRef: clientUser.uid, 
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
        senderRef: currentHost.uid,
        receiverRef: clientUser.uid,
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
          ? {...m, content: `${type === 'image' ? 'الصورة' : 'الملف'} "${file.name}" تم إرسالها بنجاح (محاكاة).`, type: 'text'} 
          : m
        ));
      }, 2000);
    }
  };

  const handleSimulatedLocationShare = () => {
    const actionId = `sim-location-${Date.now()}`;
    const initialContent = "جاري تحديد الموقع...";
    const toastTitle = "مشاركة الموقع";
    
    setMessages(prev => [...prev, {
      messageId: actionId,
      senderRef: currentHost.uid,
      receiverRef: clientUser.uid,
      content: initialContent,
      timestamp: new Date(),
      type: 'text', 
    }]);
    toast({ title: toastTitle, description: "جاري طلب إذن الموقع... (محاكاة)" });

    setTimeout(() => {
      const finalContent = "تمت مشاركة الموقع بنجاح.";
      const finalMediaUrl = `https://maps.example.com/?lat=${(Math.random()*90).toFixed(6)}&lng=${(Math.random()*180).toFixed(6)}`;
      
      setMessages(prev => prev.map(m => 
        m.messageId === actionId 
        ? {...m, content: finalContent, type: 'location_shared', mediaUrl: finalMediaUrl }
        : m
      ));
      toast({ title: toastTitle, description: "تمت مشاركة الموقع (محاكاة)." });
    }, 2500);
  };

  const addAudioMessage = (audioUrl: string, duration: number) => {
    const msg: ChatMessage = {
      messageId: `audio-${Date.now()}`,
      senderRef: currentHost.uid,
      receiverRef: clientUser.uid,
      content: "رسالة صوتية",
      timestamp: new Date(),
      type: 'audio',
      mediaUrl: audioUrl,
      duration: duration,
    };
    setMessages(prevMessages => [...prevMessages, msg]);
  };

  const handleStartRecording = async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      setAudioChunks([]);

      mediaRecorderRef.current.ondataavailable = (event) => {
        setAudioChunks((prev) => [...prev, event.data]);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const duration = recordingStartTime ? Math.round((Date.now() - recordingStartTime) / 1000) : 0;
        addAudioMessage(audioUrl, duration);
        
        stream.getTracks().forEach(track => track.stop());
        setAudioChunks([]);
        setRecordingStartTime(null);
      };

      mediaRecorderRef.current.start();
      setRecordingStartTime(Date.now());
      setIsRecording(true);
      toast({ title: "بدء التسجيل الصوتي", description: "تحدث الآن..." });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        variant: "destructive",
        title: "خطأ في الوصول للميكروفون",
        description: "يرجى التأكد من السماح بالوصول إلى الميكروفون.",
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({ title: "تم إيقاف التسجيل", description: "جاري معالجة الصوت..." });
    }
  };
  
  const formatDuration = (totalSeconds?: number) => {
    if (totalSeconds === undefined || totalSeconds === null) return "0:00";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
                <div className={cn(
                    "max-w-[70%] sm:max-w-[60%] px-4 py-3 rounded-2xl shadow-md",
                    msg.senderRef === currentHost.uid
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-card text-card-foreground rounded-bl-none border"
                )}
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
                ) : msg.type === 'audio' && msg.mediaUrl ? (
                     <div className="flex items-center text-sm font-body gap-2">
                        <Mic className="h-4 w-4 shrink-0" />
                         <audio controls src={msg.mediaUrl} className="max-w-[200px] h-8"></audio>
                         {msg.duration !== undefined && (
                            <span className="text-xs text-muted-foreground pr-1 tabular-nums">
                                ({formatDuration(msg.duration)})
                            </span>
                        )}
                    </div>
                ) : (
                    <p className="text-sm font-body break-words whitespace-pre-wrap">{msg.content}</p>
                )}
                <p className={`text-[0.7rem] mt-1.5 ${msg.senderRef === currentHost.uid ? 'text-primary-foreground/70 text-left' : 'text-muted-foreground text-right'}`}>
                   {formattedTimestamps[msg.messageId] || new Date(msg.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                </p>
                </div>
            </div>
            ))}
        </div>
      </ScrollArea>

      <div className="border-t p-3 sm:p-4 bg-card sticky bottom-0">
        {isRecording ? (
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center text-destructive">
              <Mic className="h-5 w-5 mr-2 animate-pulse" />
              <span className="font-body text-sm">جاري التسجيل...</span>
            </div>
            <Button type="button" onClick={handleStopRecording} variant="destructive" size="icon" className="rounded-full w-11 h-11 sm:w-12 sm:h-12 shrink-0">
              <Square className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="sr-only">إيقاف التسجيل</span>
            </Button>
          </div>
        ) : (
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
                <DropdownMenuItem onSelect={handleSimulatedLocationShare}>
                  <MapPin className="ml-2 h-4 w-4 text-orange-500" />
                  مشاركة الموقع (محاكاة)
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleStartRecording}>
                  <Mic className="ml-2 h-4 w-4 text-purple-500" />
                  تسجيل صوتي
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
        )}
      </div>
    </div>
  );
}

