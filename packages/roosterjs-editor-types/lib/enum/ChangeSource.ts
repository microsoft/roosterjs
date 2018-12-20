/**
 * Possible change sources. Here are the predefined sources.
 * It can also be other string if the change source can't fall into these sources.
 */
const enum ChangeSource {
    /**
     * @deprecated
     */
    AutoBullet = 'AutoBullet',

    /**
     * Content changed by auto link
     */
    AutoLink = 'AutoLink',

    /**
     * Content changed by create link
     */
    CreateLink = 'CreateLink',

    /**
     * Content changed by format
     */
    Format = 'Format',

    /**
     * Content changed by image resize
     */
    ImageResize = 'ImageResize',

    /**
     * Content changed by paste
     */
    Paste = 'Paste',

    /**
     * Content changed by setContent API
     */
    SetContent = 'SetContent',

    /**
     * @deprecated
     */
    Undo = 'Undo',

    /**
     * Content changed by cut operation
     */
    Cut = 'Cut',

    /**
     * Content changed by drag & drop operation
     */
    Drop = 'Drop',
}

export default ChangeSource;
