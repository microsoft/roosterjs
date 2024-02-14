import { adjustSegmentSelection } from '../../modelApi/selection/adjustSegmentSelection';
import { getSelectedSegments } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Remove link at selection. If no links at selection, do nothing.
 * If selection contains multiple links, all of the link styles will be removed.
 * If only part of a link is selected, the whole link style will be removed.
 * @param editor The editor instance
 */
export default function removeLink(editor: IEditor) {
    editor.focus();

    editor.formatContentModel(
        model => {
            adjustSegmentSelection(
                model,
                target => !!target.isSelected && !!target.link,
                (target, ref) =>
                    target.isSelected || // Expand the selection to any link that is involved. So we can remove multiple links together
                    (!!target.link && target.link.format.href == ref.link!.format.href)
            );

            const segments = getSelectedSegments(model, false /*includingFormatHolder*/);
            let isChanged = false;

            segments.forEach(segment => {
                if (segment.link) {
                    isChanged = true;

                    delete segment.link;
                }
            });

            return isChanged;
        },
        {
            apiName: 'removeLink',
        }
    );
}
