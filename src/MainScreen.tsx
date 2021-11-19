
import React from "react";
import {
    View,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { GeoPosition } from 'react-native-geolocation-service';
import LocationManager from "./LocationManager";
import AccountScreen from "./AccountScreen";
import ChatroomScreen from "./ChatroomScreen";
import DiscoverScreen from "./DiscoverScreen";

const Tab = createBottomTabNavigator();
const LocationManagerContext = React.createContext<LocationManager | null>(null);
const LocationContext = React.createContext<GeoPosition | null>(null);

const MainScreen = ({ navigation }) => {
    const [location, setLocation] = React.useState<GeoPosition | null>(null);
    const locationManager = new LocationManager();

    React.useEffect(() => {
        (async () => {
            let granted = await locationManager.requestLocationPermission();
            if (!granted) {
                console.warn("Location permission denied!");
                return;
            }
            locationManager.watchLocation((position) => {
                console.log("watching location...");
                setLocation(position);
            });
        })();
        return () => {
            locationManager.clearWatchLocation()
        };
    }, []);

    return (
        <LocationManagerContext.Provider value={locationManager}>
            <LocationContext.Provider value={location}>
                <Tab.Navigator>
                    <Tab.Screen
                        name="Chatrooms"
                        component={ChatroomScreen}
                        options={{
                            headerShown: false,
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons
                                    name="home-outline"
                                    color={color}
                                    size={size}
                                />
                            )
                        }}
                    />
                    <Tab.Screen
                        name="Discover"
                        component={DiscoverScreen}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons
                                    name="eye-outline"
                                    color={color}
                                    size={size}
                                />
                            )
                        }}
                    />
                    <Tab.Screen
                        name="Account"
                        component={AccountScreen}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons
                                    name="md-person-outline"
                                    color={color}
                                    size={size}
                                />
                            )
                        }}
                    />
                </Tab.Navigator>
            </LocationContext.Provider>
        </LocationManagerContext.Provider>
    );
};

export default MainScreen;
export {
    LocationContext,
    LocationManagerContext,
};
