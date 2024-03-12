import * as insertEntityModule from 'roosterjs-content-model-api/lib/publicApi/entity/insertEntity';
import { WatermarkPlugin } from '../../lib/watermark/WatermarkPlugin';

const mockedWatermark: any = 'watermark text';
const mockedFormat: any = {
    format: 'WM format',
};
const mockedClass: any = 'class';
const ENTITY_TYPE = 'WATERMARK_WRAPPER';
const mockedWrapper: any = 'mockedWrapper';

describe('WatermarkPluginTest |', () => {
    let plugin: WatermarkPlugin;

    beforeEach(() => {
        plugin = new WatermarkPlugin(mockedWatermark);
    });

    it('ctor', () => {
        plugin = new WatermarkPlugin(mockedWatermark, mockedFormat, mockedClass);

        const el = plugin as any;

        expect(el.watermark).toEqual(mockedWatermark);
        expect(el.format).toEqual(mockedFormat);
        expect(el.customClass).toEqual(mockedClass);
    });

    it('ctor 2', () => {
        plugin = new WatermarkPlugin(mockedWatermark, undefined, mockedClass);

        const el = plugin as any;

        expect(el.watermark).toEqual(mockedWatermark);
        expect(el.format).toEqual({
            fontSize: '14px',
            textColor: '#AAAAAA',
        });
        expect(el.customClass).toEqual(mockedClass);
    });

    it('getName', () => {
        expect(plugin.getName()).toEqual('Watermark');
    });

    it('initialize', () => {
        const attachDomEventSpy = jasmine.createSpy('attachDomEvent');
        const editor: any = {
            attachDomEvent: attachDomEventSpy,
        };

        plugin.initialize(editor);

        expect((plugin as any).editor).toEqual(editor);
        expect(attachDomEventSpy).toHaveBeenCalled();
    });

    it('dispose', () => {
        const disposerSpy = jasmine.createSpy('disposerSpy');
        const editor: any = {
            attachDomEvent: () => disposerSpy,
        };

        plugin.initialize(editor);
        plugin.dispose();

        expect(disposerSpy).toHaveBeenCalled();
        expect((plugin as any).editor).toEqual(null);
        expect((plugin as any).disposer).toEqual(null);
    });

    describe('onPluginEvent |', () => {
        beforeEach(() => {
            const editor: any = {
                attachDomEvent: () => {},
            };
            plugin.initialize(editor);
        });
        it('editorReady', () => {
            const showHideWatermarkSpy = jasmine.createSpy('showHideWatermark');
            (plugin as any).showHideWatermark = showHideWatermarkSpy;

            plugin.onPluginEvent({
                eventType: 'editorReady',
            });

            expect(showHideWatermarkSpy).toHaveBeenCalled();
        });

        it('content changed with Entity of watermark type', () => {
            const showHideWatermarkSpy = jasmine.createSpy('showHideWatermark');
            (plugin as any).showHideWatermark = showHideWatermarkSpy;

            plugin.onPluginEvent(<any>{
                eventType: 'contentChanged',
                data: <any>{
                    type: ENTITY_TYPE,
                },
            });

            expect(showHideWatermarkSpy).not.toHaveBeenCalled();
        });

        it('content changed without Entity of watermark type', () => {
            const showHideWatermarkSpy = jasmine.createSpy('showHideWatermark');
            (plugin as any).showHideWatermark = showHideWatermarkSpy;

            plugin.onPluginEvent(<any>{
                eventType: 'contentChanged',
                data: <any>{
                    type: 'any',
                },
            });

            expect(showHideWatermarkSpy).toHaveBeenCalled();
        });

        it('entity operation with Entity of watermark type', () => {
            const removeWatermarkSpy = jasmine.createSpy('removeWatermark');
            (plugin as any).removeWatermark = removeWatermarkSpy;

            plugin.onPluginEvent(<any>{
                eventType: 'entityOperation',
                entity: <any>{
                    type: ENTITY_TYPE,
                    wrapper: mockedWrapper,
                },
                operation: 'replaceTemporaryContent',
            });

            expect(removeWatermarkSpy).toHaveBeenCalled();
        });

        it('entity operation without Entity of watermark type', () => {
            const removeWatermarkSpy = jasmine.createSpy('removeWatermark');
            (plugin as any).removeWatermark = removeWatermarkSpy;

            plugin.onPluginEvent(<any>{
                eventType: 'entityOperation',
                entity: <any>{
                    type: 'any',
                    wrapper: mockedWrapper,
                },
                operation: 'replaceTemporaryContent',
            });

            expect(removeWatermarkSpy).not.toHaveBeenCalled();
        });

        it('entity operation not of replacetempcontent type ', () => {
            const removeWatermarkSpy = jasmine.createSpy('removeWatermark');
            (plugin as any).removeWatermark = removeWatermarkSpy;

            plugin.onPluginEvent(<any>{
                eventType: 'entityOperation',
                entity: <any>{
                    type: ENTITY_TYPE,
                    wrapper: mockedWrapper,
                },
                operation: 'any operation',
            });

            expect(removeWatermarkSpy).not.toHaveBeenCalled();
        });
    });

    const VISIBLE_CHILD_ELEMENT_SELECTOR = ['TABLE', 'IMG', 'LI'].join(',');
    describe('showHideWatermark', () => {
        let queryElementsSpy: jasmine.Spy;
        let queryElementsVisibleSpy: jasmine.Spy;
        let getTextContentSpy: jasmine.Spy;
        let hasFocusSpy: jasmine.Spy;
        let focusSpy: jasmine.Spy;
        const mockedColorManager: any = 'Color';
        beforeEach(() => {
            focusSpy = jasmine.createSpy('focusSpy').and.callFake(() => {});
            hasFocusSpy = jasmine.createSpy('hasFocusSpy');
            queryElementsSpy = jasmine.createSpy('queryElementsSpy');
            queryElementsVisibleSpy = jasmine.createSpy('queryElementsVisibleSpy');
            getTextContentSpy = jasmine.createSpy('getTextContentSpy');

            spyOn(insertEntityModule, 'insertEntity').and.callThrough();

            const editor: any = {
                attachDomEvent: () => {},
                hasFocus: () => hasFocusSpy,
                focus: () => focusSpy,
                getDocument: () => document,
                isDarkMode: () => false,
                getColorManager: () => mockedColorManager,
                getDOMHelper: () => ({
                    queryElements: (s: string) => {
                        if (s == VISIBLE_CHILD_ELEMENT_SELECTOR) {
                            return queryElementsVisibleSpy(s);
                        }

                        return queryElementsSpy(s);
                    },
                    calculateZoomScale: () => 1,
                    getTextContent: getTextContentSpy,
                }),
            };
            plugin.initialize(editor);
        });

        it('editor = null do not handle', () => {
            plugin.dispose();

            plugin.showHideWatermark();

            expect(insertEntityModule.insertEntity).not.toHaveBeenCalled();
            expect(hasFocusSpy).not.toHaveBeenCalled();
            expect(queryElementsSpy).not.toHaveBeenCalled();
            expect(queryElementsVisibleSpy).not.toHaveBeenCalled();
            expect(getTextContentSpy).not.toHaveBeenCalled();
        });

        it('Focus & is showing', () => {
            const mockedQueryElementsResult: any[] = ['any'];
            hasFocusSpy.and.returnValue(true);
            queryElementsSpy.and.returnValue(mockedQueryElementsResult);
            spyOn(plugin, 'removeWatermark').and.callFake((val: any) => {});

            plugin.showHideWatermark();

            expect(plugin.removeWatermark).toHaveBeenCalledWith(mockedQueryElementsResult[0]);
            expect(plugin.removeWatermark).toHaveBeenCalledTimes(1);
            expect(queryElementsSpy).toHaveBeenCalled();

            expect(insertEntityModule.insertEntity).not.toHaveBeenCalled();
            expect(hasFocusSpy).not.toHaveBeenCalled();
            expect(queryElementsVisibleSpy).not.toHaveBeenCalled();
            expect(getTextContentSpy).not.toHaveBeenCalled();
        });

        it('Focus & is showing', () => {
            const mockedQueryElementsResult: any[] = ['any'];
            hasFocusSpy.and.returnValue(true);
            queryElementsSpy.and.returnValue(mockedQueryElementsResult);
            spyOn(plugin, 'removeWatermark').and.callFake((val: any) => {});

            plugin.showHideWatermark();

            expect(plugin.removeWatermark).toHaveBeenCalledWith(mockedQueryElementsResult[0]);
            expect(plugin.removeWatermark).toHaveBeenCalledTimes(1);
            expect(queryElementsSpy).toHaveBeenCalled();

            expect(insertEntityModule.insertEntity).not.toHaveBeenCalled();
            expect(hasFocusSpy).not.toHaveBeenCalled();
            expect(queryElementsVisibleSpy).not.toHaveBeenCalled();
            expect(getTextContentSpy).not.toHaveBeenCalled();
        });
    });
});
