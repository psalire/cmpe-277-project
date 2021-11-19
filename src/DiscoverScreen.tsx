import React from "react";
import {
    FlatList,
    SafeAreaView,
    View,
} from "react-native";
import {
    Button,
    Text,
} from "react-native-elements";
import MapStyle from "./types/CustomMapStyle";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { GeoPosition } from "react-native-geolocation-service";
import MapView, { Marker } from "react-native-maps";
import { LocationContext } from "./MainScreen";

const DiscoverChatroomMap = ({ navigation }) => {

    const locationContext = React.useContext<GeoPosition>(LocationContext);
    const [latLon, setLatLon] = React.useState({ lat: 37.78825, lon: -122.4324});

    React.useEffect(() => {
        setLatLon({
            lat: locationContext.coords.latitude,
            lon: locationContext.coords.longitude,
        });
    }, [locationContext]);

    return (
        <SafeAreaView
            style={{
                flex: 1,
            }}
        >
            <MapView
                style={{
                    flex: 1,
                }}
                customMapStyle={MapStyle}
                initialRegion={{
                    latitude: locationContext ? locationContext.coords.latitude : latLon.lat,
                    longitude: locationContext ? locationContext.coords.longitude : latLon.lon,
                    latitudeDelta: 1,
                    longitudeDelta: 1,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: locationContext ? locationContext.coords.latitude : latLon.lat,
                        longitude: locationContext ? locationContext.coords.longitude : latLon.lon,
                    }}
                />
            </MapView>
        </SafeAreaView>
    );
};

const DiscoverChatroomList = ({ navigation }) => {
    const [chatrooms, setChatrooms] = React.useState([]);

    function getChatrooms(): string[] {
        return [
            "Oakland, CA",
            "Sacramento, CA",
            "Las Vegas, NV",
            "Dallas, TX",
        ]
    }

    React.useEffect(() => {
        setChatrooms(getChatrooms());
    }, []);

    return (
        <SafeAreaView
            style={{
                flex: 1,
                padding: 8,
            }}
        >
            <Text>See what's happening around you:</Text>
            <FlatList
                style={{
                    flex: 1,
                }}
                data={chatrooms}
                renderItem={({ item, index, separators }) => {
                    return (
                        <View
                            style={{
                                margin: 6,
                            }}
                        >
                            <Button
                                title={item}
                                buttonStyle={{
                                    borderRadius: 16,
                                }}
                                onPress={() => {
                                    navigation.navigate("Chatroom", {
                                        roomName: item,
                                    });
                                }}
                            />
                        </View>
                    )
                }}
            />
        </SafeAreaView>
    )
};

const Tab = createMaterialTopTabNavigator();

const DiscoverScreen = ({ navigation }) => {

    return (
        <Tab.Navigator>
            <Tab.Screen name="List" component={DiscoverChatroomList} />
            <Tab.Screen name="Map" component={DiscoverChatroomMap} />
        </Tab.Navigator>
    )
};

export default DiscoverScreen;
