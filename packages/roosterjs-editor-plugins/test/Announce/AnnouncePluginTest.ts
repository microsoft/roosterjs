import * as AnnounceHandlerImpl from '../../lib/plugins/Announce/AnnounceHandlerImpl';
import AnnouncePlugin from '../../lib/plugins/Announce/AnnouncePlugin';
import {
    AnnounceData,
    DefaultAnnounceStrings,
    IEditor,
    PluginEventType,
} from 'roosterjs-editor-types';

describe('AnnouncePlugin', () => {
    const mockEditor: IEditor = {
        getDocument: () => document,
    } as any;

    it('initialize', () => {
        spyOn(AnnounceHandlerImpl, 'default').and.callThrough();

        const plugin = new AnnouncePlugin();
        plugin.initialize(mockEditor);

        expect(AnnounceHandlerImpl.default).toHaveBeenCalledTimes(1);
    });

    it('onPluginEvent & dispose', () => {
        const announceSpy = jasmine.createSpy('announceSpy');
        const disposeSpy = jasmine.createSpy('disposeSpy');
        const ctorSpy = jasmine.createSpy('ctorSpy');

        const mockStrings = 'MockStrings' as any;

        spyOn(AnnounceHandlerImpl, 'default').and.callFake(
            (document: Document, stringsMap?: Map<DefaultAnnounceStrings, string> | undefined) => {
                return new (class Test {
                    constructor(document: Document, stringsMap) {
                        ctorSpy(document, stringsMap);
                    }

                    public announce(announceData: AnnounceData) {
                        announceSpy(announceData);
                    }

                    public dispose() {
                        disposeSpy();
                    }
                })(document, stringsMap) as AnnounceHandlerImpl.default;
            }
        );

        const plugin = new AnnouncePlugin(mockStrings);
        const mockAnnounceData = 'AnnounceDataMock' as any;

        plugin.initialize(mockEditor);
        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: 'Test',
            additionalData: {
                getAnnounceData: () => {
                    return mockAnnounceData;
                },
            },
        });
        plugin.dispose();

        expect(ctorSpy).toHaveBeenCalledWith(document, mockStrings);
        expect(announceSpy).toHaveBeenCalledWith(mockAnnounceData);
        expect(disposeSpy).toHaveBeenCalled();
    });
});
