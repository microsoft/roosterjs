import * as addDelimiters from 'roosterjs-editor-dom/lib/delimiter/addDelimiters';
import { ContentModelEntity } from '../../../lib/publicTypes/entity/ContentModelEntity';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleEntity } from '../../../lib/modelToDom/handlers/handleEntity';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleEntity', () => {
    let context: ModelToDomContext;

    beforeEach(() => {
        context = createModelToDomContext();
        spyOn(addDelimiters, 'default').and.callFake(() => []);
    });

    it('Simple block entity', () => {
        const div = document.createElement('div');
        const entityModel: ContentModelEntity = {
            blockType: 'Entity',
            segmentType: 'Entity',
            format: {},
            id: 'entity_1',
            type: 'entity',
            isReadonly: true,
            wrapper: div,
        };

        const parent = document.createElement('div');

        context.addDelimiterForEntity = false;
        handleEntity(document, parent, entityModel, context, null);

        expect(parent.innerHTML).toBe(
            '<div class="_Entity _EType_entity _EId_entity_1 _EReadonly_1" contenteditable="false"></div>'
        );
        expect(div.outerHTML).toBe(
            '<div class="_Entity _EType_entity _EId_entity_1 _EReadonly_1" contenteditable="false"></div>'
        );
        expect(addDelimiters.default).toHaveBeenCalledTimes(0);
    });

    it('Fake entity', () => {
        const div = document.createElement('div');
        const entityModel: ContentModelEntity = {
            blockType: 'Entity',
            segmentType: 'Entity',
            format: {},
            wrapper: div,
            isReadonly: true,
        };

        div.textContent = 'test';

        const parent = document.createElement('div');

        handleEntity(document, parent, entityModel, context, null);

        expect(parent.innerHTML).toBe('<div>test</div>');
        expect(div.outerHTML).toBe('<div>test</div>');
        expect(addDelimiters.default).toHaveBeenCalledTimes(0);
    });

    it('Simple inline readonly entity', () => {
        const span = document.createElement('span');
        const entityModel: ContentModelEntity = {
            blockType: 'Entity',
            segmentType: 'Entity',
            format: {},
            id: 'entity_1',
            type: 'entity',
            isReadonly: true,
            wrapper: span,
        };

        const parent = document.createElement('div');
        context.addDelimiterForEntity = true;
        handleEntity(document, parent, entityModel, context, null);

        expect(parent.innerHTML).toBe(
            '<span class="_Entity _EType_entity _EId_entity_1 _EReadonly_1" contenteditable="false"></span>'
        );
        expect(span.outerHTML).toBe(
            '<span class="_Entity _EType_entity _EId_entity_1 _EReadonly_1" contenteditable="false"></span>'
        );
        expect(addDelimiters.default).toHaveBeenCalledTimes(1);
    });

    it('Entity with refNode', () => {
        const div = document.createElement('div');
        const entityModel: ContentModelEntity = {
            blockType: 'Entity',
            segmentType: 'Entity',
            format: {},
            id: 'entity_1',
            type: 'entity',
            isReadonly: true,
            wrapper: div,
        };

        div.textContent = 'test';

        const parent = document.createElement('div');
        const br = document.createElement('br');
        parent.appendChild(br);

        handleEntity(document, parent, entityModel, context, br);

        expect(parent.innerHTML).toBe(
            '<div class="_Entity _EType_entity _EId_entity_1 _EReadonly_1" contenteditable="false">test</div><br>'
        );
        expect(div.outerHTML).toBe(
            '<div class="_Entity _EType_entity _EId_entity_1 _EReadonly_1" contenteditable="false">test</div>'
        );
    });
});
