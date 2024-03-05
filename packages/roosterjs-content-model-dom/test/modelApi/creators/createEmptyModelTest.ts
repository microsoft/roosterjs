import { ContentModelSegmentFormat } from 'roosterjs-content-model-types';
import { createEmptyModel } from '../../../lib/modelApi/creators/createEmptyModel';

describe('createEmptyModel', () => {
    it('no param', () => {
        const result = createEmptyModel();

        expect(result).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('with param', () => {
        const mockedFormat: ContentModelSegmentFormat = {
            fontFamily: 'Arial',
        };
        const result = createEmptyModel(mockedFormat);

        expect(result).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: mockedFormat,
                        },
                        {
                            segmentType: 'Br',
                            format: mockedFormat,
                        },
                    ],
                    segmentFormat: mockedFormat,
                },
            ],
            format: mockedFormat,
        });
    });
});
