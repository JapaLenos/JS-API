require([
  "esri/WebMap",
  "esri/views/SceneView",
  "esri/layers/FeatureLayer",
  "esri/renderers/SimpleRenderer",
  "esri/symbols/PointSymbol3D",
  "esri/symbols/IconSymbol3DLayer",
  "esri/layers/support/LabelClass",
  "esri/symbols/LabelSymbol3D",
  "esri/symbols/TextSymbol3DLayer"
], function (WebMap, SceneView, FeatureLayer, SimpleRenderer,PointSymbol3D,IconSymbol3DLayer,LabelClass,LabelSymbol3D,TextSymbol3DLayer) {
  const map = new WebMap({
    portalItem: {
      id: "ecab473029a94c9f90904997dd7836d0"
    }
  });

  const view = new SceneView({
    container: "viewDiv",
    map: map,
    camera: {
      position: {
        longitude: 2.219092028824691,
        latitude: 48.78941188838513,
        z: 2771.364869683981
      },
      heading: 17.062531917143495,
      tilt: 60.592038831044185
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
  view.ui.remove(["compass", "zoom", "navigation-toggle"]);

  map.when(() => {
    const isohypses = map.layers.items[1];
            isohypses.elevationInfo = {
            mode: "relative-to-ground",
            featureExpressionInfo: {
                expression: "$feature.Contour"
            }
        },
    isohypses.renderer = new SimpleRenderer({
            symbol: {
                type: "line-3d",
                symbolLayers: [{
                        type: "line",
                        size: 1
                    }]
            },
            visualVariables: [{
                    type: "color",
                    field: "Contour",
                    stops: [{
                            value: 25,
                            color: "#7A0177"
                        }, {
                            value: 200,
                            color: "#F768A1"
                        }, {
                            value: 400,
                            color: "#FDE0DD"
                        }]
                }]
        })
  
    const photos = map.layers.items[2];
            photos.elevationInfo = {
            mode: "on-the-ground"
        },
        photos.renderer = new SimpleRenderer({
            symbol: new PointSymbol3D({
                symbolLayers: [new IconSymbol3DLayer({
                        resource: {
                            primitive: "circle"
                        },
                        material: {
                            color: "#DD3497"
                        },
                        size: 3
                    })]
            })
        })
    
    view.watch("updating", function () {
      loader.style.display = "none";
    });
    const modal = document.getElementById("modal");
    about?.addEventListener("click", function () {
      modal.open = true;
    });
  });
});
