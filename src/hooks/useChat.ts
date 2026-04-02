import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  id: string;
  conversation_id: string;
  message: string;
  sender_type: 'visitor' | 'admin';
  is_read: boolean | null;
  created_at: string;
}

export const useChat = () => {
  const [conversationId, setConversationId] = useState<string | null>(() => {
    return localStorage.getItem('rangoli_chat_id');
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Create or load conversation
  const initConversation = useCallback(async () => {
    if (conversationId) {
      // Load existing messages
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at');
      if (data) setMessages(data as ChatMessage[]);
      return conversationId;
    }
    return null;
  }, [conversationId]);

  const startConversation = useCallback(async () => {
    const { data, error } = await supabase
      .from('chat_conversations')
      .insert({ visitor_name: 'Visitor' })
      .select()
      .single();
    if (error || !data) return null;
    localStorage.setItem('rangoli_chat_id', data.id);
    setConversationId(data.id);
    return data.id;
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    let convId = conversationId;
    if (!convId) {
      convId = await startConversation();
      if (!convId) return;
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: convId,
        message: text,
        sender_type: 'visitor',
      })
      .select()
      .single();
    
    if (!error && data) {
      setMessages(prev => [...prev, data as ChatMessage]);
      // Update last_message_at
      await supabase.from('chat_conversations').update({ last_message_at: new Date().toISOString() }).eq('id', convId);
    }
  }, [conversationId, startConversation]);

  // Subscribe to realtime messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        const newMsg = payload.new as ChatMessage;
        setMessages(prev => {
          if (prev.some(m => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  useEffect(() => {
    initConversation();
  }, [initConversation]);

  return { messages, sendMessage, loading, conversationId };
};
