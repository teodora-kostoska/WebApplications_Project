if (document.readyState !== "loading") {
    initializeCode();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      initializeCode();
    });
  }
  
function initializeCode() {
  //Add listener on fetchUsername, which is id of the form in postNew.pug
  document.getElementById("fetchUsername").addEventListener("submit", getUsername);
  document.getElementById("logout").addEventListener("click", LogOut);
}

async function getUsername(event) {
    event.preventDefault();
    //As only authenticated users can create new posts, the token is retrieved from the localStorage
    const authToken = localStorage.getItem("auth_token");
    const formInfo = new FormData(event.target); //Because fetchUsername is a form, we can use FormData to retrieve the filled information in the form
    if(!authToken){ //If there is no token in storage, inform user that they need to sign in and return to postNew
      document.getElementById("error2").innerHTML = "You are not authorized to use this feature. Please sign in.";
      return
    };
    // then fetch from routes postNew, which will add the post information into the database
    await fetch("/users/postNew", {
        method: "POST",
        headers: {
            "authorization": "Bearer " + authToken,
            "post": formInfo.get("post"),
            "header": formInfo.get("header"),
            "description": formInfo.get("description")
        }
    })
    window.location.href = "/users/posts"; //Call from routes /users/posts, which will render posts.pug and fill with updated information
}
function LogOut(){
  localStorage.removeItem("auth_token");//when logout is pressed, the token is removed from local storage.
  window.location.href = "/";
}