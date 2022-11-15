import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createText } from '../../../lib/modelApi/creators/createText';
import { setSegmentStyle } from '../../../lib/modelApi/segment/setSegmentStyle';

describe('setSegmentStyle', () => {
    it('empty doc', () => {
        const group = createContentModelDocument(document);
        const result = setSegmentStyle(group, segment => (segment.format.fontFamily = 'test'));
        expect(group).toEqual({
            blockGroupType: 'Document',
            document,
            blocks: [],
        });
        expect(result).toBeFalse();
    });

    it('doc with selection', () => {
        const group = createContentModelDocument(document);
        const para = createParagraph();
        const text = createText('test');

        text.isSelected = true;

        para.segments.push(text);
        group.blocks.push(para);

        const result = setSegmentStyle(group, segment => (segment.format.fontFamily = 'test'));
        expect(group).toEqual({
            blockGroupType: 'Document',
            document,
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            isSelected: true,
                            format: {
                                fontFamily: 'test',
                            },
                        },
                    ],
                },
            ],
        });
        expect(result).toBeTrue();
    });

    it('doc with selection, all segments are already in expected state', () => {
        const group = createContentModelDocument(document);
        const para = createParagraph();
        const text = createText('test');

        text.isSelected = true;

        para.segments.push(text);
        group.blocks.push(para);

        const segmentHasStyleCallback = jasmine.createSpy().and.returnValue(true);
        const toggleStyleCallback = jasmine
            .createSpy()
            .and.callFake(segment => (segment.format.fontFamily = 'test'));
        const result = setSegmentStyle(group, toggleStyleCallback, segmentHasStyleCallback);

        expect(group).toEqual({
            blockGroupType: 'Document',
            document,
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            isSelected: true,
                            format: {
                                fontFamily: 'test',
                            },
                        },
                    ],
                },
            ],
        });
        expect(result).toBeTrue();
        expect(segmentHasStyleCallback).toHaveBeenCalledTimes(1);
        expect(segmentHasStyleCallback).toHaveBeenCalledWith(text, 0, [text]);
        expect(toggleStyleCallback).toHaveBeenCalledTimes(1);
        expect(toggleStyleCallback).toHaveBeenCalledWith(text, false);
    });

    it('doc with selection, some segments are in expected state', () => {
        const group = createContentModelDocument(document);
        const para = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');

        text1.isSelected = true;
        text3.isSelected = true;

        para.segments.push(text1);
        para.segments.push(text2);
        para.segments.push(text3);
        group.blocks.push(para);

        const segmentHasStyleCallback = jasmine
            .createSpy()
            .and.callFake(segment => segment == text1);
        const toggleStyleCallback = jasmine
            .createSpy()
            .and.callFake(segment => (segment.format.fontFamily = 'test'));
        const result = setSegmentStyle(group, toggleStyleCallback, segmentHasStyleCallback);

        expect(group).toEqual({
            blockGroupType: 'Document',
            document,
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test1',
                            isSelected: true,
                            format: {
                                fontFamily: 'test',
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: 'test2',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'test3',
                            isSelected: true,
                            format: {
                                fontFamily: 'test',
                            },
                        },
                    ],
                },
            ],
        });
        expect(result).toBeTrue();
        expect(segmentHasStyleCallback).toHaveBeenCalledTimes(2);
        expect(segmentHasStyleCallback).toHaveBeenCalledWith(text1, 0, [text1, text3]);
        expect(segmentHasStyleCallback).toHaveBeenCalledWith(text3, 1, [text1, text3]);
        expect(toggleStyleCallback).toHaveBeenCalledTimes(2);
        expect(toggleStyleCallback).toHaveBeenCalledWith(text1, true);
        expect(toggleStyleCallback).toHaveBeenCalledWith(text3, true);
    });
});
