 require([
        "esri/Map",
        "esri/views/SceneView",
        "esri/layers/FeatureLayer",
        "esri/widgets/Home",
        "esri/layers/support/LabelClass",
      ], function (Map, SceneView, FeatureLayer, Home,Daylight,LabelClass,watchUtils) {

          const popLayer7km = new FeatureLayer({
            url: "https://services.arcgis.com/d3voDfTFbHOCRwVR/arcgis/rest/services/fraPopDens_7km/FeatureServer",
            outFields: ["*"],
            // This keeps the cylinders from poking above the ground
            elevationInfo: {
                mode: "relative-to-ground",
            }
           }); 
    
    
            popLayer7km.renderer = {
                type: "simple", // autocasts as new SimpleRenderer()
                symbol: {
                    // symbol type required for rendering point geometries
                    type: "polygon-3d", 
                    symbolLayers: [
                        {
                        // renders polygons as volumetric objects
                        type: "extrude", // autocasts as new ObjectSymbol3DLayer()
                        }
                    ]
                },

                visualVariables: [
                    {
                    type: "color",
                    field: "SUM_population", // field containing data sum of population 
                    stops: [{value: 0,color: "#F7E9E9"},{value: 75000,color: "#E297B5"},{value: 380000,color: "#BB4B6C"},{value: 859431,color: "#16041F"}]
                    },
                    {
                    type: "size",
                    field: "SUM_population", // field containing data sum of population
                    stops: [{ value: 0, size: 1 }, { value: 859431, size: 800000 }],
                    axis: "height"
                    },
                ]
            };
    

          let fraVilles10 = new FeatureLayer({
            url: "https://services.arcgis.com/d3voDfTFbHOCRwVR/ArcGIS/rest/services/villesFrance10/FeatureServer/3",
            outFields: ["*"],
            // This keeps the cylinders from poking above the ground
            elevationInfo: {
                mode: "relative-to-ground",
            },
            title: "FraPopDens_7km",
          });
    
        fraVilles10.renderer = {
            type: "simple",
            symbol: {
               type: "simple-marker",  // autocasts as new SimpleFillSymbol()
               color: [ 0, 0, 0, 0.0 ],
               outline: {  // autocasts as new SimpleLineSymbol()
                    width: "0px" 
                }
              }  
        };
    
    
        let labelClass = {  // autocasts as new LabelClass()
          symbol: {
            type: "label-3d",  // autocasts as new TextSymbol()
            symbolLayers: [{
                type: "text",  // autocasts as new TextSymbol3DLayer()
                material: { color: "#464647"},
                halo : {color : "#FDF6F0", size : "1px"},
                size: 12,  // Defined in points
                font: {  // autocast as new Font()
                    family: "Avenir Next",
                    size: 12,
                    weight: "normal"
                }
            }],
            verticalOffset: {
                screenLength: "125px",
            },
            callout: {
                type: "line", // autocasts as new LineCallout3D()
                size: 0.5,
                color: "#464647",
                border: {
                    color: "#464647"
                }
            }
          },
          //labelPlacement: "above-right",
          labelExpressionInfo: {
            expression: "$feature.Nom"
          },
        };
        // Add labels to the feature layer
        fraVilles10.labelsVisible = true;
        fraVilles10.labelingInfo = [labelClass];
    

        /********************************************************************
         * Create a map with the above defined layers. 
         * Setting the navigationConstraint on the ground to be of
         * type "none" will allow the user to navigate the view's camera
         * below the surface.
         ********************************************************************/
        var map = new Map({
          //basemap: "topo-vector",
          layers: [
              fraVilles10, popLayer7km
          ],
          ground: {
            navigationConstraint: {
              type: "none"
            },
            opacity: 0
          }
        }); 


        /********************************************************************
         * Create a local scene in France
         *
         * To create a local scene, you must set the viewingMode to "local".
         * To define a small, localized area for the view, set
         * the clippingArea property.
         ********************************************************************/
        // The clipping extent for the scene
        let fraExtent = {
          // autocasts as new Extent()
          xmax: 1091178,
          xmin: -714403,
          ymax: 6720023,
          ymin: 5030349,
          spatialReference: {
            // autocasts as new SpatialReference()
            wikd: 3857
          }
        };
     
        var view = new SceneView({
          container: "viewDiv",
          map: map,
          camera : {
              heading: -5, // face due east
              tilt: 50,
              position: {
                latitude: 27.5,
                longitude: 5,
                z: 2300000,
                spatialReference: { wkid: 3857 }
              }
          },
          // Indicates to create a local scene
          viewingMode: "local",
          // Use the exent defined in clippingArea to define the bounds of the scene
          clippingArea: fraExtent,
          extent: fraExtent,
          // Turns off atmosphere and stars settings
          environment: {
            background: {
              type: "color",
              color: "#FDF6F0"
            },
            atmosphereEnabled: false,
            starsEnabled: false
          },

        });

        let homeWidget = new Home({
            view: view
        });
        view.ui.add(homeWidget, "top-left");


          ///////////// Loader

      view.watch("updating", function () {
        loader.style.display = "none";
      });

      });
