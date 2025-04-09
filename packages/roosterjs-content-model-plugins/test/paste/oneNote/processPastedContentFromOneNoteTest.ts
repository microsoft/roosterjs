import * as setProcessorModule from '../../../lib/paste/utils/setProcessor';
import { BeforePasteEvent, DomToModelContext } from 'roosterjs-content-model-types';
import {
    processListItem,
    processOrderedList,
    processPastedContentFromOneNote,
} from '../../../lib/paste/oneNote/processPastedContentFromOneNote';

describe('processOrderedList', () => {
    it('should set listStyleType and startNumberOverride', () => {
        const mockContext = createMockContext() as any;
        const mockElement = document.createElement('ol');
        mockElement.setAttribute('type', 'a');
        mockElement.setAttribute('start', '5');

        processOrderedList(<any>{}, mockElement, mockContext);

        expect(mockContext.oneNoteListContext?.listStyleType).toBe('lower-alpha');
        expect(mockContext.oneNoteListContext?.startNumberOverride).toBe(5);
    });
});

describe('processOrderedList - OrderedListStyleMap', () => {
    const testCases = [
        { type: '1', expectedStyle: 'decimal' },
        { type: 'a', expectedStyle: 'lower-alpha' },
        { type: 'A', expectedStyle: 'upper-alpha' },
        { type: 'i', expectedStyle: 'lower-roman' },
        { type: 'I', expectedStyle: 'upper-roman' },
    ];

    testCases.forEach(({ type, expectedStyle }) => {
        it(`should map type "${type}" to listStyleType "${expectedStyle}"`, () => {
            const mockContext = createMockContext() as any;
            const mockElement = document.createElement('ol');
            mockElement.setAttribute('type', type);

            processOrderedList(<any>{}, mockElement, mockContext);

            expect(mockContext.oneNoteListContext?.listStyleType).toBe(expectedStyle);
        });
    });
});

describe('processListItem', () => {
    it('should apply listStyleType and startNumberOverride to the last level', () => {
        const mockContext = createMockContext();
        (mockContext as any).oneNoteListContext = {
            listStyleType: 'decimal',
            startNumberOverride: 3,
        };
        mockContext.listFormat.levels.push(<any>{ format: {} });

        const mockElement = document.createElement('li');
        processListItem(
            <any>{
                format: {},
            },
            mockElement,
            mockContext
        );

        const lastLevel = mockContext.listFormat.levels[0];
        expect(lastLevel.format.listStyleType).toBe('decimal');
        expect(lastLevel.format.startNumberOverride).toBe(undefined);
        expect((mockContext as any).oneNoteListContext.listStyleType).toBe(undefined);
        expect((mockContext as any).oneNoteListContext.startNumberOverride).toBe(undefined);
    });
});

describe('processPastedContentFromOneNote', () => {
    it('should call setProcessor for ol and li elements', () => {
        const setProcessorSpy = spyOn(setProcessorModule, 'setProcessor');
        const mockEvent = {
            domToModelOption: {},
        } as BeforePasteEvent;

        processPastedContentFromOneNote(mockEvent);

        expect(setProcessorSpy).toHaveBeenCalledWith(
            mockEvent.domToModelOption,
            'ol',
            jasmine.any(Function)
        );
        expect(setProcessorSpy).toHaveBeenCalledWith(
            mockEvent.domToModelOption,
            'li',
            jasmine.any(Function)
        );
    });
});

function createMockContext(): DomToModelContext {
    return ({
        listFormat: { levels: [] },
        defaultElementProcessors: {
            ol: jasmine.createSpy(),
            li: jasmine.createSpy(),
        },
    } as unknown) as DomToModelContext;
}
