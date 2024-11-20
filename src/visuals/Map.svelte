<script>
    import L from "leaflet";
    import "leaflet/dist/leaflet.css";
    import { onMount } from "svelte";

    export let dataset;
    export let width;
    

    let map;
    let tiles;

    onMount(() => {
        initMap();
        addMarker(49.49257, 8.472054);
        const mapDiv = document.getElementById("map");
        const resizeObserver = new ResizeObserver(() => {
            map.invalidateSize();
        });

        resizeObserver.observe(mapDiv);
    });

    function initMap() {
        map = L.map("map", {
            //center: [8.472054, 49.49257],
            center: [49.49257, 8.472054],
            zoom: 14.4,
            zoomSnap: 0.1,
            zoomControl: false,
            scrollWheelZoom: false,
            dragging: false,
        });

        //Create background layer
        tiles = L.tileLayer(
            "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
            {
                attribution:
                    'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken:
                    "pk.eyJ1IjoiY2hyaXM0MSIsImEiOiJja3JlM2s1ZmoxMXo1MnBwZXh4anp6eDIzIn0.TAAX-UKiOn8DJuoYIjHYog",
            }
        ).addTo(map);

    }
    function addMarker(latitude, longitude){
            L.circle([latitude,longitude],{
                color: "black",
                fillColor: "black",
                //fillOpacity: 0.8,
                radius: 50,
            }
            
            ).addTo(map)
        }


</script>

<div class="map-container" {width} height={width}>
    <div id="map" >

    </div>
</div>

<style >
#map{
    width: 300px;
    height: 300px;
    border-radius: 5px;
}
</style>