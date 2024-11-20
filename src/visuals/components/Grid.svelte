<script>
   import * as d3 from "d3";
   import { onMount } from "svelte";

    export let dataset;
    export let dateParser = d3.timeParse("%Y-%m-%dT%H");
    export let dateAccessor = (d) => {
        return dateParser(d.timestamp);
    };

    onMount(()=>{
        
    });

    //Umfang
    let angleScale = d3
        .scaleTime()
        .domain(d3.extent(dataset, dateAccessor))
        .range([0, Math.PI * 2]);
</script>

<g>
    <!-- {console.log(dataset)} -->
    {#each dataset as item}
        <!-- <circle cx={angleScale(dateAccessor(item))} cy={150} r={3}></circle> -->
    {/each}
</g>

<style>
</style>
