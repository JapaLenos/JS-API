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
        longitude: 2.340861136194503,
        latitude: 48.88276594605576,
        z: 178.8139155479148
      },
      heading: 29.620133897254565,
      tilt: 65.59724234196116
    }
  });
});
