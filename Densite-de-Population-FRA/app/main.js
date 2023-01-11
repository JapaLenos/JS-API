require([
        "esri/Map",
        "esri/views/SceneView",
        "esri/layers/FeatureLayer",
        "esri/widgets/Home"
      ], function (Map, SceneView, FeatureLayer, Home) {


        // The clipping extent for the scene
        const fraExtent = {
          // autocasts as new Extent()
          xmax: 1091178,
          xmin: -714403,
          ymax: 6720023,
          ymin: 5030349,
          spatialReference: {
            // autocasts as new SpatialReference()
            wkid: 3857
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
                        material: { color: [214, 157, 188, 0.4] },
                    }]
                }
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
              fraEmprise
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
              tilt: 40,
              position: {
                latitude: 31,
                longitude: 4,
                z: 2600000,
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
        // Set up a home button and add to the ui top-left
        const homeBtn = new Home({ view: view });
        view.ui.add(homeBtn, "top-left");
          

      });