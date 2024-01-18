/**
 * Interface to allow insert link on hot key press in ribbon plugin.
 */
export default interface RibbonPluginOptions {
    /**
     * Set the allowInsertHotKey property to false when the user doesn't want to use this feature
     * @default true
     */
    allowInsertHotKey?: Boolean;
}
