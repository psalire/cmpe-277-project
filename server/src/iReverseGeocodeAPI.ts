
export default interface iReverseGeocodeAPI {
    reverseLatLon(lat: string, lon: string): Promise<ReversedLocation | null>;
}

export type ReversedLocation = {
    county: string,
    state: string,
}
