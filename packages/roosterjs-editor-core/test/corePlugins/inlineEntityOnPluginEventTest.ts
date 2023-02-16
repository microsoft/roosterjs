import { getInlineEntityContentEditFeatures } from '../../lib/corePlugins/utils/InlineEntityHandlers/contentEditFeatures';
import { inlineEntityOnPluginEvent } from '../../lib/corePlugins/utils/InlineEntityHandlers/inlineEntityOnPluginEvent';
import {
    BeforeCutCopyEvent,
    DelimiterClasses,
    Entity,
    EntityOperation,
    EntityOperationEvent,
    ExtractContentWithDomEvent,
    PositionType,
    IEditor,
    PluginEventType,
    PluginKeyDownEvent,
} from 'roosterjs-editor-types';
import {
    addDelimiters,
    commitEntity,
    findClosestElementAncestor,
    Position,
} from 'roosterjs-editor-dom';

const ZERO_WIDTH_SPACE = '\u200B';
const DELIMITER_SELECTOR =
    '.' + DelimiterClasses.DELIMITER_AFTER + ',.' + DelimiterClasses.DELIMITER_BEFORE;

describe('Inline Entity On Plugin Event |', () => {
    let wrapper: HTMLElement;
    let editor: IEditor;

    beforeEach(() => {
        wrapper = document.createElement('span');
        wrapper.innerHTML = 'Test';
        document.body.appendChild(wrapper);

        editor = <IEditor>(<any>{
            getDocument: () => document,
            getElementAtCursor: (selector: string, node: Node) => node,
            addContentEditFeature: () => {},
            queryElements: (selector: string) => {
                return document.querySelectorAll(selector);
            },
            runAsync: (callback: () => void) => callback(),
            getSelectionRange: () =>
                <Range>{
                    collapsed: true,
                },
        });
    });

    afterEach(() => {
        wrapper.parentElement?.removeChild(wrapper);
        document.body.childNodes.forEach(cn => {
            document.body.removeChild(cn);
        });
    });

    describe('Remove Entity Operations |', () => {
        const removeOperations = [
            EntityOperation.RemoveFromStart,
            EntityOperation.RemoveFromEnd,
            EntityOperation.Overwrite,
        ];
        let entity: Entity;
        let delimiterAfter: HTMLElement;
        let delimiterBefore: HTMLElement;

        beforeEach(() => {
            entity = <Entity>{
                id: 'test',
                isReadonly: true,
                type: 'Test',
                wrapper,
            };

            commitEntity(wrapper, 'test', true, 'test');
            addDelimiters(wrapper);

            delimiterAfter = getDelimiter(entity, true /* after */);
            delimiterBefore = getDelimiter(entity, false /* after */);
        });

        removeOperations.forEach(operation => {
            it('removeDelimiter when Deleting entity between them', () => {
                inlineEntityOnPluginEvent(
                    <EntityOperationEvent>{
                        entity,
                        eventType: PluginEventType.EntityOperation,
                        operation,
                    },
                    editor
                );

                expect(document.contains(delimiterAfter)).toBeFalse();
                expect(document.contains(delimiterBefore)).toBeFalse();
            });
        });
    });

    describe('Handle Key Up & Down |', () => {
        let entity: Entity;
        let delimiterAfter: Element | null;
        let delimiterBefore: Element | null;
        let textToAdd: Node;

        beforeEach(() => {
            ({ entity, delimiterAfter, delimiterBefore } = addEntityBeforeEach(entity, wrapper));

            textToAdd = document.createTextNode('Text');

            editor.getElementAtCursor = (selector: string, selectFrom: Node) =>
                findClosestElementAncestor(selectFrom, document.body, selector);
        });

        const KeyEvents = [PluginEventType.KeyDown, PluginEventType.KeyUp];

        describe('Element Before |', () => {
            afterEach(() => {
                document.body.childNodes.forEach(cn => {
                    document.body.removeChild(cn);
                });
            });
            KeyEvents.forEach((ev: PluginEventType) => {
                function arrangeAndAct(ev: PluginEventType) {
                    editor.getFocusedPosition = () => new Position(delimiterBefore!, 0);

                    delimiterBefore?.insertBefore(textToAdd, delimiterBefore.firstChild);

                    inlineEntityOnPluginEvent(
                        <PluginKeyDownEvent>{
                            eventType: ev,
                            rawEvent: <KeyboardEvent>{
                                which: 66 /* B */,
                                key: 'B',
                            },
                        },
                        editor
                    );
                }

                it('Is Delimiter |' + ev, () => {
                    arrangeAndAct(ev);

                    expect(delimiterBefore?.textContent).toEqual(ZERO_WIDTH_SPACE);
                    expect(delimiterBefore?.textContent?.length).toEqual(1);
                    expect(delimiterBefore?.childNodes.length).toEqual(1);
                });

                it('Is not Delimiter |' + ev, () => {
                    delimiterBefore?.removeAttribute('class');
                    arrangeAndAct(ev);

                    expect(delimiterBefore?.textContent).not.toEqual(ZERO_WIDTH_SPACE);
                    expect(delimiterBefore?.textContent?.length).toEqual(5);
                    expect(delimiterBefore?.childNodes.length).toEqual(2);
                });
            });
        });

        describe('Element After |', () => {
            afterEach(() => {
                document.body.childNodes.forEach(cn => {
                    document.body.removeChild(cn);
                });
            });
            function arrangeAndAct(eventType: PluginEventType) {
                editor.getFocusedPosition = () => new Position(delimiterAfter!, 0);

                delimiterAfter?.appendChild(textToAdd);

                inlineEntityOnPluginEvent(
                    <PluginKeyDownEvent>{
                        eventType,
                        rawEvent: <KeyboardEvent>{
                            which: 66 /* B */,
                            key: 'B',
                        },
                    },
                    editor
                );
            }

            KeyEvents.forEach((ev: PluginEventType) => {
                it('Is Delimiter' + ev, () => {
                    arrangeAndAct(ev);

                    delimiterAfter = getDelimiter(entity, true);
                    expect(delimiterAfter.textContent).toEqual(ZERO_WIDTH_SPACE);
                    expect(delimiterAfter.textContent?.length).toEqual(1);
                    expect(delimiterAfter.childNodes.length).toEqual(1);
                    expect(delimiterAfter.id).toBeDefined();
                });

                it('Is not Delimiter' + ev, () => {
                    delimiterAfter?.removeAttribute('class');
                    arrangeAndAct(ev);

                    expect(delimiterAfter?.textContent).not.toEqual(ZERO_WIDTH_SPACE);
                    expect(delimiterAfter?.textContent?.length).toEqual(5);
                    expect(delimiterAfter?.childNodes.length).toEqual(2);
                });
            });
        });
    });

    describe('ExtractDOM and Before Cut Copy', () => {
        it('Before CutCopyEvent', () => {
            const rootDiv = document.createElement('div');
            const element1 = document.createElement('span');
            rootDiv.appendChild(element1);
            addDelimiters(element1);

            inlineEntityOnPluginEvent(
                <BeforeCutCopyEvent>{
                    eventType: PluginEventType.BeforeCutCopy,
                    clonedRoot: rootDiv,
                },
                editor
            );

            expect(rootDiv.querySelectorAll(DELIMITER_SELECTOR).length).toBe(0);
        });

        it('ExtractContentWithDOM', () => {
            const rootDiv = document.createElement('div');
            const element1 = document.createElement('span');
            rootDiv.appendChild(element1);
            addDelimiters(element1);

            inlineEntityOnPluginEvent(
                <ExtractContentWithDomEvent>{
                    eventType: PluginEventType.ExtractContentWithDom,
                    clonedRoot: rootDiv,
                },
                editor
            );

            expect(rootDiv.querySelectorAll(DELIMITER_SELECTOR).length).toBe(0);
        });
    });
});

describe('Content Edit Features | ', () => {
    const [moveBefore, moveAfter] = getInlineEntityContentEditFeatures();
    let entity: Entity;
    let delimiterAfter: Element;
    let delimiterBefore: Element;
    let wrapper: HTMLElement;
    let editor: IEditor;
    let select: jasmine.Spy;

    let defaultEvent = <PluginKeyDownEvent>{};

    beforeEach(() => {
        wrapper = document.createElement('span');
        wrapper.innerHTML = 'Test';
        document.body.appendChild(wrapper);
        select = jasmine.createSpy('select');

        editor = <IEditor>(<any>{
            getDocument: () => document,
            getElementAtCursor: (selector: string, node: Node) =>
                findClosestElementAncestor(node, document.body, selector),
            addContentEditFeature: () => {},
            queryElements: (selector: string) => {
                return document.querySelectorAll(selector);
            },
            triggerContentChangedEvent: (_arg0: any, _arg1: any) => {},
            runAsync: (callback: () => void) => callback(),
            getSelectionRange: () =>
                <Range>{
                    collapsed: true,
                },
            select,
        });

        ({ entity, delimiterAfter, delimiterBefore } = addEntityBeforeEach(entity, wrapper));
    });

    afterEach(() => {
        document.body.childNodes.forEach(cn => {
            document.body.removeChild(cn);
        });
    });

    describe('Move Before |', () => {
        function runTest(element: Element | null, expected: boolean, event: PluginKeyDownEvent) {
            editor.getFocusedPosition = () => (element ? new Position(element, 0) : null);

            const result = moveBefore.shouldHandleEvent(event, editor, false /* ctrlOrMeta */);

            expect(result).toBe(expected);
            return event;
        }

        it('DelimiterBefore', () => {
            runTest(delimiterBefore, false /* expected */, defaultEvent);
        });

        it('DelimiterAfter, no shiftKey', () => {
            let preventDefaultSpy = jasmine.createSpy('preventDefault');
            let extendSpy = jasmine.createSpy('expand');
            let setPositionSpy = jasmine.createSpy('setPosition');
            let event = <PluginKeyDownEvent>{
                rawEvent: <KeyboardEvent>{
                    preventDefault() {
                        preventDefaultSpy();
                    },
                },
            };

            event = runTest(delimiterAfter, true /* expected */, event);

            document.getSelection = () =>
                <Selection>{
                    extend(node, offset?) {
                        extendSpy(node, offset);
                    },
                    setPosition(node, offset?) {
                        setPositionSpy(node, offset);
                    },
                };
            moveBefore.handleEvent(event, editor);

            expect(setPositionSpy).toHaveBeenCalledWith(delimiterBefore, 0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            expect(extendSpy).toHaveBeenCalledTimes(0);
        });

        it('DelimiterAfter, with shiftKey', () => {
            let preventDefaultSpy = jasmine.createSpy('preventDefault');
            let extendSpy = jasmine.createSpy('expand');
            let setPositionSpy = jasmine.createSpy('setPosition');
            let event = <PluginKeyDownEvent>{
                rawEvent: <KeyboardEvent>{
                    shiftKey: true,
                    preventDefault() {
                        preventDefaultSpy();
                    },
                },
            };

            event = runTest(delimiterAfter, true /* expected */, event);

            document.getSelection = () =>
                <Selection>{
                    extend(node, offset?) {
                        extendSpy(node, offset);
                    },
                    setPosition(node, offset?) {
                        setPositionSpy(node, offset);
                    },
                };
            moveBefore.handleEvent(event, editor);

            expect(extendSpy).toHaveBeenCalledWith(delimiterBefore, 0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            expect(setPositionSpy).toHaveBeenCalledTimes(0);
        });

        it('Element not an entity', () => {
            delimiterAfter.setAttribute('class', '');
            runTest(delimiterBefore, false /* expected */, defaultEvent);
        });

        it('Handle Event without cache', () => {
            let preventDefaultSpy = jasmine.createSpy('preventDefault');
            let extendSpy = jasmine.createSpy('expand');
            let setPositionSpy = jasmine.createSpy('setPosition');

            moveBefore.handleEvent(defaultEvent, editor);

            expect(setPositionSpy).toHaveBeenCalledTimes(0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(extendSpy).toHaveBeenCalledTimes(0);
        });

        it('Null', () => {
            runTest(null, false /* expected */, defaultEvent);
        });
    });

    describe('Move After |', () => {
        function runTest(element: Element | null, expected: boolean, event: PluginKeyDownEvent) {
            editor.getFocusedPosition = () => (element ? new Position(element, 0) : null);

            const result = moveAfter.shouldHandleEvent(event, editor, false /* ctrlOrMeta */);

            expect(result).toBe(expected);
            return event;
        }

        it('DelimiterAfter', () => {
            runTest(delimiterAfter, false /* expected */, defaultEvent);
        });

        it('DelimiterBefore, no shiftKey', () => {
            let preventDefaultSpy = jasmine.createSpy('preventDefault');
            let extendSpy = jasmine.createSpy('expand');
            let setPositionSpy = jasmine.createSpy('setPosition');
            let event = <PluginKeyDownEvent>{
                rawEvent: <KeyboardEvent>{
                    preventDefault() {
                        preventDefaultSpy();
                    },
                },
            };

            event = runTest(delimiterBefore, true /* expected */, event);

            document.getSelection = () =>
                <Selection>{
                    extend(node, offset?) {
                        extendSpy(node, offset);
                    },
                    setPosition(node, offset?) {
                        setPositionSpy(node, offset);
                    },
                };
            moveAfter.handleEvent(event, editor);

            expect(select).toHaveBeenCalledWith(new Position(delimiterAfter, PositionType.After));
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            expect(extendSpy).toHaveBeenCalledTimes(0);
        });

        it('DelimiterBefore, with shiftKey', () => {
            let preventDefaultSpy = jasmine.createSpy('preventDefault');
            let extendSpy = jasmine.createSpy('expand');
            let setPositionSpy = jasmine.createSpy('setPosition');
            let event = <PluginKeyDownEvent>{
                rawEvent: <KeyboardEvent>{
                    shiftKey: true,
                    preventDefault() {
                        preventDefaultSpy();
                    },
                },
            };

            event = runTest(delimiterBefore, true /* expected */, event);

            document.getSelection = () =>
                <Selection>{
                    extend(node, offset?) {
                        extendSpy(node, offset);
                    },
                    setPosition(node, offset?) {
                        setPositionSpy(node, offset);
                    },
                };
            moveAfter.handleEvent(event, editor);

            expect(extendSpy).toHaveBeenCalledWith(delimiterAfter, 1);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            expect(setPositionSpy).toHaveBeenCalledTimes(0);
        });

        it('Element not an entity', () => {
            delimiterAfter.setAttribute('class', '');
            runTest(delimiterBefore, false /* expected */, defaultEvent);
        });

        it('Handle Event without cache', () => {
            let preventDefaultSpy = jasmine.createSpy('preventDefault');
            let extendSpy = jasmine.createSpy('expand');
            let setPositionSpy = jasmine.createSpy('setPosition');

            moveAfter.handleEvent(defaultEvent, editor);

            expect(setPositionSpy).toHaveBeenCalledTimes(0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(extendSpy).toHaveBeenCalledTimes(0);
        });

        it('Null', () => {
            runTest(null, false /* expected */, defaultEvent);
        });
    });
});

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

function getDelimiter(entity: Entity, after: boolean) {
    return (after
        ? entity.wrapper.nextElementSibling!
        : entity.wrapper.previousElementSibling!) as HTMLElement;
}
