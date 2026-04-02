import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Send, MessageCircle } from 'lucide-react';

const AdminChat = () => {
  const queryClient = useQueryClient();
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations } = useQuery({
    queryKey: ['admin-conversations'],
    queryFn: async () => {
      const { data, error } = await supabase.from('chat_conversations').select('*').order('last_message_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000,
  });

  const { data: messages, refetch: refetchMessages } = useQuery({
    queryKey: ['admin-chat-messages', selectedConvo],
    queryFn: async () => {
      if (!selectedConvo) return [];
      const { data, error } = await supabase.from('chat_messages').select('*').eq('conversation_id', selectedConvo).order('created_at');
      if (error) throw error;
      return data;
    },
    enabled: !!selectedConvo,
    refetchInterval: 3000,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Realtime subscription
  useEffect(() => {
    if (!selectedConvo) return;
    const channel = supabase.channel(`admin-chat-${selectedConvo}`).on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'chat_messages',
      filter: `conversation_id=eq.${selectedConvo}`,
    }, () => refetchMessages()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedConvo, refetchMessages]);

  const sendReply = async () => {
    if (!reply.trim() || !selectedConvo) return;
    await supabase.from('chat_messages').insert({
      conversation_id: selectedConvo,
      message: reply,
      sender_type: 'admin',
    });
    await supabase.from('chat_conversations').update({ last_message_at: new Date().toISOString() }).eq('id', selectedConvo);
    setReply('');
    refetchMessages();
    queryClient.invalidateQueries({ queryKey: ['admin-conversations'] });
  };

  return (
    <div>
      <h2 className="font-heading text-lg font-semibold text-foreground mb-6">Chat Conversations</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ minHeight: 400 }}>
        {/* Conversation list */}
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="p-3 bg-secondary/30 border-b border-border">
            <p className="text-xs font-body font-medium text-foreground">{conversations?.length || 0} conversations</p>
          </div>
          <div className="overflow-y-auto max-h-96">
            {conversations?.length === 0 && <p className="p-4 text-sm text-muted-foreground font-body">No conversations yet.</p>}
            {conversations?.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedConvo(c.id)}
                className={`w-full text-left p-3 border-b border-border/50 hover:bg-secondary/30 transition-colors ${selectedConvo === c.id ? 'bg-secondary/50' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <MessageCircle size={14} className="text-muted-foreground" />
                  <span className="text-sm font-body font-medium text-foreground">{c.visitor_name || 'Visitor'}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-body ml-auto ${c.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{c.status}</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-body mt-1">{c.last_message_at ? new Date(c.last_message_at).toLocaleString() : ''}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="lg:col-span-2 border border-border rounded-xl overflow-hidden flex flex-col">
          {!selectedConvo ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-muted-foreground font-body">Select a conversation to view messages</p>
            </div>
          ) : (
            <>
              <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-80">
                {messages?.map(m => (
                  <div key={m.id} className={`flex ${m.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-xl px-3 py-2 text-sm font-body max-w-[70%] ${
                      m.sender_type === 'admin' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-secondary rounded-tl-sm'
                    }`}>
                      {m.message}
                      <p className="text-[9px] opacity-60 mt-1">{new Date(m.created_at).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-border p-3 flex gap-2">
                <input
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendReply()}
                  placeholder="Type your reply..."
                  className="flex-1 bg-secondary/50 rounded-lg px-3 py-2 text-sm font-body outline-none focus:ring-1 focus:ring-gold"
                />
                <button onClick={sendReply} className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-maroon-light transition-colors">
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
