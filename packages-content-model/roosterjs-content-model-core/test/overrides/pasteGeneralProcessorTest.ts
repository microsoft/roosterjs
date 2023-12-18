import * as sanitizeElement from '../../lib/utils/sanitizeElement';
import { createContentModelDocument } from 'roosterjs-content-model-dom';
import { createPasteGeneralProcessor } from '../../lib/override/pasteGeneralProcessor';
import { DomToModelContext } from 'roosterjs-content-model-types';

describe('pasteGeneralProcessor', () => {
    let createSanitizedElementSpy: jasmine.Spy;
    let generalProcessorSpy: jasmine.Spy;
    let spanProcessorSpy: jasmine.Spy;
    let context: DomToModelContext;

    beforeEach(() => {
        createSanitizedElementSpy = spyOn(sanitizeElement, 'createSanitizedElement');
        generalProcessorSpy = jasmine.createSpy('entityProcessor');
        spanProcessorSpy = jasmine.createSpy('spanProcessorSpy');

        context = {
            defaultElementProcessors: {
                '*': generalProcessorSpy,
                span: spanProcessorSpy,
            },
        } as any;
    });

    it('Empty element, DIV', () => {
        const element = document.createElement('div');
        const group = createContentModelDocument();
        const pasteGeneralProcessor = createPasteGeneralProcessor({
            additionalAllowedTags: [],
            additionalDisallowedTags: [],
        } as any);

        createSanitizedElementSpy.and.returnValue(element);

        pasteGeneralProcessor(group, element, context);

        expect(createSanitizedElementSpy).toHaveBeenCalledTimes(1);
        expect(createSanitizedElementSpy).toHaveBeenCalledWith(
            document,
            'DIV',
            element.attributes,
            {
                position: sanitizeElement.removeStyle,
            }
        );
        expect(generalProcessorSpy).toHaveBeenCalledTimes(1);
        expect(generalProcessorSpy).toHaveBeenCalledWith(group, element, context);
        expect(spanProcessorSpy).toHaveBeenCalledTimes(0);
    });

    it('Empty element with unrecognized tag', () => {
        const element = document.createElement('test');
        const group = createContentModelDocument();
        const pasteGeneralProcessor = createPasteGeneralProcessor({
            additionalAllowedTags: [],
            additionalDisallowedTags: [],
        } as any);

        createSanitizedElementSpy.and.returnValue(element);

        pasteGeneralProcessor(group, element, context);

        expect(createSanitizedElementSpy).toHaveBeenCalledTimes(0);
        expect(generalProcessorSpy).toHaveBeenCalledTimes(0);
        expect(spanProcessorSpy).toHaveBeenCalledTimes(1);
        expect(spanProcessorSpy).toHaveBeenCalledWith(group, element, context);
    });

    it('Empty element with unrecognized in allowed list', () => {
        const element = document.createElement('test');
        const group = createContentModelDocument();
        const pasteGeneralProcessor = createPasteGeneralProcessor({
            additionalAllowedTags: ['test'],
            additionalDisallowedTags: [],
        } as any);

        createSanitizedElementSpy.and.returnValue(element);

        pasteGeneralProcessor(group, element, context);

        expect(createSanitizedElementSpy).toHaveBeenCalledTimes(1);
        expect(createSanitizedElementSpy).toHaveBeenCalledWith(
            document,
            'TEST',
            element.attributes,
            {
                position: sanitizeElement.removeStyle,
            }
        );
        expect(generalProcessorSpy).toHaveBeenCalledTimes(1);
        expect(generalProcessorSpy).toHaveBeenCalledWith(group, element, context);
        expect(spanProcessorSpy).toHaveBeenCalledTimes(0);
    });

    it('Empty element with unrecognized in disallowed list', () => {
        const element = document.createElement('test');
        const group = createContentModelDocument();
        const pasteGeneralProcessor = createPasteGeneralProcessor({
            additionalAllowedTags: [],
            additionalDisallowedTags: ['test'],
        } as any);

        createSanitizedElementSpy.and.returnValue(element);

        pasteGeneralProcessor(group, element, context);

        expect(createSanitizedElementSpy).toHaveBeenCalledTimes(0);
        expect(generalProcessorSpy).toHaveBeenCalledTimes(0);
        expect(spanProcessorSpy).toHaveBeenCalledTimes(0);
    });
});
