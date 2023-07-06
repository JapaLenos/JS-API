require([
  "esri/Map",
  "esri/Basemap",
  "esri/views/SceneView",
  "esri/layers/GeoJSONLayer",
  "esri/popup/content/TextContent",
  "esri/popup/content/MediaContent",
  "esri/popup/content/ImageMediaInfo",
  "esri/popup/content/support/ImageMediaInfoValue",
  "esri/widgets/Bookmarks",
  "esri/webmap/Bookmark",
  "esri/widgets/Zoom",
  "esri/rest/support/Query"
], (
  Map,
  Basemap,
  SceneView,
  GeoJSONLayer,
  TextContent,
  MediaContent,
  ImageMediaInfo,
  ImageMediaInfoValue,
  Bookmarks,
  Bookmark,
  Zoom,
  Query
) => {
  const map = new Map({
    basemap: new Basemap({
      portalItem: {
        id: "0560e29930dc4d5ebeb58c635c0909c9", // References the 3D Topographic Basemap
      },
    }),
  });

  const view = new SceneView({
    container: "viewDiv",
    map: map,
    
    camera: {
      position: {
        longitude: 2.340861136194503,
        latitude: 48.88276594605576,
        z: 178.8139155479148,
      },
      heading: 29.620133897254565,
      tilt: 65.59724234196116,
    },
    popup: {
      //épinglera automatiquement les fenêtres contextuelles en bas à droite
      dockEnabled: true,
      dockOptions: {
        position: "bottom-right",
        breakpoint: false,
        buttonEnabled: false,
      },
    },
    highlightOptions: { //style des entités sélectionnées
        color: [251, 214, 230],
        fillOpacity: 0.5,
        haloColor: [251, 214, 230],
        haloOpacity: 0.5,
    },
    constraints : {
        altitude : {
            max : 1500,
            min : 50
        }
    }
  });


  view.when(() => {
    ///////Symbologie

    // convenience function to retrieve the WebStyleSymbols based on their name
    function getTreeSymbol(name) {
      return {
        type: "web-style", // autocasts as new WebStyleSymbol()
        name: name,
        styleName: "EsriLowPolyVegetationStyle",
      };
    }

    const treeRenderer = {
      type: "unique-value", // autocasts as new UniqueValueRenderer()
      field: "arbres_libellefrancais",
      defaultSymbol: getTreeSymbol("Chilopsis"),
      uniqueValueInfos: [
        {
          value: "Aulne",
          symbol: getTreeSymbol("Frangula"),
        },
        {
          value: "Bouleau",
          symbol: getTreeSymbol("Betula"),
        },
        {
          value: "Cèdre",
          symbol: getTreeSymbol("Calocedrus"),
        },
        {
          value: "Chêne",
          symbol: getTreeSymbol("Quercus Rubra"),
        },
        {
          value: "Cyprès Chauve",
          symbol: getTreeSymbol("Taxodium"),
        },
        {
          value: "Erable",
          symbol: getTreeSymbol("Acer"),
        },
        {
          value: "Hêtre",
          symbol: getTreeSymbol("Fagus"),
        },
        {
          value: "Magnolia",
          symbol: getTreeSymbol("Magnolia"),
        },
        {
          value: "Marronnier",
          symbol: getTreeSymbol("Castanea"),
        },
        {
          value: "Noisetier de Byzance",
          symbol: getTreeSymbol("Hamamelis"),
        },
        {
          value: "Noyer",
          symbol: getTreeSymbol("Juglans"),
        },
        {
          value: "Oranger des Osages",
          symbol: getTreeSymbol("Citrus"),
        },
        {
          value: "Orme",
          symbol: getTreeSymbol("Ulmus"),
        },
        {
          value: "Orme de Sibérie",
          symbol: getTreeSymbol("Ulmus"),
        },
        {
          value: "Platane",
          symbol: getTreeSymbol("Platanus"),
        },
        {
          value: "Pin",
          symbol: getTreeSymbol("Pinus"),
        },
        {
          value: "Saule",
          symbol: getTreeSymbol("Salix"),
        },
        {
          value: "Sequoia",
          symbol: getTreeSymbol("Sequoiadendron"),
        },
        {
          value: "Tilleul",
          symbol: getTreeSymbol("Tilia"),
        },
      ],
      visualVariables: [
        {
          type: "size",
          field: "arbres_hauteurenm",
          axis: "height",
          valueUnit: "meters",
        },
      ],
    };

    /////Création d'une couche à partir du JSON
    const arbresRemarquables = new GeoJSONLayer({
      url: "/app/arbresremarquablesparis.geojson",
      //screenSizePerspectiveEnabled: false,
      renderer: treeRenderer,
      elevationInfo: {
        mode: "on-the-ground",
      },
    });
    //Ajout d'une couche à la carte
    map.add(arbresRemarquables);

    /////Popups

    const textElement1 = new TextContent();
    textElement1.text =
      "Cet arbre remarquable est un <b>{com_nom_usuel}</b> (nom vernaculaire) ou <b>{com_nom_latin}</b> (nom latin). Il appartient à l'espèce <b>{arbres_espece}</b> du genre <b>{arbres_genre}</b> et mesure <b>{arbres_hauteurenm} mètres </b> pour une circonférence de <b>{arbres_circonferenceencm} centimètres.</b> </br> Date de plantation : {com_annee_plantation}";

    const textElement2 = new TextContent();
    textElement2.text = "{com_descriptif}";

    // Create the ImageMediaInfoValue
    let imageMediaInfoValue = new ImageMediaInfoValue({
      sourceURL: "{com_url_photo1}",
    });

    // Create the ImageMediaInfo
    let imageElement = new ImageMediaInfo({
      caption: "{com_resume}",
      value: imageMediaInfoValue,
    });

    // Create the MediaContent
    let mediaElement = new MediaContent({
      mediaInfos: [imageElement],
    });

    arbresRemarquables.popupTemplate = {
      title: "{com_nom_usuel} / {com_nom_latin}",
      content: [textElement1, mediaElement, textElement2],
    };

    //////Labels

    let labelClass = {
      // autocasts as new LabelClass()
      symbol: {
        type: "label-3d", // autocasts as new TextSymbol()
        symbolLayers: [
          {
            type: "text", // autocasts as new TextSymbol3DLayer()
            material: { color: "#7B656F" },
            halo: { color: "#FFF", size: "1px" },
            size: 12, // Defined in points
            font: {
              // autocast as new Font()
              family: "Playfair Display",
              style: "italic",
              weight: "bold",
              size: 12,
            },
          },
        ],
        verticalOffset: {
          screenLength: "25px",
        },
        callout: {
          type: "line", // autocasts as new LineCallout3D()
          size: 0.2,
          color: "#7B656F",
          /*                border: {
                    color: "#FDF6F0"
                }*/
        },
      },
      //labelPlacement: "above-right",
      labelExpressionInfo: {
        expression: "$feature.com_nom_usuel",
      },
    };
    // Add labels to the feature layer
    arbresRemarquables.labelsVisible = true;
    arbresRemarquables.labelingInfo = [labelClass];

    /////Géosignets (bookmarks)
      
    
    //Paramétrage des bookmarks
    const bookmarks = new Bookmarks({
      view: view,
      icon: "heart",
      container: document.createElement("div"),
      bookmarks: [
        // array of bookmarks defined manually
        new Bookmark({
          name: "Montmartre",
          icon: "mask-outside",
          viewpoint: {
            camera: {
              position: {
                longitude: 2.340861136194503,
                latitude: 48.88276594605576,
                z: 178.8139155479148,
              },
              heading: 29.620133897254565,
              tilt: 65.59724234196116,
            },
          },
        }),
        new Bookmark({
          name: "Bois de Boulogne",
          viewpoint: {
            camera: {
              position: {
                longitude: 2.2321180102165576,
                latitude: 48.86061846868905,
                z: 263.4042479386553,
              },
              heading: 57.84309619643786,
              tilt: 72.15443981366577,
            },
          },
        }),
        new Bookmark({
          name: "Trocadéro et Tour Eiffel",
          viewpoint: {
            camera: {
              position: {
                longitude: 2.292790675917738,
                latitude: 48.84796326886384,
                z: 450.4147386122495,
              },
              heading: 355.6069497207025,
              tilt: 73.39124532085117,
            },
          },
        }),
      ],
    });
      
      
    // imprime les paramètres de camera dans la console, utile pour paramétrer les bookmarks
/*    let btn = document.getElementById("btn");

    btn.addEventListener("click", (ev) => {
      console.log("parametres camera :", view.viewpoint.camera);
    });*/

    //ajoute les bookmarks à l'ui
    view.ui.add(bookmarks, {
      position: "top-right",
    });

    //////Permet à l'utilisateur de choisir s'il affiche tous les arbres ou non

    let treeLayer = map.basemap.referenceLayers.find(function (layer) {
      return layer.id === "1872932aeb4-layer-48";
    });
    treeLayer.visible = false;
    
      const changeVisibility = () => {
            treeLayer.visible = !treeLayer.visible;
        };
      
      document.querySelector("calcite-switch").addEventListener("calciteSwitchChange", changeVisibility);
      

      //////Fin du loader quand chargement complet
      view.watch("updating", function () {
        loader.style.display = "none";
      });
      
  });
});
