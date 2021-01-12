export default
interface Deactivable {

    /**
     * Deactivates the resource.
     */
    deactivate (): Promise<void>;

    /**
     * @returns a `boolean` indicating whether the resource is deactivated.
     */
    isDeactivated (): Promise<boolean>;

}
