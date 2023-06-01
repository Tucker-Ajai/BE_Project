const { deleteComment } = require("../Models/comments.model")




exports.removeComment = (request, response, next) => {
    deleteComment(request.params.comment_id).then((res)=>{
       
    response.status(204).send("")
 
    }).catch((err)=>{
        next(err)
    })
}