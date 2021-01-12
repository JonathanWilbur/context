import Plugin from "../Plugin";
import PluginKind from "../PluginKind";

/**
 * Init plugins are used to bootstrap the program with just enough information
 * to obtain its configuration. In every case, the plugin directory and the
 * chosen configuration plugin will be needed, but the init plugin may also be
 * used to retrieve more information needed for the server to obtain its
 * configuration, such as a URL, decryption password, serialization format, etc.
 *
 * Unlike all other kinds of plugins, this plugin must always require no
 * initialization; in other words, all of the information it provides must be
 * available the moment the program executes, and the "choice" of init plugin
 * must be hard-coded (which arguably makes it not a "plugin," but this
 * nomenclature is retained for uniformity).
 */
export default
abstract class InitPlugin extends Plugin {
    public readonly kind: PluginKind.InitPlugin = PluginKind.InitPlugin as const;
    public abstract getBoolean (key: string): Promise<boolean>;
    public abstract getNumber (key: string): Promise<number>;
    public abstract getString (key: string): Promise<string>;

    /**
     * The local filesystem path where plugins can be found.
     */
    public abstract pluginsDirectory (): string;

    /**
     * A UUID-URN indicating which plugin should be used for obtaining
     * configuration information.
     */
    public abstract configurationPlugin (): string;

    protected static convertStringToBoolean (str: string): boolean | undefined {
        if (/^\s*True\s*$/i.test(str)) return true;
        if (/^\s*False\s*$/i.test(str)) return false;
        if (/^\s*Yes\s*$/i.test(str)) return true;
        if (/^\s*No\s*$/i.test(str)) return false;
        if (/^\s*T\s*$/i.test(str)) return true;
        if (/^\s*F\s*$/i.test(str)) return false;
        if (/^\s*Y\s*$/i.test(str)) return true;
        if (/^\s*N\s*$/i.test(str)) return false;
        if (/^\s*1\s*$/i.test(str)) return true;
        if (/^\s*0\s*$/i.test(str)) return false;
        if (/^\s*\+\s*$/i.test(str)) return true;
        if (/^\s*\-\s*$/i.test(str)) return false;
        return undefined;
    }

    protected static convertStringToNumber (str: string): number | undefined {
        try {
            const ret: number = Number(str);
            if (Number.isNaN(ret)) return undefined;
            return ret;
        } catch (e) {
            return undefined;
        }
    }

    protected static convertStringToInteger (str: string): number | undefined {
        try {
            const ret: number = Number.parseInt(str, 10);
            if (Number.isNaN(ret) || !Number.isSafeInteger(ret)) {
                return undefined;
            }
            return ret;
        } catch (e) {
            return undefined;
        }
    }
}
