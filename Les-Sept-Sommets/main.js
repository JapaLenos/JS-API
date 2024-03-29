        require(["esri/config", "esri/Map", "esri/views/SceneView", "esri/layers/ElevationLayer", "esri/layers/MediaLayer", "esri/layers/GraphicsLayer", "esri/Ground", "esri/layers/support/ImageElement", "esri/layers/support/ExtentAndRotationGeoreference", "esri/geometry/Extent","esri/Basemap", "esri/layers/TileLayer", "esri/core/reactiveUtils", "esri/Graphic","esri/layers/FeatureLayer", "esri/popup/content/AttachmentsContent", "esri/popup/content/TextContent", "esri/renderers/SimpleRenderer", "esri/symbols/IconSymbol3DLayer", "esri/symbols/PointSymbol3D", "esri/layers/support/LabelClass", "esri/symbols/LabelSymbol3D", "esri/symbols/TextSymbol3DLayer"], 

        function(esriConfig, Map, SceneView, ElevationLayer, MediaLayer, GraphicsLayer, Ground, ImageElement, ExtentAndRotationGeoreference, Extent, Basemap, TileLayer, reactiveUtils, Graphic, FeatureLayer, AttachmentsContent, TextContent, SimpleRenderer,IconSymbol3DLayer, PointSymbol3D,LabelClass,LabelSymbol3D, TextSymbol3DLayer){
            
            
    ///////////////////////////////////CARTE ET VUE
            
    //création de la carte "map"    
    const map = new Map({ 
        basemap : new Basemap({ //création de la basemap pour la carte "map"
            baseLayers: [
                new TileLayer({
                    url:"https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer", 
                    opacity: 0.7
                }),
                new TileLayer({
                    url: "https://tiles.arcgis.com/tiles/C8EMgrsFcRFL6LrL/arcgis/rest/services/GEBCO_basemap_NCEI/MapServer",
                    blendMode: "multiply"
                }),
            ]
        }),
        qualityProfile: "high"
    });
    
    //création de la vue 3D (scene)
    const view = new SceneView({ 
        container: "viewDiv", // référence à la balise qui contiendra la vue
        map: map, //appel de la carte "map" à l'intérieur de la vue
        scale: 50000000, // initialisation de la vue à l'échelle 1:50,000,000
        center: [40, 21.78], //lon, lat du point central de la vue initiale
        popup: { //préconfiguration des popups pour qu'elles soient ancrées en bas à droites
            defaultPopupTemplateEnabled: false,
            dockEnabled: true,
            dockOptions: {
              buttonEnabled: false,
              breakpoint: false,
              position : "bottom-right"
            }
          },
        highlightOptions: {
            haloOpacity: 0,
            fillOpacity: 0
        }
    });
        
                
    ///////////////////////////////////COUCHES
            
    //référencement de la couche d'élévation (cette couche possède une exagération verticale x3.5 pour accentuer les points culminants)       
    const elevLyr = new ElevationLayer({ 
    url: "https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/GEBCO_2021_3pt5x/ImageServer" 
    });
    map.ground.layers.add(elevLyr); //ajout de la couche d'élévation à la carte
    
    //création d'un Media Layer (disponible depuis v4.24) pour contenir les nuages        
    const cloudsLayer = new MediaLayer({ 
        source: [new ImageElement({
            image: "https://raw.githubusercontent.com/JapaLenos/JS-API/main/Les-Sept-Sommets/assets/clouds-nasa.png", //l'image de nuages est hébergée sur mon github
            georeference: new ExtentAndRotationGeoreference({
                extent: new Extent({
                    spatialReference: {
                        wkid: 4326
                    },
                    xmin: -180,
                    xmax: 180,
                    ymin: -80,
                    ymax: 80
                }),
            rotation: 0
            })
        })],
    });
    map.add(cloudsLayer); //ajout des nuages
            
    //configuration des Popups pour la couche de sommets

    const textElement1 = new TextContent();
    textElement1.text = "<b>Continent:</b> {Continent}"
            
    const textElement2 = new TextContent();
    textElement2.text = "<b>Année de première ascension:</b> {Annee}"
    
    const textElement3 = new TextContent();
    textElement3.text = "{Description}"
        
            
    const popup = {
        "title": "<b>{Nom}</b>, {Altitude} mètres d'altitude",
        "content": [textElement1,textElement2,textElement3],
    } 
    
    //Configuration de la symbologie pour la couche de sommets
    const symbo = new SimpleRenderer({
        symbol: new PointSymbol3D({
            symbolLayers: [new IconSymbol3DLayer({
                resource: { href: "https://raw.githubusercontent.com/JapaLenos/JS-API/5e6ba74a44fa14ed5eaccf7e0acc7d3a0c09e06a/Les-Sept-Sommets/assets/icon.svg" }, 
                size: 40
            })]
        })
    })
    
    //Configuration des labels pour la couche de sommets
    
    //référencement du Feature Layer contenant les sommets
    const sommets = new FeatureLayer({
        url: "https://services.arcgis.com/d3voDfTFbHOCRwVR/arcgis/rest/services/SeptSommets/FeatureServer/1", // la couche est hébergée en partage public sur ArcGIS Online
        outFields: ["Nom","Altitude","Continent","Description","Annee"],
        popupTemplate: popup, //référence aux popups créées plus haut
        renderer: symbo, //référence à la symbologie créée plus haut
        labelingInfo: [ //configuration des labels
            new LabelClass({
                labelExpressionInfo: { expression: "$feature.Nom" },
                labelPlacement: "center-right",
                symbol: new LabelSymbol3D({
                    symbolLayers: [new TextSymbol3DLayer({
                        material: {
                            color: [250, 250, 250] //couleur du texte des labels (ici blanc)
                         },
                        background: { color: [40,36,36] }, //couleur du fond des labels (ici noir)
                        font: { //police des labels
                            size: 12,
                            family: `"Avenir Next", "Avenir", "Helvetica Neue", sans-serif`,
                            weight: "bolder"
                        }
                    })]
                })
            })
        ]
    });
    map.add(sommets); //ajout de la couche de sommets à la carte            
            
    ///////////////////////////////////FONCTIONS COSMETIQUES
    
    //Fait tourner la planète tant que l'utilisateur n'interagit pas avec l'app        
    function rotate() { 
        if (!view.interacting) {
          const camera = view.camera.clone(); //crée un clone "camera" de la caméra actuelle
          camera.position.longitude -= 0.25; //enlève 0.25 degrés de longitudes au clone de la caméra (mettre un signe + pour que la planète tourne dans le sens inverse à son sens de révolution)
          view.goTo(camera, { animate: true }); //centre la vue sur le clone de la caméra, càd l'ancienne postition -0.25 degrés de longitude (ce qui donne donc l'impression que la planète bouge de 0,25° de lontitude)
          requestAnimationFrame(rotate); //indique que l'on souhaite exécuter une animation et utilise rotate en fonction de rappel, qui sera appelée avant le rafraîchissement du navigateur (la fonction va donc boucler)
        }
      }       
     reactiveUtils.when( //permet d'appeler la fonction rotate tant que la vue n'est pas mise à jour, ici tant que l'utilisateur n'interagit pas avec l'app
        ()=>!view.updating,
        ()=>{
         rotate();
         },
         {
         once : true //à supprimer pour que la planète reprenne sa rotation après interaction
        });
        
            
            
    //Rend les nuages transparents au zoom
    reactiveUtils.when(
        () => Math.floor(view.zoom), 
        (value) => {
            if (value) {
            cloudsLayer.opacity = 0.02 * Math.pow(value - 10, 2);
            }
      });    
            
            
    //retrait des widgets présents par défaut pour épurer l'ui        
    view.ui.remove("navigation-toggle");  
    view.ui.remove("zoom");
    view.ui.remove("compass"); 
            
});
