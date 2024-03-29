    require(["esri/config", "esri/views/SceneView", "esri/WebScene", "esri/layers/FeatureLayer", "esri/core/reactiveUtils", "esri/Graphic", "esri/geometry/Point", "esri/geometry/Mesh", "esri/popup/content/TextContent","esri/rest/support/Query","esri/popup/content/AttachmentsContent"],
      function(esriConfig, SceneView, WebScene, FeatureLayer, reactiveUtils, Graphic, Point, Mesh, TextContent,Query,AttachmentsContent) {
        
        
        ///////////////////////////////////////////////////////////////////SCENE WEB///////////////////////////////////////////////////////////////////////////////////
        const scene = new WebScene({
          portalItem: { 
            id: "d3b84f82ac5e410b8c6f02f5f4d37248" // ID de la scène web sur arcgis.com
          }
        });
        
        //// Ajout des tables
        //L'ajout des tables à la scène nous permettra d'afficher les enregistrements associés dans les fenêtres contextuelles
        
        //Table des péripéties
        const textElementPeripeties = new TextContent();
        textElementPeripeties.text = "{Description}"
        const peripetiesTable = new FeatureLayer({
          url: "https://services.arcgis.com/d3voDfTFbHOCRwVR/ArcGIS/rest/services/CTM_22_TDM80J_Scene_WFL1/FeatureServer/5", //lien vers le service web
          title: "Péripéties",
          popupTemplate: { //fenêtre contextuelle
            title: "{Titre}",
            content: [textElementPeripeties]
          }
        });
        
        //Table des moyens de transport
        const textElementTransports = new TextContent();
        textElementTransports.text = "{Precisions}"
        const transportsTable = new FeatureLayer({
          url: "https://services.arcgis.com/d3voDfTFbHOCRwVR/ArcGIS/rest/services/CTM_22_TDM80J_Scene_WFL1/FeatureServer/4",
          title: "Moyens de transport",
          popupTemplate: {
            content: [textElementTransports]
          }
        });
        
        peripetiesTable.load().then(() => {
          scene.tables.addMany([peripetiesTable, transportsTable]); //ajout des tables à la scène
        });
        
        
        
        ///////////////////////////////////////////////////////////////////VUE///////////////////////////////////////////////////////////////////////////////////
        const view = new SceneView({
          map: scene, //scène web référencée plus tôt
          alphaCompositingEnabled: true,
          container: "viewDiv",
          scale: 52000000,
          center: [0, 40],
          highlightOptions: { //style des entités sélectionnées
            color: [207, 71, 48],
            haloColor: "white",
            haloOpacity: 0.3,
            fillOpacity: 1,
            shadowColor: "black",
            shadowOpacity: 0.5
          },
          environment: { //configuration de l'environnement (atmosphère, fond, étoiles)
            background: {
              type: "color",
              color: [245, 241, 235, 1]
            },
            starsEnabled: false,
            atmosphereEnabled: false,
            lighting: {
              type: "virtual" //l'éclairage virtuel suit toujours la caméra 
            }
          },
          popup: { //épinglera automatiquement les fenêtres contextuelles en haut à droite
            dockEnabled: true,
            dockOptions: {
              position: "top-right",
              breakpoint: false,
              buttonEnabled: false
            },
          }
        });
        
        
        
        ///////////////////////////////////////////////////////////////////COUCHES///////////////////////////////////////////////////////////////////////////////////
        scene.when(() => {
            
        ///////////////////////////////////////////////////////////////////ROUTE
          const removedRoute = scene.layers.getItemAt(0);
          
          scene.layers.remove(removedRoute)
            
          const route = new FeatureLayer({
            url: "https://services.arcgis.com/d3voDfTFbHOCRwVR/ArcGIS/rest/services/CTM_22_TDM80J_Scene_WFL1/FeatureServer/1",
            title: "Itinéraire de Phileas"
          });
          route.outFields = ["*"];  
          scene.add(route);

          route.renderer = { //symbologie
            type: "simple",
            symbol: {
              type: "line-3d", 
              symbolLayers: [{
                type: "line", 
                size: 2, 
                material: {
                  color: [207, 71, 48]
                },
                cap: "round",
                join: "round",
                pattern: { 
                  type: "style",
                  style: "dash"
                }
              }]
            }
          };
           
          const textElementRoutes = new TextContent();
          textElementRoutes.text = "L'<b>étape {OBJECTID}</b> a duré <b>{Duree}</b> jours. Les héros sont partis de <b>{Depart}</b> pour arriver à <b>{Arrivee}</b>"
          route.popupTemplate = { //Popups
            title: "{Titre}",
            outFields: ["*"],
            content: [textElementRoutes,
              {
                type: "relationship", //Enregistrements associés à l'itinéraire #1 (moyens de transort)
                relationshipId: 1, //ID de la relation que vous pouvez retrouver dans la définition du service
                description: "Durant cette étape, les héros ont emprunté ces moyens de transport :",
                displayCount: 3, //Nombre d'enregistrements associés à afficher
                title: "Moyens de transport",
                orderByFields: { //Tri dans l'ordre alphabétique
                  field: "Moyen_Transport",
                  order: "asc"
                }
              },
              {
                type: "relationship", //Enregistrements associés à l'itinéraire #2 (péripéties)
                relationshipId: 0,
                description: "Voici les péripéties rencontrées par Phileas et ses compagnons lors de l'étape {OBJECTID} :",
                displayCount: 5,
                title: "Péripéties",
                orderByFields: { //Tri par OBJECTID croissant
                  field: "OBJECTID",
                  order: "asc"
                }
              }
            ]
          };
            
            
        ///////////////////////////////////////////////////////////////////VILLES
        const villes = scene.layers.getItemAt(0);
        villes.outFields = ["*"];
        
        /////popup
        const attachmentsElement = new AttachmentsContent({
            displayType: "preview",
        });
            
        villes.popupTemplate = {
        title: "{Nom}",    
        content : [attachmentsElement]
        };   
           
        /////symbologie
        villes.elevationInfo.mode = "relative-to-ground"; 
                
        villes.renderer = {
            type: "simple",  // autocasts as new SimpleRenderer()
            symbol: {
                type: "point-3d",  // autocasts as new SimpleFillSymbol()
                symbolLayers: [{
                    type: "icon",  // autocasts as new IconSymbol3DLayer()
                    resource: {href : "https://raw.githubusercontent.com/JapaLenos/JS-API/main/Le-Tour-du-Monde-en-80-Jours/assets/pin.png"},
                    size : 25,
                    anchor: "relative",
                    anchorPosition: {
                        x: 0,
                        y: 0.4
                    }
                }]
            }
        };   
            
        ///////////////////////////////////////////////////////////////////ZOOM           
          /////zoom sur les villes à la séléction
          view.whenLayerView(villes).then((layerView) => {
            // enregistre un clic sur la vue
            view.on("click", (event) => {
              // utilise hitTest pour voir si l'utilisateur a cliqué sur un graphique
              view.hitTest(event).then((response) => {
                // vérifie si un graphique est retourné par le hitTest et vérifie que c'est un point (pour ne pas confondre les villes avec les itinéraires)
                if (response.results[0] && response.results[0].graphic && response.results[0].graphic.layer.geometryType=="point") {
                  //La requpete va renvoyer les résultats pour les entités dont l'objectID correspond à celui du graphique sélectionné
                  const query = new Query({
                    objectIds: [
                      response.results[0].graphic.attributes.OBJECTID
                    ],
                    // indique que la requête doit retourner tous les attributs
                    outFields: ["*"]
                  });
                  // queryExtent() retournera l'étendue 3D de l'entité sélectionnée
                  layerView.queryExtent(query).then((result) => {
                    view
                      .goTo( //goTo permet de se rendre à la nouvelle vue indiquée
                        {
                          target: result.extent.expand(2500000),
                          tilt: 10
                        },
                        {
                          duration: 5000,
                          easing: "out-expo"
                        }
                      )
                      .catch((error) => {
                        if (error.name != "AbortError") {
                          console.error(error);
                        }
                      });
                  });
                }
              });
            });
          });
                   
              
           /////zoom sur les tronçons d'itinéraire à la séléction 
           view.whenLayerView(route).then((sceneLayerView) => {
            // register a click event on the view
            view.on("click", (event) => {
              // use hitTest to find if any graphics were clicked
              view.hitTest(event).then((response) => {
                // check if a graphic is returned from the hitTest
                if (response.results[0] && response.results[0].graphic && response.results[0].graphic.layer.geometryType=="polyline") {
                  // Create query object: by specifying objectIds, the query will return results only for
                  // the feature matching the graphic's objectid
                  const query = new Query({
                    objectIds: [
                      response.results[0].graphic.attributes.OBJECTID
                    ],
                    // indicates the query should return all attributes
                    outFields: ["*"]
                  });

                  // queryExtent() will return the 3D extent of the feature that satisfies the query
                  sceneLayerView.queryExtent(query).then((result) => {
                    if (response.results[0].graphic.attributes.OBJECTID=="6") {
                    view
                      .goTo(
                        {
                          tilt: 10,
                          scale: 40000000,
                          center: [-160, 40],
                        },
                        {
                          duration: 2000,
                          easing: "out-expo"
                        }
                      )
                    }
                    else {
                    view
                      .goTo(
                        {
                          target: result.extent.expand(0),
                          tilt: 10,
                          scale: 40000000
                        },
                        {
                          duration: 5000,
                          easing: "out-expo"
                        }
                      )
                    }
                      view
                      .catch((error) => {
                        if (error.name != "AbortError") {
                          console.error(error);
                        }
                      });
                  });
                }
              });
            });
          });           
             
            
            
        });
            
     

        ///////////////////////////////////////////////////////////////////ESTHETIQUE///////////////////////////////////////////////////////////////////////////////////
        
        
        //retrait des widgets présents par défaut pour épurer l'ui        
        view.ui.remove("navigation-toggle");
        view.ui.remove("zoom");
        view.ui.remove("compass");
           

/*        /////////////////////////////////////////////rotation
                function rotate() { 
                    if (!view.interacting) {
                        const camera = view.camera.clone(); //crée un clone "camera" de la caméra actuelle
                        camera.position.longitude += 0.10; //enlève 0.25 degrés de longitudes au clone de la caméra (mettre un signe + pour que la planète tourne dans le sens inverse à son sens de révolution)
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
                });*/
        
        
        
      });
