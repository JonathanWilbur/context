import Plugin from "../Plugin";
import PluginKind from "../PluginKind";
import type AnyContext from "../AnyContext";

export default
abstract class ExecutionPlugin <Arguments extends object, Return extends object, ContextType extends AnyContext>
    extends Plugin {
    public readonly kind: PluginKind.ExecutionPlugin = PluginKind.ExecutionPlugin as const;

    /**
     * Executes the function.
     *
     * @param args an object containing all arguments for the function.
     */
    public abstract call (ctx: ContextType, args: Arguments): Promise<Return>;
}
