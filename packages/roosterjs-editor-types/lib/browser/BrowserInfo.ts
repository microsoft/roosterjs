/**
 * Information of current OS and web browser
 */
export default interface BrowserInfo {
    /**
     * Wether current OS is Mac
     */
    readonly isMac?: boolean;

    /**
     * Whether current OS is Windows
     */
    readonly isWin?: boolean;

    /**
     * Whether current browser is using webkit kernel
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
     * Whether current browser is Firefox
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

    /**
     * Whether current OS is Android
     */
    readonly isAndroid?: boolean;

    /**
     * Whether current browser is on mobile or a tablet
     */
     readonly isMobileOrTablet?: boolean;
}
