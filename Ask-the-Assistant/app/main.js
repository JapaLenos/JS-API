window.esriConfig = {
  locale: "fr"
};

window.addEventListener("DOMContentLoaded", () => {
const assistant = document.querySelector("arcgis-assistant");
const btn_r0 = document.getElementById("btn_r0");

assistant.heading = "Accidents corporels de 2006 à 2021"; 
assistant.description =
  "Explorez le jeu de données des accidents corporels de la circulation routière dans les Hauts-de-Seine";
assistant.suggestedPrompts = [
  "Filtre uniquement les accidents mortels",
  "Quel type de route est le plus accidentogène ?",
  "Combien d'accidents ont eu lieu dans un rayon de 100m autour du 2 Place Marcel Sembat ?"
];
assistant.logEnabled = true;
assistant.copyEnabled = true;

assistant.addEventListener("arcgisReady", () => {
  btn_r0.addEventListener("click", async () => {
    await assistant.submitMessage("Réinitialise tous les filtres s'il y en a et rezoome à l'étendue initiale");
    await assistant.clearChatHistory();
  });
});
});