import * as DelimiterFile from '../../../lib/corePlugin/utils/entityDelimiterUtils';
import * as entityUtils from 'roosterjs-content-model-dom/lib/domUtils/entityUtils';
import {
    handleDelimiterContentChangedEvent,
    handleDelimiterKeyDownEvent,
} from '../../../lib/corePlugin/utils/entityDelimiterUtils';
import {
    contentModelToDom,
    createEntity,
    createModelToDomContext,
} from 'roosterjs-content-model-dom';
import {
    ContentModelDocument,
    DOMSelection,
    IStandaloneEditor,
} from 'roosterjs-content-model-types';

describe('EntityDelimiterUtils |', () => {
    let queryElementsSpy: jasmine.Spy;
    let mockedEditor: any;
    beforeEach(() => {
        mockedEditor = {
            getDOMHelper: () => ({
                queryElements: queryElementsSpy,
            }),
        } as Partial<IStandaloneEditor>;
    });

    describe('contentChanged |', () => {
        it('remove invalid delimiters', () => {
            const div = document.createElement('div');
            const entityWrapper = document.createElement('span');
            entityWrapper.style.width = '100%';
            entityWrapper.style.display = 'inline-block';

            contentModelToDom(
                document,
                div,
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'Entity',
                            entityFormat: {
                                isReadonly: true,
                                entityType: 'Test',
                                id: 'Id',
                            },
                            format: {},
                            segmentType: 'Entity',
                            wrapper: entityWrapper,
                        },
                    ],
                },
                createModelToDomContext({
                    addDelimiterForEntity: true,
                })
            );
            queryElementsSpy = jasmine
                .createSpy('queryElement')
                .and.callFake(sel => div.querySelectorAll(sel));

            entityWrapper.remove();

            handleDelimiterContentChangedEvent(mockedEditor);

            expect(queryElementsSpy).toHaveBeenCalledTimes(2);
            expect(div.childElementCount).toEqual(0);
        });

        it('add delimiters', () => {
            const div = document.createElement('div');
            const entityWrapper = document.createElement('span');
            entityWrapper.style.width = '100%';
            entityWrapper.style.display = 'inline-block';

            contentModelToDom(
                document,
                div,
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'Entity',
                            entityFormat: {
                                isReadonly: true,
                                entityType: 'Test',
                                id: 'Id',
                            },
                            format: {},
                            segmentType: 'Entity',
                            wrapper: entityWrapper,
                        },
                    ],
                },
                createModelToDomContext({})
            );
            queryElementsSpy = jasmine
                .createSpy('queryElement')
                .and.callFake(sel => div.querySelectorAll(sel));

            handleDelimiterContentChangedEvent(mockedEditor);

            expect(queryElementsSpy).toHaveBeenCalledTimes(2);
            expect(div.childElementCount).toEqual(3);
        });

        it('Remove delimiter info', () => {
            const div = document.createElement('div');
            const entityWrapper = document.createElement('span');
            entityWrapper.style.width = '100%';
            entityWrapper.style.display = 'inline-block';

            contentModelToDom(
                document,
                div,
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'Entity',
                            entityFormat: {
                                isReadonly: true,
                                entityType: 'Test',
                                id: 'Id',
                            },
                            format: {},
                            segmentType: 'Entity',
                            wrapper: entityWrapper,
                        },
                    ],
                },
                createModelToDomContext({
                    addDelimiterForEntity: true,
                })
            );
            queryElementsSpy = jasmine
                .createSpy('queryElement')
                .and.callFake(sel => div.querySelectorAll(sel));

            const invalidDelimiter = entityWrapper.previousElementSibling;
            invalidDelimiter?.appendChild(document.createTextNode('_'));

            handleDelimiterContentChangedEvent(mockedEditor);

            expect(queryElementsSpy).toHaveBeenCalledTimes(2);
            expect(div.childElementCount).toEqual(3);
            expect(invalidDelimiter && entityUtils.isEntityDelimiter(invalidDelimiter)).toBeFalsy();
        });
    });

    describe('onKeyDown |', () => {
        let mockedSelection: DOMSelection;
        let rafSpy: jasmine.Spy;
        beforeEach(() => {
            mockedSelection = undefined!;
            rafSpy = jasmine.createSpy('requestAnimationFrame');
            mockedEditor = {
                getDOMSelection: () => mockedSelection,
                getDocument: () =>
                    <any>{
                        defaultView: {
                            requestAnimationFrame: rafSpy,
                        },
                    },
            } as Partial<IStandaloneEditor>;
            spyOn(DelimiterFile, 'preventTypeInDelimiter').and.callThrough();
        });

        it('Dont handle, no selection', () => {
            handleDelimiterKeyDownEvent(mockedEditor, {
                eventType: 'keyDown',
                rawEvent: <any>{
                    ctrlKey: false,
                    altKey: false,
                    metaKey: false,
                    key: 'A',
                },
            });

            expect(rafSpy).not.toHaveBeenCalled();
            expect(DelimiterFile.preventTypeInDelimiter).not.toHaveBeenCalled();
        });

        it('Dont handle, image selection', () => {
            mockedSelection = <any>{
                type: 'image',
            };

            handleDelimiterKeyDownEvent(mockedEditor, {
                eventType: 'keyDown',
                rawEvent: <any>{
                    ctrlKey: false,
                    altKey: false,
                    metaKey: false,
                    key: 'A',
                },
            });

            expect(rafSpy).not.toHaveBeenCalled();
            expect(DelimiterFile.preventTypeInDelimiter).not.toHaveBeenCalled();
        });

        it('Dont handle, table selection', () => {
            mockedSelection = <any>{
                type: 'table',
            };

            handleDelimiterKeyDownEvent(mockedEditor, {
                eventType: 'keyDown',
                rawEvent: <any>{
                    ctrlKey: false,
                    altKey: false,
                    metaKey: false,
                    key: 'A',
                },
            });

            expect(rafSpy).not.toHaveBeenCalled();
            expect(DelimiterFile.preventTypeInDelimiter).not.toHaveBeenCalled();
        });

        it('Dont handle, range selection & no delimiter & no entity', () => {
            const parent = document.createElement('span');
            const el = document.createElement('span');
            const text = document.createTextNode('span');
            el.appendChild(text);
            parent.appendChild(el);
            el.classList.add('entityDelimiterBefore');
            mockedSelection = {
                type: 'range',
                range: <any>{
                    endContainer: text,
                    endOffset: 0,
                    collapsed: true,
                },
                isReverted: false,
            };
            spyOn(entityUtils, 'isEntityDelimiter').and.returnValue(false);
            spyOn(entityUtils, 'isEntityElement').and.returnValue(false);

            handleDelimiterKeyDownEvent(mockedEditor, {
                eventType: 'keyDown',
                rawEvent: <any>{
                    ctrlKey: false,
                    altKey: false,
                    metaKey: false,
                    key: 'A',
                },
            });

            expect(rafSpy).not.toHaveBeenCalled();
            expect(DelimiterFile.preventTypeInDelimiter).not.toHaveBeenCalled();
        });

        it('Handle, range selection & delimiter', () => {
            const parent = document.createElement('span');
            const el = document.createElement('span');
            const text = document.createTextNode('span');
            el.appendChild(text);
            parent.appendChild(el);
            el.classList.add('entityDelimiterBefore');
            mockedSelection = {
                type: 'range',
                range: <any>{
                    endContainer: text,
                    endOffset: 0,
                    collapsed: true,
                },
                isReverted: false,
            };
            spyOn(entityUtils, 'isEntityDelimiter').and.returnValue(true);
            spyOn(entityUtils, 'isEntityElement').and.returnValue(false);

            handleDelimiterKeyDownEvent(mockedEditor, {
                eventType: 'keyDown',
                rawEvent: <any>{
                    ctrlKey: false,
                    altKey: false,
                    metaKey: false,
                    key: 'A',
                },
            });

            expect(rafSpy).toHaveBeenCalled();
        });

        it('Handle, range selection & entity', () => {
            const parent = document.createElement('span');
            const el = document.createElement('span');
            const text = document.createTextNode('span');
            el.appendChild(text);
            parent.appendChild(el);
            el.classList.add('entityDelimiterBefore');
            mockedSelection = {
                type: 'range',
                range: <any>{
                    endContainer: parent,
                    endOffset: 0,
                    collapsed: true,
                },
                isReverted: false,
            };
            spyOn(entityUtils, 'isEntityDelimiter').and.returnValue(false);
            spyOn(entityUtils, 'isEntityElement').and.returnValue(true);

            handleDelimiterKeyDownEvent(mockedEditor, {
                eventType: 'keyDown',
                rawEvent: <any>{
                    ctrlKey: false,
                    altKey: false,
                    metaKey: false,
                    key: 'A',
                },
            });

            expect(rafSpy).toHaveBeenCalled();
        });

        it('Handle, range selection & entity & Enter', () => {
            const parent = document.createElement('span');
            const el = document.createElement('span');
            const text = document.createTextNode('span');
            el.appendChild(text);
            parent.appendChild(el);
            el.classList.add('entityDelimiterBefore');
            mockedSelection = {
                type: 'range',
                range: <any>{
                    endContainer: parent,
                    endOffset: 0,
                    collapsed: true,
                },
                isReverted: false,
            };
            spyOn(entityUtils, 'isEntityDelimiter').and.returnValue(false);
            spyOn(entityUtils, 'isEntityElement').and.returnValue(true);

            handleDelimiterKeyDownEvent(mockedEditor, {
                eventType: 'keyDown',
                rawEvent: <any>{
                    ctrlKey: false,
                    altKey: false,
                    metaKey: false,
                    key: 'Enter',
                },
            });

            expect(rafSpy).toHaveBeenCalled();
            expect(el.classList.contains('entityDelimiterBefore')).toBeFalse();
        });
    });
});

describe('preventTypeInDelimiter', () => {
    let mockedEditor: any;
    let mockedModel: ContentModelDocument;
    beforeEach(() => {
        mockedModel = {
            blockGroupType: 'Document',
            blocks: [],
        };
        mockedEditor = {
            formatContentModel: formatter => {
                formatter(mockedModel, <any>{});
            },
        } as Partial<IStandaloneEditor>;
    });

    it('handle', () => {
        const entityWrapper = document.createElement('span');
        entityWrapper.className = '_Entity';

        mockedModel = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                    ],
                    format: {},
                    isImplicit: true,
                },
                createEntity(entityWrapper, true),
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };

        const root = document.createElement('div');
        contentModelToDom(
            document,
            root,
            mockedModel,
            createModelToDomContext({
                addDelimiterForEntity: true,
            })
        );

        DelimiterFile.preventTypeInDelimiter(
            entityWrapper.previousElementSibling as HTMLElement,
            mockedEditor,
            false
        );

        expect(mockedModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                    ],
                    format: {},
                },
                {
                    segmentType: 'Entity',
                    blockType: 'Entity',
                    format: {},
                    entityFormat: {
                        isReadonly: true,
                        id: undefined,
                        entityType: undefined,
                    },
                    wrapper: entityWrapper,
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        });
    });

    xit('handle as Enter Key', () => {
        const entityWrapper = document.createElement('span');
        entityWrapper.className = '_Entity';

        mockedModel = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                    ],
                    format: {},
                    isImplicit: true,
                },
                createEntity(entityWrapper, true),
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };

        const root = document.createElement('div');
        contentModelToDom(
            document,
            root,
            mockedModel,
            createModelToDomContext({
                addDelimiterForEntity: true,
            })
        );

        DelimiterFile.preventTypeInDelimiter(
            entityWrapper.previousElementSibling as HTMLElement,
            mockedEditor,
            true
        );

        expect(mockedModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
                {
                    segmentType: 'Entity',
                    blockType: 'Entity',
                    format: {},
                    entityFormat: {
                        isReadonly: true,
                        id: undefined,
                        entityType: undefined,
                    },
                    wrapper: entityWrapper,
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        });
    });
});
