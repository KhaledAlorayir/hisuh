import { Entry } from "./types";

//
export const getDirectionsUrl = (
  lat: number,
  lon: number,
  place_id: string | null
): string => {
  if (place_id) {
    return `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lon}&query_place_id=${place_id}`;
  } else {
    return `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lon}`;
  }
};
