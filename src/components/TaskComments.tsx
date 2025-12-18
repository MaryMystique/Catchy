"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, Timestamp, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import { FaPaperPlane, FaUser } from "react-icons/fa";

interface Comment {
    id: string;
    text: string;
    userId: string;
    userName: string;
    createdAt: any;
}

interface TaskCommentsProps {
    projectId: string;
    taskId: string;
}

export default function TaskComments({ projectId, taskId }: TaskCommentsProps) {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    //Load comments
    const loadComments = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const commentsRef = collection(db, 'users', user.uid, 'projects', projectId, 'tasks', taskId, 'comments');
            const q = query(commentsRef, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);

           const loadedComments: Comment[] = [];
           snapshot.forEach((doc) => {
            loadedComments.push({
                id: doc.id,
                ...doc.data()
            } as Comment);
            });
           
            setComments(loadedComments);
        } catch (error) {
          console.error('Error loading comments:', error);  
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        loadComments();
    }, [user, projectId, taskId]);

    // Add new comment
    const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSending(true);
    try {
      const commentsRef = collection(db, 'users', user.uid, 'projects', projectId, 'tasks', taskId, 'comments');
      const commentData = {
        text: newComment.trim(),
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        createdAt: serverTimestamp()
      };
      console.log("Adding comment:", commentData); //debug log

      await addDoc(commentsRef, commentData);

      setNewComment("");
      toast.success("Comment added!");
      await loadComments(); // Reload comments
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(error?.message || "Failed to add comment");
    } finally {
      setIsSending(false);
    }
  };

  // Format timestamp
  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">
        Comments ({comments.length})
      </h3>

      {/* Comment Input */}
      <form onSubmit={handleAddComment} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          disabled={isSending}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={isSending || !newComment.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaPaperPlane />
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {isLoading ? (
          <p className="text-sm text-gray-500 text-center py-4">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs shrink-0">
                  <FaUser />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-gray-900">{comment.userName}</span>
                    <span className="text-xs text-gray-500">{formatTime(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700 wrap-break-words">{comment.text}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}