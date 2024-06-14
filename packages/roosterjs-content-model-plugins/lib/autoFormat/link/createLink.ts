import { addLink, ChangeSource, isElementOfType, isNodeOfType } from 'roosterjs-content-model-dom';
import { formatTextSegmentBeforeSelectionMarker, matchLink } from 'roosterjs-content-model-api';
import type { IEditor, LinkData } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createLink(editor: IEditor) {
    let anchorNode: Node | null = null;
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
            onNodeCreated: (_modelElement, node) => {
                if (
                    !anchorNode &&
                    isNodeOfType(node, 'ELEMENT_NODE') &&
                    isElementOfType(node, 'a')
                ) {
                    anchorNode = node;
                }
            },
            getChangeData: () => anchorNode,
        }
    );
}
