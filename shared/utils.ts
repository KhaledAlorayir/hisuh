import { Entry } from "./types";

//
export const getDirectionsUrl = (entry: Entry): string => {
  if (entry.place_id) {
    return `https://www.google.com/maps/search/?api=1&query=${entry.lat}%2C${entry.lon}&query_place_id=${entry.place_id}`;
  } else {
    return `https://www.google.com/maps/search/?api=1&query=${entry.lat}%2C${entry.lon}`;
  }
};
