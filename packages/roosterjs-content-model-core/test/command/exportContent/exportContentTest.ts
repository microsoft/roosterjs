import * as contentModelToDom from 'roosterjs-content-model-dom/lib/modelToDom/contentModelToDom';
import * as contentModelToText from 'roosterjs-content-model-dom/lib/modelToText/contentModelToText';
import * as createModelToDomContext from 'roosterjs-content-model-dom/lib/modelToDom/context/createModelToDomContext';
import * as transformColor from 'roosterjs-content-model-dom/lib/domUtils/style/transformColor';
import { exportContent } from '../../../lib/command/exportContent/exportContent';
import { IEditor } from 'roosterjs-content-model-types';

describe('exportContent', () => {
    it('PlainTextFast', () => {
        const mockedTextContent = 'TEXT';
        const getTextContentSpy = jasmine
            .createSpy('getTextContent')
            .and.returnValue(mockedTextContent);
        const editor: IEditor = {
            getDOMHelper: () => ({
                getTextContent: getTextContentSpy,
            }),
        } as any;

        const text = exportContent(editor, 'PlainTextFast');

        expect(text).toBe(mockedTextContent);
        expect(getTextContentSpy).toHaveBeenCalledTimes(1);
    });

    it('PlainText', () => {
        const mockedModel = 'MODEL' as any;
        const getContentModelCopySpy = jasmine
            .createSpy('getContentModelCopy')
            .and.returnValue(mockedModel);
        const editor: IEditor = {
            getContentModelCopy: getContentModelCopySpy,
        } as any;
        const mockedText = 'TEXT';
        const contentModelToTextSpy = spyOn(
            contentModelToText,
            'contentModelToText'
        ).and.returnValue(mockedText);

        const text = exportContent(editor, 'PlainText');

        expect(text).toBe(mockedText);
        expect(getContentModelCopySpy).toHaveBeenCalledWith('clean');
        expect(contentModelToTextSpy).toHaveBeenCalledWith(mockedModel, undefined, undefined);
    });

    it('PlainText with callback', () => {
        const mockedModel = 'MODEL' as any;
        const getContentModelCopySpy = jasmine
            .createSpy('getContentModelCopy')
            .and.returnValue(mockedModel);
        const editor: IEditor = {
            getContentModelCopy: getContentModelCopySpy,
        } as any;
        const mockedText = 'TEXT';
        const contentModelToTextSpy = spyOn(
            contentModelToText,
            'contentModelToText'
        ).and.returnValue(mockedText);
        const mockedCallbacks = 'CALLBACKS' as any;

        const text = exportContent(editor, 'PlainText', mockedCallbacks);

        expect(text).toBe(mockedText);
        expect(getContentModelCopySpy).toHaveBeenCalledWith('clean');
        expect(contentModelToTextSpy).toHaveBeenCalledWith(mockedModel, undefined, mockedCallbacks);
    });

    it('HTML', () => {
        const mockedModel = 'MODEL' as any;
        const getContentModelCopySpy = jasmine
            .createSpy('getContentModelCopy')
            .and.returnValue(mockedModel);
        const mockedHTML = 'HTML';
        const mockedDiv = {
            innerHTML: mockedHTML,
        } as any;
        const mockedDoc = {
            createElement: () => mockedDiv,
        } as any;
        const triggerEventSpy = jasmine.createSpy('triggerEvent');
        const editor: IEditor = {
            getContentModelCopy: getContentModelCopySpy,
            getDocument: () => mockedDoc,
            triggerEvent: triggerEventSpy,
        } as any;
        const contentModelToDomSpy = spyOn(contentModelToDom, 'contentModelToDom');
        const mockedContext = 'CONTEXT' as any;
        const createModelToDomContextSpy = spyOn(
            createModelToDomContext,
            'createModelToDomContext'
        ).and.returnValue(mockedContext);

        const html = exportContent(editor, 'HTML');

        expect(html).toBe(mockedHTML);
        expect(getContentModelCopySpy).toHaveBeenCalledWith('clean');
        1;
        expect(createModelToDomContextSpy).toHaveBeenCalledWith(undefined, undefined);
        expect(contentModelToDomSpy).toHaveBeenCalledWith(
            mockedDoc,
            mockedDiv,
            mockedModel,
            mockedContext
        );
        expect(triggerEventSpy).toHaveBeenCalledWith(
            'extractContentWithDom',
            { clonedRoot: mockedDiv },
            true
        );
    });

    it('HTML with options', () => {
        const mockedModel = 'MODEL' as any;
        const getContentModelCopySpy = jasmine
            .createSpy('getContentModelCopy')
            .and.returnValue(mockedModel);
        const mockedHTML = 'HTML';
        const mockedDiv = {
            innerHTML: mockedHTML,
        } as any;
        const mockedDoc = {
            createElement: () => mockedDiv,
        } as any;
        const triggerEventSpy = jasmine.createSpy('triggerEvent');
        const editor: IEditor = {
            getContentModelCopy: getContentModelCopySpy,
            getDocument: () => mockedDoc,
            triggerEvent: triggerEventSpy,
        } as any;
        const contentModelToDomSpy = spyOn(contentModelToDom, 'contentModelToDom');
        const mockedContext = 'CONTEXT' as any;
        const createModelToDomContextSpy = spyOn(
            createModelToDomContext,
            'createModelToDomContext'
        ).and.returnValue(mockedContext);
        const mockedOptions = 'OPTIONS' as any;

        const html = exportContent(editor, 'HTML', mockedOptions);

        expect(html).toBe(mockedHTML);
        expect(getContentModelCopySpy).toHaveBeenCalledWith('clean');
        expect(createModelToDomContextSpy).toHaveBeenCalledWith(undefined, mockedOptions);
        expect(contentModelToDomSpy).toHaveBeenCalledWith(
            mockedDoc,
            mockedDiv,
            mockedModel,
            mockedContext
        );
        expect(triggerEventSpy).toHaveBeenCalledWith(
            'extractContentWithDom',
            { clonedRoot: mockedDiv },
            true
        );
    });

    describe('CleanHTML', () => {
        function runTest(isDarkMode: boolean) {
            const clonedRoot = document.createElement('div');
            clonedRoot.innerHTML = 'test';
            const getClonedRootSpy = jasmine.createSpy('getClonedRoot').and.returnValue(clonedRoot);
            const isDarkModeSpy = jasmine.createSpy('isDarkMode').and.returnValue(isDarkMode);
            const getDOMHelperSpy = jasmine.createSpy('getDOMHelper').and.returnValue({
                getClonedRoot: getClonedRootSpy,
            });
            const triggerEventSpy = jasmine.createSpy('triggerEvent');
            const transformColorSpy = spyOn(transformColor, 'transformColor');
            const getColorManagerSpy = jasmine.createSpy('getColorManager');

            const editor = {
                getDOMHelper: getDOMHelperSpy,
                isDarkMode: isDarkModeSpy,
                triggerEvent: triggerEventSpy,
                getColorManager: getColorManagerSpy,
            } as any;

            const result = exportContent(editor, 'CleanHTML');
            expect(isDarkModeSpy).toHaveBeenCalled();
            expect(triggerEventSpy).toHaveBeenCalledWith(
                'extractContentWithDom',
                { clonedRoot },
                true
            );
            if (isDarkMode) {
                expect(transformColorSpy).toHaveBeenCalledWith(
                    clonedRoot,
                    false /*includeSelf*/,
                    'darkToLight',
                    editor.getColorManager()
                );
            } else {
                expect(transformColorSpy).not.toHaveBeenCalled();
            }

            expect(result).toBe('test');
        }

        it('should return the inner HTML content of the editor in dark mode', () => {
            runTest(true);
        });

        it('should return the inner HTML content of the editor in light mode', () => {
            runTest(false);
        });
    });
});
