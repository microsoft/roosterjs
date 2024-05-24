import { applyChange } from '../../../lib/imageEdit/utils/applyChange';
import { createImage } from 'roosterjs-content-model-dom';
import { formatInsertPointWithContentModel } from 'roosterjs-content-model-api';
import type {
    ContentModelDocument,
    IEditor,
    ImageMetadataFormat,
    PluginEventType,
} from 'roosterjs-content-model-types';

const IMG_SRC =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAYAAAC0VX7mAAAALUlEQVQ4EWNgYGD4T2U8lAz8TyZACzKEl8k0Dz0OhpKBaGGB7hVi+QgvD0oDATe/bqDDw39VAAAAAElFTkSuQmCC';
const WIDTH = 20;
const HEIGHT = 10;
const contentModelImage = createImage(IMG_SRC);
const model: ContentModelDocument = {
    blockGroupType: 'Document',
    blocks: [
        {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Image',
                    src: IMG_SRC,
                    format: {
                        fontFamily: 'Calibri',
                        fontSize: '11pt',
                        textColor: 'rgb(0, 0, 0)',
                        id: 'image_0',
                        maxWidth: '1800px',
                    },
                    dataset: {},
                    isSelectedAsImageSelection: true,
                    isSelected: true,
                },
            ],
            format: {},
            segmentFormat: {
                fontFamily: 'Calibri',
                fontSize: '11pt',
                textColor: 'rgb(0, 0, 0)',
            },
        },
    ],
    format: {
        fontFamily: 'Calibri',
        fontSize: '11pt',
        textColor: '#000000',
    },
};

describe('applyChange', () => {
    let img: HTMLImageElement;
    let editor: IEditor;
    let triggerEvent: jasmine.Spy;

    beforeEach(async () => {
        img = await loadImage(IMG_SRC);
        document.body.appendChild(img);
        triggerEvent = jasmine.createSpy('triggerEvent');
        editor = <IEditor>(<any>{
            focus: () => {},
            triggerEvent: (type: PluginEventType, obj: any) => {
                triggerEvent();
                return {
                    eventType: type,
                    ...obj,
                };
            },
        });
    });

    afterEach(() => {
        img?.parentNode?.removeChild(img);
    });

    function runTest(input: ContentModelDocument, callback: () => boolean) {
        const formatWithContentModelSpy = jasmine
            .createSpy('formatWithContentModel')
            .and.callFake((callback, options) => {
                return callback(input, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                    canUndoByBackspace: true,
                });
            });
        formatInsertPointWithContentModel(
            {
                formatContentModel: formatWithContentModelSpy,
                focus: () => {},
                triggerEvent: (type: PluginEventType, obj: any) => {
                    triggerEvent();
                    return {
                        eventType: type,
                        ...obj,
                    };
                },
            } as any,
            {} as any,
            callback,
            {
                selectionOverride: {
                    type: 'image',
                    image: img,
                },
            }
        );
    }

    it('Write back with no change', () => {
        const editInfo = getEditInfoFromImage(img);

        applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, false);

        expect(img.outerHTML).toBe(`<img src="${IMG_SRC}">`);
    });

    it('Write back with resize only', () => {
        const editInfo = getEditInfoFromImage(img);
        editInfo.widthPx = 100;
        applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, true);
        expect(img.outerHTML).toBe(`<img src="${IMG_SRC}">`);
    });

    it('Write back with rotate only', () => {
        runTest(model, () => {
            const editInfo = getEditInfoFromImage(img);
            editInfo.angleRad = Math.PI / 2;
            applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, false);
            const newSrc =
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAUCAYAAAC07qxWAAAAAXNSR0IArs4c6QAAACxJREFUOE9jZGBg+M9ABGCkrcL//1FdwcgIshACUKweVQgOktHgoW16xJcjAK3PPgHKCkLrAAAAAElFTkSuQmCC';

            const metadata: ImageMetadataFormat = JSON.parse(
                contentModelImage.dataset['editingInfo']
            );
            expect(metadata).toEqual({
                src: IMG_SRC,
                widthPx: WIDTH,
                heightPx: HEIGHT,
                naturalWidth: WIDTH,
                naturalHeight: HEIGHT,
                leftPercent: 0,
                rightPercent: 0,
                topPercent: 0,
                bottomPercent: 0,
                angleRad: 1.5707963267948966,
            });
            expect(contentModelImage.src).toBe(newSrc);
            expect(triggerEvent).toHaveBeenCalled();
            return true;
        });
    });

    it('Write back with crop only', () => {
        runTest(model, () => {
            const editInfo = getEditInfoFromImage(img);
            editInfo.leftPercent = 0.1;
            editInfo.rightPercent = 0.2;
            editInfo.topPercent = 0.3;
            editInfo.bottomPercent = 0.4;
            applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, false);
            const newSrc =
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAYAAAC0VX7mAAAAAXNSR0IArs4c6QAAADpJREFUOE9jZGBg+O/v788QEBDAQA3ACDKwvLycoaKighrmMYANrK+vZ2hoaBg1kLwQGA1D8sINWRcASiEmkzo9vZYAAAAASUVORK5CYII=';

            expect(triggerEvent).toHaveBeenCalled();
            const metadata: ImageMetadataFormat = JSON.parse(
                contentModelImage.dataset['editingInfo']
            );
            expect(metadata).toEqual({
                src: IMG_SRC,
                widthPx: WIDTH,
                heightPx: HEIGHT,
                naturalWidth: WIDTH,
                naturalHeight: HEIGHT,
                leftPercent: 0.1,
                rightPercent: 0.2,
                topPercent: 0.3,
                bottomPercent: 0.4,
                angleRad: 0,
            });
            expect(contentModelImage.src).toBe(newSrc);
            return true;
        });
    });

    it('Write back with rotate and crop', () => {
        runTest(model, () => {
            const editInfo = getEditInfoFromImage(img);
            editInfo.leftPercent = 0.1;
            editInfo.rightPercent = 0.2;
            editInfo.topPercent = 0.3;
            editInfo.bottomPercent = 0.4;
            editInfo.angleRad = Math.PI / 4;
            applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, false);
            const newSrc =
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAQ9JREFUOE+t07FthDAYBeDnAWCJVPS3QoqUkRgjEjnJUlJgIHKTVEG6ZW6ANJiePZCuuO5PjERkwAZs4ZafT/bzM4N7vQB4AHBembF+Yo4fNHhJ0xRJktRSSi/Yhg4g5xxZlqHrOrRtW+d5vhueozkAqcGiKBBFEfq+R9M0XrCJVgBKExyj8YVH1AmGwBrdBOewUupLCPHuasWAcs7LMcOt+oxRKKU+hBB6Q4s1HP9vsIrjuNwCLTu2wv8XRURDDEfAk0odBS/KfwRsfaZE9AngLTQK19sHEX0DeA2BnajGQuFVNAC+AnjeRD3gHwCPjLH7LnQHrMEnxthNz+5GV+AJ6I1a4AUYhBrwyTyyWb1fIePUTmYAkbMAAAAASUVORK5CYII=';

            expect(triggerEvent).toHaveBeenCalled();
            const metadata: ImageMetadataFormat = JSON.parse(
                contentModelImage.dataset['editingInfo']
            );
            expect(metadata).toEqual({
                src: IMG_SRC,
                widthPx: WIDTH,
                heightPx: HEIGHT,
                naturalWidth: WIDTH,
                naturalHeight: HEIGHT,
                leftPercent: 0.1,
                rightPercent: 0.2,
                topPercent: 0.3,
                bottomPercent: 0.4,
                angleRad: 0.7853981633974483,
            });
            expect(contentModelImage.src).toBe(newSrc);
            return true;
        });
    });

    it('Write back with triggerEvent', () => {
        runTest(model, () => {
            const editInfo = getEditInfoFromImage(img);
            editInfo.angleRad = Math.PI / 2;

            const newSrc =
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAlElEQVQ4je3MsQ3DIBBG4eszH5MgOiqgxAPReRcGAN0CfyqncAQckMJFXvukj6idJqLY+dNpIoJSCtban8CaiGCMQc4ZKSV477fgD8jMAIBSyhb8BV6twk3wqtY6BQ/BFThKwDvsnDu6KjNHkTgLA3gWHEL4w3L4WIDPLroAnwBeQ3QCloNCeB4cwOtgA94Hb3ATfAMzcgdiCyJ6YgAAAABJRU5ErkJggg==';
            editor.triggerEvent = <any>(() => {
                return { newSrc };
            });
            applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, false);

            const metadata: ImageMetadataFormat = JSON.parse(
                contentModelImage.dataset['editingInfo']
            );
            expect(metadata).toEqual({
                src: IMG_SRC,
                widthPx: WIDTH,
                heightPx: HEIGHT,
                naturalWidth: WIDTH,
                naturalHeight: HEIGHT,
                leftPercent: 0,
                rightPercent: 0,
                topPercent: 0,
                bottomPercent: 0,
                angleRad: 1.5707963267948966,
            });
            expect(contentModelImage.src).toBe(newSrc);
            return true;
        });
    });

    it('Resize then rotate', () => {
        runTest(model, () => {
            let editInfo = getEditInfoFromImage(img);
            editInfo.widthPx = editInfo.widthPx * 2;
            editInfo.angleRad = Math.PI / 4;
            applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, true);

            const newSrc =
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAAAXNSR0IArs4c6QAAAZBJREFUWEfF1r1OwzAQwPF/n6GPwDN0jsTCQhaWpuqA0pkBJhiQoEKqYCoSezslyjuwpAtbJV6jQ4VUMcCGLNUoTep81edmtZP8fHf2uYP5uQJOgJuSOVaHOoavKcjbduzVFWgfJgvRViegPOYeeDJESxyUxTwCDxVFIArSmDoQ8ZQpTCnE9302mw2LxSIbNJEIlWIUZDgc0u/3GY1GzOdzUZAxTVmIFkiDjAXseR5pmhbqWRKU39o79ROGIbPZzBlo36F3NJCpHRwFZMKo1LQFvQB3bTpoGeYQ0Hi7mEamKoxTUB2MM1BdjBNQE4wCPQO3uhAanEO1aqgpRjmmwLUEqA1GDNQWIwI6BGMddCjGKsgGxhrIFqY2aDAYkCRJtk38b3ubmErQarUiiiImkwnr9boAso0xgjQkjmOWy+W+BjqWwBRAQRDQ6/Uogah3fqQwBVC3282nJhudX8CXxBRAhsvNN3ABvEtjqkAKcgZ8qIkuMCbQDsQlJg/6As51RHT6XEVG/09dPy6BU+AzX0N/QcPh4EzchP8AAAAASUVORK5CYII=';

            const metadata: ImageMetadataFormat = JSON.parse(
                contentModelImage.dataset['editingInfo']
            );
            expect(metadata).toEqual({
                src: IMG_SRC,
                widthPx: WIDTH * 2,
                heightPx: HEIGHT,
                naturalWidth: WIDTH,
                naturalHeight: HEIGHT,
                leftPercent: 0,
                rightPercent: 0,
                topPercent: 0,
                bottomPercent: 0,
                angleRad: 0.7853981633974483,
            });
            expect(contentModelImage.src).toBe(newSrc);
            return true;
        });
    });

    it('Rotate then resize', () => {
        runTest(model, () => {
            let editInfo = getEditInfoFromImage(img);
            editInfo.angleRad = Math.PI / 4;
            editInfo.widthPx = editInfo.widthPx * 2;
            applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, true);

            const newSrc =
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAAAXNSR0IArs4c6QAAAZBJREFUWEfF1r1OwzAQwPF/n6GPwDN0jsTCQhaWpuqA0pkBJhiQoEKqYCoSezslyjuwpAtbJV6jQ4VUMcCGLNUoTep81edmtZP8fHf2uYP5uQJOgJuSOVaHOoavKcjbduzVFWgfJgvRViegPOYeeDJESxyUxTwCDxVFIArSmDoQ8ZQpTCnE9302mw2LxSIbNJEIlWIUZDgc0u/3GY1GzOdzUZAxTVmIFkiDjAXseR5pmhbqWRKU39o79ROGIbPZzBlo36F3NJCpHRwFZMKo1LQFvQB3bTpoGeYQ0Hi7mEamKoxTUB2MM1BdjBNQE4wCPQO3uhAanEO1aqgpRjmmwLUEqA1GDNQWIwI6BGMddCjGKsgGxhrIFqY2aDAYkCRJtk38b3ubmErQarUiiiImkwnr9boAso0xgjQkjmOWy+W+BjqWwBRAQRDQ6/Uogah3fqQwBVC3282nJhudX8CXxBRAhsvNN3ABvEtjqkAKcgZ8qIkuMCbQDsQlJg/6As51RHT6XEVG/09dPy6BU+AzX0N/QcPh4EzchP8AAAAASUVORK5CYII=';

            const metadata: ImageMetadataFormat = JSON.parse(
                contentModelImage.dataset['editingInfo']
            );
            expect(metadata).toEqual({
                src: IMG_SRC,
                widthPx: WIDTH * 2,
                heightPx: HEIGHT,
                naturalWidth: WIDTH,
                naturalHeight: HEIGHT,
                leftPercent: 0,
                rightPercent: 0,
                topPercent: 0,
                bottomPercent: 0,
                angleRad: 0.7853981633974483,
            });
            expect(contentModelImage.src).toBe(newSrc);
            return true;
        });
    });

    it('Crop then resize', () => {
        runTest(model, () => {
            let editInfo = getEditInfoFromImage(img);
            editInfo.leftPercent = 0.5;
            editInfo.widthPx *= 2;
            applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, true);

            const newSrc =
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAKCAYAAADGmhxQAAAAAXNSR0IArs4c6QAAAEBJREFUOE9jZGBg+M8wiAHjqAMpjB3G////0yWKHzx4wHDgwAE4fvjwIVFOH3UgLJiGbwiO5mKisgJuRYO+HAQAjrZGAckZDUoAAAAASUVORK5CYII=';

            const metadata: ImageMetadataFormat = JSON.parse(
                contentModelImage.dataset['editingInfo']
            );
            expect(metadata).toEqual({
                src: IMG_SRC,
                widthPx: WIDTH * 2,
                heightPx: HEIGHT,
                naturalWidth: WIDTH,
                naturalHeight: HEIGHT,
                leftPercent: 0.5,
                rightPercent: 0,
                topPercent: 0,
                bottomPercent: 0,
                angleRad: 0,
            });
            expect(contentModelImage.src).toBe(newSrc);
            return true;
        });
    });

    it('Rotate then crop', () => {
        runTest(model, () => {
            let editInfo = getEditInfoFromImage(img);
            editInfo.angleRad = Math.PI / 4;
            editInfo.leftPercent = 0.5;
            applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, false);

            const newSrc =
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAShJREFUOE+t0zFugzAUxvF/Vq5RiRP0Ch2ygHoEe87QTs1QKYm6tFMrRWKEjQMw9QDduQUnqFA3t44AGRsn4JTV9o/vPfut8H8b4AZ4PLNncmnlOaDBY7f2sRR2UKXURkp5LIrC/N8ieIQqpZ6BF61JKQmFB1QptQd2ZrxQuEf3QohdnudOi0NgjQ4JhRDMhN+Are9VjFC9aQF86AI59lC+2c9rYfP2Rxd1DWy/03+BpyZqFpymKVVVmf0ceuwb01fgqT9ht6Kua8qyJMsy2rZ1YB+qN74DDzbcgxptmmbqVR3OoQ6cJAlxHJ9SesDTTy6hDhxFkV2ymfYTuJ+DOrBnkr6Au79J+5mLXoI1uAa+55ZvBhtdXrcwAkNQO7EDhqI9fGuWbJbzC88EiJ0xyRQjAAAAAElFTkSuQmCC';

            const metadata: ImageMetadataFormat = JSON.parse(
                contentModelImage.dataset['editingInfo']
            );
            expect(metadata).toEqual({
                src: IMG_SRC,
                widthPx: WIDTH,
                heightPx: HEIGHT,
                naturalWidth: WIDTH,
                naturalHeight: HEIGHT,
                leftPercent: 0.5,
                rightPercent: 0,
                topPercent: 0,
                bottomPercent: 0,
                angleRad: 0.7853981633974483,
            });

            expect(contentModelImage.src).toBe(newSrc);
            return true;
        });
    });

    it('Crop then rotate', () => {
        runTest(model, () => {
            let editInfo = getEditInfoFromImage(img);
            editInfo.leftPercent = 0.5;
            editInfo.angleRad = Math.PI / 4;
            applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, false);

            const newSrc =
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAShJREFUOE+t0zFugzAUxvF/Vq5RiRP0Ch2ygHoEe87QTs1QKYm6tFMrRWKEjQMw9QDduQUnqFA3t44AGRsn4JTV9o/vPfut8H8b4AZ4PLNncmnlOaDBY7f2sRR2UKXURkp5LIrC/N8ieIQqpZ6BF61JKQmFB1QptQd2ZrxQuEf3QohdnudOi0NgjQ4JhRDMhN+Are9VjFC9aQF86AI59lC+2c9rYfP2Rxd1DWy/03+BpyZqFpymKVVVmf0ceuwb01fgqT9ht6Kua8qyJMsy2rZ1YB+qN74DDzbcgxptmmbqVR3OoQ6cJAlxHJ9SesDTTy6hDhxFkV2ymfYTuJ+DOrBnkr6Au79J+5mLXoI1uAa+55ZvBhtdXrcwAkNQO7EDhqI9fGuWbJbzC88EiJ0xyRQjAAAAAElFTkSuQmCC';

            const metadata: ImageMetadataFormat = JSON.parse(
                contentModelImage.dataset['editingInfo']
            );
            expect(metadata).toEqual({
                src: IMG_SRC,
                widthPx: WIDTH,
                heightPx: HEIGHT,
                naturalWidth: WIDTH,
                naturalHeight: HEIGHT,
                leftPercent: 0.5,
                rightPercent: 0,
                topPercent: 0,
                bottomPercent: 0,
                angleRad: 0.7853981633974483,
            });

            expect(contentModelImage.src).toBe(newSrc);
            return true;
        });
    });
});

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>(resolve => {
        const img = document.createElement('img');
        const load = () => {
            img.onload = null;
            img.onerror = null;
            resolve(img);
        };
        img.onload = load;
        img.onerror = load;
        img.src = src;
    });
}

function getEditInfoFromImage(img: HTMLImageElement) {
    return {
        src: img.getAttribute('src') || '',
        widthPx: img.clientWidth,
        heightPx: img.clientHeight,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        leftPercent: 0,
        rightPercent: 0,
        topPercent: 0,
        bottomPercent: 0,
        angleRad: 0,
    };
}
