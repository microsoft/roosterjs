import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { imageMarkerFormatHandler } from '../../../lib/formatHandlers/segment/imageMarkerFormatHandler';
import { setImageMarker } from '../../../lib/domUtils/hiddenProperties/imageMarker';
import {
    DomToModelContext,
    ImageMarkerFormat,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

describe('imageMarkerFormatHandler.parser', () => {
    let img: HTMLImageElement;
    let context: DomToModelContext;
    let format: ImageMarkerFormat;

    beforeEach(() => {
        img = document.createElement('img');
        context = createDomToModelContext();
        format = {};
    });

    it('No marker', () => {
        imageMarkerFormatHandler.parse(format, img, context, {});
        expect(format.imageMarker).toBeUndefined();
    });

    it('Editing marker', () => {
        setImageMarker(img, 'isEditing');
        imageMarkerFormatHandler.parse(format, img, context, {});
        expect(format.imageMarker).toBe('isEditing');
    });
});

describe('imageMarkerFormatHandler.apply', () => {
    let img: HTMLImageElement;
    let context: ModelToDomContext;
    let format: ImageMarkerFormat;

    beforeEach(() => {
        img = document.createElement('img');
        context = createModelToDomContext();
        format = {};
    });

    it('No marker', () => {
        imageMarkerFormatHandler.apply(format, img, context);
        expect((img as any).__roosterjsHiddenProperty).toBeUndefined();
    });

    it('Editing marker', () => {
        format.imageMarker = 'isEditing';
        imageMarkerFormatHandler.apply(format, img, context);
        expect((img as any).__roosterjsHiddenProperty['imageMarker']).toBe('isEditing');
    });
});
