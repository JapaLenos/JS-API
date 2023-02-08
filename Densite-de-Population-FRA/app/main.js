require([
        "esri/Map",
        "esri/views/SceneView",
        "esri/layers/FeatureLayer",
        "esri/widgets/Home",
    "esri/widgets/Daylight"
      ], function (Map, SceneView, FeatureLayer, Home,Daylight) {


        // The clipping extent for the scene
        const fraExtent = {
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


          const fraEmprise = new FeatureLayer({
            url: "https://services.arcgis.com/d3voDfTFbHOCRwVR/arcgis/rest/services/France/FeatureServer/0",
            outFields: ["*"],
            // This keeps the cylinders from poking above the ground
            elevationInfo: {
                mode: "relative-to-ground",
            }
           });
          
            fraEmprise.renderer = {
                type : "simple",
                symbol : {
                    type : "polygon-3d", // autocasts as new SimpleRenderer()
                    symbolLayers: [{
                        type: "fill",  // autocasts as new LineSymbol3DLayer()
                        material: { color: [214, 157, 188, 0] },//op = 0.4
                    }]
                }
            };
    
          const popLayer7km = new FeatureLayer({
            url: "https://services.arcgis.com/d3voDfTFbHOCRwVR/arcgis/rest/services/fraPopDens_7km/FeatureServer/5",
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
                    type: "polygon-3d", // autocasts as new PointSymbol3D()
                    symbolLayers: [
                        {
                        // renders points as volumetric objects
                        type: "extrude", // autocasts as new ObjectSymbol3DLayer()
                        }
                    ]
                },
                
                visualVariables: [
                    {
                    type: "color",
                    field: "SUM_population", // field containing data for atmospheric pressure
                    stops: [{value: 0,color: "#F7E9E9"},{value: 75000,color: "#E297B5"},{value: 380000,color: "#BB4B6C"},{value: 859431,color: "#16041F"}]
                    },
                    {
                    type: "size",
                    field: "SUM_population", // field containing data for wind speed
                    stops: [{ value: 0, size: 1 }, { value: 859431, size: 800000 }],
                    axis: "height"
                    },
                ]
            };
    


        /********************************************************************
         * Create a map with the above defined layers and a topographic
         * basemap. Setting the navigationConstraint on the ground to be of
         * type "none" will allow the user to navigate the view's camera
         * below the surface.
         ********************************************************************/
        const map = new Map({
          //basemap: "topo-vector",
          layers: [
              fraEmprise,
              popLayer7km//,popLayer5km,popLayer3km
          ],
          ground: {
            navigationConstraint: {
              type: "none"
            },
            opacity: 0
          }
        }); 

        /********************************************************************
         * Create a local scene in south central Kansas
         *
         * To create a local scene, you must set the viewingMode to "local".
         * To define a small, localized area for the view, set
         * the clippingArea property.
         ********************************************************************/
        const view = new SceneView({
          container: "viewDiv",
          map: map,
          camera : {
              heading: -5, // face due east
              tilt: 50,
              position: {
                latitude: 27.5,
                longitude: 5,
                z: 2300000,
                //spatialReference: { wkid: 3857 }
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

          

      });
