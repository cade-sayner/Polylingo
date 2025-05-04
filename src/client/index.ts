interface RouteDefinition {
  content: () => string | undefined;
  loadCallback: () => void;
}

// Find a way to write a proper type for this
const routes : Record<string, RouteDefinition>  = {
  'login' : { content: () => document.querySelector(".login-screen-template")?.innerHTML, loadCallback : loadLoginPage },
  'landing' : {content : () => document.querySelector(".landing-page-template")?.innerHTML, loadCallback : loadLandingPage}
}

// move these to a constants module at some point
const applicationUri = "http://localhost:3000"
const googleAuthURI = "https://accounts.google.com/o/oauth2/auth?client_id=988182050054-vlcub1cr22892gc1e4uesj5d6sa3ji1v.apps.googleusercontent.com&redirect_uri=http://localhost:3000/login.html&response_type=code&scope=openid%20phone%20email%20profile";

function render(path : string){
  const pageContent = routes[path]?.content() ?? "<section> 404 not found </section>";
  let pageContainer = document.querySelector(".page-container");
  if(pageContainer){
    pageContainer.innerHTML = pageContent;
  }
  routes[path].loadCallback();
}

function navigateTo(path : string){
  history.pushState({}, '', `${applicationUri}/${path}` );
  render(path);
}

function main(){
  // check if the user is currently logged in, if they are not then navigate to the login screen
  const jwt = localStorage.getItem("polylingo_jwt");
  // TODO: actually validate the jwt, check the expiry etc. Just checking for existence for now
  if(jwt !== null){
    // check the roles that the person has
    // if they have an admin role they should be taken to the admin landing page
    navigateTo("landing");
    return;
  }
  navigateTo("login");
}


function loadLoginPage(){
  
   // subscribe all event listeners
   const loginButton = document.querySelector(".login-button");
   loginButton?.addEventListener('click', ()=>{
     // redirect to google
      window.location.href = googleAuthURI;
   })
}

function loadLandingPage(){
  // subscribe all event listeners for the landing page
  // check roles and based on roles decide that the admin roles should be shown for instance 
}

function loadAdminPage(){

}

function loadTranslationPage(){

}

function loadFillBlankPage(){

}

main();
