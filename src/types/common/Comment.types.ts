export interface Comment {
  commentId: number;
  description?: string;
  tableName?: string;
  recordID?: number;
  parentCommentId?: number;
  isInternal?: boolean;
  createdOn?: string;
  createdBy?: string;
  isDeleted?: boolean;
  deletedOn?: string;
  deletedBy?: string;
}
