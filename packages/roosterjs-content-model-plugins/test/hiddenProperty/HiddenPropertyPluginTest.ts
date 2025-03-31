import * as fixupHiddenPropertiesModule from '../../lib/hiddenProperty/fixupHiddenProperties';
import { HiddenPropertyOptions } from '../../lib/hiddenProperty/HiddenPropertyOptions';
import { HiddenPropertyPlugin } from '../../lib/hiddenProperty/HiddenPropertyPlugin';
import { IEditor } from 'roosterjs-content-model-types';

describe('HiddenPropertyPluginTest', () => {
    let editor: IEditor;
    let fixupHiddenPropertiesSpy: jasmine.Spy;

    beforeEach(() => {
        editor = {} as any;
        fixupHiddenPropertiesSpy = spyOn(fixupHiddenPropertiesModule, 'fixupHiddenProperties');
    });

    it('Call fixupHiddenProperties when setContent', () => {
        const mockedOptions: HiddenPropertyOptions = {
            test: 'testValue',
        } as any;
        const plugin = new HiddenPropertyPlugin(mockedOptions);

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: 'contentChanged',
            source: 'SetContent',
        } as any);

        expect(fixupHiddenPropertiesSpy).toHaveBeenCalledWith(editor, mockedOptions);
    });

    it('Do not call fixupHiddenProperties when other source setContent', () => {
        const mockedOptions: HiddenPropertyOptions = {
            test: 'testValue',
        } as any;
        const plugin = new HiddenPropertyPlugin(mockedOptions);

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: 'contentChanged',
            source: 'test',
        } as any);

        expect(fixupHiddenPropertiesSpy).not.toHaveBeenCalled();
    });
});
