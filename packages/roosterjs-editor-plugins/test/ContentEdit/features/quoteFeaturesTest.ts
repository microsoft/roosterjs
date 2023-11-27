import * as unwrap from 'roosterjs-editor-dom/lib/utils/unwrap';
import * as wrap from 'roosterjs-editor-dom/lib/utils/wrap';
import { BlockElement, IEditor, PluginKeyboardEvent } from 'roosterjs-editor-types';
import { createElement, Position } from 'roosterjs-editor-dom';
import { QuoteFeatures } from '../../../lib/plugins/ContentEdit/features/quoteFeatures';

describe('QuoteFeatures |', () => {
    let editor: IEditor;

    describe('UnquoteWhenBackOnEmpty1stLine |', () => {
        let quote: HTMLElement;
        beforeEach(() => {
            quote = createElement(
                {
                    tag: 'blockquote',
                    children: [{ tag: 'div', children: ['text'] }],
                },
                document
            ) as HTMLElement;
            editor = <IEditor>(<any>{
                select: () => true,
                addUndoSnapshot: (cb: () => void) => cb?.(),
                dispose: () => {},
                getElementAtCursor: () => quote,
                getFocusedPosition: () => new Position(quote, 0),
                getBlockElementAtNode: () => <BlockElement>(<any>{
                        getStartNode: () => quote.firstChild,
                        collapseToSingleElement: () => quote.firstChild,
                    }),
                getSelectionRange: () =>
                    <Range>{
                        collapsed: true,
                    },
                getContentSearcherOfCursor: () => <any>{},
            });
        });

        afterEach(() => {
            while (document.body.firstChild) {
                document.body.firstChild.remove();
            }
        });

        const feature = QuoteFeatures.unquoteWhenBackspaceOnStartOfLine;

        describe('shouldHandle |', () => {
            it('Do not handle on selection not collapsed', () => {
                spyOn(editor, 'getSelectionRange').and.returnValue(<Range>{
                    collapsed: false,
                });
                spyOn(editor, 'getContentSearcherOfCursor').and.returnValue(<any>{
                    getSubStringBefore: () => '',
                });

                const result = feature.shouldHandleEvent(
                    <PluginKeyboardEvent>(<any>{}),
                    editor,
                    false /* ctrlOrMeta */
                );
                expect(result).toEqual(false);
            });

            it('Do not handle not at start of line', () => {
                spyOn(editor, 'getSelectionRange').and.returnValue(<Range>{
                    collapsed: true,
                });
                spyOn(editor, 'getContentSearcherOfCursor').and.returnValue(<any>{
                    getSubStringBefore: () => 'text',
                });

                const result = feature.shouldHandleEvent(
                    <PluginKeyboardEvent>(<any>{}),
                    editor,
                    false /* ctrlOrMeta */
                );
                expect(result).toEqual(false);
            });

            it('Do not handle not at start of line and selection not collapsed', () => {
                spyOn(editor, 'getSelectionRange').and.returnValue(<Range>{
                    collapsed: false,
                });
                spyOn(editor, 'getContentSearcherOfCursor').and.returnValue(<any>{
                    getSubStringBefore: () => 'text',
                });

                const result = feature.shouldHandleEvent(
                    <PluginKeyboardEvent>(<any>{}),
                    editor,
                    false /* ctrlOrMeta */
                );
                expect(result).toEqual(false);
            });

            it('Handle at start of line and selection collapsed', () => {
                spyOn(editor, 'getSelectionRange').and.returnValue(<Range>{
                    collapsed: true,
                });
                spyOn(editor, 'getContentSearcherOfCursor').and.returnValue(<any>{
                    getSubStringBefore: () => '',
                });
                const quote = createElement(
                    {
                        tag: 'blockquote',
                        children: ['text'],
                    },
                    document
                ) as HTMLElement;

                spyOn(editor, 'getElementAtCursor').and.returnValue(quote);
                spyOn(editor, 'getFocusedPosition').and.returnValue(
                    new Position(quote.firstChild!, 0)
                );
                spyOn(editor, 'getBlockElementAtNode').and.returnValue(<any>{
                    getStartNode: () => quote,
                    collapseToSingleElement: () => quote,
                });

                const result = feature.shouldHandleEvent(
                    <PluginKeyboardEvent>(<any>{}),
                    editor,
                    false /* ctrlOrMeta */
                );
                expect(result).toEqual(true);
            });

            it('Should not Handle, no quote at cursor', () => {
                spyOn(editor, 'getSelectionRange').and.returnValue(<Range>{
                    collapsed: true,
                });
                spyOn(editor, 'getContentSearcherOfCursor').and.returnValue(<any>{
                    getSubStringBefore: () => '',
                });
                const element = createElement(
                    {
                        tag: 'div',
                        children: ['text'],
                    },
                    document
                ) as HTMLElement;

                spyOn(editor, 'getElementAtCursor').and.returnValue(element);
                spyOn(editor, 'getFocusedPosition').and.returnValue(
                    new Position(element.firstChild!, 0)
                );
                spyOn(editor, 'getBlockElementAtNode').and.returnValue(<any>{
                    getStartNode: () => element,
                    collapseToSingleElement: () => element,
                });

                const result = feature.shouldHandleEvent(
                    <PluginKeyboardEvent>(<any>{}),
                    editor,
                    false /* ctrlOrMeta */
                );
                expect(result).toEqual(false);
            });
        });

        describe('handleEvent |', () => {
            afterEach(() => {
                while (document.body.firstChild) {
                    document.body.firstChild.remove();
                }
            });

            it('handle', () => {
                const quote = createElement(
                    {
                        tag: 'blockquote',
                        children: ['text'],
                    },
                    document
                ) as HTMLElement;
                const container = document.createElement('div');
                container.appendChild(quote);

                document.body.appendChild(container);

                spyOn(wrap, 'default').and.callThrough();
                spyOn(unwrap, 'default').and.callThrough();

                editor = <IEditor>(<any>{
                    select: () => true,
                    addUndoSnapshot: (cb: () => void) => cb?.(),
                    dispose: () => {},
                    getElementAtCursor: () => quote,
                    getFocusedPosition: () => new Position(quote.firstChild!, 0),
                    getBlockElementAtNode: () => <BlockElement>(<any>{
                            getStartNode: () => quote,
                            collapseToSingleElement: () => quote,
                        }),
                });

                const pd = jasmine.createSpy('preventDefault');
                const ev = <any>{
                    rawEvent: <any>{
                        preventDefault: pd,
                    },
                };

                feature.handleEvent(ev, editor);

                expect(pd).toHaveBeenCalled();
                expect(wrap.default).toHaveBeenCalled();
                expect(unwrap.default).toHaveBeenCalled();
                expect(container.innerHTML).toEqual('<div>text</div>');

                container.remove();
            });

            it('handle, div inside blockquote', () => {
                const container = document.createElement('div');
                container.appendChild(quote);

                document.body.appendChild(container);

                spyOn(wrap, 'default').and.callThrough();
                spyOn(unwrap, 'default').and.callThrough();

                editor = <IEditor>(<any>{
                    select: () => true,
                    addUndoSnapshot: (cb: () => void) => cb?.(),
                    dispose: () => {},
                    getElementAtCursor: () => quote,
                    getFocusedPosition: () => new Position(quote, 0),
                    getBlockElementAtNode: () => <BlockElement>(<any>{
                            getStartNode: () => quote.firstChild,
                            collapseToSingleElement: () => quote.firstChild,
                        }),
                });

                const pd = jasmine.createSpy('preventDefault');
                const ev = <any>{
                    rawEvent: <any>{
                        preventDefault: pd,
                    },
                };

                feature.handleEvent(ev, editor);

                expect(pd).toHaveBeenCalled();
                expect(wrap.default).not.toHaveBeenCalled();
                expect(unwrap.default).toHaveBeenCalled();
                expect(container.innerHTML).toEqual('<div>text</div>');

                container.remove();
            });
        });
    });
});
