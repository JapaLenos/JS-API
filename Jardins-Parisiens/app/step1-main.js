require(["esri/Map", "esri/Basemap", "esri/views/SceneView"], (
  Map,
  Basemap,
  SceneView
) => {
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
});
