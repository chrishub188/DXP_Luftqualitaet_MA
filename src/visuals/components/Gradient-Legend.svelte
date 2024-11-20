<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";

    export let width;
    let barWidth = width * 0.7;
    let padding = 10;
    let innerWidth = barWidth - padding * 2;
    let barHeight = 5;
    let heigth = 20;

    let xScale = d3.scaleLinear().range([0, innerWidth]).domain([-30, 42]);

    //-30° auf +42°
    let ticks = [-30,-20,-10,0,10,20,30,42];

    let xAxis = d3
        .axisBottom(xScale)
        .tickSize(barHeight * 2)
        .tickValues(ticks)
        .tickFormat((d) => {
            return d + "°C";
        });

    onMount(() => {
        d3.select(".scaleAndBar")
            .append("g")
            .call(xAxis)
            .style("font-size", "0.4rem");
    });
</script>

<div class="gradient-legend">
    <svg class="tempLegendContainer" width={barWidth} height={"1.2rem"}>
        <g class="legendColor" />
        <g class="scaleAndBar" transform={`translate(${padding}, 0)`}>
            <rect
                width={innerWidth}
                height={barHeight}
                style="fill: url('#linearLegendGradient');"
            />
            <g class="legendScale">
                <!-- Append with D3 -->
            </g>
            <defs>
                <linearGradient id="linearLegendGradient">
                    {#each Array(101) as _, i}
                        <stop
                            offset={`${i}%`}
                            stop-color={d3.interpolateTurbo(i / 100)}
                        />
                    {/each}
                </linearGradient>>
            </defs>
        </g>
    </svg>
</div>

<style lang="scss">
    .gradient-legend {
    }
    .legend-text {
        font-size: 0.4rem;
    }
</style>
