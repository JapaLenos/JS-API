# Mesure de volumes avec l'ArcGIS Maps SDK for JavaScript   

Cette application démontre les [capacités de mesure de volume dans des scènes 3D d'ArcGIS](https://developers.arcgis.com/javascript/latest/references/core/analysis/VolumeMeasurementAnalysis/). Deux modes d'analyse sont disponibles :
- cut-fill (déblais-remblais) : Calcule les volumes de déblais et de remblais par rapport à une surface plane et horizontale définie par le polygone en entrée. 
- stockpile (dépôt) : Calcule les volumes de déblais et de remblais par rapport à une surface approximée à partir des points de contrôle du polygone en entrée.
Différents géosignets permettent d'utiliser ces deux types de mesure. L'utilisateur peut cliquer sur une entité, ce qui lancera automatiquement une analyse (l'application sait quel type d'analyse lancer selon l'entité qui est cliquée), ou dessiner à la main les limites de son analyse de volume.
[<img src="screenshot.JPG">](https://japalenos.github.io/JS-API/Mesure-de-volumes/)
