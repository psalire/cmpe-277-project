
import React from "react";
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    View,
} from "react-native";
import {
    Button,
    Text,
} from 'react-native-elements';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GeoPosition } from "react-native-geolocation-service";
import Chatroom from "./Chatroom";
import { LocationContext, LocationManagerContext } from "./MainScreen";
import { ContextAuthenticated } from "./App";

const Stack = createNativeStackNavigator();

const ChatroomList = ({ navigation }) => {
    const [chatrooms, setChatrooms] = React.useState([]);
    const [location, setLocation] = React.useState<GeoPosition | null>(null);
    const locationContext = React.useContext(LocationContext);
    const locationManagerContext = React.useContext(LocationManagerContext);
    const { authenticatedData } = React.useContext(ContextAuthenticated);

    React.useEffect(() => {
        console.log(`Location updated: ${JSON.stringify(locationContext)}`);
        if (locationContext) {
            setLocation(locationContext);
        }
    }, [locationContext]);

    React.useEffect(() => {
        if (location) {
            updateChatroomList();
        }
    }, [location]);

    async function updateChatroomList(): void {
        setChatrooms(await getChatrooms());
    }

    async function getChatrooms(): Promise<string[]> {
        var ret: string[] = [];
        if (locationManagerContext) {
            if (location) {
                try {
                    let loc = await locationManagerContext.getRoomnameFromLocation(locationContext);
                    if (loc) {
                        ret.push(loc);
                    }
                    if (authenticatedData && authenticatedData.areacode) {
                        ret.push(authenticatedData.areacode+" Area Code");
                    }
                }
                catch (err) {
                    console.error(err);
                }
            }
            else {
                console.log("getChatrooms: locationContext falsy");
            }
        }
        else {
            console.warn("locationManagerContext==null");
        }
        return ret;
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                padding: 8,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <Text>Near you:</Text>
                <Text
                    style={{
                        color: "blue",
                        fontWeight: "bold",
                    }}
                    onPress={() => {
                        setChatrooms([]);
                        locationManagerContext?.getLocation((position) => {
                            setLocation(position);
                        });
                    }}
                >
                    Refresh
                </Text>
            </View>
            {chatrooms.length > 0 ?
                (
                    <FlatList
                        data={chatrooms}
                        renderItem={({ item, index, separators }) => {
                            console.log(`Updating button: ${item}`);
                            return item ? (
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
                            ) : <></>;
                        }}
                    />
                ) :
                (
                    <ActivityIndicator
                        size="large"
                    />
                )
            }
            <View style={{
                flexDirection: "row",
                justifyContent: "center",
            }}
            >
                <Text>
                    Want more?{" "}
                    <Text
                        style={{
                            color: "blue",
                            fontWeight: "bold",
                        }}
                        onPress={() => {
                            navigation.getParent().navigate("Discover");
                        }}
                    >
                        Discover new rooms
                    </Text>
                </Text>
            </View>
        </SafeAreaView>
    );
};

const ChatroomScreen = () => {

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Your Chatrooms"
                component={ChatroomList}
            />
            <Stack.Screen
                name="Chatroom"
                component={Chatroom}
                options={({ route }) => ({
                    title: (route.params && "roomName" in route.params && route.params.roomName) ?
                        route.params.roomName : "Chatroom",
                })}
            />
        </Stack.Navigator>
    );
};

export default ChatroomScreen;
