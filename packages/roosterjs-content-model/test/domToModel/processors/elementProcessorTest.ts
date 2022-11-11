import { commitEntity } from 'roosterjs-editor-dom';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ElementProcessor } from '../../../lib/publicTypes/context/ElementProcessor';
import { elementProcessor } from '../../../lib/domToModel/processors/elementProcessor';

describe('elementProcessor', () => {
    let context: DomToModelContext;
    let group: ContentModelDocument;
    let divProcessor: jasmine.Spy<ElementProcessor<HTMLElement>>;
    let generalProcessor: jasmine.Spy<ElementProcessor<HTMLElement>>;
    let entityProcessor: jasmine.Spy<ElementProcessor<HTMLElement>>;

    beforeEach(() => {
        group = createContentModelDocument(document);
        divProcessor = jasmine.createSpy('div processor');
        generalProcessor = jasmine.createSpy('general processor');
        entityProcessor = jasmine.createSpy('entity processor');

        context = createDomToModelContext(undefined, {
            processorOverride: {
                div: divProcessor,
                entity: entityProcessor,
                '*': generalProcessor,
            },
        });
    });

    it('Empty DIV', () => {
        const div = document.createElement('div');

        elementProcessor(group, div, context);

        expect(divProcessor).toHaveBeenCalledWith(group, div, context);
        expect(generalProcessor).not.toHaveBeenCalled();
        expect(entityProcessor).not.toHaveBeenCalled();
    });

    it('Unknown element type', () => {
        const element = document.createElement('unknown');

        elementProcessor(group, element, context);

        expect(divProcessor).not.toHaveBeenCalled();
        expect(generalProcessor).toHaveBeenCalledWith(group, element, context);
        expect(entityProcessor).not.toHaveBeenCalled();
    });

    it('Entity', () => {
        const div = document.createElement('div');

        commitEntity(div, 'entity', true, 'entity_1');

        elementProcessor(group, div, context);

        expect(divProcessor).not.toHaveBeenCalled();
        expect(generalProcessor).not.toHaveBeenCalled();
        expect(entityProcessor).toHaveBeenCalledWith(group, div, context);
    });
});
