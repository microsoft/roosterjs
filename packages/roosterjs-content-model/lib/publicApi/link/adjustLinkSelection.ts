import { adjustSegmentSelection } from '../../modelApi/selection/adjustSegmentSelection';
import { areSameFormats } from '../../domToModel/utils/areSameFormats';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getSelectedSegments } from '../../modelApi/selection/collectSelections';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Adjust selection to make sure select a hyperlink if any, or a word if original selection is collapsed
 * @return A combination of existing link display text and url if any. If there is no existing link, return selected text and null
 */
export default function adjustLinkSelection(
    editor: IExperimentalContentModelEditor
): [string, string | null] {
    let text = '';
    let url: string | null = null;

    formatWithContentModel(editor, 'adjustLinkSelection', model => {
        const changed = adjustSegmentSelection(
            model,
            target => !!target.isSelected && !!target.link,
            (target, ref) => !!target.link && areSameFormats(target.link.format, ref.link!.format)
        );
        const segments = getSelectedSegments(model, false /*includingFormatHolder*/);

        // TODO: expand selection to a word if selection is collapsed

        text = segments.map(x => (x.segmentType == 'Text' ? x.text : '')).join('');
        url = segments[0]?.link?.format.href || null;

        return changed;
    });

    return [text, url];
}
