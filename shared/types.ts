export interface entryInsert {
  spot_id: number;
  description: string | undefined;
  name: string;
}

export interface MarkerItem {
  lat: number;
  lng: number;
  name?: string;
}
