
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from "./LoginScreen";
import MainScreen from "./MainScreen";
import { AuthenticatedContext, AuthenticatedData } from "./types/AuthenticatedData";

const Stack = createNativeStackNavigator();
const ContextAuthenticated = React.createContext<AuthenticatedContext>({ authenticatedData: null, setAuthenticatedData: null });

const App = () => {

    const [authenticatedData, setAuthenticatedData] = React.useState<AuthenticatedData|null>(null);

    return (
        <ContextAuthenticated.Provider value={{ authenticatedData, setAuthenticatedData }}>
            <SafeAreaProvider>
                <NavigationContainer>
                    <Stack.Navigator>
                        {
                            authenticatedData ?
                                (<></>)
                                :
                                (
                                    <Stack.Screen
                                        name="Login Screen"
                                        component={LoginScreen}
                                        options={{
                                            headerShown: false,
                                        }}
                                    />
                                )
                        }
                        <Stack.Screen
                            name="Main Screen"
                            component={MainScreen}
                            options={{
                                headerShown: false,
                            }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
        </ContextAuthenticated.Provider>
    );
}

export default App;
export {
    ContextAuthenticated,
};
