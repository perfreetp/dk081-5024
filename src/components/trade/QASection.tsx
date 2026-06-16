import { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { useAppStore } from '@/store';
import { UserAvatar } from '@/components/user/UserAvatar';
import { formatDate } from '@/utils/format';
import type { QAComment } from '@/types';

interface QASectionProps {
  postId: string;
}

export function QASection({ postId }: QASectionProps) {
  const [newComment, setNewComment] = useState('');
  const currentUser = useAppStore((s) => s.currentUser);
  const post = useAppStore((s) => s.posts.find((p) => p.id === postId));
  const comments = useAppStore((s) => s.getPostQA(postId));
  const addQAComment = useAppStore((s) => s.addQAComment);

  const isSeller = post?.userId === currentUser.id;

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    addQAComment({
      postId,
      userId: currentUser.id,
      content: newComment.trim(),
      isSeller,
      user: currentUser,
    });
    setNewComment('');
  };

  const renderComment = (comment: QAComment, isReply = false) => (
    <div key={comment.id} className={`flex gap-3 ${isReply ? 'ml-12 mt-3' : ''}`}>
      <UserAvatar user={comment.user} size="sm" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-white">{comment.user.nickname}</span>
          {comment.isSeller && (
            <span className="tag-neon bg-neon-orange/20 text-neon-orange text-[10px]">卖家</span>
          )}
          <span className="tag-neon bg-neon-purple/20 text-neon-purple text-[10px]">
            {comment.user.school}
          </span>
          <span className="text-xs text-white/40">{formatDate(comment.createdAt)}</span>
        </div>
        <div className={`rounded-2xl px-4 py-2.5 max-w-lg ${
          comment.isSeller
            ? 'bg-neon-orange/10 border border-neon-orange/20'
            : 'bg-dark-700/50 border border-white/5'
        }`}>
          <p className="text-sm text-white/90">{comment.content}</p>
        </div>
      </div>
    </div>
  );

  const topLevelComments = comments.filter((c) => !c.replyTo);
  const replies = comments.filter((c) => c.replyTo);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle size={20} className="text-neon-purple" />
        <h3 className="text-lg font-semibold text-white">交易问答</h3>
        <span className="tag-neon bg-neon-purple/20 text-neon-purple text-xs">
          {comments.length} 条
        </span>
      </div>

      <div className="space-y-5 mb-6 max-h-96 overflow-y-auto pr-2">
        {topLevelComments.length === 0 ? (
          <div className="text-center py-10 text-white/40">
            <MessageCircle size={40} className="mx-auto mb-3 opacity-30" />
            <p>暂无问答，快来第一个提问吧！</p>
          </div>
        ) : (
          topLevelComments.map((comment) => (
            <div key={comment.id}>
              {renderComment(comment)}
              {replies
                .filter((r) => r.replyTo === comment.id)
                .map((reply) => renderComment(reply, true))}
            </div>
          ))
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-white/5">
        <UserAvatar user={currentUser} size="sm" />
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={isSeller ? '回复买家问题...' : '向卖家提问...'}
            className="input-field flex-1"
          />
          <button
            onClick={handleSubmit}
            disabled={!newComment.trim()}
            className="px-4 py-2 rounded-xl bg-gradient-neon text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-neon transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
