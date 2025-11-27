// import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";
// import HttpService from "./HttpService";
// import type { Comment } from "../../types/common/Comment.types";
// import type { CustomResponse } from "../../types/common/ApiTypes";

// class CommentService {

//   // GET ALL COMMENTS BY TABLE NAME AND RECORD ID
//   static async getByTableAndId(
//     tableName: string,
//     recordId: number | string
//   ): Promise<Comment[]> {

//     const response: CustomResponse<Comment[]> = await HttpService.callApi(
//       API_ENDPOINTS.COMMENT.GET_BY_TABLE_AND_ID(tableName, Number(recordId)),
//       "GET"
//     );

//     return response.value || [];
//   }


//   // CREATE COMMENT
//   static async createComment(payload: Comment): Promise<Comment | null> {

//     const response: CustomResponse<Comment> = await HttpService.callApi(
//       API_ENDPOINTS.COMMENT.CREATE,
//       "POST",
//       payload
//     );

//     return response.value;
//   }


//   //  DELETE COMMENT
//   // /api/Comment/{commentId}?deletedBy=Admin
//   static async deleteComment(commentId: number, deletedBy: string): Promise<null> {

//     const response: CustomResponse<null> = await HttpService.callApi(
//       `${API_ENDPOINTS.COMMENT.DELETE(commentId)}?deletedBy=${deletedBy}`,
//       "DELETE"
//     );

//     return response.value;
//   }
// }

// export default CommentService;
