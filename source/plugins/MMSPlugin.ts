import Plugin from "../Plugin";
import PluginKind from "../PluginKind";

export
interface SendMMSArgs {
    from?: string;
    to: string;
    body: string;
}

export default
abstract class MMSPlugin extends Plugin {
    public readonly kind: PluginKind.MMSPlugin = PluginKind.MMSPlugin as const;
    public abstract send (args: SendMMSArgs): Promise<void>;
}
