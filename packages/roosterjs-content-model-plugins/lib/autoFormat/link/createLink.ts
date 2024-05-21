import { addLink, ChangeSource } from 'roosterjs-content-model-dom';
import { formatTextSegmentBeforeSelectionMarker, matchLink } from 'roosterjs-content-model-api';
import type { ContentChangedEvent, IEditor, LinkData } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createLink(editor: IEditor, event: ContentChangedEvent) {
    formatTextSegmentBeforeSelectionMarker(
        editor,
        (_model, linkSegment, _paragraph) => {
            if (linkSegment.link) {
                return true;
            }
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
        },
        {
            changeSource: ChangeSource.AutoLink,
            getChangeData: () => {
                return event.data;
            },
        }
    );
}
