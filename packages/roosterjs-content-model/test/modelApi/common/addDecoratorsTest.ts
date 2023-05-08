import { addCode, addLink } from '../../../lib/modelApi/common/addDecorators';
import { ContentModelCode } from '../../../lib/publicTypes/decorator/ContentModelCode';
import { ContentModelLink } from '../../../lib/publicTypes/decorator/ContentModelLink';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';

describe('addLink', () => {
    it('no link', () => {
        const segment = createSelectionMarker();
        const link: ContentModelLink = {
            format: {},
            dataset: {},
        };
        addLink(segment, link);

        expect(segment).toEqual({
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
        });
    });

    it('has link', () => {
        const segment = createSelectionMarker();
        const link: ContentModelLink = {
            format: {
                href: 'test',
            },
            dataset: {},
        };
        addLink(segment, link);

        expect(segment).toEqual({
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
            link: {
                format: {
                    href: 'test',
                },
                dataset: {},
            },
        });

        link.format.href = 'test2';

        expect(segment).toEqual({
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
            link: {
                format: {
                    href: 'test',
                },
                dataset: {},
            },
        });
    });

    it('has link and dataset', () => {
        const segment = createSelectionMarker();
        const link: ContentModelLink = {
            format: {
                href: 'test',
            },
            dataset: {
                a: 'b',
                c: 'd',
            },
        };
        addLink(segment, link);

        expect(segment).toEqual({
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
            link: {
                format: {
                    href: 'test',
                },
                dataset: {
                    a: 'b',
                    c: 'd',
                },
            },
        });

        link.dataset.a = 'e';

        expect(segment).toEqual({
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
            link: {
                format: {
                    href: 'test',
                },
                dataset: {
                    a: 'b',
                    c: 'd',
                },
            },
        });
    });
});

describe('addCode', () => {
    it('no code', () => {
        const segment = createSelectionMarker();
        const code: ContentModelCode = {
            format: {},
        };
        addCode(segment, code);

        expect(segment).toEqual({
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
        });
    });

    it('has code', () => {
        const segment = createSelectionMarker();
        const code: ContentModelCode = {
            format: {
                fontFamily: 'monospace',
            },
        };
        addCode(segment, code);

        expect(segment).toEqual({
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
            code: {
                format: {
                    fontFamily: 'monospace',
                },
            },
        });

        code.format.fontFamily = 'Arial';

        expect(segment).toEqual({
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
            code: {
                format: {
                    fontFamily: 'monospace',
                },
            },
        });
    });
});
