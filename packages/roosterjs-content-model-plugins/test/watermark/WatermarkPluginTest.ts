import * as isModelEmptyFast from '../../lib/watermark/isModelEmptyFast';
import { ChangeSource } from 'roosterjs-content-model-dom';
import { IEditor } from 'roosterjs-content-model-types';
import { WatermarkPlugin } from '../../lib/watermark/WatermarkPlugin';

describe('WatermarkPlugin', () => {
    let editor: IEditor;
    let formatContentModelSpy: jasmine.Spy;
    let isModelEmptyFastSpy: jasmine.Spy;
    let setEditorStyleSpy: jasmine.Spy;

    const mockedModel = 'Model' as any;

    beforeEach(() => {
        isModelEmptyFastSpy = spyOn(isModelEmptyFast, 'isModelEmptyFast');
        setEditorStyleSpy = jasmine.createSpy('setEditorStyle');

        formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: Function) => {
                const result = callback(mockedModel);

                expect(result).toBeFalse();
            });
        editor = {
            formatContentModel: formatContentModelSpy,
            setEditorStyle: setEditorStyleSpy,
            isDarkMode: () => false,
        } as any;
    });

    it('No format, empty editor, with text', () => {
        isModelEmptyFastSpy.and.returnValue(true);

        const plugin = new WatermarkPlugin('test');

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: 'editorReady',
            addedBlockElements: [],
            removedBlockElements: [],
        });

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(setEditorStyleSpy).toHaveBeenCalledTimes(1);
        expect(setEditorStyleSpy).toHaveBeenCalledWith(
            '_WatermarkContent',
            'position: absolute; pointer-events: none; content: "test";font-size: 14px!important;color: #AAAAAA!important;',
            'before'
        );

        plugin.onPluginEvent({ eventType: 'input', rawEvent: {} } as any);
        expect(formatContentModelSpy).toHaveBeenCalledTimes(2);
        expect(setEditorStyleSpy).toHaveBeenCalledTimes(1);

        isModelEmptyFastSpy.and.returnValue(false);

        plugin.onPluginEvent({ eventType: 'input', rawEvent: {} } as any);
        expect(formatContentModelSpy).toHaveBeenCalledTimes(3);
        expect(setEditorStyleSpy).toHaveBeenCalledTimes(2);
        expect(setEditorStyleSpy).toHaveBeenCalledWith('_WatermarkContent', null);
    });

    it('No format, not empty editor, with text', () => {
        isModelEmptyFastSpy.and.returnValue(false);

        const plugin = new WatermarkPlugin('test');

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: 'editorReady',
            addedBlockElements: [],
            removedBlockElements: [],
        });

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(setEditorStyleSpy).not.toHaveBeenCalled();

        plugin.onPluginEvent({ eventType: 'input', rawEvent: {} } as any);
        expect(formatContentModelSpy).toHaveBeenCalledTimes(2);
        expect(setEditorStyleSpy).not.toHaveBeenCalled();

        isModelEmptyFastSpy.and.returnValue(true);

        plugin.onPluginEvent({ eventType: 'input', rawEvent: {} } as any);
        expect(formatContentModelSpy).toHaveBeenCalledTimes(3);
        expect(setEditorStyleSpy).toHaveBeenCalledTimes(1);
        expect(setEditorStyleSpy).toHaveBeenCalledWith(
            '_WatermarkContent',
            'position: absolute; pointer-events: none; content: "test";font-size: 14px!important;color: #AAAAAA!important;',
            'before'
        );
    });

    it('Has format, empty editor, with text', () => {
        isModelEmptyFastSpy.and.returnValue(true);

        const plugin = new WatermarkPlugin('test', {
            fontFamily: 'Arial',
            fontSize: '20pt',
            textColor: 'red',
        });

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: 'editorReady',
            addedBlockElements: [],
            removedBlockElements: [],
        });

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(setEditorStyleSpy).toHaveBeenCalledTimes(1);
        expect(setEditorStyleSpy).toHaveBeenCalledWith(
            '_WatermarkContent',
            'position: absolute; pointer-events: none; content: "test";font-family: Arial!important;font-size: 20pt!important;color: red!important;',
            'before'
        );

        plugin.onPluginEvent({ eventType: 'input', rawEvent: {} } as any);
        expect(formatContentModelSpy).toHaveBeenCalledTimes(2);
        expect(setEditorStyleSpy).toHaveBeenCalledTimes(1);

        isModelEmptyFastSpy.and.returnValue(false);

        plugin.onPluginEvent({ eventType: 'input', rawEvent: {} } as any);
        expect(formatContentModelSpy).toHaveBeenCalledTimes(3);
        expect(setEditorStyleSpy).toHaveBeenCalledTimes(2);
        expect(setEditorStyleSpy).toHaveBeenCalledWith('_WatermarkContent', null);
    });

    it('Input event with insertText', () => {
        isModelEmptyFastSpy.and.returnValue(true);

        const plugin = new WatermarkPlugin('test', {
            fontFamily: 'Arial',
            fontSize: '20pt',
            textColor: 'red',
        });

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: 'editorReady',
            addedBlockElements: [],
            removedBlockElements: [],
        });

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(setEditorStyleSpy).toHaveBeenCalledTimes(1);
        expect(setEditorStyleSpy).toHaveBeenCalledWith(
            '_WatermarkContent',
            'position: absolute; pointer-events: none; content: "test";font-family: Arial!important;font-size: 20pt!important;color: red!important;',
            'before'
        );

        plugin.onPluginEvent({ eventType: 'input', rawEvent: { inputType: 'insertText' } } as any);
        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(setEditorStyleSpy).toHaveBeenCalledTimes(2);
    });
});

describe('WatermarkPlugin dark mode', () => {
    let editor: IEditor;
    let formatContentModelSpy: jasmine.Spy;
    let isModelEmptyFastSpy: jasmine.Spy;
    let setEditorStyleSpy: jasmine.Spy;
    let getDarkColorSpy: jasmine.Spy;
    let isDarkModeSpy: jasmine.Spy;
    const DEFAULT_DARK_COLOR_SUFFIX_COLOR = 'DarkColorMock-';

    const mockedModel = 'Model' as any;

    beforeEach(() => {
        isModelEmptyFastSpy = spyOn(isModelEmptyFast, 'isModelEmptyFast');
        setEditorStyleSpy = jasmine.createSpy('setEditorStyle');
        getDarkColorSpy = jasmine.createSpy('getDarkColor');
        isDarkModeSpy = jasmine.createSpy('isDarkMode');

        formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: Function) => {
                const result = callback(mockedModel);

                expect(result).toBeFalse();
            });

        editor = {
            formatContentModel: formatContentModelSpy,
            setEditorStyle: setEditorStyleSpy,
            isDarkMode: isDarkModeSpy,
            getColorManager: () => ({
                getDarkColor: getDarkColorSpy.and.callFake((color: string) => {
                    return `${DEFAULT_DARK_COLOR_SUFFIX_COLOR}${color}`;
                }),
            }),
        } as any;
    });

    it('Has format, empty editor, with text', () => {
        isModelEmptyFastSpy.and.returnValue(true);
        const textColor = 'red';
        const plugin = new WatermarkPlugin('test', {
            fontFamily: 'Arial',
            fontSize: '20pt',
            textColor: textColor,
        });
        const darkModeStyles = `position: absolute; pointer-events: none; content: "test";font-family: Arial!important;font-size: 20pt!important;color: ${DEFAULT_DARK_COLOR_SUFFIX_COLOR}${textColor}!important;`;
        const lightModeStyles = `position: absolute; pointer-events: none; content: "test";font-family: Arial!important;font-size: 20pt!important;color: red!important;`;

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: 'editorReady',
            addedBlockElements: [],
            removedBlockElements: [],
        });

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(setEditorStyleSpy).toHaveBeenCalledTimes(1);
        expect(setEditorStyleSpy).toHaveBeenCalledWith(
            '_WatermarkContent',
            lightModeStyles,
            'before'
        );
        expect(getDarkColorSpy).not.toHaveBeenCalled();
        isDarkModeSpy.and.returnValue(true);
        plugin.onPluginEvent({
            eventType: 'contentChanged',
            source: ChangeSource.SwitchToDarkMode,
            rawEvent: {},
        } as any);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(getDarkColorSpy).toHaveBeenCalledTimes(1);
        expect(setEditorStyleSpy).toHaveBeenCalledTimes(2);
        expect(setEditorStyleSpy).toHaveBeenCalledWith(
            '_WatermarkContent',
            darkModeStyles,
            'before'
        );

        isDarkModeSpy.and.returnValue(false);
        plugin.onPluginEvent({
            eventType: 'contentChanged',
            source: ChangeSource.SwitchToLightMode,
            rawEvent: {},
        } as any);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(getDarkColorSpy).toHaveBeenCalledTimes(1);
        expect(setEditorStyleSpy).toHaveBeenCalledTimes(3);
        expect(setEditorStyleSpy).toHaveBeenCalledWith(
            '_WatermarkContent',
            lightModeStyles,
            'before'
        );

        isDarkModeSpy.and.returnValue(true);
        plugin.onPluginEvent({
            eventType: 'contentChanged',
            source: ChangeSource.SwitchToDarkMode,
            rawEvent: {},
        } as any);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(getDarkColorSpy).toHaveBeenCalledTimes(1);
        expect(setEditorStyleSpy).toHaveBeenCalledTimes(4);
        expect(setEditorStyleSpy).toHaveBeenCalledWith(
            '_WatermarkContent',
            darkModeStyles,
            'before'
        );
    });
});
