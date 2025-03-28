const asyncHandler = (requestHandler) => (req,res,next) => {
   return (req,res,next) => {
        Promise.resolve(requestHandler(req, res, next).catch((err) => next()) )
    }
}

export default asyncHandler;