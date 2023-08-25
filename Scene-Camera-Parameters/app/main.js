require([
  "esri/Map",
  "esri/Basemap",
  "esri/views/SceneView",
  "esri/core/reactiveUtils",
  "esri/widgets/BasemapGallery",
  "esri/widgets/Expand"
], (Map, Basemap, SceneView, reactiveUtils, BasemapGallery, Expand) => {
  const map = new Map({
    basemap: new Basemap({
      portalItem: {
        id: "0560e29930dc4d5ebeb58c635c0909c9" 
      }
    })
  });

  const view = new SceneView({
    container: "viewDiv",
    map: map,
    camera: {
      position: {
        longitude: 2.60287861473599,
        latitude: 34.641824028666484,
        z: 18812775.919748373
      },
      heading: 355.07932581734315,
      tilt: 0.12658165562978302
    },
  });

  view.when(() => {
    let basemapGallery = new BasemapGallery({
      view: view
    });
    basemapGalleryExpand = new Expand({
      expandIcon: "basemap", 
      view: view,
      content: basemapGallery
    });

    view.ui.add(basemapGalleryExpand, "top-left");


    const lonText = document.getElementById("lon");
    let lon = { x: undefined };
    const latText = document.getElementById("lat");
    let lat = { x: undefined };
    const zText = document.getElementById("z");
    let z = { x: undefined };
    const headingText = document.getElementById("heading");
    let heading = { x: undefined };
    const tiltText = document.getElementById("tilt");
    let tilt = { x: undefined };

    reactiveUtils.when(() => {
      if (view.center) {
        lon = { x: view.viewpoint.camera.position.longitude };
        lonText.textContent = `${lon.x}`;

        lat = { x: view.viewpoint.camera.position.latitude };
        latText.textContent = `${lat.x}`;

        z = { x: view.viewpoint.camera.position.z };
        zText.textContent = `${z.x}`;

        heading = { x: view.viewpoint.camera.heading };
        headingText.textContent = `${heading.x}`;

        tilt = { x: view.viewpoint.camera.tilt };
        tiltText.textContent = `${tilt.x}`;
      }
    });
  });
});
