import Plugin from "../Plugin";
import PluginKind from "../PluginKind";

export default
abstract class HookPlugin <Arguments extends Record<string, any> = Record<string, any>>
    extends Plugin {
    public readonly kind: PluginKind.HookPlugin = PluginKind.HookPlugin as const;
    public abstract call (args: Arguments): Promise<void>;
}
