import { ChangeSource, createLinkDecorator } from 'roosterjs-content-model-dom';
import { formatTextSegmentBeforeSelectionMarker, matchLink } from 'roosterjs-content-model-api';
import type { IEditor, LinkData } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createLink(editor: IEditor) {
    formatTextSegmentBeforeSelectionMarker(
        editor,
        (_model, linkSegment, _paragraph) => {
            let linkData: LinkData | null = null;
            if (!linkSegment.link && (linkData = matchLink(linkSegment.text))) {
                if (linkData.normalizedUrl) {
                    linkSegment.link = createLinkDecorator({
                        href: linkData.normalizedUrl,
                        underline: true,
                    });
                }

                return true;
            }
            return false;
        },
        {
            changeSource: ChangeSource.AutoLink,
        }
    );
}
