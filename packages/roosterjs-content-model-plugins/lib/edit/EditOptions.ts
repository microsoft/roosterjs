import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Options for handling Tab key in Edit plugin
 */
export interface HandleTabOptions {
    /**
     * Whether to indent/outdent multiple selected blocks when Tab/Shift+Tab is pressed and multiple blocks are selected.
     * @default true
     */
    indentMultipleBlocks?: boolean;

    /**
     * Whether to indent/outdent table cells when Tab key is pressed and a table is selected
     * @default true
     */
    indentTable?: boolean;

    /**
     * Whether to append a new row when Tab key is pressed in the last cell of a table
     * @default true
     */
    appendTableRow?: boolean;

    /**
     * Whether to indent/outdent list items when Tab key is pressed
     * @default true
     */
    indentList?: boolean;

    /**
     * Whether to indent/outdent paragraph when Tab key is pressed
     * @default true
     */
    indentParagraph?: boolean;
}

/**
 * Options to customize the keyboard handling behavior of Edit plugin
 */

export type EditOptions = {
    /**
     * Whether to handle Tab key in keyboard, or an object to control specific Tab key behaviors.
     * When true, all Tab features are enabled. When false, all are disabled.
     * When an object, individual features can be controlled via HandleTabOptions.
     * @default true
     */
    handleTabKey?: HandleTabOptions | boolean;

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
     * An array of format property names that should be preserved when merging paragraphs
     * during editing operations such as pressing Enter, Backspace, or Delete keys.
     * This ensures consistent formatting is maintained across paragraph operations.
     *
     * @example
     * // Preserve font family and class name during paragraph operations
     * formatsToPreserveOnMerge: ['fontFamily', 'className']
     *
     * // When pressing Enter in a paragraph with fontFamily='Arial' and className='highlight',
     * // the new paragraph will inherit both properties: fontFamily='Arial' and className='highlight'
     *
     * // When pressing Backspace to merge two paragraphs, the preserved formats from the first
     * // paragraph will be applied to the merged result
     */
    formatsToPreserveOnMerge?: string[];
};
