import * as addDelimiters from 'roosterjs-editor-dom/lib/delimiter/addDelimiters';
import * as getComputedStyles from 'roosterjs-editor-dom/lib/utils/getComputedStyles';
import { EntityFeatures } from '../../../lib/plugins/ContentEdit/features/entityFeatures';
import {
    commitEntity,
    ContentTraverser,
    findClosestElementAncestor,
    getBlockElementAtNode,
    Position,
    PositionContentSearcher,
} from 'roosterjs-editor-dom';
import {
    Entity,
    ExperimentalFeatures,
    IEditor,
    Keys,
    PluginKeyDownEvent,
    BlockElement,
} from 'roosterjs-editor-types';

describe('Content Edit Features |', () => {
    const { moveBetweenDelimitersFeature, removeEntityBetweenDelimiters } = EntityFeatures;
    let entity: Entity;
    let delimiterAfter: Element | null;
    let delimiterBefore: Element | null;
    let wrapper: HTMLElement;
    let editor: IEditor;
    let select: jasmine.Spy;
    let triggerContentChangedEvent: jasmine.Spy;
    let testContainer: HTMLDivElement;

    let defaultEvent = <PluginKeyDownEvent>{};
    let extendSpy: jasmine.Spy;
    let event: PluginKeyDownEvent;
    let preventDefaultSpy: jasmine.Spy;

    beforeAll(() => {
        cleanUp();
    });

    beforeEach(() => {
        preventDefaultSpy = jasmine.createSpy('preventDefault');
        extendSpy = jasmine.createSpy('expand');
        cleanUp();
        defaultEvent = <PluginKeyDownEvent>{};
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
            queryElements: (selector: string) => document.querySelectorAll(selector),
            triggerPluginEvent: (arg0: any, arg1: any) => triggerContentChangedEvent(arg0, arg1),
            runAsync: (callback: () => void) => callback(),
            getSelectionRange: () =>
                <Range>{
                    collapsed: true,
                },
            select,
            isFeatureEnabled: (feature: ExperimentalFeatures) =>
                feature === ExperimentalFeatures.InlineEntityReadOnlyDelimiters,
            getBodyTraverser: (startNode?: Node) =>
                ContentTraverser.createBodyTraverser(testContainer, startNode),
            getBlockElementAtNode: (node: Node) => getBlockElementAtNode(document.body, node),
        });

        ({ entity, delimiterAfter, delimiterBefore } = addEntityBeforeEach(entity, wrapper));
        spyOn(addDelimiters, 'default').and.callThrough();
    });

    afterAll(() => {
        cleanUp();
    });

    describe('Move Before |', () => {
        function runTest(
            element: Element | Position | null,
            expected: boolean,
            event: PluginKeyDownEvent
        ) {
            setEditorFuncs(editor, element, testContainer);

            const result = moveBetweenDelimitersFeature.shouldHandleEvent(
                event,
                editor,
                false /* ctrlOrMeta */
            );

            expect(result).toBe(expected);
            return event;
        }
        function runTests() {
            it('DelimiterAfter, shouldHandle and Handle, no shiftKey', () => {
                event = runTest(delimiterAfter, true /* expected */, event);

                spyOnSelection();

                moveBetweenDelimitersFeature.handleEvent(event, editor);

                expect(select).toHaveBeenCalledWith(new Position(testContainer, 0));
                expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
                expect(extendSpy).toHaveBeenCalledTimes(0);

                restoreSelection();
            });

            it('DelimiterAfter, shouldHandle and Handle, with shiftKey', () => {
                event = {
                    ...event,
                    rawEvent: <KeyboardEvent>{
                        ...event.rawEvent,
                        shiftKey: true,
                    },
                };

                event = runTest(delimiterAfter, true /* expected */, event);

                spyOnSelection();

                moveBetweenDelimitersFeature.handleEvent(event, editor);

                expect(extendSpy).toHaveBeenCalledWith(testContainer, 0);
                expect(preventDefaultSpy).toHaveBeenCalledTimes(1);

                restoreSelection();
            });

            it('DelimiterAfter, shouldHandle and Handle, no shiftKey, elements wrapped in B', () => {
                wrapElementInB(delimiterBefore);
                wrapElementInB(entity.wrapper);
                wrapElementInB(delimiterAfter);
                event = runTest(delimiterAfter, true /* expected */, event);

                spyOnSelection();

                moveBetweenDelimitersFeature.handleEvent(event, editor);

                expect(select).toHaveBeenCalledWith(
                    new Position(delimiterBefore!.parentElement!, 0)
                );
                expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
                expect(extendSpy).toHaveBeenCalledTimes(0);

                restoreSelection();
            });

            it('DelimiterAfter, shouldHandle and Handle, with shiftKey, elements wrapped in B', () => {
                event = {
                    ...event,
                    rawEvent: <KeyboardEvent>{
                        ...event.rawEvent,
                        shiftKey: true,
                    },
                };

                wrapElementInB(delimiterBefore);
                wrapElementInB(entity.wrapper);
                wrapElementInB(delimiterAfter);
                event = runTest(delimiterAfter, true /* expected */, event);

                spyOnSelection();

                moveBetweenDelimitersFeature.handleEvent(event, editor);

                expect(extendSpy).toHaveBeenCalledWith(delimiterBefore?.parentElement, 0);
                expect(preventDefaultSpy).toHaveBeenCalledTimes(1);

                restoreSelection();
            });

            it('DelimiterAfter, should not Handle, no shiftKey', () => {
                event = {
                    ...event,
                    rawEvent: <KeyboardEvent>{
                        ...event.rawEvent,
                        shiftKey: true,
                        which: event.rawEvent.which === Keys.RIGHT ? Keys.LEFT : Keys.RIGHT,
                    },
                };

                event = runTest(delimiterAfter, false /* expected */, event);
            });

            it('DelimiterAfter, should not Handle, with shiftKey', () => {
                event = {
                    ...event,
                    rawEvent: <KeyboardEvent>{
                        ...event.rawEvent,
                        shiftKey: true,
                        which: event.rawEvent.which === Keys.RIGHT ? Keys.LEFT : Keys.RIGHT,
                    },
                };

                event = runTest(delimiterAfter, false /* expected */, event);
            });

            it('DelimiterAfter, shouldHandle and Handle, with shiftKey', () => {
                event = {
                    ...event,
                    rawEvent: <KeyboardEvent>{
                        ...event.rawEvent,
                        shiftKey: true,
                    },
                };

                event = runTest(delimiterAfter, true /* expected */, event);

                spyOnSelection();

                moveBetweenDelimitersFeature.handleEvent(event, editor);

                expect(extendSpy).toHaveBeenCalledWith(testContainer, 0);
                expect(preventDefaultSpy).toHaveBeenCalledTimes(1);

                restoreSelection();
            });

            it('Element not an delimiter', () => {
                delimiterAfter!.setAttribute('class', '');

                runTest(delimiterAfter, false /* expected */, event);
            });

            it('Handle Event without cache', () => {
                moveBetweenDelimitersFeature.handleEvent(event, editor);

                expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
                expect(extendSpy).toHaveBeenCalledTimes(0);
            });

            it('Null', () => {
                runTest(null, false /* expected */, event);
            });

            it('Feature not enabled, do not handle', () => {
                editor.isFeatureEnabled = () => false;
                runTest(null, false /* expected */, event);
            });

            it('Selection not collapsed. do not handle', () => {
                (editor.getSelectionRange = () =>
                    <Range>{
                        collapsed: false,
                    }),
                    runTest(null, false /* expected */, event);
            });

            it('DelimiterAfter, shouldHandle and Handle, cursor at start of element after delimiter after', () => {
                const bold = document.createElement('b');
                bold.append(document.createTextNode('Bold'));
                testContainer.insertBefore(bold, null);

                event = runTest(new Position(bold.firstChild!, 0), true /* expected */, event);

                spyOnSelection();

                moveBetweenDelimitersFeature.handleEvent(event, editor);

                expect(select).toHaveBeenCalledWith(new Position(testContainer, 0));
                expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
                expect(extendSpy).toHaveBeenCalledTimes(0);

                restoreSelection();
            });

            it('DelimiterAfter, should not Handle, cursor is not not at the start of the element after delimiter after', () => {
                const bold = document.createElement('b');
                bold.append(document.createTextNode('Bold'));
                testContainer.insertBefore(bold, null);

                event = runTest(new Position(bold.firstChild!, 1), false /* expected */, event);
            });

            it('DelimiterAfter, should not Handle, cursor is at start of next block', () => {
                const div = document.createElement('div');
                div.appendChild(document.createTextNode('New block'));
                testContainer.insertAdjacentElement('afterend', div);

                runTest(new Position(<Node>div.firstChild!, 0), false /* expected */, event);
            });

            it('Delimiter After, Inline Readonly Entity with multiple Inline Elements', () => {
                const b = document.createElement('b');
                b.appendChild(document.createTextNode('Bold'));

                entity.wrapper.appendChild(b);
                entity.wrapper.appendChild(b.cloneNode(true));

                wrapElementInB(delimiterBefore);
                wrapElementInB(entity.wrapper);
                wrapElementInB(delimiterAfter);

                runTest(delimiterAfter, true /* expected */, event);
            });

            it('DelimiterAfter, should not Handle, getBlockElementAtCursor returned inline', () => {
                const div = document.createElement('div');
                div.appendChild(document.createTextNode('New block'));
                testContainer.insertAdjacentElement('afterend', div);

                const pos = new Position(<Node>div.firstChild!, 0);

                setEditorFuncs(editor, pos, testContainer);
                editor.getBlockElementAtNode = node => {
                    return <BlockElement>{
                        getStartNode: () => node,
                    };
                };

                const result = moveBetweenDelimitersFeature.shouldHandleEvent(
                    event,
                    editor,
                    false /* ctrlOrMeta */
                );

                expect(result).toBe(false);
            });
        }

        describe('LTR |', () => {
            beforeEach(() => {
                event = <PluginKeyDownEvent>{
                    rawEvent: <KeyboardEvent>{
                        preventDefault() {
                            preventDefaultSpy();
                        },
                        which: Keys.LEFT,
                    },
                };
            });
            runTests();
        });

        describe('RTL |', () => {
            beforeEach(() => {
                event = <PluginKeyDownEvent>{
                    rawEvent: <KeyboardEvent>{
                        preventDefault() {
                            preventDefaultSpy();
                        },
                        which: Keys.RIGHT,
                    },
                };
                spyOn(getComputedStyles, 'getComputedStyle').and.returnValue('rtl');
            });
            runTests();
        });
    });

    describe('Move After |', () => {
        let event: PluginKeyDownEvent;

        function runTest(
            element: Element | Position | null,
            expected: boolean,
            event: PluginKeyDownEvent
        ) {
            setEditorFuncs(editor, element, testContainer);

            const result = moveBetweenDelimitersFeature.shouldHandleEvent(
                event,
                editor,
                false /* ctrlOrMeta */
            );

            expect(result).toBe(expected);
            return event;
        }

        function runTests() {
            it('DelimiterAfter', () => {
                runTest(delimiterAfter, false /* expected */, event);
            });

            it('DelimiterBefore, should handle and handle,  no shiftKey', () => {
                event = runTest(delimiterBefore, true /* expected */, event);

                spyOnSelection();
                moveBetweenDelimitersFeature.handleEvent(event, editor);

                expect(select).toHaveBeenCalledWith(new Position(delimiterAfter!, 1));
                expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
                expect(extendSpy).toHaveBeenCalledTimes(0);

                restoreSelection();
            });

            it('DelimiterBefore, should handle and handle,  no shiftKey elements wrapped in B', () => {
                wrapElementInB(delimiterBefore);
                wrapElementInB(entity.wrapper);
                wrapElementInB(delimiterAfter);
                event = runTest(delimiterBefore, true /* expected */, event);

                spyOnSelection();
                moveBetweenDelimitersFeature.handleEvent(event, editor);

                expect(select).toHaveBeenCalledWith(new Position(delimiterAfter!, 1));
                expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
                expect(extendSpy).toHaveBeenCalledTimes(0);

                restoreSelection();
            });

            it('DelimiterBefore, should handle and handle, with shiftKey', () => {
                event = {
                    ...event,
                    rawEvent: <KeyboardEvent>{
                        ...event.rawEvent,
                        shiftKey: true,
                    },
                };

                event = runTest(delimiterBefore, true /* expected */, event);

                spyOnSelection();

                moveBetweenDelimitersFeature.handleEvent(event, editor);

                expect(extendSpy).toHaveBeenCalledWith(testContainer, 3);
                expect(preventDefaultSpy).toHaveBeenCalledTimes(1);

                restoreSelection();
            });

            it('DelimiterBefore, should handle and handle, with shiftKey, elements wrapped in B', () => {
                event = {
                    ...event,
                    rawEvent: <KeyboardEvent>{
                        ...event.rawEvent,
                        shiftKey: true,
                    },
                };

                wrapElementInB(delimiterBefore);
                wrapElementInB(entity.wrapper);
                wrapElementInB(delimiterAfter);
                event = runTest(delimiterBefore, true /* expected */, event);

                spyOnSelection();

                moveBetweenDelimitersFeature.handleEvent(event, editor);

                expect(extendSpy).toHaveBeenCalledWith(delimiterAfter?.parentElement, 1);
                expect(preventDefaultSpy).toHaveBeenCalledTimes(1);

                restoreSelection();
            });

            it('DelimiterBefore, should not handle, no shiftKey', () => {
                event = {
                    ...event,
                    rawEvent: <KeyboardEvent>{
                        ...event.rawEvent,
                        which: event.rawEvent.which === Keys.RIGHT ? Keys.LEFT : Keys.RIGHT,
                    },
                };
                event = runTest(delimiterBefore, false /* expected */, event);
            });

            it('DelimiterBefore, should not handle, with shiftKey', () => {
                event = {
                    ...event,
                    rawEvent: <KeyboardEvent>{
                        ...event.rawEvent,
                        shiftKey: true,
                        which: event.rawEvent.which === Keys.RIGHT ? Keys.LEFT : Keys.RIGHT,
                    },
                };
                event = runTest(delimiterBefore, false /* expected */, event);
            });

            it('Element not an delimiter', () => {
                delimiterAfter!.setAttribute('class', '');
                runTest(delimiterAfter, false /* expected */, event);
            });

            it('Handle Event without cache', () => {
                moveBetweenDelimitersFeature.handleEvent(defaultEvent, editor);

                expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
                expect(extendSpy).toHaveBeenCalledTimes(0);
            });

            it('Null', () => {
                runTest(null, false /* expected */, event);
            });

            it('Feature not enabled, do not handle', () => {
                editor.isFeatureEnabled = () => false;
                runTest(null, false /* expected */, event);
            });

            it('Selection not collapsed. do not handle', () => {
                (editor.getSelectionRange = () =>
                    <Range>{
                        collapsed: false,
                    }),
                    runTest(null, false /* expected */, event);
            });

            it('DelimiterBefore, shouldHandle and Handle, cursor at end of element before delimiter before', () => {
                const bold = document.createElement('b');
                bold.append(document.createTextNode('Bold'));
                testContainer.insertBefore(bold, delimiterBefore);

                event = runTest(new Position(bold.firstChild!, 4), true /* expected */, event);

                spyOnSelection();

                moveBetweenDelimitersFeature.handleEvent(event, editor);

                expect(select).toHaveBeenCalledWith(new Position(delimiterAfter!, 1));
                expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
                expect(extendSpy).toHaveBeenCalledTimes(0);

                restoreSelection();
            });

            it('DelimiterBefore, should not Handle, cursor is not not at the start of the element after delimiter after', () => {
                const bold = document.createElement('b');
                bold.append(document.createTextNode('Bold'));
                testContainer.insertBefore(bold, null);

                event = runTest(new Position(bold.firstChild!, 1), false /* expected */, event);
            });

            it('DelimiterBefore, should not Handle, cursor is at end of previous block', () => {
                const div = document.createElement('div');
                testContainer.insertAdjacentElement('beforeend', div);

                runTest(new Position(div, 0), false /* expected */, event);
            });

            it('DelimiterBefore, Inline Readonly Entity with multiple Inline Elements', () => {
                const b = document.createElement('b');
                b.appendChild(document.createTextNode('Bold'));

                entity.wrapper.appendChild(b);
                entity.wrapper.appendChild(b.cloneNode(true));

                wrapElementInB(delimiterBefore);
                wrapElementInB(entity.wrapper);
                wrapElementInB(delimiterAfter);

                runTest(delimiterBefore, true /* expected */, event);
            });

            it('DelimiterBefore, should not Handle, getBlockElementAtCursor returned inline', () => {
                const div = document.createElement('div');
                div.appendChild(document.createTextNode('New block'));
                testContainer.insertAdjacentElement('afterend', div);

                const pos = new Position(<Node>div.firstChild!, 0);

                setEditorFuncs(editor, pos, testContainer);
                editor.getBlockElementAtNode = node => {
                    return <BlockElement>{
                        getStartNode: () => node,
                    };
                };

                const result = moveBetweenDelimitersFeature.shouldHandleEvent(
                    event,
                    editor,
                    false /* ctrlOrMeta */
                );

                expect(result).toBe(false);
            });
        }

        describe('LTR |', () => {
            beforeEach(() => {
                preventDefaultSpy = jasmine.createSpy('preventDefault');
                event = <PluginKeyDownEvent>{
                    rawEvent: <KeyboardEvent>{
                        preventDefault() {
                            preventDefaultSpy();
                        },
                        which: Keys.RIGHT,
                    },
                };
            });
            runTests();
        });

        describe('RTL |', () => {
            beforeEach(() => {
                preventDefaultSpy = jasmine.createSpy('preventDefault');
                event = <PluginKeyDownEvent>{
                    rawEvent: <KeyboardEvent>{
                        preventDefault() {
                            preventDefaultSpy();
                        },
                        which: Keys.LEFT,
                    },
                };
                spyOn(getComputedStyles, 'getComputedStyle').and.returnValue('rtl');
            });
            runTests();
        });
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

        it('removeEntityBetweenDelimiters, should not Handle, getBlockElementAtCursor returned inline', () => {
            const div = document.createElement('div');
            div.appendChild(document.createTextNode('New block'));
            testContainer.insertAdjacentElement('afterend', div);

            const pos = new Position(<Node>div.firstChild!, 0);

            setEditorFuncs(editor, pos, testContainer);
            editor.getBlockElementAtNode = node => {
                return <BlockElement>{
                    getStartNode: () => node,
                };
            };

            const result = removeEntityBetweenDelimiters.shouldHandleEvent(
                <PluginKeyDownEvent>{
                    rawEvent: <KeyboardEvent>{
                        which: Keys.BACKSPACE,
                        defaultPrevented: false,
                    },
                },
                editor,
                false /* ctrlOrMeta */
            );

            expect(result).toBe(false);
        });

        it('DelimiterAfter, Backspace, default not prevented', () => {
            let event = <PluginKeyDownEvent>{
                rawEvent: <KeyboardEvent>{
                    which: Keys.BACKSPACE,
                    defaultPrevented: false,
                },
            };

            runTest(delimiterAfter, true /* expected */, event);

            removeEntityBetweenDelimiters.handleEvent(event, editor);

            expect(triggerContentChangedEvent).toHaveBeenCalledTimes(1);
            expect(select).toHaveBeenCalledTimes(1);
        });

        it('DelimiterAfter, Backspace, default prevented and entity is still in editor', () => {
            let event = <PluginKeyDownEvent>{
                rawEvent: <KeyboardEvent>{
                    which: Keys.BACKSPACE,
                    defaultPrevented: true,
                },
            };
            editor.contains = () => true;
            runTest(delimiterAfter, true /* expected */, event);

            removeEntityBetweenDelimiters.handleEvent(event, editor);

            expect(triggerContentChangedEvent).toHaveBeenCalledTimes(1);
            expect(select).toHaveBeenCalledTimes(1);
            expect(testContainer.contains(delimiterAfter)).toBe(true);
            expect(testContainer.contains(delimiterBefore)).toBe(true);
            expect(addDelimiters.default).toHaveBeenCalledWith(entity.wrapper);
        });

        it('DelimiterAfter, Backspace, default prevented and entity is removed', () => {
            let event = <PluginKeyDownEvent>{
                rawEvent: <KeyboardEvent>{
                    which: Keys.BACKSPACE,
                    defaultPrevented: true,
                },
            };
            editor.contains = () => false;
            runTest(delimiterAfter, true /* expected */, event);

            removeEntityBetweenDelimiters.handleEvent(event, editor);

            expect(triggerContentChangedEvent).toHaveBeenCalledTimes(1);
            expect(select).toHaveBeenCalledTimes(0);
            expect(testContainer.contains(delimiterAfter)).toBe(false);
            expect(testContainer.contains(delimiterBefore)).toBe(false);
            expect(addDelimiters.default).not.toHaveBeenCalled();
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

        it('DelimiterBefore, Backspace, default not prevented', () => {
            let event = <PluginKeyDownEvent>{
                rawEvent: <KeyboardEvent>{
                    which: Keys.DELETE,
                    defaultPrevented: false,
                },
            };

            runTest(delimiterBefore, true /* expected */, event);

            removeEntityBetweenDelimiters.handleEvent(event, editor);

            expect(triggerContentChangedEvent).toHaveBeenCalledTimes(1);
            expect(select).toHaveBeenCalledTimes(1);
        });

        it('DelimiterBefore, Backspace, default prevented and entity is still in editor', () => {
            let event = <PluginKeyDownEvent>{
                rawEvent: <KeyboardEvent>{
                    which: Keys.DELETE,
                    defaultPrevented: true,
                },
            };
            editor.contains = () => true;
            runTest(delimiterBefore, true /* expected */, event);

            removeEntityBetweenDelimiters.handleEvent(event, editor);

            expect(triggerContentChangedEvent).toHaveBeenCalledTimes(1);
            expect(select).toHaveBeenCalledTimes(1);
            expect(testContainer.contains(delimiterAfter)).toBe(true);
            expect(testContainer.contains(delimiterBefore)).toBe(true);
            expect(addDelimiters.default).toHaveBeenCalledWith(entity.wrapper);
        });

        it('DelimiterBefore, Backspace, default prevented and entity is removed', () => {
            let event = <PluginKeyDownEvent>{
                rawEvent: <KeyboardEvent>{
                    which: Keys.DELETE,
                    defaultPrevented: true,
                },
            };
            editor.contains = () => false;
            runTest(delimiterBefore, true /* expected */, event);

            removeEntityBetweenDelimiters.handleEvent(event, editor);

            expect(triggerContentChangedEvent).toHaveBeenCalledTimes(1);
            expect(select).toHaveBeenCalledTimes(0);
            expect(testContainer.contains(delimiterAfter)).toBe(false);
            expect(testContainer.contains(delimiterBefore)).toBe(false);
            expect(addDelimiters.default).not.toHaveBeenCalled();
        });
    });

    let selectionTemp: any;
    function spyOnSelection() {
        selectionTemp = document.getSelection;
        document.getSelection = () =>
            <Selection>{
                extend(node: Node, offset: number) {
                    extendSpy(node, offset);
                },
            };
    }

    function restoreSelection() {
        document.getSelection = selectionTemp;
    }
});

function wrapElementInB(delimiterBefore: Element | null) {
    const element = delimiterBefore?.insertAdjacentElement(
        'beforebegin',
        document.createElement('b')
    );
    element?.appendChild(delimiterBefore!);
}

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
    addDelimiters.default(wrapper);

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
