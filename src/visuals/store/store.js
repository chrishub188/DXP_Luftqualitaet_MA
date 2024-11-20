import { writable } from "svelte/store"

//export const focusValue = writable({temperature: 0, timestamp:new Date()})
export const focusPosition = writable({ x: 0, y: 0, index: 138 });
//NO2, PM10, PM25
export const selectedAirMeasure = writable(["NO2"]);