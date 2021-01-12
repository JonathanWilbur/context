import Plugin from "../Plugin";
import PluginKind from "../PluginKind";

export
interface SendChatArgs {
    room?: string;
    text: string;
}

export default
abstract class ChatPlugin extends Plugin {
    public readonly kind: PluginKind.ChatPlugin = PluginKind.ChatPlugin as const;
    public abstract send (args: SendChatArgs): Promise<void>;
}
