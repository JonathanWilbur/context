import Plugin from "../Plugin";
import PluginKind from "../PluginKind";

export default
abstract class LoggingPlugin extends Plugin {
    public readonly kind: PluginKind.LoggingPlugin = PluginKind.LoggingPlugin as const;
    public abstract debug (message: string): void;
    public abstract info (message: string): void;
    public abstract warn (message: string): void;
    public abstract error (error: Error): void;
}
