import { getLinkSegment } from './getLinkSegment';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function unlink(editor: IEditor, rawEvent: KeyboardEvent) {
    editor.formatContentModel(model => {
        const link = getLinkSegment(model);
        if (link?.link) {
            link.link = undefined;
            rawEvent.preventDefault();
            return true;
        }

        return false;
    });
}
