import { addLink, ChangeSource } from 'roosterjs-content-model-dom';
import { formatTextSegmentBeforeSelectionMarker } from 'roosterjs-content-model-api';
import { getLinkUrl } from './getLinkUrl';
import type { ContentModelLink, IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createLink(
    editor: IEditor,
    autoLink?: boolean,
    autoTel?: boolean,
    autoMailto?: boolean
) {
    let anchorNode: Node | null = null;
    const links: ContentModelLink[] = [];
    formatTextSegmentBeforeSelectionMarker(
        editor,
        (_model, linkSegment, _paragraph) => {
            if (linkSegment.link) {
                links.push(linkSegment.link);
                return true;
            }
            let linkUrl: string | undefined = undefined;
            if (
                !linkSegment.link &&
                (linkUrl = getLinkUrl(linkSegment.text, autoLink, autoTel, autoMailto))
            ) {
                addLink(linkSegment, {
                    format: {
                        href: linkUrl,
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
