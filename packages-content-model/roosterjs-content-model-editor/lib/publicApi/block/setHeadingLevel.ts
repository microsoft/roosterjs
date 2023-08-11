import { defaultImplicitFormatMap } from 'roosterjs-content-model-dom';
import { formatParagraphWithContentModel } from '../utils/formatParagraphWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import {
    ContentModelParagraphDecorator,
    ContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

type HeadingLevelTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/**
 * Set heading level of selected paragraphs
 * @param editor The editor to set heading level to
 * @param headingLevel Level of heading, from 1 to 6. Set to 0 means set it back to a regular paragraph
 */
export default function setHeadingLevel(
    editor: IContentModelEditor,
    headingLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6
) {
    formatParagraphWithContentModel(editor, 'setHeadingLevel', para => {
        const tagName =
            headingLevel > 0
                ? (('h' + headingLevel) as HeadingLevelTags | null)
                : getExistingHeadingTag(para.decorator);
        const headingStyle =
            (tagName && (defaultImplicitFormatMap[tagName] as ContentModelSegmentFormat)) || {};

        if (headingLevel > 0) {
            para.decorator = {
                tagName: tagName!,
                format: { ...headingStyle },
            };

            // Remove existing formats since tags have default font size and weight
            para.segments.forEach(segment => {
                delete segment.format.fontSize;
                delete segment.format.fontWeight;
            });
        } else if (tagName) {
            delete para.decorator;
        }
    });
}

function getExistingHeadingTag(
    decorator?: ContentModelParagraphDecorator
): HeadingLevelTags | null {
    const tag = decorator?.tagName || '';
    const level = parseInt(tag.substring(1));

    return level >= 1 && level <= 6 ? (tag as HeadingLevelTags) : null;
}
