import * as ContentModelCachePlugin from 'roosterjs-content-model-core/lib/corePlugin/ContentModelCachePlugin';
import * as ContentModelCopyPastePlugin from 'roosterjs-content-model-core/lib/corePlugin/ContentModelCopyPastePlugin';
import * as ContentModelFormatPlugin from 'roosterjs-content-model-core/lib/corePlugin/ContentModelFormatPlugin';
import { contentModelDomIndexer } from 'roosterjs-content-model-core/lib/corePlugin/utils/contentModelDomIndexer';
import { ContentModelTypeInContainerPlugin } from 'roosterjs-content-model-core/lib/corePlugin/ContentModelTypeInContainerPlugin';
import { createEditorCore } from '../../lib/editor/createEditorCore';
import { EditorOptions } from 'roosterjs-editor-types';
import { StandaloneEditorOptions } from 'roosterjs-content-model-types';

const mockedSwitchShadowEdit = 'SHADOWEDIT' as any;
const mockedFormatPlugin = 'FORMATPLUGIN' as any;
const mockedCachePlugin = 'CACHPLUGIN' as any;
const mockedCopyPastePlugin = 'COPYPASTE' as any;
const mockedCopyPastePlugin2 = 'COPYPASTE2' as any;

describe('createEditorCore', () => {
    let contentDiv: any;

    beforeEach(() => {
        contentDiv = {
            style: {},
        } as any;

        spyOn(ContentModelFormatPlugin, 'createContentModelFormatPlugin').and.returnValue(
            mockedFormatPlugin
        );
        spyOn(ContentModelCachePlugin, 'createContentModelCachePlugin').and.returnValue(
            mockedCachePlugin
        );
        spyOn(ContentModelCopyPastePlugin, 'createContentModelCopyPastePlugin').and.returnValue(
            mockedCopyPastePlugin
        );
    });

    it('No additional option', () => {
        // const core = createEditorCore(contentDiv, {});
        // expect(core).toEqual({});
        // const expectedPluginState: any = {
        //     cache: { domIndexer: undefined },
        //     copyPaste: { allowedCustomPasteType: [] },
        //     format: {
        //         defaultFormat: {
        //             fontWeight: undefined,
        //             italic: undefined,
        //             underline: undefined,
        //             fontFamily: undefined,
        //             fontSize: undefined,
        //             textColor: undefined,
        //             backgroundColor: undefined,
        //         },
        //         pendingFormat: null,
        //     },
        // };
        // expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, expectedOptions);
        // expect(promoteToContentModelEditorCoreSpy).toHaveBeenCalledWith(
        //     core,
        //     expectedOptions,
        //     expectedPluginState
        // );
    });

    // it('With additional option', () => {
    //     const defaultDomToModelOptions = { a: '1' } as any;
    //     const defaultModelToDomOptions = { b: '2' } as any;

    //     const options = {
    //         defaultDomToModelOptions,
    //         defaultModelToDomOptions,
    //         corePluginOverride: {
    //             copyPaste: mockedCopyPastePlugin2,
    //         },
    //     };
    //     const core = createEditorCore(contentDiv, options, createEditorCoreSpy);

    //     const expectedOptions = {
    //         defaultDomToModelOptions,
    //         defaultModelToDomOptions,
    //         plugins: [mockedCachePlugin, mockedFormatPlugin],
    //         corePluginOverride: {
    //             typeInContainer: new ContentModelTypeInContainerPlugin(),
    //             copyPaste: mockedCopyPastePlugin2,
    //         },
    //     };
    //     const expectedPluginState: any = {
    //         cache: { domIndexer: undefined },
    //         copyPaste: { allowedCustomPasteType: [] },
    //         format: {
    //             defaultFormat: {
    //                 fontWeight: undefined,
    //                 italic: undefined,
    //                 underline: undefined,
    //                 fontFamily: undefined,
    //                 fontSize: undefined,
    //                 textColor: undefined,
    //                 backgroundColor: undefined,
    //             },
    //             pendingFormat: null,
    //         },
    //     };

    //     expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, expectedOptions);
    //     expect(promoteToContentModelEditorCoreSpy).toHaveBeenCalledWith(
    //         core,
    //         expectedOptions,
    //         expectedPluginState
    //     );
    // });

    // it('With default format', () => {
    //     const options = {
    //         defaultFormat: {
    //             bold: true,
    //             italic: true,
    //             underline: true,
    //             fontFamily: 'Arial',
    //             fontSize: '10pt',
    //             textColor: 'red',
    //             backgroundColor: 'blue',
    //         },
    //     };

    //     const core = createEditorCore(contentDiv, options, createEditorCoreSpy);

    //     const expectedOptions = {
    //         plugins: [mockedCachePlugin, mockedFormatPlugin],
    //         corePluginOverride: {
    //             typeInContainer: new ContentModelTypeInContainerPlugin(),
    //             copyPaste: mockedCopyPastePlugin,
    //         },
    //         defaultFormat: {
    //             bold: true,
    //             italic: true,
    //             underline: true,
    //             fontFamily: 'Arial',
    //             fontSize: '10pt',
    //             textColor: 'red',
    //             backgroundColor: 'blue',
    //         },
    //     };
    //     const expectedPluginState: any = {
    //         cache: { domIndexer: undefined },
    //         copyPaste: { allowedCustomPasteType: [] },
    //         format: {
    //             defaultFormat: {
    //                 fontWeight: 'bold',
    //                 italic: true,
    //                 underline: true,
    //                 fontFamily: 'Arial',
    //                 fontSize: '10pt',
    //                 textColor: 'red',
    //                 backgroundColor: 'blue',
    //             },
    //             pendingFormat: null,
    //         },
    //     };

    //     expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, expectedOptions);
    //     expect(promoteToContentModelEditorCoreSpy).toHaveBeenCalledWith(
    //         core,
    //         expectedOptions,
    //         expectedPluginState
    //     );
    // });

    // it('Allow dom indexer', () => {
    //     const options: StandaloneEditorOptions & EditorOptions = {
    //         cacheModel: true,
    //     };

    //     const core = createEditorCore(contentDiv, options, createEditorCoreSpy);

    //     const expectedOptions = {
    //         plugins: [mockedCachePlugin, mockedFormatPlugin],
    //         corePluginOverride: {
    //             typeInContainer: new ContentModelTypeInContainerPlugin(),
    //             copyPaste: mockedCopyPastePlugin,
    //         },
    //         cacheModel: true,
    //     };
    //     const expectedPluginState: any = {
    //         cache: { domIndexer: contentModelDomIndexer },
    //         copyPaste: { allowedCustomPasteType: [] },
    //         format: {
    //             defaultFormat: {
    //                 fontWeight: undefined,
    //                 italic: undefined,
    //                 underline: undefined,
    //                 fontFamily: undefined,
    //                 fontSize: undefined,
    //                 textColor: undefined,
    //                 backgroundColor: undefined,
    //             },
    //             pendingFormat: null,
    //         },
    //     };

    //     expect(createEditorCoreSpy).toHaveBeenCalledWith(contentDiv, expectedOptions);
    //     expect(promoteToContentModelEditorCoreSpy).toHaveBeenCalledWith(
    //         core,
    //         expectedOptions,
    //         expectedPluginState
    //     );
    // });
});
