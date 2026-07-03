import esriRequest from "https://js.arcgis.com/5.1/@arcgis/core/request.js";
import WebMap from "https://js.arcgis.com/5.1/@arcgis/core/WebMap.js";
import MapView from "https://js.arcgis.com/5.1/@arcgis/core/views/MapView.js";
import GeoJSONLayer from "https://js.arcgis.com/5.1/@arcgis/core/layers/GeoJSONLayer.js";
import LabelClass from "https://js.arcgis.com/5.1/@arcgis/core/layers/support/LabelClass.js";
import Legend from "https://js.arcgis.com/5.1/@arcgis/core/widgets/Legend.js";
import Print from "https://js.arcgis.com/5.1/@arcgis/core/widgets/Print.js";
import Expand from "https://js.arcgis.com/5.1/@arcgis/core/widgets/Expand.js";
import Portal from "https://js.arcgis.com/5.1/@arcgis/core/portal/Portal.js";
import esriId from "https://js.arcgis.com/5.1/@arcgis/core/identity/IdentityManager.js";
import OAuthInfo from "https://js.arcgis.com/5.1/@arcgis/core/identity/OAuthInfo.js";

// --- OAuth : flux par redirection (pas de popup) ---
const info = new OAuthInfo({
  appId: "TkSM22amWLiFhkqf",
  portalUrl: "https://esrifrance.maps.arcgis.com", // pas de slash final
  popup: false // redirection classique, plus fiable
});
esriId.registerOAuthInfos([info]);
console.log(esriId.credentials);
// Force la connexion. Si pas encore connecté, le navigateur redirige vers
// la page de login ArcGIS puis revient automatiquement sur cette même page.
await esriId.getCredential(info.portalUrl + "/sharing");

// --- Construction de la carte (identique à avant) ---
const response = await esriRequest(
  "https://raw.githubusercontent.com/JapaLenos/JS-API/refs/heads/main/from-json/reaseau-transport-lyon.json",
  { responseType: "json" }
);

const webmap = WebMap.fromJSON(response.data);
await webmap.load();

const view = new MapView({
  container: "viewDiv",
  map: webmap
});

await view.when();

const gares = new GeoJSONLayer({
  url: "https://raw.githubusercontent.com/JapaLenos/JS-API/refs/heads/main/from-json/gares-ferroviaires-lyon-frequentation.geojson",
  title: "Gares ferroviaires (fréquentation annuelle)",
  copyright: "Métropole de Lyon"
});

gares.renderer = {
  type: "simple",
  symbol: {
    type: "simple-marker",
    color: "rgba(235, 133, 49,0.3)",
    outline: { color: "#eb8531", width: 1 }
  },
  visualVariables: [
    {
      type: "size",
      field: "frequentation",
      stops: [
        { value: 1000, size: 4 },
        { value: 100000, size: 9 },
        { value: 1000000, size: 14 },
        { value: 10000000, size: 22 },
        { value: 42000000, size: 34 }
      ]
    }
  ]
};

const labels = new LabelClass({
  labelExpressionInfo: { expression: "$feature.nom" },
  minScale: 50000,
  symbol: { type: "text", color: "black", haloSize: 1, haloColor: "white" }
});
gares.labelingInfo = [labels];
webmap.add(gares);

const legend = new Legend({ view });
const legendExpand = new Expand({ expandIcon: "legend", view, content: legend });
view.ui.add(legendExpand, "top-left");

// --- Print avec templates custom de l'org ---
const portal = new Portal({ url: info.portalUrl, authMode: "immediate" });
await portal.load();

const print = new Print({
  view: view,
  portal: portal
});
const printExpand = new Expand({ expandIcon: "print", view, content: print });
view.ui.add(printExpand, "top-left");
