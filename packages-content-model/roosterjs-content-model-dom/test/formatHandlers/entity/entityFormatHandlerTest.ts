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

    it('Real entity, block entity', () => {
        div.className = '_Entity _EId_A _EType_B _EReadonly_1 _EBlock';
        entityFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            id: 'A',
            entityType: 'B',
            isReadonly: true,
            isBlock: true,
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

    it('Real entity with entity info and block', () => {
        format.id = 'A';
        format.entityType = 'B';
        format.isReadonly = true;
        format.isBlock = true;
        entityFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe(
            '<div class="_Entity _EType_B _EId_A _EReadonly_1 _EBlock" contenteditable="false" style="width: 100%;"></div>'
        );
    });

    it('Real entity with entity info and block and div with different width than 100%', () => {
        format.id = 'A';
        format.entityType = 'B';
        format.isReadonly = true;
        format.isBlock = true;
        div.style.width = '600px';
        entityFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe(
            '<div class="_Entity _EType_B _EId_A _EReadonly_1 _EBlock" contenteditable="false" style="width: 100%;"></div>'
        );
    });
});
