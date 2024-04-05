import { addLink } from 'roosterjs-content-model-dom';
import { formatTextSegmentBeforeSelectionMarker } from 'roosterjs-content-model-api';
import { matchLink } from 'roosterjs-content-model-api';
import type { IEditor, LinkData } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createLink(editor: IEditor) {
    formatTextSegmentBeforeSelectionMarker(editor, (_model, linkSegment, _paragraph) => {
        let linkData: LinkData | null = null;
        if (!linkSegment.link && (linkData = matchLink(linkSegment.text))) {
            addLink(linkSegment, {
                format: {
                    href: linkData.normalizedUrl,
                    underline: true,
                },
                dataset: {},
            });
            return true;
        }
        return false;
    });
}
