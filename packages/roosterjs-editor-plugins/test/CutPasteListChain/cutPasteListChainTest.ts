import * as experimentCommitListChains from 'roosterjs-editor-api/lib/experiment/experimentCommitListChains';
import { Position, VListChain } from 'roosterjs-editor-dom';
import * as DomTestHelper from 'roosterjs-editor-dom/test/DomTestHelper';
import {
    ClipboardData,
    DOMEventHandlerFunction,
    IEditor,
    Keys,
    PluginEvent,
    PluginEventType,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';
import { CutPasteListChain } from '../../lib/CutPasteListChain';

describe('cutPasteListChain tests', () => {
    let editor: IEditor;
    let plugin: CutPasteListChain;
    let handler: Record<string, DOMEventHandlerFunction> | null;
    let addDomEventHandler: jasmine.Spy;

    beforeEach(() => {
        spyOn(VListChain, 'createListChains').and.callThrough();
        spyOn(experimentCommitListChains, 'default').and.callFake(() => {});

        handler = null;
        plugin = new CutPasteListChain();

        addDomEventHandler = jasmine
            .createSpy('addDomEventHandler')
            .and.callFake((handlerParam: Record<string, DOMEventHandlerFunction>) => {
                handler = handlerParam;
                return () => {
                    handler = null;
                };
            });

        editor = <IEditor>(<any>{
            addDomEventHandler,
            getSelectionRange: () => <Range>{ collapsed: false },
            getSelectionRangeEx: () => {
                return {
                    type: SelectionRangeTypes.Normal,
                    ranges: [<Range>{ collapsed: false }],
                    areAllCollapsed: false,
                };
            },
        });

        plugin.initialize(editor);
    });

    afterEach(() => {
        plugin.dispose();
        editor = null;
    });

    it('returns the actual plugin name', () => {
        const expectedName = 'CutPasteListChain';
        const pluginName = plugin.getName();
        expect(pluginName).toBe(expectedName);
    });

    function createPluginEventBeforeCutCopy(root: HTMLDivElement) {
        const range = DomTestHelper.createRangeFromChildNodes(root);

        const pluginEvent: PluginEvent = {
            eventType: PluginEventType.BeforeCutCopy,
            rawEvent: <any>{
                which: Keys.NULL,
            },
            clonedRoot: root,
            range,
            isCut: true,
        };
        return pluginEvent;
    }

    function createPluginEventBeforePaste(testString: string) {
        const clipboardData: ClipboardData = {
            types: [],
            text: testString,
            rawHtml: null,
            image: null,
            snapshotBeforePaste: null,
            imageDataUri: null,
            customValues: {},
        };

        const pluginEvent: PluginEvent = {
            eventType: PluginEventType.BeforePaste,
            clipboardData,
            fragment: null,
            sanitizingOption: {
                elementCallbacks: {},
                attributeCallbacks: {},
                cssStyleCallbacks: {},
                additionalTagReplacements: {},
                additionalAllowedAttributes: [],
                additionalAllowedCssClasses: [],
                additionalDefaultStyleValues: {},
                additionalGlobalStyleNodes: [],
                additionalPredefinedCssForElement: {},
                preserveHtmlComments: false,
                unknownTagReplacement: null,
            },
            htmlBefore: null,
            htmlAfter: null,
            htmlAttributes: {},
        };

        return pluginEvent;
    }

    it('caches the list chain with cut', () => {
        const testString: string = 'this is a test';
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = testString;

        const expectedText: string = testString;

        const pluginEvent = createPluginEventBeforeCutCopy(contentDiv);

        editor.getSelectedRegions = () => [
            {
                rootNode: contentDiv,
                nodeBefore: null,
                nodeAfter: null,
                skipTags: [],
                fullSelectionStart: new Position(contentDiv.firstChild, 0),
                fullSelectionEnd: new Position(contentDiv.firstChild, 3),
            },
        ];

        plugin.onPluginEvent(pluginEvent);
        expect(VListChain.createListChains).toHaveBeenCalled();
        expect(contentDiv.innerHTML).toBe(expectedText);
    });

    it('caches the list chain with paste', () => {
        const testString: string = 'this is a test';
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = testString;
        const expectedText: string = testString;

        const pluginEvent = createPluginEventBeforePaste(testString);

        editor.getSelectedRegions = () => [
            {
                rootNode: contentDiv,
                nodeBefore: null,
                nodeAfter: null,
                skipTags: [],
                fullSelectionStart: new Position(contentDiv.firstChild, 0),
                fullSelectionEnd: new Position(contentDiv.firstChild, 3),
            },
        ];

        plugin.onPluginEvent(pluginEvent);
        expect(VListChain.createListChains).toHaveBeenCalled();
        expect(contentDiv.innerHTML).toBe(expectedText);
    });

    it('not call experimentCommitListChains with non-list element', () => {
        const testString: string = 'this is a test';
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = 'This is a test';
        const pasteEvent = createPluginEventBeforePaste(testString);

        editor.getSelectedRegions = () => [
            {
                rootNode: contentDiv,
                nodeBefore: null,
                nodeAfter: null,
                skipTags: [],
                fullSelectionStart: new Position(contentDiv.firstChild, 0),
                fullSelectionEnd: new Position(contentDiv.firstChild, 3),
            },
        ];

        plugin.onPluginEvent(pasteEvent);

        const contentChangedEvent: PluginEvent = {
            eventType: PluginEventType.ContentChanged,
            source: 'Paste',
        };
        plugin.onPluginEvent(contentChangedEvent);

        expect(experimentCommitListChains.default).not.toHaveBeenCalled();
    });

    it('calls experimentCommitListChains with list element', () => {
        const contentDiv = document.createElement('div');
        const ol = document.createElement('ol');

        const li1 = document.createElement('li');
        li1.appendChild(document.createTextNode('123'));
        const li2 = document.createElement('li');
        li2.appendChild(document.createTextNode('456'));

        ol.appendChild(li1);
        ol.appendChild(li2);

        contentDiv.appendChild(ol);

        editor.getSelectedRegions = () => [
            {
                rootNode: contentDiv,
                nodeBefore: null,
                nodeAfter: null,
                skipTags: [],
                fullSelectionStart: new Position(contentDiv.firstChild, 0),
                fullSelectionEnd: new Position(contentDiv.firstChild, 3),
            },
        ];

        const testString: string = 'this is a test';
        const pasteEvent = createPluginEventBeforePaste(testString);
        plugin.onPluginEvent(pasteEvent);

        const contentChangedEvent: PluginEvent = {
            eventType: PluginEventType.ContentChanged,
            source: 'Paste',
        };
        plugin.onPluginEvent(contentChangedEvent);

        expect(experimentCommitListChains.default).toHaveBeenCalled();
    });
});
