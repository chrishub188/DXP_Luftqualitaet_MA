<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import { focusPosition } from "../store/store.js";

    export let radius = 80;
    export let imageDimension = 12;
    export let dataset;

    export let dateAccessor = (d) => {
        return new Date(d.timestamp);
    };
    export let windAccessor = (d) => {
        return d.averageWindDirection;
    };

    onMount(() => {});
    const angle = 0;

    const angleScale = d3
        .scaleTime()
        .domain(d3.extent(dataset, dateAccessor))
        .range([0, Math.PI * 2]);

    const getXCoordinatesForAngle = (angle, offset = 1) => {
        return Math.cos(angle - Math.PI / 2) * radius * offset;
    };

    const getYCoordinatesForAngle = (angle, offset = 1) => {
        return Math.sin(angle - Math.PI / 2) * radius * offset;
    };

    function getWindArray(dataset, step = 10) {
        // let grouped = d3.group(dataset, (d) => dateAccessor(d).getDate());
        // console.log(grouped);

        let grouped = [];
        for (let i = 0; i < dataset.length; i += step) {
            let slice = dataset.slice(i, i + step);
            grouped.push(slice);
        }
        let meansPerIntervall = [];
        grouped.forEach((element) => {
           // console.log(element);
            if (step === element.length) {
                let meanWind = getMeanBetween(
                    dateAccessor(element[0]),
                    dateAccessor(element[element.length - 1])
                );
                let meanDate = dateAccessor(element[step / 2]);
                //console.log(meanWind);
                meansPerIntervall.push({
                    averageWindDirection: meanWind,
                    timestamp: meanDate,
                    startdate: dateAccessor(element[0]),
                    endDate: dateAccessor(element[element.length - 1]),
                });
            }
        });
        //Start with the actualDate = 0
        return meansPerIntervall;
    }

    let intervalls = getWindArray(dataset);

    //console.log(intervalls);
    $: activeIntervall = getIntervallFromIndex(
        $focusPosition.index,
        intervalls
    );

    function getIntervallFromIndex(index, intervalls) {
        //console.log("Index" + index);
        //console.log(dateAccessor(dataset[index]));

        let intervallIndex = undefined;

        intervalls.forEach((item, i) => {
            //console.log(item);
            if (
                dateIsInBetween(
                    dateAccessor(dataset[index]),
                    item.startdate,
                    item.endDate
                )
            ) {
                intervallIndex = i;
            }
        });
        //console.log(intervallIndex);
        return intervallIndex;
    }

    function dateIsInBetween(actualDate, startDate, endDate) {
        // console.log(actualDate);
        // console.log(startDate);
        //console.log(endDate);

        if (actualDate >= startDate && actualDate <= endDate) {
            return true;
        } else {
            return false;
        }
    }

    function getMeanBetween(startDate, endDate) {
        // console.log("Start:");
        // console.log(startDate);
        // console.log("End:");
        // console.log(endDate);

        const compareStart = (d) => {
            return (
                dateAccessor(d).getDate() == startDate.getDate() &&
                dateAccessor(d).getHours() == startDate.getHours()
            );
        };
        const compareEnd = (d) => {
            return (
                dateAccessor(d).getDate() == endDate.getDate() &&
                dateAccessor(d).getHours() == endDate.getHours()
            );
        };

        let startIndex = dataset.findIndex(compareStart);
        let endIndex;

        if (endDate === undefined) {
            endIndex = dataset.length;
        } else {
            endIndex = dataset.findIndex(compareEnd);
        }
        let intervallDataset = dataset.slice(startIndex, endIndex);
        let median = d3.median(intervallDataset, windAccessor);
        // console.log("Index start: " + startIndex);
        // console.log("Index end: " + endIndex);
        // console.log("intervallDataset:");
        // console.log(intervallDataset);
        // console.log("Mean:");
        // console.log(d3.mean(intervallDataset, windAccessor));
        return median;
    }

</script>

<!-- rotate(${angle},${getXCoordinatesForAngle(angleScale(day))}, ${getYCoordinatesForAngle(angleScale(day))}) -->
<g class="arrow">
    <!-- {#each angleScale.ticks(7) as day, i} -->

    {#each intervalls as intervall, i}
        <!-- {console.log(i)}
        {console.log(intervall)} -->
        {#if i === activeIntervall}
            <circle
                class="marker-circle"
                cx={getXCoordinatesForAngle(
                    angleScale(dateAccessor(intervall))
                )}
                cy={getYCoordinatesForAngle(
                    angleScale(dateAccessor(intervall))
                )}
                r={"8"}
            />
            <!-- <text
                class="label"
                style="font-size: 0.8rem;"
                x={0}
                y={0}
                text-anchor={"middle"}
                >{i}
            </text> -->
        {/if}
        <g>
            <g
                transform={`rotate(${windAccessor(
                    intervall
                )},${getXCoordinatesForAngle(
                    angleScale(dateAccessor(intervall))
                )}, ${getYCoordinatesForAngle(
                    angleScale(dateAccessor(intervall))
                )})`}
            >
                <image
                    class="arrow-item"
                    width={imageDimension}
                    height={imageDimension}
                    x={getXCoordinatesForAngle(
                        angleScale(dateAccessor(intervall))
                    ) -
                        imageDimension / 2}
                    y={getYCoordinatesForAngle(
                        angleScale(dateAccessor(intervall))
                    ) -
                        imageDimension / 2}
                    href="assets/Arrow.svg"
                />
            </g>
        </g>
    {/each}
</g>

<style lang="scss">
    .arrow-item {
        // outline: 2px solid red;
    }
    .marker-circle {
        //stroke:black;
        opacity: 15%;
        fill: gray;
    }
</style>
