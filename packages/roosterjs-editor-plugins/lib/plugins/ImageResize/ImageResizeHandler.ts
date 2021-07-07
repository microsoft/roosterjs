import ResizeHelper from './ResizeHelper';
import { Browser, fromHtml, getEntityFromElement, getEntitySelector } from 'roosterjs-editor-dom';
import { insertEntity } from 'roosterjs-editor-api';
import {
    ChangeSource,
    Entity,
    ExperimentalFeatures,
    IEditor,
    PositionType,
} from 'roosterjs-editor-types';

const ENTITY_TYPE = 'IMAGE_RESIZE_WRAPPER';

/**
 * Resize Handle Definitions
 *
 * There are 8 resize handles, we put them onto a Cartesian coordinates system:
 * [0,2]      [1,2]      [2,2]
 *
 * [0,1]                 [2,1]
 *
 * [0,0]      [1,0]      [2,0]
 * Then we can use a two-dimensional array to store them
 *
 */
const DIRECTIONS = [
    ['sw', 'w', 'nw'],
    ['s', null, 'n'],
    ['se', 'e', 'ne'],
];
const HANDLE_SIZE = 7;
const HANDLE_MARGIN = 3;

const enum XCoordinate {
    Left = 0,
    Center = 1,
    Right = 2,
}

const enum YCoordinate {
    Bottom = 0,
    Middle = 1,
    Top = 2,
}

type ResizeContext = [XCoordinate, YCoordinate];

/**
 * @internal
 */
export default class ImageResizeHandler {
    private image: HTMLImageElement | null;
    private initWidth: number;
    private initHeight: number;
    private ratio: number;
    private resizeHelpers: ResizeHelper<ResizeContext>[][] = [];

    constructor(
        private editor: IEditor,
        private minWidth: number,
        private minHeight: number,
        private selectionBorderColor: string,
        private forcePreserveRatio: boolean
    ) {}

    setCurrentImage(image: HTMLImageElement | null, selectImage?: boolean) {
        if (this.editor.contains(this.image) && this.image != image) {
            this.hideResizeHandles();

            if (selectImage) {
                this.editor.select(this.image);
            }
        }

        this.image = image;
        this.createWrapper();
    }

    getResizeWrapper() {
        const entity = getEntityFromElement(this.image?.parentNode as HTMLElement);

        return entity?.type == ENTITY_TYPE ? entity.wrapper : null;
    }

    isHandlerEntity(entity: Entity) {
        return entity?.type == ENTITY_TYPE;
    }

    /**
     * Remove the temp wrapper of the image
     * @param wrapper The wrapper object to remove. If not specified, remove all existing wrappers.
     */
    removeWrappers = (wrapper?: HTMLElement) => {
        const wrappers = wrapper
            ? [wrapper]
            : this.editor.queryElements(getEntitySelector(ENTITY_TYPE));

        wrappers.forEach(wrapper => {
            const parent = wrapper?.parentNode;
            const img = wrapper?.querySelector('img');

            if (img && parent) {
                img.style.transform = wrapper.style.transform;
                parent.insertBefore(img, wrapper);
                parent.removeChild(wrapper);
            }
        });
    };

    private hideResizeHandles() {
        const wrapper = this.getResizeWrapper();

        for (let i = 0; i < this.resizeHelpers.length; i++) {
            if (!this.resizeHelpers[i]) {
                continue;
            }
            for (let j = 0; j < this.resizeHelpers[i].length; j++) {
                const helper = this.resizeHelpers[i][j];
                helper?.dispose();
            }
        }

        this.resizeHelpers = [];
        this.removeWrappers(wrapper);
    }

    private createWrapper() {
        if (!this.image) {
            return;
        }

        const doc = this.editor.getDocument();
        const { wrapper } = insertEntity(
            this.editor,
            ENTITY_TYPE,
            this.image,
            false /*isBlock*/,
            true /*isReadonly*/
        );

        wrapper.style.position = 'relative';
        wrapper.style.display = Browser.isSafari ? 'inline-block' : 'inline-flex';
        const sideResize = this.editor.isFeatureEnabled(ExperimentalFeatures.SingleDirectionResize);

        for (let x: XCoordinate = XCoordinate.Left; x <= XCoordinate.Right; x++) {
            this.resizeHelpers[x] = [];
            for (let y: YCoordinate = YCoordinate.Bottom; y <= YCoordinate.Top; y++) {
                const direction = DIRECTIONS[x][y];
                const html =
                    !sideResize && (x == XCoordinate.Center) != (y == YCoordinate.Middle)
                        ? ''
                        : direction
                        ? `<div style="position:absolute;${
                              x == XCoordinate.Left ? 'left' : 'right'
                          }:${x == XCoordinate.Center ? '50%' : '0px'};${
                              y == YCoordinate.Top ? 'top' : 'bottom'
                          }:${y == YCoordinate.Middle ? '50%' : '0px'}">
                    <div style="position:relative;width:${HANDLE_SIZE}px;height:${HANDLE_SIZE}px;background-color: ${
                              this.selectionBorderColor
                          };cursor:${direction}-resize;${
                              y == YCoordinate.Top ? 'top' : 'bottom'
                          }:-${HANDLE_MARGIN}px;${
                              x == XCoordinate.Left ? 'left' : 'right'
                          }:-${HANDLE_MARGIN}px"></div></div>`
                        : `<div style="position:absolute;left:0;right:0;top:0;bottom:0;border:solid 1px ${this.selectionBorderColor};pointer-events:none;">`;

                if (html) {
                    const div = fromHtml(html, doc)[0] as HTMLElement;
                    wrapper.appendChild(div);

                    this.resizeHelpers[x][y] = direction
                        ? new ResizeHelper(
                              div,
                              [x, y],
                              this.onResizeBegin,
                              this.onResize,
                              this.onResizeEnd
                          )
                        : null;
                }
            }
        }

        // If the resizeDiv's image has a transform, apply it to the container
        wrapper.style.transform = this.image.style.transform;
        this.image.style.transform = '';
        this.editor.select(wrapper, PositionType.After);
    }

    private onResizeBegin = () => {
        if (this.image) {
            this.editor.addUndoSnapshot();
            this.initWidth = this.image.clientWidth;
            this.initHeight = this.image.clientHeight;
            this.ratio =
                this.initWidth > 0 && this.initHeight > 0
                    ? (this.initWidth * 1.0) / this.initHeight
                    : 0;
        }
    };

    private onResize = ([x, y]: ResizeContext, deltaX: number, deltaY: number, e: MouseEvent) => {
        if (this.image) {
            const horizontalOnly = x == XCoordinate.Center;
            const verticalOnly = y == YCoordinate.Middle;
            const shouldPreserveRatio =
                !(horizontalOnly || verticalOnly) && (this.forcePreserveRatio || e.shiftKey);
            let newWidth = horizontalOnly
                ? this.initWidth
                : Math.max(
                      this.initWidth + deltaX * (x == XCoordinate.Left ? -1 : 1),
                      this.minWidth
                  );
            let newHeight = verticalOnly
                ? this.initHeight
                : Math.max(
                      this.initHeight + deltaY * (y == YCoordinate.Top ? -1 : 1),
                      this.minHeight
                  );

            if (shouldPreserveRatio && this.ratio > 0) {
                newHeight = Math.min(newHeight, newWidth / this.ratio);
                newWidth = Math.min(newWidth, newHeight * this.ratio);

                if (this.ratio > 0) {
                    if (newWidth < newHeight * this.ratio) {
                        newWidth = newHeight * this.ratio;
                    } else {
                        newHeight = newWidth / this.ratio;
                    }
                }
            }

            this.setSize(newWidth, newHeight);

            // double check
            if (shouldPreserveRatio && this.ratio > 0) {
                const clientWidth = Math.floor(this.image.clientWidth);
                const clientHeight = Math.floor(this.image.clientHeight);
                newWidth = Math.floor(newWidth);
                newHeight = Math.floor(newHeight);
                if (clientHeight !== newHeight || clientWidth !== newWidth) {
                    if (clientHeight < newHeight) {
                        newWidth = clientHeight * this.ratio;
                    } else {
                        newHeight = clientWidth / this.ratio;
                    }

                    this.setSize(newWidth, newHeight);
                }
            }
        }
    };

    private onResizeEnd = () => {
        if (this.image) {
            this.editor.addUndoSnapshot();
            this.editor.triggerContentChangedEvent(ChangeSource.ImageResize, this.image);
        }
    };

    private setSize(width: number, height: number) {
        this.image.style.width = width + 'px';
        this.image.style.height = height + 'px';
        this.image.width = width;
        this.image.height = height;
    }
}
