if(document.readyState !=="loading"){
    initializaCodeLogin();
}else{
    document.addEventListener("DOMContentLoaded", ()=>{
        initializaCodeLogin();
    })
}
//function to add listener to login form
function initializaCodeLogin(){
    //Set listener to comment-form, which is in singlePost.pug, the form contains the comment for that post
    document.getElementById("comment-form").addEventListener("submit", postComment)
}

async function postComment(event){
    event.preventDefault();
    const formData = new FormData(event.target);//Get all of the form data, which in this case is only the comment
    const authToken = localStorage.getItem("auth_token");//Only authenticated users can comment, so get token from storage
    const id = document.getElementsByTagName("label")[0].id; //The lable in the form has the id that is the same as the post id, need this to save comment for correct post
    if(!authToken){//If token isn't found in storage, inform user to sign in
        document.getElementById("error2").innerHTML = "You are not authorized to use this feature. Please sign in.";
        return
    }
    await fetch("/users/postNewComment", {//If token is okay fetch from routes users/postNewComment, which will add comment to database
        method: "POST",
        headers:{
            "authorization": "Bearer " + authToken,
            "comment": formData.get("comment"),
            "id":id
        }
    })
    window.location.href="/users/singlePost/" + id; //This basically refreshes the singlePost page with the new comment
}