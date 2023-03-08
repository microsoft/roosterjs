import { EntityFeatures } from '../../../lib/plugins/ContentEdit/features/entityFeatures';
import {
    addDelimiters,
    commitEntity,
    findClosestElementAncestor,
    Position,
    PositionContentSearcher,
} from 'roosterjs-editor-dom';
import {
    Entity,
    ExperimentalFeatures,
    IEditor,
    Keys,
    PluginKeyDownEvent,
} from 'roosterjs-editor-types';

describe('Content Edit Features |', () => {
    const { removeEntityBetweenDelimiters } = EntityFeatures;
    let entity: Entity;
    let delimiterAfter: Element | null;
    let delimiterBefore: Element | null;
    let wrapper: HTMLElement;
    let editor: IEditor;
    let select: jasmine.Spy;
    let triggerContentChangedEvent: jasmine.Spy;
    let testContainer: HTMLDivElement;

    beforeAll(() => {
        cleanUp();
    });

    beforeEach(() => {
        cleanUp();
        testContainer = document.createElement('div');
        document.body.appendChild(testContainer);

        wrapper = document.createElement('span');
        wrapper.innerHTML = 'Test';

        testContainer.appendChild(wrapper);
        select = jasmine.createSpy('select');
        triggerContentChangedEvent = jasmine.createSpy('triggerContentChangedEvent');

        editor = <IEditor>(<any>{
            getDocument: () => document,
            getElementAtCursor: (selector: string, node: Node) =>
                selector && node
                    ? findClosestElementAncestor(node, document.body, selector)
                    : testContainer,
            addContentEditFeature: () => {},
            queryElements: (selector: string) => {
                return document.querySelectorAll(selector);
            },
            triggerPluginEvent: (arg0: any, arg1: any) => {
                triggerContentChangedEvent(arg0, arg1);
            },
            runAsync: (callback: () => void) => callback(),
            getSelectionRange: () =>
                <Range>{
                    collapsed: true,
                },
            select,
            isFeatureEnabled: (feature: ExperimentalFeatures) => {
                return feature === ExperimentalFeatures.InlineEntityReadOnlyDelimiters;
            },
        });

        ({ entity, delimiterAfter, delimiterBefore } = addEntityBeforeEach(entity, wrapper));
    });

    afterAll(() => {
        cleanUp();
    });

    describe('Remove Entity Between delimiters', () => {
        function runTest(element: Element | null, expected: boolean, event: PluginKeyDownEvent) {
            setEditorFuncs(editor, element, testContainer);

            const result = removeEntityBetweenDelimiters.shouldHandleEvent(
                event,
                editor,
                false /* ctrlOrMeta */
            );

            expect(result).toBe(expected);
            return event;
        }

        it('DelimiterAfter, Backspace', () => {
            let event = <PluginKeyDownEvent>{
                rawEvent: <KeyboardEvent>{
                    which: Keys.BACKSPACE,
                },
            };

            runTest(delimiterAfter, true /* expected */, event);

            removeEntityBetweenDelimiters.handleEvent(event, editor);

            expect(triggerContentChangedEvent).toHaveBeenCalledTimes(1);
        });

        it('DelimiterAfter, DELETE', () => {
            let event = <PluginKeyDownEvent>{
                rawEvent: <KeyboardEvent>{
                    which: Keys.DELETE,
                },
            };

            runTest(delimiterAfter, false /* expected */, event);
        });

        it('DelimiterBefore, BACKSPACE', () => {
            let event = <PluginKeyDownEvent>{
                rawEvent: <KeyboardEvent>{
                    which: Keys.BACKSPACE,
                },
            };

            runTest(delimiterBefore, false /* expected */, event);
        });

        it('DelimiterBefore, DELETE', () => {
            let event = <PluginKeyDownEvent>{
                rawEvent: <KeyboardEvent>{
                    which: Keys.DELETE,
                },
            };

            runTest(delimiterBefore, true /* expected */, event);

            removeEntityBetweenDelimiters.handleEvent(event, editor);

            expect(triggerContentChangedEvent).toHaveBeenCalledTimes(1);
        });
    });
});

function setEditorFuncs(
    editor: IEditor,
    element: Element | Position | null,
    testContainer: HTMLDivElement
) {
    editor.getFocusedPosition = () => getPos(element);
    editor.getContentSearcherOfCursor = () => {
        const pos = getPos(element);
        return pos ? new PositionContentSearcher(testContainer, pos) : null!;
    };
}

function cleanUp() {
    document.body.childNodes.forEach(cn => {
        document.body.removeChild(cn);
    });
}

function addEntityBeforeEach(entity: Entity, wrapper: HTMLElement) {
    entity = <Entity>{
        id: 'test',
        isReadonly: true,
        type: 'Test',
        wrapper,
    };

    commitEntity(wrapper, 'test', true, 'test');
    addDelimiters(wrapper);

    return {
        entity,
        delimiterAfter: wrapper.nextElementSibling,
        delimiterBefore: wrapper.previousElementSibling,
    };
}

const getPos = (element: Element | Position | null) => {
    return (element
        ? (element as Position).element
            ? (element as Position)
            : new Position(element as Element, 0)
        : null)!;
};
