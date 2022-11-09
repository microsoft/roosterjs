import { ContentModelEntity } from '../../../lib/publicTypes/entity/ContentModelEntity';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleEntity } from '../../../lib/modelToDom/handlers/handleEntity';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleEntity', () => {
    let context: ModelToDomContext;

    beforeEach(() => {
        context = createModelToDomContext();
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

        handleEntity(document, parent, entityModel, context);

        expect(parent.innerHTML).toBe('<!--Entity:entity_1-->');
        expect(context.entityPairs).toEqual([
            {
                entityWrapper: div,
                placeholder: parent.firstChild as Comment,
            },
        ]);
        expect(div.outerHTML).toBe(
            '<div class="_Entity _EType_entity _EId_entity_1 _EReadonly_1" contenteditable="false"></div>'
        );
    });
});
