<script>
    import * as d3 from "d3";
    import { focusPosition } from "../store/store.js";
    import { onMount } from "svelte";


    export let dataset;
    export let radius=150;
    export let radiusLengthOffset = 0.5;
    export let textOffset = 0.92;
    export let dateAccessor = (d) => {
        return new Date(d.timestamp);
    };
    export let tempAccessor = (d) =>{
        return d.temperature; 
    };

    let xPosition;
    let yPosition;

    const angleScale = d3
        .scaleTime()
        .domain(d3.extent(dataset, dateAccessor))
        .range([0, Math.PI * 2]);

    // const valueScale = d3
    //     .scaleLinear()
    //     .domain(d3.extent(dataset, tempAccessor))
    //     .range([innerRadius, outerRadius]);


    
    const getXCoordinatesForAngle = (angle, offset = 1) => {
        return Math.cos(angle - Math.PI / 2) * radius * offset;
    };

    const getYCoordinatesForAngle = (angle, offset = 1) => {
        return Math.sin(angle - Math.PI / 2) * radius * offset;
    };
    //Position of the arc tooltip
    let angle;

    onMount(() => {
        angle = angleScale(dateAccessor(dataset[dataset.length-1]));
        if (angle < 0) {
            angle = Math.PI * 2 + angle;
        }
        // $focusPosition.index = dataset.length-2;
    });

    //$: console.log($focusPosition.index);
    $: tooltipArcGenerator = d3
        .arc()
        .innerRadius(85)
        .outerRadius(radius * radiusLengthOffset)
        .startAngle(angle - 0.05)
        .endAngle(angle + 0.05);


    function handleMousemove(event) {
        //console.log(event);
        const [x, y] = d3.pointer(event);
        //console.log( [x, y]);

        const getAngleFromCoordinates = (x, y) => {
            return Math.atan2(y, x);
        };

        angle = getAngleFromCoordinates(x, y) + Math.PI / 2;
        if (angle < 0) {
            angle = Math.PI * 2 + angle;
        }
        let selectedDate = angleScale.invert(angle);

        const searchFunc = (d) => {
            const date = dateAccessor(d);
            //Format example: 2022-05-09T05
            const dateString = d3.timeFormat("%Y-%m-%dT%H");
            return dateString(date) === dateString(selectedDate);
        };
        let index = d3.bisect(dataset,selectedDate);
        //let index = dataset.findIndex(searchFunc);
        // console.log("DateIndex: " + index);
        // console.log(selectedDate);
        // console.log(dataset[index]);
        $focusPosition = { x: x, y: y, index: index };
    }

    function handleTouchMove(event) {
        // console.log(event);
        // console.log(event.touches[0].pageX);
        // console.log(event.touches[0].pageY)
        //console.log(event.targetTouches[0].TouchList.clientY);

        //Get offset from y position to touchevent y position
        let br = document
            .getElementById("chart-radial")
            .getBoundingClientRect();
        const x = event.touches[0].clientX - radius;
        const y = event.touches[0].clientY - radius - br.y;


        xPosition = x;
        yPosition = y;

        //const [x, y] = d3.pointer(event);
        // console.log("Radius:" + radius*2);
        // console.log("X:" + x);
        // console.log("Y:" + y);

        const getAngleFromCoordinates = (x, y) => {
            return Math.atan2(y, x);
        };

        angle = getAngleFromCoordinates(x, y) + Math.PI / 2;
        if (angle < 0) {
            angle = Math.PI * 2 + angle;
        }
        let selectedDate = angleScale.invert(angle);

        const searchFunc = (d) => {
            const date = dateAccessor(d);
            //Format example: 2022-05-09T05
            const dateString = d3.timeFormat("%Y-%m-%dT%H");
            return dateString(date) === dateString(selectedDate);
        };
        //let index = d3.bisect(dataset,selectedDate);
        let index = dataset.findIndex(searchFunc);
        // console.log("DateIndex: " + index);
        // console.log(selectedDate);
        // console.log(dataset[index]);
        $focusPosition = { x: x, y: y, index: index };
        event.preventDefault();
        event.stopPropagation();
    }
    //$: console.log("Index-Arc: " + $focusPosition.index)
</script>

<g class="tooltips">
    {#await dataset then data}
    {#if  $focusPosition.index == dataset.length-2}
            <text class="label-now" x={getXCoordinatesForAngle(0,textOffset)} y={getYCoordinatesForAngle(0,textOffset)}>Aktuell</text>
            <!-- <circle cx={getXCoordinatesForAngle(0,textOffset)} cy={getYCoordinatesForAngle(0,textOffset)} r="2"/> -->
            <g transform="translate(-25,-9)" >
                <rect class="label-background" x={getXCoordinatesForAngle(0,textOffset)} y={getYCoordinatesForAngle(0,textOffset)} width="50" height="13" rx="5" ry="5"></rect>
            </g>
    {/if}
    <circle
        class="listener-circle"
        r={radius}
        on:mousemove={handleMousemove}
        on:touchmove={handleTouchMove}
    />
    <!-- <circle cx={xPosition} cy={yPosition} r=3></circle> -->
    <!-- <circle cx={xPosition} cy={yPosition} r=3></circle> -->
    <path class="tooltip-line" d={tooltipArcGenerator()} />
    {/await}
</g>

<style>
    .label-now{
        text-anchor: middle;
        font-size: 0.5rem;
        font-family: "Montserrat", sans-serif;
        font-weight: bold;
    }
    .label-background{
        fill: lightgrey;
        opacity: 25%;
    }
    .listener-circle {
        fill: transparent;
    }
    .tooltip-line {
        fill: #8395a7;
        fill-opacity: 0.2;
        mix-blend-mode: multiply;
        pointer-events: none;
    }
</style>
