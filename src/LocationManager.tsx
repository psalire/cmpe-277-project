
// import React from "react";
import {
    PermissionsAndroid,
} from "react-native";
import { SERVER_URL } from "./types/CONSTANTS";
import Geolocation from 'react-native-geolocation-service';
import axios from "axios";

export default class LocationManager {

    private watchId: number | null;

    constructor() {
        this.watchId = null;
    }

    async requestLocationPermission(): Promise<boolean> {
        console.log("request location permission...");
        const permission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
        );
        console.log(`permission: ${permission == PermissionsAndroid.RESULTS.GRANTED}`);
        return permission == PermissionsAndroid.RESULTS.GRANTED;
    }

    getLocation(callback: Geolocation.SuccessCallback): void {
        Geolocation.getCurrentPosition(
            callback,
            (error) => {
                console.error(error.code, error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000
            }
        );
    }

    watchLocation(callback: Geolocation.SuccessCallback, interval = 60000): void {
        this.watchId = Geolocation.watchPosition(
            callback,
            (error) => {
                console.error(error.code, error.message);
            },
            {
                enableHighAccuracy: true,
                interval: interval,
            }
        )
    }

    clearWatchLocation() {
        if (this.watchId != null) {
            console.log("clearing watchLocation");
            Geolocation.clearWatch(this.watchId);
        }
        else {
            console.log("watchId falsy");
        }
    }

    async getRoomnameFromLocation(position: Geolocation.GeoPosition): Promise<string | null> {
        return axios
            .get(`${SERVER_URL}/reverse/${position.coords.latitude}/${position.coords.longitude}`)
            .then((res) => {
                console.log(`Got reverse latlong: ${JSON.stringify(res.data)}`);
                return res.data ? `${res.data.county}, ${res.data.state}` : null;
            })
            .catch((err) => {
                console.error(err);
                return null;
            });
    }
}
