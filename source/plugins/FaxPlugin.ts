import Plugin from "../Plugin";
import PluginKind from "../PluginKind";

export
interface SendFaxArgs {
    to: string;
    contents: Buffer[];
    headerText?: string;
}

export default
abstract class FaxPlugin extends Plugin {
    public readonly kind: PluginKind.FaxPlugin = PluginKind.FaxPlugin as const;
    public abstract send (args: SendFaxArgs): Promise<void>;
}
