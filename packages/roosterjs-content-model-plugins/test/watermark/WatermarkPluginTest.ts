import * as isModelEmptyFast from '../../lib/watermark/isModelEmptyFast';
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
        } as any;
    });

    it('No format, empty editor, with text', () => {
        isModelEmptyFastSpy.and.returnValue(true);

        const plugin = new WatermarkPlugin('test');

        plugin.initialize(editor);

        plugin.onPluginEvent({ eventType: 'editorReady' });

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(setEditorStyleSpy).toHaveBeenCalledTimes(1);
        expect(setEditorStyleSpy).toHaveBeenCalledWith(
            '_WatermarkContent',
            'position: absolute; pointer-events: none; content: "test";font-size: 14px!important;color: #AAAAAA!important;',
            'before'
        );

        plugin.onPluginEvent({ eventType: 'input' } as any);
        expect(formatContentModelSpy).toHaveBeenCalledTimes(2);
        expect(setEditorStyleSpy).toHaveBeenCalledTimes(1);

        isModelEmptyFastSpy.and.returnValue(false);

        plugin.onPluginEvent({ eventType: 'input' } as any);
        expect(formatContentModelSpy).toHaveBeenCalledTimes(3);
        expect(setEditorStyleSpy).toHaveBeenCalledTimes(2);
        expect(setEditorStyleSpy).toHaveBeenCalledWith('_WatermarkContent', null);
    });

    it('No format, not empty editor, with text', () => {
        isModelEmptyFastSpy.and.returnValue(false);

        const plugin = new WatermarkPlugin('test');

        plugin.initialize(editor);

        plugin.onPluginEvent({ eventType: 'editorReady' });

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(setEditorStyleSpy).not.toHaveBeenCalled();

        plugin.onPluginEvent({ eventType: 'input' } as any);
        expect(formatContentModelSpy).toHaveBeenCalledTimes(2);
        expect(setEditorStyleSpy).not.toHaveBeenCalled();

        isModelEmptyFastSpy.and.returnValue(true);

        plugin.onPluginEvent({ eventType: 'input' } as any);
        expect(formatContentModelSpy).toHaveBeenCalledTimes(3);
        expect(setEditorStyleSpy).toHaveBeenCalledTimes(1);
        expect(setEditorStyleSpy).toHaveBeenCalledWith(
            '_WatermarkContent',
            'position: absolute; pointer-events: none; content: "test";font-size: 14px!important;color: #AAAAAA!important;',
            'before'
        );
    });

    it('No format, empty editor, with callback', () => {
        isModelEmptyFastSpy.and.returnValue(true);

        const watermarkCallback = jasmine.createSpy('watermark').and.returnValue('test');
        const plugin = new WatermarkPlugin(watermarkCallback);

        plugin.initialize(editor);

        plugin.onPluginEvent({ eventType: 'editorReady' });

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(setEditorStyleSpy).toHaveBeenCalledTimes(1);
        expect(setEditorStyleSpy).toHaveBeenCalledWith(
            '_WatermarkContent',
            'position: absolute; pointer-events: none; content: "test";font-size: 14px!important;color: #AAAAAA!important;',
            'before'
        );
        expect(watermarkCallback).toHaveBeenCalledTimes(1);

        plugin.onPluginEvent({ eventType: 'input' } as any);
        expect(formatContentModelSpy).toHaveBeenCalledTimes(2);
        expect(setEditorStyleSpy).toHaveBeenCalledTimes(1);
        expect(watermarkCallback).toHaveBeenCalledTimes(1);

        isModelEmptyFastSpy.and.returnValue(false);

        plugin.onPluginEvent({ eventType: 'input' } as any);
        expect(formatContentModelSpy).toHaveBeenCalledTimes(3);
        expect(setEditorStyleSpy).toHaveBeenCalledTimes(2);
        expect(setEditorStyleSpy).toHaveBeenCalledWith('_WatermarkContent', null);
        expect(watermarkCallback).toHaveBeenCalledTimes(1);
    });

    it('Has format, empty editor, with text', () => {
        isModelEmptyFastSpy.and.returnValue(true);

        const plugin = new WatermarkPlugin('test', {
            fontFamily: 'Arial',
            fontSize: '20pt',
            textColor: 'red',
        });

        plugin.initialize(editor);

        plugin.onPluginEvent({ eventType: 'editorReady' });

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(setEditorStyleSpy).toHaveBeenCalledTimes(1);
        expect(setEditorStyleSpy).toHaveBeenCalledWith(
            '_WatermarkContent',
            'position: absolute; pointer-events: none; content: "test";font-family: Arial!important;font-size: 20pt!important;color: red!important;',
            'before'
        );

        plugin.onPluginEvent({ eventType: 'input' } as any);
        expect(formatContentModelSpy).toHaveBeenCalledTimes(2);
        expect(setEditorStyleSpy).toHaveBeenCalledTimes(1);

        isModelEmptyFastSpy.and.returnValue(false);

        plugin.onPluginEvent({ eventType: 'input' } as any);
        expect(formatContentModelSpy).toHaveBeenCalledTimes(3);
        expect(setEditorStyleSpy).toHaveBeenCalledTimes(2);
        expect(setEditorStyleSpy).toHaveBeenCalledWith('_WatermarkContent', null);
    });
});
