require([
  "esri/WebMap",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/layers/GraphicsLayer",
  "esri/Graphic"
], function (WebMap, MapView, FeatureLayer, GraphicsLayer, Graphic) {
  
  const map = new WebMap({
    portalItem: {
      id: "360827c4ab4f4aad85b771bd453a7254"
    }
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [2277430.5171051705, 2076536.5900727776],
    zoom: 4,
    constraints: {
      maxZoom: 4,
      minZoom: 4
    }
  });
  view.ui.remove(["zoom"]);

  map.when(() => {
    const arcticExtentLayer = map.layers.items[2];
    arcticExtentLayer.visible = false;
    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    arcticExtentLayer.queryFeatures().then((results) => {
      const features = results.features.map((feature) => {
        return new Graphic({
          geometry: feature.geometry,
          attributes: feature.attributes,
          symbol: {
            type: "simple-fill",
            color: [203, 242, 242, 0.3],
            outline: { color: [133, 242, 242], width: 1 }
          }
        });
      });

      let index = 0;
      let previousYear = null;
      function displayFeature() {
        graphicsLayer.removeAll();
        const currentFeature = features[index];
        graphicsLayer.add(currentFeature);

        // Récupérez les informations de date et mettez à jour l'affichage
        const month = currentFeature.attributes["Rec_Month"];
        const year = currentFeature.attributes["Rec_Year"];
        dateDisplay.innerHTML = `${month}/${year}`;
        if (year % 2 === 0) {
          dateDisplay.style.color = "rgb(108, 166, 166)"; // Années paires en bleu foncé
        } else {
          dateDisplay.style.color = "rgb(150, 212, 212)"; // Années impaires en bleu clair
        }

        index = (index + 1) % features.length;
      }

      setInterval(displayFeature, 100); // Mise à jour toutes les 100 ms
    });
    view.watch("updating", function () {
      loader.style.display = "none";
    });
    const modal = document.getElementById("modal");
    about?.addEventListener("click", function () {
      modal.open = true;
    });
  });
});
