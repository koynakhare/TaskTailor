export interface Place {
  name: string;
  lat: number;
  lon: number;
  distance: number;
  cost: number;
  mood: string;
}

export interface PlaceRequest {
  budget: number;
  maxDistance: number;
  userLat: number;
  userLon: number;
  mood?: string;
}
