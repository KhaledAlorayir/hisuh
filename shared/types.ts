import { List, Spot, Entry as prismaEntry } from "@prisma/client";

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
  description: string | null;
  lat: number;
  lon: number;
  id: number;
  place_id: string | null;
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

export type ParsedList = List & {
  entries: (prismaEntry & {
    spot: Spot;
  })[];
  owner: {
    name: string | null;
    image: string | null;
    id: string;
  };
  _count: {
    likes: number;
  };
};
