import Plugin from "../Plugin";
import PluginKind from "../PluginKind";

export default
abstract class CachePlugin extends Plugin {
    public readonly kind: PluginKind.CachePlugin = PluginKind.CachePlugin as const;
    public abstract get (key: string): Promise<string>;
    public abstract set (key: string, value: string, lifetimeInSeconds?: number): Promise<void>;
}
