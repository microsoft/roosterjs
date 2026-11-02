import { Cropper } from './cropperContext';
import { ImageEditElementClass } from '../types/ImageEditElementClass';
import type { Disposable } from '../../pluginUtils/Disposable';
import type { DragAndDropContext } from '../types/DragAndDropContext';
import type { DragAndDropEvent } from '../../pluginUtils/DragAndDrop/DragAndDropHandler';
import type { ImageEditOptions } from '../types/ImageEditOptions';
import type { ImageMetadataFormat } from 'roosterjs-content-model-types';

const DefaultTopLeftLabel = 'Top left';
const DefaultBottomRightLabel = 'Bottom right';
const DefaultMoveCropLabel = 'Move Crop';

const FocusTargetAttributes = [
    'tabindex',
    'contenteditable',
    'role',
    'aria-label',
    'aria-describedby',
    'part',
];

/**
 * @internal
 * Keyboard cropping shares the pointer handler's geometry and constraints.
 */
export class ImageCropKeyboardHelper implements Disposable {
    private cropFocusTargets: HTMLElement[] = [];
    private instructions?: HTMLElement;
    private cropMoveTarget: HTMLElement | null;
    private disposed = false;

    constructor(
        private wrapper: HTMLElement,
        imageId: string,
        private editInfo: ImageMetadataFormat,
        private options: ImageEditOptions,
        private onCrop: () => void,
        private onFinish: (apply: boolean, restoreFocus: boolean) => void
    ) {
        const cropLabels = options.cropLabels;
        if (cropLabels?.instructions) {
            this.instructions = this.createInstructions(imageId, cropLabels.instructions);
            wrapper.appendChild(this.instructions);
        }

        (['nw', 'se'] as const).forEach(direction => {
            const handle = wrapper.querySelector<HTMLElement>(
                `.${ImageEditElementClass.CropHandle}[data-y="${direction[0]}"][data-x="${direction[1]}"]`
            );
            if (handle) {
                this.prepareTarget(
                    handle,
                    cropLabels?.handleLabel?.(direction) ||
                        (direction == 'nw' ? DefaultTopLeftLabel : DefaultBottomRightLabel)
                );
            }
        });

        this.cropMoveTarget = wrapper.querySelector<HTMLElement>(
            `.${ImageEditElementClass.ImageBorder}`
        );
        if (this.cropMoveTarget) {
            wrapper.appendChild(this.cropMoveTarget);
            this.prepareTarget(
                this.cropMoveTarget,
                cropLabels?.moveCropLabel || DefaultMoveCropLabel
            );
        }

        // Make native tab entry start at the top-left corner as well.
        const first = this.cropFocusTargets[0];
        if (first?.parentElement) {
            first.parentElement.insertBefore(first, first.parentElement.firstChild);
        }
        wrapper.addEventListener('keydown', this.onKeyDown);
        wrapper.addEventListener('keyup', this.stopPropagation);
        wrapper.addEventListener('keypress', this.stopPropagation);
        wrapper.addEventListener('focusout', this.onFocusOut);
    }

    focus() {
        this.cropFocusTargets[0]?.focus();
    }

    contains(target: EventTarget | null) {
        return this.cropFocusTargets.some(element => element === target);
    }

    dispose() {
        this.disposed = true;
        this.wrapper.removeEventListener('keydown', this.onKeyDown);
        this.wrapper.removeEventListener('keyup', this.stopPropagation);
        this.wrapper.removeEventListener('keypress', this.stopPropagation);
        this.wrapper.removeEventListener('focusout', this.onFocusOut);
        for (const target of this.cropFocusTargets) {
            for (const attribute of FocusTargetAttributes) {
                target.removeAttribute(attribute);
            }
            target.classList.remove(ImageEditElementClass.CropKeyboardTarget);
        }
        this.instructions?.remove();
    }

    private createInstructions(imageId: string, text: string): HTMLSpanElement {
        const instructions = this.wrapper.ownerDocument.createElement('span');
        instructions.id = 'imageCropInstructions' + imageId;
        instructions.textContent = text;
        instructions.style.cssText =
            'position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;';
        return instructions;
    }

    private prepareTarget(target: HTMLElement, label?: string) {
        target.tabIndex = 0;
        target.contentEditable = 'false';
        target.setAttribute('role', 'application');
        if (label) {
            target.setAttribute('aria-label', label);
        }
        if (this.instructions) {
            target.setAttribute('aria-describedby', this.instructions.id);
        }
        target.classList.add(ImageEditElementClass.CropKeyboardTarget);
        target.setAttribute('part', ImageEditElementClass.CropKeyboardTarget);
        this.cropFocusTargets.push(target);
    }

    private stopPropagation = (event: KeyboardEvent) => {
        if (this.contains(event.target)) {
            event.stopPropagation();
        }
    };

    private onFocusOut = (event: FocusEvent) => {
        if (!this.disposed && this.contains(event.target) && !this.contains(event.relatedTarget)) {
            this.onFinish(true, false);
        }
    };

    private onKeyDown = (event: KeyboardEvent) => {
        if (!this.contains(event.target)) {
            return;
        }
        event.stopPropagation();
        if (event.key == 'Tab') {
            const index = this.cropFocusTargets.findIndex(target => target === event.target);
            const next = this.cropFocusTargets[index + (event.shiftKey ? -1 : 1)];
            if (next) {
                event.preventDefault();
                next.focus();
            }
        } else if (event.key == 'Enter' || event.key == 'Escape') {
            event.preventDefault();
            this.onFinish(event.key == 'Enter', true);
        } else if (
            event.key == 'ArrowLeft' ||
            event.key == 'ArrowRight' ||
            event.key == 'ArrowUp' ||
            event.key == 'ArrowDown'
        ) {
            event.preventDefault();
            if (!event.ctrlKey && !event.metaKey && !event.altKey) {
                this.crop(event);
            }
        } else if (event.key == ' ' || event.key == 'Delete' || event.key == 'Backspace') {
            event.preventDefault();
        }
    };

    private crop(event: KeyboardEvent) {
        const target = this.cropFocusTargets.find(element => element === event.target);
        const context: DragAndDropContext = {
            editInfo: this.editInfo,
            options: this.options,
            elementClass:
                target === this.cropMoveTarget
                    ? ImageEditElementClass.CropContainer
                    : ImageEditElementClass.CropHandle,
            x: target?.dataset.x == 'e' ? 'e' : target?.dataset.x == 'w' ? 'w' : '',
            y: target?.dataset.y == 'n' ? 'n' : target?.dataset.y == 's' ? 's' : '',
        };
        const dragEvent: DragAndDropEvent = {
            clientX: 0,
            clientY: 0,
            pageX: 0,
            pageY: 0,
            target: event.target,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
        };
        const base = Cropper.onDragStart?.(context, dragEvent);
        if (
            base &&
            Cropper.onDragging?.(
                context,
                dragEvent,
                base,
                event.key == 'ArrowLeft' ? -1 : event.key == 'ArrowRight' ? 1 : 0,
                event.key == 'ArrowUp' ? -1 : event.key == 'ArrowDown' ? 1 : 0
            )
        ) {
            this.onCrop();
        }
    }
}
