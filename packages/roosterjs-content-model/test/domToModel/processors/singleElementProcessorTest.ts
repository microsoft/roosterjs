import * as entityProcessor from '../../../lib/domToModel/processors/entityProcessor';
import * as generalProcessor from '../../../lib/domToModel/processors/generalProcessor';
import { commitEntity } from 'roosterjs-editor-dom';
import { ContentModelDocument } from '../../../lib/publicTypes/block/group/ContentModelDocument';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { singleElementProcessor } from '../../../lib/domToModel/processors/singleElementProcessor';

describe('singleElementProcessor', () => {
    let context: DomToModelContext;
    let group: ContentModelDocument;
    let divProcessor: jasmine.Spy;

    beforeEach(() => {
        group = createContentModelDocument(document);
        context = createDomToModelContext();
        divProcessor = jasmine.createSpy('processor');
        spyOn(generalProcessor, 'generalProcessor');
        spyOn(entityProcessor, 'entityProcessor');

        context.elementProcessors.DIV = divProcessor;
    });

    it('Empty DIV', () => {
        const div = document.createElement('div');

        singleElementProcessor(group, div, context);

        expect(divProcessor).toHaveBeenCalledWith(group, div, context);
        expect(generalProcessor.generalProcessor).not.toHaveBeenCalled();
        expect(entityProcessor.entityProcessor).not.toHaveBeenCalled();
    });

    it('Unknown element type', () => {
        const element = document.createElement('unknown');

        singleElementProcessor(group, element, context);

        expect(divProcessor).not.toHaveBeenCalled();
        expect(generalProcessor.generalProcessor).toHaveBeenCalledWith(group, element, context);
        expect(entityProcessor.entityProcessor).not.toHaveBeenCalled();
    });

    it('Entity', () => {
        const div = document.createElement('div');

        commitEntity(div, 'entity', true, 'entity_1');

        singleElementProcessor(group, div, context);

        expect(divProcessor).not.toHaveBeenCalled();
        expect(generalProcessor.generalProcessor).not.toHaveBeenCalled();
        expect(entityProcessor.entityProcessor).toHaveBeenCalledWith(group, div, context);
    });
});
