import { addLink, ChangeSource } from 'roosterjs-content-model-dom';
import { formatTextSegmentBeforeSelectionMarker, matchLink } from 'roosterjs-content-model-api';
import type { ContentModelLink, IEditor, LinkData } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createLink(editor: IEditor) {
    let anchorNode: Node | null = null;
    const links: ContentModelLink[] = [];
    formatTextSegmentBeforeSelectionMarker(
        editor,
        (_model, linkSegment, _paragraph) => {
            if (linkSegment.link) {
                links.push(linkSegment.link);
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
                if (linkSegment.link) {
                    links.push(linkSegment.link);
                }
                return true;
            }

            return false;
        },
        {
            changeSource: ChangeSource.AutoLink,
            onNodeCreated: (modelElement, node) => {
                if (!anchorNode && links.indexOf(modelElement as ContentModelLink) >= 0) {
                    anchorNode = node;
                }
            },
            getChangeData: () => anchorNode,
        }
    );
}
