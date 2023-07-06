require([
        "esri/Map",
        "esri/Basemap",
        "esri/views/SceneView",
        "esri/layers/GeoJSONLayer",
        "esri/popup/content/TextContent",
        "esri/popup/content/MediaContent",
        "esri/popup/content/ImageMediaInfo",
        "esri/popup/content/support/ImageMediaInfoValue"
          
      ], 
        
        (Map, Basemap, SceneView ,GeoJSONLayer,TextContent,MediaContent,ImageMediaInfo,ImageMediaInfoValue) => {
          
          
        const map = new Map({
          basemap: new Basemap({
            portalItem: {
              id: "0560e29930dc4d5ebeb58c635c0909c9" // References the 3D Topographic Basemap
            }
          })
        });
        
          const view = new SceneView({
          container: "viewDiv",
          map: map,
          camera: {
            position: {
              longitude: 2.3122219,
              latitude: 48.846614,
              z: 1620.71497
            },
            heading: 80,
            tilt: 50
          },
          popup: { //épinglera automatiquement les fenêtres contextuelles en bas à droite
            dockEnabled: true,
            dockOptions: {
              position: "bottom-right",
              breakpoint: false,
              buttonEnabled: true
            },
          }
        });
          
        view.when(() => {
            
        ///////Modification de la symbologie
            
        // convenience function to retrieve the WebStyleSymbols based on their name
        function getTreeSymbol(name) {
          return {
            type: "web-style", // autocasts as new WebStyleSymbol()
            name: name,
            styleName: "EsriLowPolyVegetationStyle"
          };
        }
            
        const treeRenderer = {
          type: "unique-value", // autocasts as new UniqueValueRenderer()
          field: "arbres_libellefrancais",
          defaultSymbol: getTreeSymbol("Chilopsis"),
          uniqueValueInfos: [
            {
              value: "Aulne",
              symbol: getTreeSymbol("Frangula")
            },
            {
              value: "Bouleau",
              symbol: getTreeSymbol("Betula")
            },
            {
              value: "Cèdre",
              symbol: getTreeSymbol("Calocedrus")
            },
            {
              value: "Chêne",
              symbol: getTreeSymbol("Quercus Rubra")
            },
            {
              value: "Cyprès Chauve",
              symbol: getTreeSymbol("Taxodium")
            },
            {
              value: "Erable",
              symbol: getTreeSymbol("Acer")
            },
            {
              value: "Hêtre",
              symbol: getTreeSymbol("Fagus")
            },
            {
              value: "Magnolia",
              symbol: getTreeSymbol("Magnolia")
            },
            {
              value: "Marronnier",
              symbol: getTreeSymbol("Castanea")
            },
            {
              value: "Noisetier de Byzance",
              symbol: getTreeSymbol("Hamamelis")
            },
            {
              value: "Noyer",
              symbol: getTreeSymbol("Juglans")
            },
            {
              value: "Oranger des Osages",
              symbol: getTreeSymbol("Citrus")
            },
            {
              value: "Orme",
              symbol: getTreeSymbol("Ulmus")
            },
            {
              value: "Orme de Sibérie",
              symbol: getTreeSymbol("Ulmus")
            },
            {
              value: "Platane",
              symbol: getTreeSymbol("Platanus")
            },
            {
              value: "Pin",
              symbol: getTreeSymbol("Pinus")
            },
            {
              value: "Saule",
              symbol: getTreeSymbol("Salix")
            },
            {
              value: "Sequoia",
              symbol: getTreeSymbol("Sequoiadendron")
            },
            {
              value: "Tilleul",
              symbol: getTreeSymbol("Tilia")
            },
          ],
          visualVariables: [
            {
              type: "size",
              field: "arbres_hauteurenm",
              axis: "height",
              valueUnit : "meters"
            }
          ]
        };
            
            /////Création d'une couche à partir du JSON
            const arbresRemarquables = new GeoJSONLayer({
                url: "/app/arbresremarquablesparis.geojson",
                //screenSizePerspectiveEnabled: false,
                renderer: treeRenderer,
                elevationInfo: {
                    mode: "on-the-ground"
                }
            });
            //Ajout d'une couche à la carte
            map.add(arbresRemarquables);
            
            
        /////Création des popups
            
        const textElement1 = new TextContent();
        textElement1.text = "Cet arbre remarquable est un <b>{com_nom_usuel}</b> (nom vernaculaire) ou <b>{com_nom_latin}</b> (nom latin). Il appartient à l'espèce <b>{arbres_espece}</b> du genre <b>{arbres_genre}</b> et mesure <b>{arbres_hauteurenm} mètres </b> pour une circonférence de <b>{arbres_circonferenceencm} centimètres.</b> </br> Date de plantation : {com_annee_plantation}"  
        
        const textElement2 = new TextContent();
        textElement2.text = "{com_descriptif}" 
            
            
        // Create the ImageMediaInfoValue
        let imageMediaInfoValue = new ImageMediaInfoValue({
                sourceURL: "{com_url_photo1}"
            });

        // Create the ImageMediaInfo
        let imageElement = new ImageMediaInfo({
            caption: "{com_resume}",
            value: imageMediaInfoValue
        });

        // Create the MediaContent
        let mediaElement = new MediaContent({
            mediaInfos: [ imageElement ]
        });

            
        arbresRemarquables.popupTemplate = {
        title: "{com_nom_usuel} / {com_nom_latin}",    
        content : [textElement1,mediaElement, textElement2]
        };   
            
            
        //////Rendre les autres arbres invisibles
        let treeLayer = map.basemap.referenceLayers.find(function(layer){
            return layer.id === "1872932aeb4-layer-48";
        });
        treeLayer.visible = false ;
            
        
            
        });
});