require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/layers/FeatureLayer"
], function (
  Map,
  SceneView,
  FeatureLayer
) {
  const elevLayer = new FeatureLayer({
    url:
      "https://services.arcgis.com/d3voDfTFbHOCRwVR/arcgis/rest/services/Altitudes_hexagones_WFL1/FeatureServer/1",
    outFields: ["*"],
    elevationInfo: {
      mode: "relative-to-ground"
    }
  });

  elevLayer.popupTemplate = {
    title: "<b>Altitude moyenne :",
    content: "{Altitude_moyenne} mètres"
  };

  elevLayer.renderer = {
    type: "simple", 
    symbol: {
      type: "polygon-3d",
      symbolLayers: [
        {
          type: "extrude" 
        }
      ]
    },

    visualVariables: [
      {
        type: "color",
        field: "Altitude_moyenne", 
        stops: [
          { value: -12, color: "#A1B696" },
          { value: 500, color: "#FCD170" },
          { value: 1000, color: "#647F2F" },
          { value: 1500, color: "#60562D" },
          { value: 2000, color: "#815F5B" },
          { value: 2500, color: "#DBCDCB" }
        ]
      },
      {
        type: "size",
        field: "Altitude_moyenne", 
        stops: [
          { value: 0, size: 1 },
          { value: 3300, size: 100000 }
        ],
        axis: "height"
      }
    ]
  };

  var map = new Map({
    layers: [elevLayer],
    ground: {
      navigationConstraint: {
        type: "stay-above"
      },
      opacity: 0
    }
  });

  let fraExtent = {
    xmax: 1091178,
    xmin: -714403,
    ymax: 6720023,
    ymin: 5030349,
    spatialReference: {
      wikd: 3857
    }
  };

  var view = new SceneView({
    container: "viewDiv",
    map: map,
    camera: {
      heading: 10, 
      tilt: 50,
      position: {
        latitude: 30.5,
        longitude: -1,
        z: 2000000,
        spatialReference: { wkid: 3857 }
      }
    },
    viewingMode: "local",
    environment: {
      background: {
        type: "color",
        color: "#212526"
      },
      atmosphereEnabled: false,
      starsEnabled: false
    }
  });
  view.ui.remove([ "compass", "zoom","navigation-toggle"]);

  view.watch("updating", function () {
    loader.style.display = "none";
  });
});
