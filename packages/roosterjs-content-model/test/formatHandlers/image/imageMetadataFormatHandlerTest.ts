import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ImageMetadataFormat } from '../../../lib/publicTypes/format/formatParts/ImageMetadataFormat';
import { imageMetadataFormatHandler } from '../../../lib/formatHandlers/image/imageMetadataFormatHandler';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('imageMetadataFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: ImageMetadataFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    function runTest(metadata: any, expectedValue: ImageMetadataFormat) {
        if (metadata) {
            div.dataset.editingInfo = JSON.stringify(metadata);
        }

        imageMetadataFormatHandler.parse(format, div, context, {});

        expect(format).toEqual(expectedValue);
    }

    it('No value', () => {
        imageMetadataFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('Empty value', () => {
        runTest({}, {});
    });

    it('Full valid value', () => {
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
        runTest(imageFormat, imageFormat);
    });

    it('Partial valid value 1', () => {
        const imageFormat: ImageMetadataFormat = {
            widthPx: 1,
            heightPx: 2,
            leftPercent: 3,
        };

        runTest(imageFormat, {});
    });
});

describe('imageMetadataFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: ImageMetadataFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    function runTest(imageFormat: ImageMetadataFormat | null, expectedValue: any) {
        if (imageFormat) {
            format = imageFormat;
        }

        imageMetadataFormatHandler.apply(format, div, context);

        if (div.dataset.editingInfo) {
            const result = JSON.parse(div.dataset.editingInfo);
            expect(result).toEqual(expectedValue);
        } else {
            expect(expectedValue).toBeNull();
        }
    }

    it('No value', () => {
        runTest(null, null);
    });

    it('Empty value', () => {
        runTest({}, null);
    });

    it('Full value', () => {
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

        runTest(imageFormat, imageFormat);
    });

    it('Invalid value', () => {
        runTest(
            {
                widthPx: 1,
            },
            null
        );
    });
});
