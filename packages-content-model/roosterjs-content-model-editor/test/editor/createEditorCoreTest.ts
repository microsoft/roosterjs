import * as ContextMenuPlugin from '../../lib/corePlugins/ContextMenuPlugin';
import * as EditPlugin from '../../lib/corePlugins/EditPlugin';
import * as NormalizeTablePlugin from '../../lib/corePlugins/NormalizeTablePlugin';
import { BridgePlugin } from '../../lib/corePlugins/BridgePlugin';
import { coreApiMap } from '../../lib/coreApi/coreApiMap';
import { createEditorCore } from '../../lib/editor/createEditorCore';
import { EditPluginState, PluginWithState } from 'roosterjs-editor-types';

describe('createEditorCore', () => {
    const mockedSizeTransformer = 'TRANSFORMER' as any;
    const mockedEditPluginState = 'EDITSTATE' as any;
    const mockedContextMenuPlugin = 'CONTEXTMENU' as any;
    const mockedNormalizeTablePlugin = 'NORMALIZETABLE' as any;

    let addInnerPluginsSpy: jasmine.Spy;
    let mockedBridgePlugin: BridgePlugin;
    let mockedEditPlugin: PluginWithState<EditPluginState>;

    beforeEach(() => {
        addInnerPluginsSpy = jasmine.createSpy('addInnerPlugins');

        mockedEditPlugin = {
            getState: () => mockedEditPluginState,
        } as any;
        mockedBridgePlugin = {
            addInnerPlugins: addInnerPluginsSpy,
        } as any;

        spyOn(EditPlugin, 'createEditPlugin').and.returnValue(mockedEditPlugin);
        spyOn(ContextMenuPlugin, 'createContextMenuPlugin').and.returnValue(
            mockedContextMenuPlugin
        );
        spyOn(NormalizeTablePlugin, 'createNormalizeTablePlugin').and.returnValue(
            mockedNormalizeTablePlugin
        );
    });

    it('No additional option', () => {
        const core = createEditorCore({}, mockedBridgePlugin, mockedSizeTransformer);

        expect(core).toEqual({
            api: { ...coreApiMap },
            originalApi: { ...coreApiMap },
            customData: {},
            experimentalFeatures: [],
            bridgePlugin: mockedBridgePlugin,
            edit: mockedEditPluginState,
            sizeTransformer: mockedSizeTransformer,
        });
        expect(addInnerPluginsSpy).toHaveBeenCalledWith([
            mockedEditPlugin,
            mockedContextMenuPlugin,
            mockedNormalizeTablePlugin,
        ]);
    });

    it('With additional plugins', () => {
        const mockedPlugin1 = 'P1' as any;
        const mockedPlugin2 = 'P2' as any;
        const mockedFeatures = 'FEATURES' as any;
        const mockedCoreApi = {
            a: 'b',
        } as any;

        const core = createEditorCore(
            {
                plugins: [mockedPlugin1, mockedPlugin2],
                experimentalFeatures: mockedFeatures,
                coreApiOverride: mockedCoreApi,
            },
            mockedBridgePlugin,
            mockedSizeTransformer
        );

        expect(core).toEqual({
            api: { ...coreApiMap, a: 'b' } as any,
            originalApi: { ...coreApiMap },
            customData: {},
            experimentalFeatures: mockedFeatures,
            bridgePlugin: mockedBridgePlugin,
            edit: mockedEditPluginState,
            sizeTransformer: mockedSizeTransformer,
        });
        expect(addInnerPluginsSpy).toHaveBeenCalledWith([
            mockedEditPlugin,
            mockedPlugin1,
            mockedPlugin2,
            mockedContextMenuPlugin,
            mockedNormalizeTablePlugin,
        ]);
    });
});
