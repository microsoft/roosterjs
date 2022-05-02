/**
 * Update mode for UpdateContentPlugins
 */
export enum UpdateMode {
    /**
     * Force update, triggered from UpdateContentPlugin.forceUpdate()
     */
    Force = 0,

    /**
     * Update when editor is initialized
     */
    OnInitialize = 1,

    /**
     * Update when editor is about to be disposed
     */
    OnDispose = 2,

    /**
     * Update when user input in editor
     */
    OnUserInput = 4,

    /**
     * Update when ContentChangedEvent is triggered from a plugin
     */
    OnContentChangedEvent = 8,

    /**
     * Update when editor loses focus
     */
    OnBlur = 16,
}
