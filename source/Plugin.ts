import type KubernetesObject from "./KubernetesObject";
import type Metadata from "./Metadata";
import type Bistable from "./Bistable";
import type Context from "./Context";
import type AnyContext from "./AnyContext";

export default
abstract class Plugin implements KubernetesObject, Bistable {
    abstract apiVersion: string;
    abstract kind: string;
    abstract metadata: Metadata;

    /**
     * Activates the resource.
     */
    abstract activate (ctx?: AnyContext, ...otherArgs: any[]): Promise<void>;

    /**
     * @returns a `boolean` indicating whether the resource is initialized.
     */
    abstract isActivated (): Promise<boolean>;

    /**
     * Deactivates the resource.
     */
    abstract deactivate (ctx?: Context, ...otherArgs: any[]): Promise<void>;

    /**
     * @returns a `boolean` indicating whether the resource is deactivated.
     */
    abstract isDeactivated (): Promise<boolean>;
}
