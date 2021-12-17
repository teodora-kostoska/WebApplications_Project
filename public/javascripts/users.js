if (document.readyState !== "loading") {
    initializeCode();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      initializeCode();
    });
  }
  
  function initializeCode() {
    document.getElementById("newPost").addEventListener("click", PostNewPost); //Add listener on newPost, which is in menu.pug, when pressed it will render newPost page
    document.getElementById("logout").addEventListener("click", LogOut);//Add listener to logout item, as this will be used to clear localStorage
}

function PostNewPost(event) {
    event.preventDefault();
    window.location.href = "/users/postNew";//go to routes /users/postNew, which will render the postNew page
}

function LogOut(){
  localStorage.removeItem("auth_token");//when logout is pressed, the token is removed from local storage.
  window.location.href = "/";
}

