import getObjectKeys from '../jsUtils/getObjectKeys';
import { DocumentCommand, PendableFormatState } from 'roosterjs-editor-types';

/**
 * Names of Pendable formats
 */
export type PendableFormatNames = keyof PendableFormatState;

/**
 * A map from pendable format name to document command
 */
export const PendableFormatCommandMap: { [key in PendableFormatNames]: DocumentCommand } = {
    /**
     * Bold
     */
    isBold: DocumentCommand.Bold,

    /**
     * Italic
     */
    isItalic: DocumentCommand.Italic,

    /**
     * Underline
     */
    isUnderline: DocumentCommand.Underline,

    /**
     * StrikeThrough
     */
    isStrikeThrough: DocumentCommand.StrikeThrough,

    /**
     * Subscript
     */
    isSubscript: DocumentCommand.Subscript,

    /**
     * Superscript
     */
    isSuperscript: DocumentCommand.Superscript,
};

/**
 * Get Pendable Format State at cursor.
 * @param document The HTML Document to get format state from
 * @returns A PendableFormatState object which contains the values of pendable format states
 */
export default function getPendableFormatState(document: Document): PendableFormatState {
    let keys = getObjectKeys(PendableFormatCommandMap);

    return keys.reduce((state, key) => {
        state[key] = document.queryCommandState(PendableFormatCommandMap[key]);
        return state;
    }, <PendableFormatState>{});
}
