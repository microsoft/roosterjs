/**
 * Current running environment
 */
export interface EditorEnvironment {
    /**
     * Whether editor is running on Mac
     */
    isMac?: boolean;

    /**
     * Whether editor is running on Android
     */
    isAndroid?: boolean;

    /**
     * Whether editor is running on Safari browser
     */
    isSafari?: boolean;
}
