class ApiError extends Error {
    constructor (
         statusCode,
         message = "Someting went worng",
         errors = [],
         stack = "",
    ){
        super(statusCode)
        this.statusCode = statusCode
        this.errors = errors
        this.data = null
        this.message = message
        this.success = true

        if(stack){
            this.stack = stack
        }else {
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}