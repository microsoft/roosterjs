import * as isWhiteSpacePreserved from '../../../lib/domUtils/isWhiteSpacePreserved';
import { addTextSegment } from '../../../lib/modelApi/common/addTextSegment';
import { createBr } from '../../../lib/modelApi/creators/createBr';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';

describe('addTextSegment', () => {
    it('Add empty text', () => {
        const group = createContentModelDocument();
        const context = createDomToModelContext();

        addTextSegment(group, '', context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
    });

    it('Add text with space only', () => {
        const group = createContentModelDocument();
        const context = createDomToModelContext();

        addTextSegment(group, '   ', context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [],
                    isImplicit: true,
                },
            ],
        });
    });

    it('Add text with space only, has existing segment', () => {
        const group = createContentModelDocument();
        const para = createParagraph();
        const br = createBr();

        para.segments.push(br);
        group.blocks.push(para);

        const context = createDomToModelContext();

        addTextSegment(group, '   ', context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: '   ',
                        },
                    ],
                },
            ],
        });
    });

    it('Add text with space only, white space preserved', () => {
        const group = createContentModelDocument();
        const context = createDomToModelContext();

        spyOn(isWhiteSpacePreserved, 'isWhiteSpacePreserved').and.returnValue(true);

        addTextSegment(group, '   ', context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: '   ',
                        },
                    ],
                    isImplicit: true,
                },
            ],
        });
    });

    it('Add text, no existing paragraph', () => {
        const group = createContentModelDocument();
        const context = createDomToModelContext();

        addTextSegment(group, 'test', context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                    ],
                    isImplicit: true,
                },
            ],
        });
    });

    it('Add text, to existing paragraph', () => {
        const group = createContentModelDocument();
        const paragraph = createParagraph();

        group.blocks.push(paragraph);

        const context = createDomToModelContext();

        addTextSegment(group, 'test', context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Add text, already in selection', () => {
        const group = createContentModelDocument();
        const context = createDomToModelContext();

        context.isInSelection = true;

        addTextSegment(group, 'test', context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    isImplicit: true,
                },
            ],
        });
    });

    it('Add text, has format', () => {
        const group = createContentModelDocument();
        const context = createDomToModelContext();

        context.segmentFormat.fontFamily = 'Arial';
        context.blockFormat.textAlign = 'end';

        addTextSegment(group, 'test', context);

        expect(group).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: { textAlign: 'end' },
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: { fontFamily: 'Arial' },
                        },
                    ],
                    isImplicit: true,
                },
            ],
        });
    });
});
