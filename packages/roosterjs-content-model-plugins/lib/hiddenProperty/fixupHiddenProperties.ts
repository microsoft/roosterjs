import { setLinkUndeletable } from 'roosterjs-content-model-dom';
import type { HiddenPropertyOptions } from './HiddenPropertyOptions';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 * Maintain hidden properties in DOM after editor content is reset using HTML
 * This includes:
 * 1. Undeletable property
 */
export function fixupHiddenProperties(editor: IEditor, options: HiddenPropertyOptions) {
    if (options.undeletableLinkChecker) {
        checkUndeletable(editor, options.undeletableLinkChecker);
    }

    // Add more hidden properties checkers here
}

function checkUndeletable(editor: IEditor, checker: (link: HTMLAnchorElement) => boolean) {
    const anchors = editor.getDOMHelper().queryElements('a');

    for (const a of anchors) {
        if (checker(a)) {
            setLinkUndeletable(a, true);
        }
    }
}
