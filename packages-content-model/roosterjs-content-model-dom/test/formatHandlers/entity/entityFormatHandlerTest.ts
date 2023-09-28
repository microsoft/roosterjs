import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { entityFormatHandler } from '../../../lib/formatHandlers/entity/entityFormatHandler';
import {
    DomToModelContext,
    EntityInfoFormat,
    IdFormat,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

describe('entityFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: EntityInfoFormat & IdFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    it('Not an entity', () => {
        entityFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            isFakeEntity: true,
            isReadonly: true,
        });
    });

    it('Not an entity, content editable', () => {
        div.contentEditable = 'true';
        entityFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            isFakeEntity: true,
            isReadonly: false,
        });
    });

    it('Real entity', () => {
        div.className = '_Entity _EId_A _EType_B _EReadonly_1';
        entityFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            id: 'A',
            entityType: 'B',
            isReadonly: true,
        });
    });
});

describe('entityFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: EntityInfoFormat & IdFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No format', () => {
        entityFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div class="_Entity _EType_ _EReadonly_0"></div>');
    });

    it('Fake entity with entity info', () => {
        format.isFakeEntity = true;
        format.id = 'A';
        format.entityType = 'B';
        format.isReadonly = true;
        entityFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div contenteditable="false"></div>');
    });

    it('Real entity with entity info', () => {
        format.id = 'A';
        format.entityType = 'B';
        format.isReadonly = true;
        entityFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe(
            '<div class="_Entity _EType_B _EId_A _EReadonly_1" contenteditable="false"></div>'
        );
    });
});
