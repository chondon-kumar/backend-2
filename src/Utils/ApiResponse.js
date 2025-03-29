class ApiResponse {
    constructor(statusCode, message, data = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }

//     static success(message, data = null) {
//         return new ApiResponse(200, message, data);
//     }

//     static error(statusCode, message) {
//         return new ApiResponse(statusCode, message);
//     }
  }
 
export { ApiResponse}