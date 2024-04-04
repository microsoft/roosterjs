import { formatTextSegmentBeforeSelectionMarker } from '../../pluginUtils/formatTextSegmentBeforeSelectionMarker';

import type { IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function unlink(editor: IEditor, rawEvent: KeyboardEvent) {
    formatTextSegmentBeforeSelectionMarker(editor, (_model, linkSegment, _paragraph) => {
        if (linkSegment?.link) {
            linkSegment.link = undefined;
            rawEvent.preventDefault();

            return true;
        }
        return false;
    });
}
