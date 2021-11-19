
import React from "react";
import {
    FlatList,
    SafeAreaView,
    View,
} from "react-native";
import {
    Input,
    Text,
} from 'react-native-elements';
import { io as SocketIOClient } from "socket.io-client";
import { ChatMessage } from "./types/ChatMessage";
import { SERVER_URL } from "./types/CONSTANTS";

const ChatMessageItem = (props: ChatMessage) => {

    function getAlignment(key) {
        switch (key) {
            case "end":
                return "flex-end";
            case "center":
                return "center";
            case "start":
            default:
                return "flex-start";
        }
    }

    return (
        <View style={{
            flexDirection: "row",
            justifyContent: getAlignment(props.alignment),
        }}>
            <View>
                {props.username ? (
                    <Text

                        >
                            {props.username}
                        </Text>
                    )
                    :
                    <></>
                }
                <Text
                    style={props.style}
                >
                    {props.msg}
                </Text>
            </View>
        </View>
    );
}

const ChatMessageInput = (props: any) => {
    const [text, setText] = React.useState("");

    return (
        <View>
            <Input
                onChangeText={(text) => {
                    setText(text);
                }}
                onSubmitEditing={(e) => {
                    let msg = e.nativeEvent.text;
                    if (props.socketIOClient != null) {
                        console.log("emitting " + msg)
                        props.socketIOClient.emit("msg", msg);
                    }
                    else {
                        console.log("socketIOClient null");
                    }
                    props.setNewMessage({
                        msg: msg,
                        alignment: "end",
                        style: {
                            color: "white",
                            backgroundColor: "chartreuse",
                            padding: 8,
                            margin: 2,
                            borderRadius: 10,
                        },
                        username: "You",
                    });
                    setText("");
                }}
                value={text}
                placeholder="Say something…"
            />
        </View>
    );
};

const ChatMessageList = (props: any) => {
    const messageList = React.useRef(null);

    return (
        <View
            style={{
                flex: 1,
                padding: 8
            }}
        >
            <FlatList
                ref={messageList}
                data={props.messages}
                renderItem={({ item, index, separators }) => {
                    return (
                        <ChatMessageItem
                            msg={item.msg}
                            alignment={item.alignment}
                            style={item.style}
                            username={item.username}
                        />
                    );
                }}
                onContentSizeChange={() => {
                    if (messageList && messageList.current) {
                        messageList.current.scrollToEnd();
                    }
                }}
            />
        </View>
    );
};

const Chatroom = ({ route, navigation }) => {
    const [messages, setMessages] = React.useState([]);
    const [newMessage, setNewMessage] = React.useState(null);
    const [socketIOClient, setSocketIOClient] = React.useState(null);
    const { roomName, } = route.params;

    React.useEffect(() => {
        const socket = SocketIOClient(
            SERVER_URL,
            {
                transports: ["websocket"]
            }
        );
        setSocketIOClient(socket);
    }, []);

    React.useEffect(() => {
        if (socketIOClient == null) {
            return;
        }
        socketIOClient.on("connect", () => {
            setNewMessage({
                msg: "Connected!",
                alignment: "center",
            });
            console.log(`roomName: ${roomName}`);
            socketIOClient.emit("joinRoom", roomName);
        });
        socketIOClient.on("userConnect", (data) => {
            setNewMessage({ msg: `${data} has joined` });
        });
        socketIOClient.on("msg", (data) => {
            console.log("recvd " + data)
            setNewMessage({
                msg: data,
                style: {
                    color: "white",
                    backgroundColor: "dodgerblue",
                    padding: 8,
                    margin: 2,
                    borderRadius: 10,
                },
                username: "anon",
            });
        });
        return () => {
            socketIOClient.disconnect();
        };
    }, [socketIOClient]);

    React.useEffect(() => {
        if (newMessage != null) {
            setMessages(messages.concat(newMessage));
        }
    }, [newMessage]);

    return (
        <SafeAreaView
            style={{
                flex: 1
            }}
        >
            <ChatMessageList
                messages={messages}
            />
            <ChatMessageInput
                setNewMessage={setNewMessage}
                socketIOClient={socketIOClient}
            />
        </SafeAreaView>
    )
}

export default Chatroom;
