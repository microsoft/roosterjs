import { ChangeSource } from 'roosterjs-content-model-dom';
import { formatTextSegmentBeforeSelectionMarker, promoteLink } from 'roosterjs-content-model-api';
import type {
    ContentModelLink,
    IEditor,
    ContentModelText,
    AutoLinkOptions,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createLink(editor: IEditor, autoLinkOptions: AutoLinkOptions) {
    let anchorNode: Node | null = null;
    const links: ContentModelLink[] = [];

    formatTextSegmentBeforeSelectionMarker(
        editor,
        (_model, segment, paragraph) => {
            let promotedSegment: ContentModelText | null = null;

            if (segment.link) {
                links.push(segment.link);

                return true;
            } else if (
                (promotedSegment = promoteLink(segment, paragraph, autoLinkOptions)) &&
                promotedSegment.link
            ) {
                links.push(promotedSegment.link);

                return true;
            } else {
                return false;
            }
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
