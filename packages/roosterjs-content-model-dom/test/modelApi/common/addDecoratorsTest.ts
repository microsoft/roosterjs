import { addCode, addData, addLink } from '../../../lib/modelApi/common/addDecorators';
import {
    ContentModelCode,
    ContentModelData,
    ContentModelLink,
} from 'roosterjs-content-model-types';
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

    it('has anchor', () => {
        const segment = createSelectionMarker();
        const link: ContentModelLink = {
            format: {
                name: 'name',
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
                    name: 'name',
                },
                dataset: {},
            },
        });

        link.format.name = 'name2';

        expect(segment).toEqual({
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
            link: {
                format: {
                    name: 'name',
                },
                dataset: {},
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

describe('addData', () => {
    it('no data', () => {
        const segment = createSelectionMarker();
        const data: ContentModelData = {
            format: {},
        };
        addData(segment, data);

        expect(segment).toEqual({
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
        });
    });

    it('has data value', () => {
        const segment = createSelectionMarker();
        const data: ContentModelData = {
            format: {
                dataValue: '123',
            },
        };
        addData(segment, data);

        expect(segment).toEqual({
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
            data: {
                format: {
                    dataValue: '123',
                },
            },
        });

        data.format.dataValue = '456';

        expect(segment).toEqual({
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
            data: {
                format: {
                    dataValue: '123',
                },
            },
        });
    });

    it('has empty data value', () => {
        const segment = createSelectionMarker();
        const data: ContentModelData = {
            format: {
                dataValue: '',
            },
        };
        addData(segment, data);

        expect(segment).toEqual({
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
            data: {
                format: {
                    dataValue: '',
                },
            },
        });
    });
});
