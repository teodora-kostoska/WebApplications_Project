if(document.readyState !=="loading"){
    initializaCodeLogin();
}else{
    document.addEventListener("DOMContentLoaded", ()=>{
        initializaCodeLogin();
    })
}
//function to add listener to login form
function initializaCodeLogin(){
    //Set event listener on login-form, when it is submitted the function onSubmit will be called
    document.getElementById("login-form").addEventListener("submit", onSubmit); 
}

async function onSubmit(event){
    event.preventDefault();
    const formData = new FormData(event.target);//Get all the data that is in login-form form
    await fetch("/users/login", { //call from routes login, which will verify username and password and if they're ok will return a token
        method: "POST",
        body:formData
    }).then((response) => response.json())
    .then((data) =>{
        if(data.token){ //check if the returned json information has a value token, if it does save token to localStorage
            storeToken(data.token); //Token to local storage
            window.location.href="/"; //Go back to home page
        }else{ //If token not available inform user of error, and possible reason behind error.
            if(data.message){
                document.getElementById("error").innerHTML = data.message;
            }else{
                document.getElementById("error").innerHTML = "Error with login authorization.";
            }

        }
    })
}

function storeToken(token){
    localStorage.setItem("auth_token", token);
}