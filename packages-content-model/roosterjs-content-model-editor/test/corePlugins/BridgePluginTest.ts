import * as selectionConvert from '../../lib/editor/utils/selectionConverter';
import { createBridgePlugin } from '../../lib/corePlugins/BridgePlugin';
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
        const plugin = createBridgePlugin([]);

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
        const plugin = createBridgePlugin([]);

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
