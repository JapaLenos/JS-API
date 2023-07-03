require([
        "esri/Map",
        "esri/Basemap",
        "esri/views/SceneView",
        "esri/layers/GeoJSONLayer",
          
      ], 
        
        (Map, Basemap, SceneView ,GeoJSONLayer) => {
          
          
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
          } 
        });
          
        view.when(() => {
            
            
        //Modification de la symbologie
            
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
            
            const arbresRemarquables = new GeoJSONLayer({
                url: "/app/arbresremarquablesparis.geojson",
                //screenSizePerspectiveEnabled: false,
                renderer: treeRenderer,
                elevationInfo: {
                    mode: "on-the-ground"
                }
            });
            

            
            map.add(arbresRemarquables);
            
        //rendre les autres arbres invisibles :
        let treeLayer = map.basemap.referenceLayers.find(function(layer){
            return layer.id === "1872932aeb4-layer-48";
        });
        treeLayer.visible = false ;
        
            
        });
});