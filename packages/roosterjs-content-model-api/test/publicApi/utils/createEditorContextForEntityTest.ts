import { createEditorContextForEntity } from '../../../lib/publicApi/utils/createEditorContextForEntity';
import { ContentModelEntity, IEditor } from 'roosterjs-content-model-types';

describe('createEditorContextForEntity', () => {
    let isDarkMode: jasmine.Spy;
    let calculateZoomScale: jasmine.Spy;
    let getComputedStyle: jasmine.Spy;
    let getDocument: jasmine.Spy;
    let getDOMHelper: jasmine.Spy;
    let getColorManager: jasmine.Spy;
    let editor: IEditor;
    let entity: ContentModelEntity;

    beforeEach(() => {
        isDarkMode = jasmine.createSpy('isDarkMode').and.returnValue(false);
        calculateZoomScale = jasmine.createSpy('calculateZoomScale').and.returnValue(1);
        getComputedStyle = jasmine.createSpy('getComputedStyle').and.returnValue({
            direction: 'ltr',
        });
        getDocument = jasmine.createSpy('getDocument').and.returnValue({
            defaultView: {
                getComputedStyle,
            },
        });
        getDOMHelper = jasmine.createSpy('getDOMHelper').and.returnValue({ calculateZoomScale });
        getColorManager = jasmine.createSpy('getColorManager').and.returnValue('colorManager');
        editor = ({
            isDarkMode,
            getDocument,
            getDOMHelper,
            getColorManager,
        } as unknown) as IEditor;

        entity = {
            wrapper: 'fakeWrapper' as any,
            format: {
                backgroundColor: 'red',
            },
            blockType: 'Entity',
            entityFormat: {
                entityType: 'TestEntity',
                id: 'TestEntityId',
            },
            segmentType: 'Entity',
        };
    });

    it('should create an EditorContext for an entity', () => {
        const context = createEditorContextForEntity(editor, entity);

        expect(context).toEqual({
            isDarkMode: false,
            defaultFormat: {
                backgroundColor: 'red',
            },
            darkColorHandler: 'colorManager' as any,
            addDelimiterForEntity: false,
            allowCacheElement: false,
            domIndexer: undefined,
            zoomScale: 1,
            experimentalFeatures: [],
        });
        expect(isDarkMode).toHaveBeenCalled();
        expect(calculateZoomScale).toHaveBeenCalled();
        expect(getComputedStyle).toHaveBeenCalledWith(entity.wrapper);
        expect(getDocument).toHaveBeenCalled();
        expect(getDOMHelper).toHaveBeenCalled();
        expect(getColorManager).toHaveBeenCalled();
    });

    it('should detect RTL', () => {
        getComputedStyle = jasmine.createSpy('getComputedStyle').and.returnValue({
            direction: 'rtl',
        });
        getDocument = jasmine.createSpy('getDocument').and.returnValue({
            defaultView: {
                getComputedStyle,
            },
        });
        editor = ({
            isDarkMode,
            getDocument,
            getDOMHelper,
            getColorManager,
        } as unknown) as IEditor;

        const context = createEditorContextForEntity(editor, entity);

        expect(context).toEqual({
            isDarkMode: false,
            defaultFormat: {
                backgroundColor: 'red',
            },
            darkColorHandler: 'colorManager' as any,
            addDelimiterForEntity: false,
            allowCacheElement: false,
            domIndexer: undefined,
            zoomScale: 1,
            experimentalFeatures: [],
            isRootRtl: true,
        });
        expect(isDarkMode).toHaveBeenCalled();
        expect(calculateZoomScale).toHaveBeenCalled();
        expect(getComputedStyle).toHaveBeenCalledWith(entity.wrapper);
        expect(getDocument).toHaveBeenCalled();
        expect(getDOMHelper).toHaveBeenCalled();
        expect(getColorManager).toHaveBeenCalled();
    });
});
