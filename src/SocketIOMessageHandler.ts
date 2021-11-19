
import aMessageHandler from "./aMessageHandler";

export default class SocketIOMessageHandler extends aMessageHandler {

    getMessages(): string[] {
        return [
            "hello", "mock", "world!"
        ];
    }

    postMessage(msg: string): void {

    }
}
