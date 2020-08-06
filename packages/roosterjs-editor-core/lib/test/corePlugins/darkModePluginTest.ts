import * as normalizeContentColor from '../../corePlugins/darkMode/normalizeContentColor';
import DarkModePlugin from '../../corePlugins/darkMode/DarkModePlugin';
import Editor from '../../editor/Editor';

describe('DarkModePlugin', () => {
    it('init and dispose', () => {
        const plugin = new DarkModePlugin({});
        const addDomEventHandler = jasmine.createSpy('addDomEventHandler');
        const state = plugin.getState();
        plugin.initialize(<Editor>(<any>{
            addDomEventHandler,
        }));

        expect(state.value.isDarkMode).toBeFalsy();
        expect(addDomEventHandler).toHaveBeenCalled();

        plugin.dispose();
    });

    it('init and dispose for dark mode', () => {
        const plugin = new DarkModePlugin({ inDarkMode: true });
        const addDomEventHandler = jasmine.createSpy('addDomEventHandler');
        const state = plugin.getState();
        plugin.initialize(<Editor>(<any>{
            addDomEventHandler,
        }));

        expect(state.value.isDarkMode).toBeTruthy();
        expect(addDomEventHandler).toHaveBeenCalled();

        plugin.dispose();
    });

    it('event handler should be added', () => {
        const plugin = new DarkModePlugin({});
        let eventMap: Record<string, (event: Event) => void>;
        plugin.initialize(<Editor>(<any>{
            addDomEventHandler: (map: Record<string, (event: Event) => void>) => {
                eventMap = map;
            },
        }));

        expect(eventMap).toBeDefined();
        expect(eventMap.copy).toBeDefined();
        expect(eventMap.cut).toBeDefined();

        plugin.dispose();
    });

    it('trigger copy event in light mode', () => {
        spyOn(normalizeContentColor, 'default');
        const plugin = new DarkModePlugin({});
        let eventMap: Record<string, (event: Event) => void>;
        plugin.initialize(<Editor>(<any>{
            addDomEventHandler: (map: Record<string, (event: Event) => void>) => {
                eventMap = map;
            },
        }));

        eventMap.copy(<Event>{});

        expect(normalizeContentColor.default).not.toHaveBeenCalled();

        plugin.dispose();
    });

    it('trigger copy event in dark mode', () => {
        const fakeResultText = 'test';
        const fakeResultHtml = '<span>' + fakeResultText + '</span>';
        spyOn(normalizeContentColor, 'default').and.callFake((div: HTMLElement) => {
            div.innerHTML = fakeResultHtml;
        });
        const plugin = new DarkModePlugin({ inDarkMode: true });
        let eventMap: Record<string, (event: Event) => void>;

        const deleteContents = jasmine.createSpy('deleteContents');
        plugin.initialize(<Editor>(<any>{
            addDomEventHandler: (map: Record<string, (event: Event) => void>) => {
                eventMap = map;
            },
            getSelectionRange: () => ({
                collapsed: false,
                cloneContents: createFragment,
                deleteContents,
            }),
            getDocument: () => document,
        }));

        const setData = jasmine.createSpy('setData');
        const preventDefault = jasmine.createSpy('preventDefault');

        eventMap.copy(<Event>(<any>{
            clipboardData: {
                setData,
            },
            preventDefault,
        }));

        expect(normalizeContentColor.default).toHaveBeenCalled();
        expect(preventDefault).toHaveBeenCalled();
        expect(setData).toHaveBeenCalledTimes(2);
        expect(setData.calls.argsFor(0)[0]).toEqual('text/html');
        expect(setData.calls.argsFor(0)[1]).toEqual(fakeResultHtml);
        expect(setData.calls.argsFor(1)[0]).toEqual('text/plain');
        expect(setData.calls.argsFor(1)[1]).toEqual(fakeResultText);
        expect(deleteContents).not.toHaveBeenCalled();

        plugin.dispose();
    });

    it('trigger cut event in dark mode', () => {
        const fakeResultText = 'test';
        const fakeResultHtml = '<span>' + fakeResultText + '</span>';
        spyOn(normalizeContentColor, 'default').and.callFake((div: HTMLElement) => {
            div.innerHTML = fakeResultHtml;
        });
        const plugin = new DarkModePlugin({ inDarkMode: true });
        let eventMap: Record<string, (event: Event) => void>;

        const deleteContents = jasmine.createSpy('deleteContents');
        plugin.initialize(<Editor>(<any>{
            addDomEventHandler: (map: Record<string, (event: Event) => void>) => {
                eventMap = map;
            },
            getSelectionRange: () => ({
                collapsed: false,
                cloneContents: createFragment,
                deleteContents,
            }),
            getDocument: () => document,
        }));

        const setData = jasmine.createSpy('setData');
        const preventDefault = jasmine.createSpy('preventDefault');

        eventMap.cut(<Event>(<any>{
            clipboardData: {
                setData,
            },
            preventDefault,
        }));

        expect(normalizeContentColor.default).toHaveBeenCalled();
        expect(preventDefault).toHaveBeenCalled();
        expect(setData).toHaveBeenCalledTimes(2);
        expect(setData.calls.argsFor(0)[0]).toEqual('text/html');
        expect(setData.calls.argsFor(0)[1]).toEqual(fakeResultHtml);
        expect(setData.calls.argsFor(1)[0]).toEqual('text/plain');
        expect(setData.calls.argsFor(1)[1]).toEqual(fakeResultText);
        expect(deleteContents).toHaveBeenCalled();

        plugin.dispose();
    });
});

function createFragment() {
    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');
    div.innerHTML = 'test';
    fragment.appendChild(div);
    return fragment;
}
