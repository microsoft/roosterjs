import * as sanitizeElement from '../../lib/utils/sanitizeElement';
import { AllowedTags, DisallowedTags } from '../../lib/utils/allowedTags';
import { ContentModelDocument, DomToModelContext } from 'roosterjs-content-model-types';
import { createContentModelDocument } from 'roosterjs-content-model-dom';
import { createPasteEntityProcessor } from '../../lib/override/pasteEntityProcessor';

describe('pasteEntityProcessor', () => {
    let sanitizeElementSpy: jasmine.Spy;
    let entityProcessorSpy: jasmine.Spy;
    let context: DomToModelContext;
    let sanitizedElement: HTMLElement | undefined;

    beforeEach(() => {
        sanitizeElementSpy = spyOn(sanitizeElement, 'sanitizeElement');
        entityProcessorSpy = jasmine
            .createSpy('entityProcessor')
            .and.callFake((_: ContentModelDocument, element: HTMLElement) => {
                sanitizedElement = element;
            });

        context = {
            defaultElementProcessors: {
                entity: entityProcessorSpy,
            },
        } as any;

        sanitizedElement = undefined;
    });

    it('Empty element', () => {
        const element = document.createElement('div');
        const group = createContentModelDocument();
        const pasteEntityProcessor = createPasteEntityProcessor({
            additionalAllowedTags: [],
            additionalDisallowedTags: [],
        } as any);

        sanitizeElementSpy.and.returnValue(element);

        pasteEntityProcessor(group, element, context);

        expect(sanitizedElement?.outerHTML).toEqual('<div></div>');
        expect(sanitizeElementSpy).toHaveBeenCalledTimes(1);
        expect(sanitizeElementSpy).toHaveBeenCalledWith(element, AllowedTags, DisallowedTags, {
            position: sanitizeElement.removeStyle,
        });
        expect(entityProcessorSpy).toHaveBeenCalledTimes(1);
        expect(entityProcessorSpy).toHaveBeenCalledWith(group, sanitizedElement, context);
    });

    it('Empty element with allowed and disallowed tags', () => {
        const element = document.createElement('div');
        const group = createContentModelDocument();
        const pasteEntityProcessor = createPasteEntityProcessor({
            additionalAllowedTags: ['allowed'],
            additionalDisallowedTags: ['disallowed'],
        } as any);

        sanitizeElementSpy.and.returnValue(element);

        pasteEntityProcessor(group, element, context);

        expect(sanitizedElement?.outerHTML).toEqual('<div></div>');
        expect(sanitizeElementSpy).toHaveBeenCalledTimes(1);
        expect(sanitizeElementSpy).toHaveBeenCalledWith(
            element,
            AllowedTags.concat('allowed'),
            DisallowedTags.concat('disallowed'),
            {
                position: sanitizeElement.removeStyle,
            }
        );
        expect(entityProcessorSpy).toHaveBeenCalledTimes(1);
        expect(entityProcessorSpy).toHaveBeenCalledWith(group, sanitizedElement, context);
    });
});
