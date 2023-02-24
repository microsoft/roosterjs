import { inlineEntityOnPluginEvent } from '../../lib/corePlugins/utils/InlineEntityHandlers/inlineEntityOnPluginEvent';
import {
    BeforeCutCopyEvent,
    DelimiterClasses,
    Entity,
    EntityOperation,
    EntityOperationEvent,
    ExtractContentWithDomEvent,
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
