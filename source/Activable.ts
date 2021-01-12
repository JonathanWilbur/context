export default
interface Activable {

    /**
     * Activates the resource.
     */
    activate (): Promise<void>;

    /**
     * @returns a `boolean` indicating whether the resource is initialized.
     */
    isActivated (): Promise<boolean>;

}
