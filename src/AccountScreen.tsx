import React from "react";
import {
    SafeAreaView,
    StyleSheet,
    View,
} from "react-native";
import {
    Button,
    Text,
} from 'react-native-elements';
import { ContextAuthenticated } from "./App";

const styleSheet = StyleSheet.create({
    accountMessage: {
        color: "black",
        textAlign: "center",
        fontSize: 16,
        marginVertical: 4,
    }
});

const AccountScreen = ({ navigation }) => {

    const { authenticatedData, setAuthenticatedData } = React.useContext(ContextAuthenticated);

    return (
        <SafeAreaView
            style={{
                flex: 1,
                padding: 8,
            }}
        >
            {authenticatedData ?
                (
                    <>
                        <Text style={styleSheet.accountMessage}>Welcome {authenticatedData.username || "user"}!</Text>
                        <Button
                            title="Log out"
                            onPress={() => {
                                setAuthenticatedData && setAuthenticatedData(null);
                            }}
                        />
                    </>
                )
                :
                (
                    <>
                        <Text style={styleSheet.accountMessage}>
                            You are currently anonymous
                        </Text>
                        <Text>For access to all features log in or sign up:</Text>
                        <Button
                            title="Login/Sign-up"
                            buttonStyle={{
                                borderRadius: 16,
                            }}
                            onPress={() => {
                                navigation.navigate("Login Screen");
                            }}
                        />
                    </>
                )
            }
        </SafeAreaView >
    );
};

export default AccountScreen;
