import Plugin from "../Plugin";
import PluginKind from "../PluginKind";

export default
abstract class BackupPlugin <
    BackupArguments extends Record<string, any> = Record<string, any>,
    RestoreArguments extends Record<string, any> = Record<string, any>,
    HistoryItem extends Record<string, any> = Record<string, any>
>
    extends Plugin {
    public readonly kind: PluginKind.BackupPlugin = PluginKind.BackupPlugin as const;

    public abstract create (args: BackupArguments): Promise<void>;
    public abstract restore (args: RestoreArguments): Promise<void>;
    public abstract history (...args: any[]): AsyncIterableIterator<HistoryItem>;
}
