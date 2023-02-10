import { ContentModelWithDataset } from '../../../lib/publicTypes/format/ContentModelWithDataset';
import { ListMetadataFormat } from '../../../lib/publicTypes/format/formatParts/ListMetadataFormat';
import { updateListMetadata } from '../../../lib/domUtils/metadata/updateListMetadata';

describe('updateListMetadata', () => {
    it('No value', () => {
        const list: ContentModelWithDataset<ListMetadataFormat> = {
            dataset: {},
        };
        const callback = jasmine.createSpy('callback').and.returnValue(null);

        updateListMetadata(list, callback);

        expect(callback).toHaveBeenCalledWith(null);
        expect(list).toEqual({
            dataset: {},
        });
    });

    it('Empty value', () => {
        const list: ContentModelWithDataset<ListMetadataFormat> = {
            dataset: {
                editingInfo: '',
            },
        };
        const callback = jasmine.createSpy('callback').and.returnValue(null);

        updateListMetadata(list, callback);

        expect(callback).toHaveBeenCalledWith(null);
        expect(list).toEqual({
            dataset: {},
        });
    });

    it('Full valid value, return original value', () => {
        const listFormat: ListMetadataFormat = {
            orderedStyleType: 2,
            unorderedStyleType: 3,
        };
        const list: ContentModelWithDataset<ListMetadataFormat> = {
            dataset: {
                editingInfo: JSON.stringify(listFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.callFake(format => format);

        updateListMetadata(list, callback);

        expect(callback).toHaveBeenCalledWith(listFormat);
        expect(list).toEqual({
            dataset: {
                editingInfo: JSON.stringify(listFormat),
            },
        });
    });

    it('Full valid value, return partial value', () => {
        const listFormat: ListMetadataFormat = {
            orderedStyleType: 2,
            unorderedStyleType: 3,
        };
        const list: ContentModelWithDataset<ListMetadataFormat> = {
            dataset: {
                editingInfo: JSON.stringify(listFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.returnValue('test');

        updateListMetadata(list, callback);

        expect(callback).toHaveBeenCalledWith(listFormat);
        expect(list).toEqual({
            dataset: {
                editingInfo: JSON.stringify(listFormat),
            },
        });
    });

    it('Full valid value, change value', () => {
        const listFormat: ListMetadataFormat = {
            orderedStyleType: 2,
            unorderedStyleType: 3,
        };
        const list: ContentModelWithDataset<ListMetadataFormat> = {
            dataset: {
                editingInfo: JSON.stringify(listFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.callFake(format => {
            const result = {
                ...format,
                orderedStyleType: 4,
            };
            return result;
        });

        updateListMetadata(list, callback);

        expect(callback).toHaveBeenCalledWith(listFormat);

        listFormat.orderedStyleType = 4;
        expect(list).toEqual({
            dataset: {
                editingInfo: JSON.stringify(listFormat),
            },
        });
    });

    it('Full valid value, return null', () => {
        const listFormat: ListMetadataFormat = {
            orderedStyleType: 2,
            unorderedStyleType: 3,
        };
        const list: ContentModelWithDataset<ListMetadataFormat> = {
            dataset: {
                editingInfo: JSON.stringify(listFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.returnValue(null);

        updateListMetadata(list, callback);

        expect(callback).toHaveBeenCalledWith(listFormat);
        expect(list).toEqual({
            dataset: {},
        });
    });

    it('Partial value, return original value', () => {
        const listFormat: ListMetadataFormat = ({
            a: 'b',
        } as any) as ListMetadataFormat;
        const list: ContentModelWithDataset<ListMetadataFormat> = {
            dataset: {
                editingInfo: JSON.stringify(listFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.callFake(format => format);

        updateListMetadata(list, callback);

        expect(callback).toHaveBeenCalledWith({ a: 'b' });
        expect(list).toEqual({
            dataset: {
                editingInfo: '{"a":"b"}',
            },
        });
    });

    it('Partial value, return a valid value', () => {
        const listFormat: ListMetadataFormat = ({
            a: 'b',
        } as any) as ListMetadataFormat;
        const validFormat: ListMetadataFormat = {
            orderedStyleType: 2,
            unorderedStyleType: 3,
        };
        const list: ContentModelWithDataset<ListMetadataFormat> = {
            dataset: {
                editingInfo: JSON.stringify(listFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.returnValue(validFormat);

        updateListMetadata(list, callback);

        expect(callback).toHaveBeenCalledWith({ a: 'b' });
        expect(list).toEqual({
            dataset: {
                editingInfo: JSON.stringify(validFormat),
            },
        });
    });
});
