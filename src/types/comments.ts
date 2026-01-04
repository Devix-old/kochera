// Comment system TypeScript types

export type CommentStatus = 'pending' | 'approved' | 'spam';

export interface Comment {
  id: string;
  page_slug: string;
  author_name: string;
  author_email: string | null;
  content: string;
  parent_id: string | null;
  is_admin: boolean;
  status: CommentStatus;
  created_at: string;
  replies?: Comment[];
}

export interface CommentCounts {
  total: number;
  pending: number;
  approved: number;
  spam: number;
}

// API Request types
export interface CreateCommentRequest {
  page_slug: string;
  author_name: string;
  author_email?: string | null;
  content: string;
  parent_id?: string | null;
}

export interface UpdateCommentRequest {
  status: CommentStatus;
  is_admin?: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CommentsResponse {
  comments: Comment[];
  counts?: CommentCounts;
}

export interface CommentSubmitResponse {
  comment: Comment;
  message: string;
}

