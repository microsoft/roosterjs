import { ContentModelImage } from '../../../lib/publicTypes/segment/ContentModelImage';
import { ImageMetadataFormat } from '../../../lib/publicTypes/format/formatParts/ImageMetadataFormat';
import { updateImageMetadata } from '../../../lib/domUtils/metadata/updateImageMetadata';

describe('updateImageMetadataTest', () => {
    it('No value', () => {
        const image: ContentModelImage = {
            segmentType: 'Image',
            format: {},
            src: 'test',
            dataset: {},
        };
        const callback = jasmine.createSpy('callback').and.returnValue(null);

        updateImageMetadata(image, callback);

        expect(callback).toHaveBeenCalledWith(null);
        expect(image).toEqual({
            segmentType: 'Image',
            format: {},
            src: 'test',
            dataset: {},
        });
    });

    it('Empty value', () => {
        const image: ContentModelImage = {
            segmentType: 'Image',
            format: {},
            src: 'test',
            dataset: {
                editingInfo: '',
            },
        };
        const callback = jasmine.createSpy('callback').and.returnValue(null);

        updateImageMetadata(image, callback);

        expect(callback).toHaveBeenCalledWith(null);
        expect(image).toEqual({
            segmentType: 'Image',
            format: {},
            src: 'test',
            dataset: {},
        });
    });

    it('Full valid value, return original value', () => {
        const imageFormat: ImageMetadataFormat = {
            widthPx: 1,
            heightPx: 2,
            leftPercent: 3,
            rightPercent: 4,
            topPercent: 5,
            bottomPercent: 6,
            angleRad: 7,
            naturalHeight: 8,
            naturalWidth: 9,
            src: 'test',
        };
        const image: ContentModelImage = {
            segmentType: 'Image',
            format: {},
            src: 'test',
            dataset: {
                editingInfo: JSON.stringify(imageFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.callFake(format => format);

        updateImageMetadata(image, callback);

        expect(callback).toHaveBeenCalledWith(imageFormat);
        expect(image).toEqual({
            segmentType: 'Image',
            format: {},
            src: 'test',
            dataset: {
                editingInfo: JSON.stringify(imageFormat),
            },
        });
    });

    it('Full valid value, return invalid value', () => {
        const imageFormat: ImageMetadataFormat = {
            widthPx: 1,
            heightPx: 2,
            leftPercent: 3,
            rightPercent: 4,
            topPercent: 5,
            bottomPercent: 6,
            angleRad: 7,
            naturalHeight: 8,
            naturalWidth: 9,
            src: 'test',
        };
        const image: ContentModelImage = {
            segmentType: 'Image',
            format: {},
            src: 'test',
            dataset: {
                editingInfo: JSON.stringify(imageFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.returnValue({
            widthPx: 1,
            heightPx: 2,
        });

        updateImageMetadata(image, callback);

        expect(callback).toHaveBeenCalledWith(imageFormat);
        expect(image).toEqual({
            segmentType: 'Image',
            format: {},
            src: 'test',
            dataset: {
                editingInfo: JSON.stringify(imageFormat),
            },
        });
    });

    it('Full valid value, change value', () => {
        const imageFormat: ImageMetadataFormat = {
            widthPx: 1,
            heightPx: 2,
            leftPercent: 3,
            rightPercent: 4,
            topPercent: 5,
            bottomPercent: 6,
            angleRad: 7,
            naturalHeight: 8,
            naturalWidth: 9,
            src: 'test',
        };
        const image: ContentModelImage = {
            segmentType: 'Image',
            format: {},
            src: 'test',
            dataset: {
                editingInfo: JSON.stringify(imageFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.callFake(format => {
            const result = {
                ...format,
                widthPx: 2,
            };
            return result;
        });

        updateImageMetadata(image, callback);

        expect(callback).toHaveBeenCalledWith(imageFormat);

        imageFormat.widthPx = 2;
        expect(image).toEqual({
            segmentType: 'Image',
            format: {},
            src: 'test',
            dataset: {
                editingInfo: JSON.stringify(imageFormat),
            },
        });
    });

    it('Full valid value, return null', () => {
        const imageFormat: ImageMetadataFormat = {
            widthPx: 1,
            heightPx: 2,
            leftPercent: 3,
            rightPercent: 4,
            topPercent: 5,
            bottomPercent: 6,
            angleRad: 7,
            naturalHeight: 8,
            naturalWidth: 9,
            src: 'test',
        };
        const image: ContentModelImage = {
            segmentType: 'Image',
            format: {},
            src: 'test',
            dataset: {
                editingInfo: JSON.stringify(imageFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.returnValue(null);

        updateImageMetadata(image, callback);

        expect(callback).toHaveBeenCalledWith(imageFormat);
        expect(image).toEqual({
            segmentType: 'Image',
            format: {},
            src: 'test',
            dataset: {},
        });
    });

    it('Partial valid value, return original value', () => {
        const imageFormat: ImageMetadataFormat = {
            widthPx: 1,
            heightPx: 2,
            leftPercent: 3,
        };
        const image: ContentModelImage = {
            segmentType: 'Image',
            format: {},
            src: 'test',
            dataset: {
                editingInfo: JSON.stringify(imageFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.callFake(format => format);

        updateImageMetadata(image, callback);

        expect(callback).toHaveBeenCalledWith(null);
        expect(image).toEqual({
            segmentType: 'Image',
            format: {},
            src: 'test',
            dataset: {},
        });
    });

    it('Partial valid value, return a valid value', () => {
        const imageFormat: ImageMetadataFormat = {
            widthPx: 1,
            heightPx: 2,
            leftPercent: 3,
        };
        const validFormat = {
            widthPx: 1,
            heightPx: 2,
            leftPercent: 3,
            rightPercent: 4,
            topPercent: 5,
            bottomPercent: 6,
            angleRad: 7,
            naturalHeight: 8,
            naturalWidth: 9,
            src: 'test',
        };
        const image: ContentModelImage = {
            segmentType: 'Image',
            format: {},
            src: 'test',
            dataset: {
                editingInfo: JSON.stringify(imageFormat),
            },
        };
        const callback = jasmine.createSpy('callback').and.returnValue(validFormat);

        updateImageMetadata(image, callback);

        expect(callback).toHaveBeenCalledWith(null);
        expect(image).toEqual({
            segmentType: 'Image',
            format: {},
            src: 'test',
            dataset: {
                editingInfo: JSON.stringify(validFormat),
            },
        });
    });
});
