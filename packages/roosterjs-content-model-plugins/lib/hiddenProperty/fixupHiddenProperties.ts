import type { HiddenPropertyOptions } from './HiddenPropertyOptions';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 * Maintain hidden properties in DOM after editor content is reset using HTML
 * This includes:
 * TODO: add more checkers here
 */
export function fixupHiddenProperties(editor: IEditor, options: HiddenPropertyOptions) {
    // TODO: We can add more checkers here
}
