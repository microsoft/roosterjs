import { ContentModelBlock } from '../../../lib/publicTypes/block/ContentModelBlock';
import { ContentModelHandler } from '../../../lib/publicTypes/context/ContentModelHandler';
import { ContentModelSegment } from '../../../lib/publicTypes/segment/ContentModelSegment';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { handleSegment } from '../../../lib/modelToDom/handlers/handleSegment';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('handleSegment', () => {
    let parent: HTMLElement;
    let context: ModelToDomContext;
    let handleBlock: jasmine.Spy<ContentModelHandler<ContentModelBlock>>;

    beforeEach(() => {
        handleBlock = jasmine.createSpy('handleBlock');
        context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                block: handleBlock,
            },
        });
    });

    function runTest(
        segment: ContentModelSegment,
        expectedInnerHTML: string,
        expectedCreateBlockFromContentModelCalledTimes: number
    ) {
        parent = document.createElement('div');

        handleSegment(document, parent, segment, context);

        expect(parent.innerHTML).toBe(expectedInnerHTML);
        expect(handleBlock).toHaveBeenCalledTimes(expectedCreateBlockFromContentModelCalledTimes);
    }

    it('Text segment', () => {
        runTest(
            {
                segmentType: 'Text',
                text: 'test',
                format: {},
            },
            '<span>test</span>',
            0
        );
    });

    it('Br segment', () => {
        runTest(
            {
                segmentType: 'Br',
                format: {},
            },
            '<br>',
            0
        );
    });

    it('general segment', () => {
        const segment: ContentModelSegment = {
            segmentType: 'General',
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            blocks: [],
            element: null!,
            format: {},
        };
        runTest(segment, '', 1);
        expect(handleBlock).toHaveBeenCalledWith(document, parent, segment, context);
    });

    it('entity segment', () => {
        const div = document.createElement('div');
        const segment: ContentModelSegment = {
            segmentType: 'Entity',
            blockType: 'Entity',
            format: {},
            type: 'entity',
            id: 'entity_1',
            wrapper: div,
            isReadonly: true,
        };
        runTest(segment, '<!--Entity:entity_1-->', 0);

        expect(context.entityPairs).toEqual([
            {
                entityWrapper: div,
                placeholder: document.createComment('Entity:entity_1'),
            },
        ]);

        expect(div.outerHTML).toBe(
            '<div class="_Entity _EType_entity _EId_entity_1 _EReadonly_1" contenteditable="false"></div>'
        );
    });
});
