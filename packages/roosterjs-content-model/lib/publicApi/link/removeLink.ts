import { adjustSegmentSelection } from '../../modelApi/selection/adjustSegmentSelection';
import { areSameFormats } from '../../domToModel/utils/areSameFormats';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getSelectedSegments } from '../../modelApi/selection/collectSelections';
import { HyperLinkColorPlaceholder } from '../../formatHandlers/utils/defaultStyles';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Remove link at selection. If no links at selection, do nothing.
 * If selection contains multiple links, all of the link styles will be removed.
 * If only part of a link is selected, the whole link style will be removed.
 * @param editor The editor instance
 */
export default function removeLink(editor: IExperimentalContentModelEditor) {
    formatWithContentModel(editor, 'removeLink', model => {
        adjustSegmentSelection(
            model,
            target => !!target.isSelected && !!target.link,
            (target, ref) =>
                target.isSelected || // Expand the selection to any link that is involved. So we can remove multiple links together
                (!!target.link && areSameFormats(target.link.format, ref.link!.format))
        );

        const segments = getSelectedSegments(model, false /*includingFormatHolder*/);
        let isChanged = false;

        segments.forEach(segment => {
            if (segment.link) {
                isChanged = true;

                if (segment.format.textColor == HyperLinkColorPlaceholder) {
                    delete segment.format.textColor;
                }

                segment.format.underline = false;
                delete segment.link;
            }
        });

        return isChanged;
    });
}
