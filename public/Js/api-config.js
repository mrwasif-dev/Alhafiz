/* =====================================================================
   API CONFIG
   Since this site and its API are deployed together as ONE Heroku app
   (see server.js at the project root), the API lives at the same
   address as the website itself — so the default "/api" below works
   automatically once you deploy to Heroku. No editing needed.

   Only change this if you ever host the website and the API
   separately (e.g. website on one host, API on another).
   ===================================================================== */

window.API_BASE = "/api";
window.apiReady = function(){
  return !!window.API_BASE;
};
