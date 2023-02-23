import { adjustSegmentSelection } from '../../modelApi/selection/adjustSegmentSelection';
import { adjustWordSelection } from '../../modelApi/selection/adjustWordSelection';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getSelectedSegments } from '../../modelApi/selection/collectSelections';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { setSelection } from '../../modelApi/selection/setSelection';

/**
 * Adjust selection to make sure select a hyperlink if any, or a word if original selection is collapsed
 * @return A combination of existing link display text and url if any. If there is no existing link, return selected text and null
 */
export default function adjustLinkSelection(editor: IContentModelEditor): [string, string | null] {
    let text = '';
    let url: string | null = null;

    formatWithContentModel(editor, 'adjustLinkSelection', model => {
        let changed = adjustSegmentSelection(
            model,
            target => !!target.isSelected && !!target.link,
            (target, ref) => !!target.link && target.link.format.href == ref.link!.format.href
        );
        let segments = getSelectedSegments(model, false /*includingFormatHolder*/);
        const firstSegment = segments[0];

        if (segments.length == 1 && firstSegment.segmentType == 'SelectionMarker') {
            segments = adjustWordSelection(model, firstSegment);

            if (segments.length > 1) {
                changed = true;
                setSelection(model, segments[0], segments[segments.length - 1]);
            }
        }

        text = segments.map(x => (x.segmentType == 'Text' ? x.text : '')).join('');
        url = segments[0]?.link?.format.href || null;

        return changed;
    });

    return [text, url];
}
