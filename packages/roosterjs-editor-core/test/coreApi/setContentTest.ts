import * as createRange from 'roosterjs-editor-dom/lib/selection/createRange';
import * as entityPlaceholderUtils from 'roosterjs-editor-dom/lib/entity/entityPlaceholderUtils';
import createEditorCore from './createMockEditorCore';
import { setContent } from '../../lib/coreApi/setContent';
import {
    ChangeSource,
    ContentMetadata,
    PluginEventType,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

describe('setContent', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('null content', () => {
        const core = createEditorCore(div, {});
        setContent(core, null, false);
        expect(div.innerHTML).toBe('');
    });

    it('null content to overwrite existing content', () => {
        const core = createEditorCore(div, {});
        div.innerHTML = 'test';
        setContent(core, null, false);
        expect(div.innerHTML).toBe('');
    });

    it('same content, no event is triggered', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent,
            },
        });
        div.innerHTML = 'test';
        setContent(core, 'test', true);
        expect(div.innerHTML).toBe('test');
        expect(triggerEvent).not.toHaveBeenCalled();
    });

    it('different content, event is triggered', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent,
            },
        });
        div.innerHTML = 'test1';
        setContent(core, 'test2', true);
        expect(div.innerHTML).toBe('test2');
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.ContentChanged,
                source: ChangeSource.SetContent,
            },
            false
        );
    });

    it('content with selection path', () => {
        const core = createEditorCore(div, {});
        div.innerHTML = 'test';
        setContent(core, '<div>test</div><!--{"start":[0,0,1],"end":[0,0,3]}-->', false);
        expect(div.innerHTML).toBe('<div>test</div>');

        const range = core.domEvent.selectionRange;
        const textNode = div.firstChild!.firstChild;
        expect(range.startContainer).toBe(textNode);
        expect(range.endContainer).toBe(textNode);
        expect(range.startOffset).toBe(1);
        expect(range.endOffset).toBe(3);
    });

    it('dark mode', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: { triggerEvent },
            inDarkMode: true,
        });
        div.innerHTML = 'test';
        setContent(core, '<div>test</div>', true);
        expect(div.innerHTML).toBe('<div>test</div>');
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.ContentChanged,
                source: ChangeSource.SetContent,
            },
            false
        );
    });

    it('setContent with entity map', () => {
        const core = createEditorCore(div, {
            coreApiOverride: {},
        });
        const entity = document.createElement('div');

        entity.id = 'div1';

        const entityMapMock = 'ENTITYMAP' as any;
        core.entity.entityMap = entityMapMock;

        const restoreContentWithEntityPlaceholderSpy = spyOn(
            entityPlaceholderUtils,
            'restoreContentWithEntityPlaceholder'
        );

        setContent(core, 'test', false);

        expect(restoreContentWithEntityPlaceholderSpy).toHaveBeenCalledTimes(1);
        expect(restoreContentWithEntityPlaceholderSpy.calls.argsFor(0)[2]).toBe(entityMapMock);
    });
});

describe('setContent and metadata', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    const selectionPath = { start: [1], end: [2] };
    const htmlContent = '<div>test</div>';

    function runNormalMetadataTest(newContent: string, metadata: ContentMetadata) {
        const triggerEvent = jasmine.createSpy('triggerEvent');
        const selectRange = jasmine.createSpy('selectRange');
        const transformColor = jasmine.createSpy('transformColor');
        const core = createEditorCore(div, {
            coreApiOverride: { triggerEvent, selectRange },
            inDarkMode: true,
        });
        const range = <any>{};
        div.innerHTML = 'test';

        spyOn(createRange, 'default').and.returnValue(range);

        setContent(core, newContent, true, metadata);

        expect(div.innerHTML).toBe(htmlContent);
        expect(triggerEvent).toHaveBeenCalledTimes(2);
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.BeforeSetContent,
                newContent: newContent,
            },
            true
        );
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.ContentChanged,
                source: ChangeSource.SetContent,
            },
            false
        );
        expect(<any>createRange.default).toHaveBeenCalledWith(
            div,
            selectionPath.start,
            selectionPath.end
        );
        expect(selectRange).toHaveBeenCalledWith(core, range);
        expect(transformColor).not.toHaveBeenCalled();
    }

    it('setContent with metadata - standalone metadata', () => {
        runNormalMetadataTest(htmlContent, {
            type: SelectionRangeTypes.Normal,
            isDarkMode: false,
            ...selectionPath,
        });
    });

    it('setContent with metadata - embedded metadata', () => {
        runNormalMetadataTest(
            htmlContent +
                '<!--' +
                JSON.stringify({
                    type: SelectionRangeTypes.Normal,
                    isDarkMode: false,
                    ...selectionPath,
                }) +
                '-->',
            undefined
        );
    });

    it('setContent with metadata - both', () => {
        runNormalMetadataTest(
            htmlContent +
                '<!--' +
                JSON.stringify({
                    type: SelectionRangeTypes.Normal,
                    isDarkMode: true,
                    start: [0],
                    end: [0],
                }) +
                '-->',
            {
                type: SelectionRangeTypes.Normal,
                isDarkMode: false,
                ...selectionPath,
            }
        );
    });
});
