import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createParagraph, createText } from '../../../lib';
import { mergeFormat } from '../../../lib/modelApi/editing/mergeFormat';

describe('mergeFormat |', () => {
    it('merge Link format keeping emphasis format', () => {
        const model = createContentModelDocument();
        const block = createParagraph();
        const segment = createText(
            'link',
            {},
            {
                format: {
                    href: 'http://test.com/test',
                    underline: true,
                    backgroundColor: 'red',
                    textColor: 'blue',
                },
                dataset: {},
            }
        );

        block.segments.push(segment);
        model.blocks.push(block);

        mergeFormat(
            model,
            {
                backgroundColor: 'newFormat',
                fontFamily: 'newFormat',
                fontSize: 'newFormat',
                fontWeight: 'newFormat',
                italic: false,
                letterSpacing: 'newFormat',
                lineHeight: 'newFormat',
                strikethrough: false,
                superOrSubScriptSequence: 'newFormat',
                textColor: 'newFormat',
                underline: false,
            },
            'keepSourceEmphasisFormat'
        );

        expect(segment.format).toEqual({});
    });
});
