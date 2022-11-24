import { number } from "zod";

export interface entryInsert {
  spot_id: number;
  description: string | undefined;
  name: string;
}

export interface MarkerItem {
  lat: number;
  lng: number;
  place_id?: string;
}

export interface Entry {
  name: string;
  description?: string;
  lat: number;
  lon: number;
  id: number;
  place_id?: string;
}

export interface ListInfo {
  name: string;
  description?: string;
}

export interface APIError {
  message: string;
}

export type MapsLibrary = (
  | "places"
  | "drawing"
  | "geometry"
  | "localContext"
  | "visualization"
)[];
