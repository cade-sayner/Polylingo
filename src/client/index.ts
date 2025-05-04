

type Page = "Login Page" | "Translation Page" | "Fill Blank Page" | "Landing Page" | "Admin Page"


// move this to a constants module
const googleAuthURI = "https://accounts.google.com/o/oauth2/auth?client_id=988182050054-vlcub1cr22892gc1e4uesj5d6sa3ji1v.apps.googleusercontent.com&redirect_uri=http://localhost:3000/login.html&response_type=code&scope=openid%20phone%20email%20profile";

function main(){
  // check if the user is currently logged in, if they are not then navigate to the login screen
  const jwt = localStorage.getItem("polylingo_jwt");

  // TODO: actually validate the jwt, check the expiry etc. Just checking for existence for now
  if(jwt !== null){
    navigateTo("Landing Page");
    console.log("navigating to landing page");
    return;
  }

  // check if jwt is valid
  console.log("navigating to login page");
  navigateTo("Login Page");
  
}

function navigateTo(page : Page ){
  switch (page){
    case "Login Page":
      loadLoginPage();
      break;
    case "Landing Page":
      loadLandingPage();
      break;
  }
}

function loadLoginPage(){
   // inject template into the domA
   console.log("loading login page again");
   let loginTemplate = document.querySelector(".login-screen-template");
   let pageContainer = document.querySelector(".page-container");
   if(loginTemplate == null || pageContainer == null){
      throw new Error("Failed to load required elements");
   }
   pageContainer.innerHTML = loginTemplate.innerHTML;

   // subscribe all event listeners
   const loginButton = document.querySelector(".login-button");
   loginButton?.addEventListener('click', ()=>{
     // redirect to google
      window.location.href = googleAuthURI;
   })
}

function loadLandingPage(){
  // inject template into dom
   console.log("loading landing page again");
  const landingTemplate = document.querySelector(".landing-page-template");
  const pageContainer = document.querySelector(".page-container");
  if(landingTemplate == null || pageContainer == null){
    throw new Error("Failed to load required elements");
  }
  pageContainer.innerHTML = landingTemplate.innerHTML;
}

function loadAdminPage(){

}

function loadTranslationPage(){

}

function loadFillBlankPage(){

}

main();
