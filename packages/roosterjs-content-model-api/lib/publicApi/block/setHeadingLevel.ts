import { createParagraphDecorator } from 'roosterjs-content-model-dom';
import { formatParagraphWithContentModel } from '../utils/formatParagraphWithContentModel';
import type { ContentModelParagraphDecorator, IEditor } from 'roosterjs-content-model-types';

type HeadingLevelTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const HeaderFontSizes: Record<HeadingLevelTags, string> = {
    h1: '2em',
    h2: '1.5em',
    h3: '1.17em',
    h4: '1em',
    h5: '0.83em',
    h6: '0.67em',
};
const MinHeadingLevel = 1;
const MaxHeadingLevel = 6;

/**
 * Set heading level of selected paragraphs
 * @param editor The editor to set heading level to
 * @param headingLevel Level of heading, from 1 to 6. Set to 0 means set it back to a regular paragraph
 */
export function setHeadingLevel(editor: IEditor, headingLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6) {
    editor.focus();

    formatParagraphWithContentModel(editor, 'setHeadingLevel', para => {
        if (headingLevel >= MinHeadingLevel && headingLevel <= MaxHeadingLevel) {
            const tagName = ('h' + headingLevel) as HeadingLevelTags;

            para.decorator = createParagraphDecorator(tagName, {
                fontWeight: 'bold',
                fontSize: HeaderFontSizes[tagName],
            });

            // Remove existing formats since tags have default font size and weight
            para.segments.forEach(segment => {
                delete segment.format.fontSize;
                delete segment.format.fontWeight;
            });
        } else {
            // Delete exiting heading decorator if any
            const tagName = getExistingHeadingTag(para.decorator);

            if (tagName) {
                delete para.decorator;
            }
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
