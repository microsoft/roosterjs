/**
 * Information of current OS and web browser
 */
interface BrowserInfo {
    /**
     * Wether current OS is Mac
     */
    readonly isMac?: boolean;

    /**
     * Whether current OS is Windows
     */
    readonly isWin?: boolean;

    /**
     * Whether current browser is using webkit kernal
     */
    readonly isWebKit?: boolean;

    /**
     * Whether current browser is Internet Explorer
     */
    readonly isIE?: boolean;

    /**
     * Whether current browser is IE10 or IE11
     */
    readonly isIE11OrGreater?: boolean;

    /**
     * Whether current browser is Safari
     */
    readonly isSafari?: boolean;

    /**
     * Whether current browser is Chrome
     */
    readonly isChrome?: boolean;

    /**
     * Whether current browser is Firfox
     */
    readonly isFirefox?: boolean;

    /**
     * Whether current browser is Edge
     */
    readonly isEdge?: boolean;

    /**
     * Whether current browser is IE/Edge
     */
    readonly isIEOrEdge?: boolean;
}

export default BrowserInfo;
