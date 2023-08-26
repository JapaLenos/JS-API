require([
  "esri/Map",
  "esri/Basemap",
  "esri/views/MapView",
  "esri/core/reactiveUtils",
  "esri/widgets/BasemapGallery",
  "esri/widgets/Expand",
  "esri/widgets/Compass",
], (Map, Basemap, MapView, reactiveUtils, BasemapGallery, Expand, Compass) => {
  const map = new Map({
    basemap: new Basemap({
      portalItem: {
        id: "0560e29930dc4d5ebeb58c635c0909c9",
      },
    }),
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [0, 42],
    zoom: 2,
  });

  view.when(() => {
    let basemapGallery = new BasemapGallery({
      view: view,
    });
    basemapGalleryExpand = new Expand({
      expandIcon: "basemap",
      view: view,
      content: basemapGallery,
    });
    view.ui.add(basemapGalleryExpand, "top-left");

    let compass = new Compass({
      view: view,
    });
    view.ui.add(compass, "top-left");

    const centerText = document.getElementById("center");
    let center = { x: undefined, y: undefined };

    const zoomText = document.getElementById("zoom");
    let zoom = { x: undefined };

    const rotationText = document.getElementById("rotation");
    let rotation = { x: undefined };

    reactiveUtils.when(() => {
      if (view.center) {
        center = { x: view.center.longitude, y: view.center.latitude };
        centerText.textContent = `[${center.x.toFixed(6)}, ${center.y.toFixed(
          6
        )}]`;

        zoom = { x: view.zoom };
        zoomText.textContent = `${zoom.x.toFixed(0)}`;

        rotation = { x: view.rotation };
        rotationText.textContent = `${rotation.x.toFixed(6)}`;
      }
    });
  });
});
