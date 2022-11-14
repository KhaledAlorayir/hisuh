export interface entryInsert {
  spot_id: number;
  description: string | undefined;
  name: string;
}

export interface MarkerItem {
  lat: number;
  lng: number;
}

export interface Entry {
  name: string;
  description?: string;
  lat: number;
  lon: number;
}

export interface ListInfo {
  name: string;
  description?: string;
}
