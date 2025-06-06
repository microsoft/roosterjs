import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { imageStateFormatHandler } from '../../../lib/formatHandlers/segment/imageStateFormatHandler';
import { setImageState } from '../../../lib/domUtils/hiddenProperties/imageState';
import {
    DomToModelContext,
    ImageStateFormat,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

describe('imageStateFormatHandler.parser', () => {
    let img: HTMLImageElement;
    let context: DomToModelContext;
    let format: ImageStateFormat;

    beforeEach(() => {
        img = document.createElement('img');
        context = createDomToModelContext();
        format = {};
    });

    it('No state', () => {
        imageStateFormatHandler.parse(format, img, context, {});
        expect(format.imageState).toBeUndefined();
    });

    it('Editing state', () => {
        setImageState(img, 'isEditing');
        imageStateFormatHandler.parse(format, img, context, {});
        expect(format.imageState).toBe('isEditing');
    });
});

describe('imageStateFormatHandler.apply', () => {
    let img: HTMLImageElement;
    let context: ModelToDomContext;
    let format: ImageStateFormat;

    beforeEach(() => {
        img = document.createElement('img');
        context = createModelToDomContext();
        format = {};
    });

    it('No state', () => {
        imageStateFormatHandler.apply(format, img, context);
        expect((img as any).__roosterjsHiddenProperty).toBeUndefined();
    });

    it('Editing state', () => {
        format.imageState = 'isEditing';
        imageStateFormatHandler.apply(format, img, context);
        expect((img as any).__roosterjsHiddenProperty['imageState']).toBe('isEditing');
    });
});
