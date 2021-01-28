import Plugin from "../Plugin";
import PluginKind from "../PluginKind";
import type RecursivePartial from "../RecursivePartial";
import { EventEmitter } from "events";
import _ from "lodash";

export default
abstract class ConfigurationPlugin <AppConfig extends Record<string, any> = Record<string, any>> extends Plugin {
    public readonly kind: PluginKind.ConfigurationPlugin = PluginKind.ConfigurationPlugin as const;

    /**
     * @param ctx An context that can be used to obtain more information.
     */
    public abstract activate (): Promise<void>;

    /**
     * A copy of the configuration, but composed entirely of default values.
     */
    public abstract readonly defaults: AppConfig;

    /**
     * The configuration values. Configuration values may be read from this,
     * but must only be written to by this plugin's `load()` method.
     */
    public abstract values: AppConfig;

    /**
     * An event emitter that emits an event every time the configuration is
     * read from.
     */
    public readonly events: EventEmitter = new EventEmitter();

    /**
     * The method for updating `this.cache`. This fills in any unsupplied
     * configuration values with their defaults.
     */
    protected updateValues (loadedValues: RecursivePartial<AppConfig>): void {
        this.values = _.defaultsDeep(loadedValues, this.defaults);
        this.events.emit("loaded");
    }

    /**
     * The method that initially loads or reloads the configuration. It MUST
     * store the configuration in `this.cache`.
     *
     * This should be triggered by `SIGHUP`.
     */
    public abstract load (): Promise<void>;

    /**
     * A method for dumping JSON for diagnostic purposes. Configuration MUST NOT
     * be read from this.
     */
    public dump (): any {
        return JSON.stringify(this.values);
    }

    /**
     * Note that no language-specific boolean formats are recognized, such as
     * "Y" and "N" for "Yes" and "No," respectively. This is done intentionally
     * for the sake of better internationalization.
     */
    protected static convertStringToBoolean (str: string): boolean | undefined {
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
            if (Number.isNaN(ret)) return undefined;
            if (!Number.isSafeInteger(ret)) return undefined;
            return ret;
        } catch (e) {
            return undefined;
        }
    }

    constructor () {
        super();
        this.load();
    }
}
