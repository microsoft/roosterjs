import type { IEditor } from 'roosterjs-content-model-types/lib';

/**
 * Options to customize the keyboard handling behavior of Edit plugin
 */

export type EditOptions = {
    /**
     * Whether to handle Tab key in keyboard. @default true
     */
    handleTabKey?: boolean;

    /**
     * Whether expanded selection within a text node should be handled by CM when pressing Backspace/Delete key.
     * @default true
     */
    handleExpandedSelectionOnDelete?: boolean;

    /**
     * Callback function to determine whether the Rooster should handle the Enter key press.
     * If the function returns true, the Rooster will handle the Enter key press instead of the browser.
     * @param editor - The editor instance.
     * @returns A boolean
     */
    shouldHandleEnterKey?: ((editor: IEditor) => boolean) | boolean;

    /**
     * Callback or boolean to determine whether the browser (not Content Model) should handle the Backspace key press.
     * If the value/callback returns true, Rooster will NOT handle Backspace and will defer to the browser's native behavior.
     * @param editor - The editor instance (when using callback).
     * @returns A boolean
     */
    shouldHandleBackspaceKey?: ((editor: IEditor) => boolean) | boolean;

    /**
     * An array of format keys that should be kept when pressing Enter key to split a paragraph.
     * For example, if the formatToKeep contains 'fontFamily', when pressing Enter in a paragraph with fontFamily='Arial',
     * the new paragraph will also have fontFamily='Arial'.
     */
    formatsToKeep?: string[];
};
