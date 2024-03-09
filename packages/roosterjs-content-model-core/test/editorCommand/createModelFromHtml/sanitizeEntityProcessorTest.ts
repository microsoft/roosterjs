import * as sanitizeElement from '../../../lib/editorCommand/createModelFromHtml/sanitizeElement';
import { ContentModelDocument, DomToModelContext } from 'roosterjs-content-model-types';
import { createContentModelDocument } from 'roosterjs-content-model-dom';
import { createSanitizeEntityProcessor } from '../../../lib/editorCommand/createModelFromHtml/sanitizeEntityProcessor';

describe('sanitizeEntityProcessor', () => {
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
        const pasteEntityProcessor = createSanitizeEntityProcessor({
            additionalAllowedTags: [],
            additionalDisallowedTags: [],
            styleSanitizers: {},
            attributeSanitizers: {},
        } as any);

        sanitizeElementSpy.and.returnValue(element);

        pasteEntityProcessor(group, element, context);

        expect(sanitizedElement?.outerHTML).toEqual('<div></div>');
        expect(sanitizeElementSpy).toHaveBeenCalledTimes(1);
        expect(sanitizeElementSpy).toHaveBeenCalledWith(
            element,
            sanitizeElement.AllowedTags,
            sanitizeElement.DisallowedTags,
            {
                position: false,
            },
            {}
        );
        expect(entityProcessorSpy).toHaveBeenCalledTimes(1);
        expect(entityProcessorSpy).toHaveBeenCalledWith(group, sanitizedElement, context);
    });

    it('Empty element with allowed and disallowed tags', () => {
        const element = document.createElement('div');
        const group = createContentModelDocument();
        const pasteEntityProcessor = createSanitizeEntityProcessor({
            additionalAllowedTags: ['allowed'],
            additionalDisallowedTags: ['disallowed'],
            styleSanitizers: {
                color: true,
            },
            attributeSanitizers: {
                id: true,
            },
        } as any);

        sanitizeElementSpy.and.returnValue(element);

        pasteEntityProcessor(group, element, context);

        expect(sanitizedElement?.outerHTML).toEqual('<div></div>');
        expect(sanitizeElementSpy).toHaveBeenCalledTimes(1);
        expect(sanitizeElementSpy).toHaveBeenCalledWith(
            element,
            sanitizeElement.AllowedTags.concat('allowed'),
            sanitizeElement.DisallowedTags.concat('disallowed'),
            {
                position: false,
                color: true,
            },
            { id: true }
        );
        expect(entityProcessorSpy).toHaveBeenCalledTimes(1);
        expect(entityProcessorSpy).toHaveBeenCalledWith(group, sanitizedElement, context);
    });
});
