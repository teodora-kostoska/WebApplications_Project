if(document.readyState !=="loading"){
    initializaCodeLogin();
}else{
    document.addEventListener("DOMContentLoaded", ()=>{
        initializaCodeLogin();
    })
}
//function to add listener to registration form
function initializaCodeLogin(){
    //Set event listener on register-form, when it is submitted the function onRegister will be called
    document.getElementById("register-form").addEventListener("submit", onRegister); 
}

async function onRegister(event){
    event.preventDefault();
    const formData = new FormData(event.target);//Get all the data that is in register form
    await fetch("/users/register", { //call from routes register, which will check if same username exists, if not it will add user to user database
        method: "POST",
        headers:{
            "username":formData.get("username"),
            "password":formData.get("password")
        }
    }).then((response) => response.json())
    .then((data) =>{
        if(data.success){ //check if the returned json information was successfull, if it was redirect to login
            window.location.href="/users/login";
        }else{ //If it was not successful inform user, and give possible reason behind error.
            if(data.message){
                document.getElementById("error3").innerHTML = data.message;
            }else{
                document.getElementById("error3").innerHTML = "Error with registration.";
            }
        }
    })
}