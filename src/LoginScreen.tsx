
import React from "react";
import {
    SafeAreaView,
    StyleSheet,
    View,
} from "react-native";
import {
    Input,
    Button,
    Text,
} from 'react-native-elements';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Formik } from "formik";
import axios from "axios";
import { SERVER_URL } from "./types/CONSTANTS";
import { ContextAuthenticated } from "./App";

const Stack = createNativeStackNavigator();

const styleSheet = StyleSheet.create({
    textbox: {
        borderWidth: 1,
        marginVertical: 4,
        padding: 10,
        height: 40,
        borderRadius: 8,
    }
});

const Verify = ({ route, navigation }) => {

    const { email, username, areacode } = route.params;
    const { authenticatedData, setAuthenticatedData } = React.useContext(ContextAuthenticated);

    return (
        <SafeAreaView
            style={{
                flex: 1,
                padding: 8,
                justifyContent: "center",
            }}
        >
            <Formik
                initialValues={{
                    code: "",
                }}
                onSubmit={(values) => {
                    axios.post(`${SERVER_URL}/auth/verify`, {
                        email: email,
                        code: values.code,
                    })
                        .then((res) => {
                            setAuthenticatedData && setAuthenticatedData({
                                username: username,
                                areacode: areacode,
                            });
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values }) => {
                    return (
                        <View>
                            <View
                                style={{
                                    marginVertical: 8,
                                }}
                            >
                                <Text>
                                    Please enter the code that we sent to <Text style={{ fontStyle: "italic" }}>{email} (if valid)</Text>:
                                </Text>
                                <Input
                                    placeholder="Code"
                                    keyboardType="number-pad"
                                    onChangeText={handleChange("code")}
                                    onBlur={handleBlur("code")}
                                    value={values.code}
                                />
                            </View>
                            <Button
                                title="Submit"
                                buttonStyle={{
                                    borderRadius: 16,
                                }}
                                onPress={handleSubmit}
                            />
                        </View>
                    );
                }}
            </Formik>
        </SafeAreaView>
    );
};

const SignUp = ({ navigation }) => {

    return (
        <SafeAreaView
            style={{
                flex: 1,
                padding: 8,
                justifyContent: "center",
            }}
        >
            <Formik
                initialValues={{
                    email: "",
                    username: "",
                    password: "",
                    phoneNumber: "",
                }}
                onSubmit={(values) => {
                    axios.post(`${SERVER_URL}/auth/register`, {
                        username: values.username || null,
                        email: values.email || null,
                        password: values.password || null,
                        phone: values.phoneNumber || null,
                    })
                        .then((res) => {
                            navigation.navigate("Verify Form", {
                                email: values.email,
                                username: values.username,
                                areacode: values.phoneNumber.substring(0,3),
                            });
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values }) => {
                    return (
                        <View>
                            <View
                                style={{
                                    marginVertical: 8,
                                }}
                            >
                                <Input
                                    placeholder="Email"

                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    value={values.email}
                                />
                                <Input
                                    placeholder="Username"

                                    onChangeText={handleChange("username")}
                                    onBlur={handleBlur("username")}
                                    value={values.username}
                                />
                                <Input
                                    placeholder="Password"
                                    secureTextEntry={true}

                                    onChangeText={handleChange("password")}
                                    onBlur={handleBlur("password")}
                                    value={values.password}
                                />
                                <Input
                                    placeholder="Phone (Optional)"

                                    onChangeText={handleChange("phoneNumber")}
                                    onBlur={handleBlur("phoneNumber")}
                                    value={values.phoneNumber}
                                />
                            </View>
                            <Button
                                title="Submit"
                                buttonStyle={{
                                    borderRadius: 16,
                                }}
                                onPress={handleSubmit}
                            />
                        </View>
                    );
                }}
            </Formik>
        </SafeAreaView>
    );
}

const Login = ({ navigation }) => {

    const { isAuthenticated, setIsAuthenticated } = React.useContext(ContextAuthenticated);

    return (
        <SafeAreaView
            style={{
                flex: 1,
                padding: 8,
                justifyContent: "center",
            }}
        >
            <Text>Welcome!</Text>
            <Formik
                initialValues={{
                    username: "",
                    password: "",
                }}
                onSubmit={(values) => {
                    axios.post(`${SERVER_URL}/auth/login`, {
                        username: values.username,
                        password: values.password,
                    })
                        .then((res) => {
                            setIsAuthenticated && setIsAuthenticated(true);
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values }) => {
                    return (
                        <View>
                            <View
                                style={{
                                    marginBottom: 8,
                                }}
                            >
                                <Input
                                    placeholder="Username"

                                    onChangeText={handleChange("username")}
                                    onBlur={handleBlur("username")}
                                    value={values.username}
                                />
                                <Input
                                    placeholder="Password"
                                    secureTextEntry={true}

                                    onChangeText={handleChange("password")}
                                    onBlur={handleBlur("password")}
                                    value={values.password}
                                />
                            </View>
                            <Button
                                title="Login"
                                onPress={handleSubmit}
                            />
                        </View>
                    );
                }}
            </Formik>
            <View>
                <Text
                    style={{
                        textAlign: "center",
                        marginTop: 8,
                    }}
                >
                    No account?
                </Text>
                <Button
                    title="Sign up"
                    onPress={() => {
                        navigation.navigate("Sign up Form");
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

const Welcome = ({ navigation }) => {

    return (
        <SafeAreaView
            style={{
                flex: 1,
                padding: 8,
                justifyContent: "center",
            }}
        >
            <Text
                style={{
                    textAlign: "center",
                    fontSize: 18,
                    marginBottom: 8,
                    fontWeight: "bold",
                    color: "black",
                }}
            >
                Yappa
            </Text>
            <Button
                title="Sign in"
                buttonStyle={{
                    borderRadius: 16,
                }}
                onPress={() => {
                    navigation.navigate("Login Form");
                }}
            />
            <Text style={{ textAlign: "center" }}>
                {"or, "}
            </Text>
            <Button
                title="Continue anonymously"
                buttonStyle={{
                    borderRadius: 16,
                }}
                onPress={() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "Main Screen" }],
                    });
                }}
            />
        </SafeAreaView>
    );
};

const LoginScreen = ({ navigation }) => {

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Welcome Page"
                component={Welcome}
                options={{
                    title: "Welcome",
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Login Form"
                component={Login}
                options={{
                    title: "Login"
                }}
            />
            <Stack.Screen
                name="Sign up Form"
                component={SignUp}
                options={{
                    title: "Sign up"
                }}
            />
            <Stack.Screen
                name="Verify Form"
                component={Verify}
                options={{
                    title: "Verify"
                }}
            />
        </Stack.Navigator>
    )
}

export default LoginScreen;
