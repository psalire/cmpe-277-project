
export default abstract class aMessageHandler {

    abstract getMessages(): string[];
    abstract postMessage(msg: string): void;
}
