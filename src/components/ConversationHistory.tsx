import React, { useEffect, useState } from 'react';
import { MessageSquare, Clock, Trash2 } from 'lucide-react';
import { ConversationService, ConversationSession } from '../lib/services/conversation.service';

interface ConversationHistoryProps {
  onLoadConversation?: (conversationId: string) => void;
}

export function ConversationHistory({ onLoadConversation }: ConversationHistoryProps) {
  const [conversations, setConversations] = useState<ConversationSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const service = ConversationService.getInstance();
      const history = await service.getConversationHistory();
      setConversations(history);
    } catch (err) {
      console.error('Failed to load conversation history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadConversation = async (id: string) => {
    if (onLoadConversation) {
      onLoadConversation(id);
    }
  };

  if (loading) {
    return (
      <div className="bg-background rounded-lg shadow-theme-lg p-6 border border-border">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-16 bg-muted rounded"></div>
          <div className="h-16 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="bg-background rounded-lg shadow-theme-lg p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Conversation History</h2>
        </div>
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No conversations yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Start a conversation to see your history here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-lg shadow-theme-lg p-6 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Conversation History</h2>
        <span className="ml-auto text-sm text-muted-foreground">{conversations.length} total</span>
      </div>

      <div className="space-y-3">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className="p-4 bg-muted hover:bg-accent rounded-lg border border-border cursor-pointer transition-colors"
            onClick={() => handleLoadConversation(conversation.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">
                  {conversation.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>
                    {new Date(conversation.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="p-2 hover:bg-error/10 rounded-md transition-colors group"
                title="Delete conversation"
              >
                <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-error" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
