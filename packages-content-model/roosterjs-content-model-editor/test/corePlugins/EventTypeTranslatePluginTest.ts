import * as selectionConvert from '../../lib/editor/utils/selectionConverter';
import { createEventTypeTranslatePlugin } from '../../lib/corePlugins/EventTypeTranslatePlugin';
import { PluginEventType } from 'roosterjs-editor-types';

describe('EventTypeTranslatePlugin', () => {
    let convertDomSelectionToRangeExSpy: jasmine.Spy;
    const mockedDOMSelection = 'DOMSELECTION' as any;
    const mockedRangeEx = 'RANGEEX' as any;

    beforeEach(() => {
        convertDomSelectionToRangeExSpy = spyOn(
            selectionConvert,
            'convertDomSelectionToRangeEx'
        ).and.returnValue(mockedRangeEx);
    });

    it('translate a SelectionChanged event without selection', () => {
        const plugin = createEventTypeTranslatePlugin();

        plugin.initialize({} as any);

        const event = {
            eventType: PluginEventType.SelectionChanged,
            selectionRangeEx: null,
        } as any;

        plugin.onPluginEvent(event);

        expect(event).toEqual({
            eventType: PluginEventType.SelectionChanged,
            selectionRangeEx: null,
        });
        expect(convertDomSelectionToRangeExSpy).not.toHaveBeenCalled();
    });

    it('translate a SelectionChanged event', () => {
        const plugin = createEventTypeTranslatePlugin();

        plugin.initialize({} as any);

        const event = {
            eventType: PluginEventType.SelectionChanged,
            selectionRangeEx: null,
            newSelection: mockedDOMSelection,
        } as any;

        plugin.onPluginEvent(event);

        expect(event).toEqual({
            eventType: PluginEventType.SelectionChanged,
            selectionRangeEx: mockedRangeEx,
            newSelection: mockedDOMSelection,
        });
        expect(convertDomSelectionToRangeExSpy).toHaveBeenCalledWith(mockedDOMSelection);
    });
});
