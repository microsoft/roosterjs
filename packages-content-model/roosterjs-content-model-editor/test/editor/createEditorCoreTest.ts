import { coreApiMap } from '../../lib/coreApi/coreApiMap';
import { createEditorCore } from '../../lib/editor/createEditorCore';

const mockedBridgePlugin = 'Bridge' as any;

describe('createEditorCore', () => {
    it('No additional option', () => {
        const core = createEditorCore({}, mockedBridgePlugin, { features: [] });
        expect(core).toEqual({
            api: { ...coreApiMap },
            originalApi: { ...coreApiMap },
            customData: {},
            experimentalFeatures: [],
            bridgePlugin: mockedBridgePlugin,
            edit: {
                features: [],
            },
        });
    });
});
