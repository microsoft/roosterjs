import { insertEntity } from 'roosterjs-content-model-api';
import { iterateSelections } from 'roosterjs-content-model-core';
import {
    contentModelToDom,
    createDomToModelContext,
    createModelToDomContext,
    domToContentModel,
} from 'roosterjs-content-model-dom';
import type {
    EditorPlugin,
    IEditor,
    PluginEvent,
    Entity,
    ContentModelSegmentFormat,
    ContentModelSegment,
    ContentModelParagraph,
    ContentModelBlockGroup,
} from 'roosterjs-content-model-types';

const ENTITY_TYPE = 'WATERMARK_WRAPPER';
const ENTITY_INFO_NAME = '_Entity';
const ENTITY_TYPE_PREFIX = '_EType_';
const ENTITY_SELECTOR = `.${ENTITY_INFO_NAME}.${ENTITY_TYPE_PREFIX}${ENTITY_TYPE}`;
const VISIBLE_CHILD_ELEMENT_SELECTOR = ['TABLE', 'IMG', 'LI'].join(',');
const ZERO_WIDTH_SPACE = /\u200b/g;

/**
 * A watermark plugin to manage watermark string for roosterjs
 */
export class WatermarkPlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    private disposer: (() => void) | null = null;
    private format: ContentModelSegmentFormat;

    /**
     * Create an instance of Watermark plugin
     * @param watermark The watermark string
     */
    constructor(
        private watermark: string,
        format?: ContentModelSegmentFormat,
        private customClass?: string
    ) {
        this.format = format || {
            fontSize: '14px',
            textColor: '#AAAAAA',
        };
    }

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'Watermark';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.disposer = this.editor.attachDomEvent({
            focus: { beforeDispatch: this.showHideWatermark },
            blur: { beforeDispatch: this.showHideWatermark },
        });
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.disposer?.();
        this.disposer = null;
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (
            event.eventType == 'editorReady' ||
            (event.eventType == 'contentChanged' && (<Entity>event.data)?.type != ENTITY_TYPE)
        ) {
            this.showHideWatermark();
        } else if (
            event.eventType == 'entityOperation' &&
            event.entity.type == ENTITY_TYPE &&
            this.editor
        ) {
            const {
                operation,
                entity: { wrapper },
            } = event;
            if (operation == 'replaceTemporaryContent') {
                this.removeWatermark(wrapper);
            }
        }
    }

    /**
     * Public only for unit testing
     */
    public showHideWatermark = () => {
        if (!this.editor) {
            return;
        }

        const hasFocus = this.editor.hasFocus();
        const watermarks = this.editor.getDOMHelper().queryElements(ENTITY_SELECTOR);
        const isShowing = watermarks.length > 0;

        if (hasFocus && isShowing) {
            watermarks.forEach(element => this.removeWatermark(element));
            this.editor.focus();
        } else if (!hasFocus && !isShowing && shouldAddWatermark(this.editor)) {
            const contentNode = this.editor.getDocument().createTextNode(this.watermark);
            const newEntity = insertEntity(this.editor, ENTITY_TYPE, false /* isBlock */, 'begin', {
                contentNode,
            });

            if (newEntity) {
                const wrapper = newEntity?.wrapper;
                const newRange = new Range();
                newRange.selectNode(contentNode);
                const model = domToContentModel(
                    wrapper,
                    createDomToModelContext({
                        darkColorHandler: this.editor.getColorManager(),
                        isDarkMode: this.editor.isDarkMode(),
                        zoomScale: this.editor.getDOMHelper().calculateZoomScale(),
                    }),
                    {
                        type: 'range',
                        isReverted: false,
                        range: newRange,
                    }
                );
                iterateSelections(model, (_, __, block) => {
                    if (block?.blockType == 'Paragraph') {
                        block.segments.forEach((segment: ContentModelSegment) => {
                            segment.format = this.format;
                        });
                        return true;
                    }
                    return false;
                });
                contentModelToDom(
                    wrapper.ownerDocument,
                    wrapper,
                    model,
                    createModelToDomContext({
                        darkColorHandler: this.editor.getColorManager(),
                        isDarkMode: this.editor.isDarkMode(),
                        zoomScale: this.editor.getDOMHelper().calculateZoomScale(),
                    })
                );
                wrapper.spellcheck = false;
                if (this.customClass) {
                    newEntity.wrapper.classList.add(this.customClass);
                }
            }
        }
    };

    /**
     * Public only for unit testing
     */
    public removeWatermark = (wrapper: HTMLElement) => {
        const range = new Range();
        range.selectNode(wrapper);
        this.editor?.formatContentModel(
            model => {
                let paragraph: ContentModelParagraph | undefined;
                let paraPath: ContentModelBlockGroup[] | undefined;
                iterateSelections(model, (path, __, block) => {
                    if (block?.blockType == 'Paragraph' && block.segments.length == 1) {
                        block.segments.forEach(segment => {
                            if (
                                segment.segmentType == 'Entity' &&
                                segment.entityFormat.entityType?.startsWith(ENTITY_TYPE)
                            ) {
                                paragraph = block;
                                paraPath = path;
                            }
                        });
                    }
                });

                if (paragraph && paraPath) {
                    const [last] = paraPath;
                    const index = last.blocks.indexOf(paragraph);
                    last.blocks.splice(index, 1);
                }
                return true;
            },
            {
                selectionOverride: { type: 'range', isReverted: false, range },
            }
        );
    };
}

function shouldAddWatermark(editor: IEditor) {
    const helper = editor.getDOMHelper();
    const textContent = trim(helper.getTextContent());
    if (textContent != '' || helper.queryElements(VISIBLE_CHILD_ELEMENT_SELECTOR)[0]) {
        return false;
    }
    return true;
}

function trim(s: string) {
    s = s.replace(ZERO_WIDTH_SPACE, '');
    return s;
}
