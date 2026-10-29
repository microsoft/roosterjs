import { createImageCropper } from '../../../lib/imageEdit/Cropper/createImageCropper';
import { Cropper } from '../../../lib/imageEdit/Cropper/cropperContext';
import { ImageCropKeyboardHelper } from '../../../lib/imageEdit/Cropper/ImageCropKeyboardHelper';
import { ImageEditElementClass } from '../../../lib/imageEdit/types/ImageEditElementClass';
import type { ImageMetadataFormat } from 'roosterjs-content-model-types';

describe('ImageCropKeyboardHelper', () => {
    let wrapper: HTMLElement;
    let helper: ImageCropKeyboardHelper;
    let editInfo: ImageMetadataFormat;
    let onCrop: jasmine.Spy;
    let onFinish: jasmine.Spy;

    function target(index: number) {
        return wrapper.querySelectorAll<HTMLElement>(
            `.${ImageEditElementClass.CropKeyboardTarget}`
        )[index];
    }

    function key(index: number, value: string, init?: KeyboardEventInit) {
        const event = new KeyboardEvent('keydown', {
            key: value,
            bubbles: true,
            cancelable: true,
            ...init,
        });
        target(index).dispatchEvent(event);
        return event;
    }

    beforeEach(() => {
        wrapper = document.createElement('span');
        const border = document.createElement('div');
        border.className = ImageEditElementClass.ImageBorder;
        wrapper.appendChild(border);
        createImageCropper(document).forEach(element => wrapper.appendChild(element));
        document.body.appendChild(wrapper);
        editInfo = {
            widthPx: 60,
            heightPx: 120,
            leftPercent: 0.2,
            rightPercent: 0.2,
            topPercent: 0.2,
            bottomPercent: 0.2,
            angleRad: 0,
        };
        onCrop = jasmine.createSpy('onCrop');
        onFinish = jasmine.createSpy('onFinish');
        helper = new ImageCropKeyboardHelper(
            wrapper,
            'cropImage',
            editInfo,
            { minWidth: 10, minHeight: 10 },
            onCrop,
            onFinish
        );
    });

    afterEach(() => {
        helper.dispose();
        wrapper.remove();
    });

    it('exposes top left, bottom right, and the whole image in tab order', () => {
        expect(wrapper.querySelectorAll('[tabindex="0"]').length).toBe(3);
        expect(target(0).dataset.x).toBe('w');
        expect(target(0).dataset.y).toBe('n');
        expect(target(1).dataset.x).toBe('e');
        expect(target(1).dataset.y).toBe('s');
        expect(target(0).getAttribute('aria-label')).toBe('Top left');
        expect(target(1).getAttribute('aria-label')).toBe('Bottom right');
        expect(target(2).getAttribute('aria-label')).toBe('Move Crop');
        [0, 1, 2].forEach(index => {
            expect(target(index).getAttribute('role')).toBe('application');
            expect(target(index).hasAttribute('aria-describedby')).toBe(false);
        });
        helper.focus();
        expect(document.activeElement).toBe(target(0));
        key(0, 'Tab');
        expect(document.activeElement).toBe(target(1));
        key(1, 'Tab');
        expect(document.activeElement).toBe(target(2));
        key(2, 'Tab', { shiftKey: true });
        expect(document.activeElement).toBe(target(1));
        expect(onFinish).not.toHaveBeenCalled();
    });

    it('scopes application semantics to crop targets and removes them on disposal', () => {
        expect(wrapper.hasAttribute('role')).toBe(false);
        expect(wrapper.querySelectorAll('[role="application"]').length).toBe(3);
        helper.dispose();
        expect(wrapper.querySelector('[role="application"]')).toBeNull();
        expect(wrapper.querySelector('[tabindex]')).toBeNull();
    });

    it('keeps focus on each crop target when arrow keys adjust the crop', () => {
        [0, 1, 2].forEach(index => {
            target(index).focus();
            ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].forEach(value => {
                expect(key(index, value).defaultPrevented).toBe(true);
                expect(document.activeElement).toBe(target(index));
            });
        });
        expect(onCrop).toHaveBeenCalledTimes(12);
        expect(onFinish).not.toHaveBeenCalled();
    });

    it('reuses the drag handler for one-pixel corner cropping and key repeats', () => {
        const dragSpy = spyOn(Cropper, 'onDragging').and.callThrough();
        key(0, 'ArrowRight');
        key(0, 'ArrowDown', { repeat: true });
        expect(dragSpy).toHaveBeenCalledTimes(2);
        expect(editInfo.leftPercent).toBeCloseTo(0.21, 8);
        expect(editInfo.topPercent).toBeCloseTo(0.205, 8);
        expect(editInfo.widthPx).toBeCloseTo(59, 8);
        expect(editInfo.heightPx).toBeCloseTo(119, 8);
        key(1, 'ArrowLeft');
        key(1, 'ArrowUp');
        expect(editInfo.rightPercent).toBeCloseTo(0.21, 8);
        expect(editInfo.bottomPercent).toBeCloseTo(0.205, 8);
        expect(editInfo.widthPx).toBeCloseTo(58, 8);
        expect(editInfo.heightPx).toBeCloseTo(118, 8);
        expect(onCrop).toHaveBeenCalledTimes(4);
    });

    it('moves the viewport without resizing it, clamping at every image edge', () => {
        for (let i = 0; i < 100; i++) {
            key(2, 'ArrowRight');
            key(2, 'ArrowDown');
        }
        expect(editInfo.leftPercent).toBeCloseTo(0.4, 8);
        expect(editInfo.topPercent).toBeCloseTo(0.4, 8);
        expect(editInfo.rightPercent).toBe(0);
        expect(editInfo.bottomPercent).toBe(0);
        for (let i = 0; i < 100; i++) {
            key(2, 'ArrowLeft');
            key(2, 'ArrowUp');
        }
        expect(editInfo.leftPercent).toBeCloseTo(0, 8);
        expect(editInfo.topPercent).toBeCloseTo(0, 8);
        expect(editInfo.rightPercent).toBeCloseTo(0.4, 8);
        expect(editInfo.bottomPercent).toBeCloseTo(0.4, 8);
        expect(editInfo.widthPx).toBe(60);
        expect(editInfo.heightPx).toBe(120);
    });

    it('preserves the minimum crop size and never expands beyond the image', () => {
        for (let i = 0; i < 250; i++) {
            key(0, 'ArrowRight');
            key(0, 'ArrowDown');
        }
        expect(editInfo.widthPx).toBeCloseTo(10, 8);
        expect(editInfo.heightPx).toBeCloseTo(10, 8);
        for (let i = 0; i < 250; i++) {
            key(0, 'ArrowLeft');
            key(0, 'ArrowUp');
        }
        expect(editInfo.leftPercent).toBeCloseTo(0, 8);
        expect(editInfo.topPercent).toBeCloseTo(0, 8);
        expect(editInfo.widthPx).toBeCloseTo(80, 8);
        expect(editInfo.heightPx).toBeCloseTo(160, 8);
    });

    it('uses physical arrow directions for rotated images', () => {
        editInfo.angleRad = Math.PI / 2;
        key(0, 'ArrowRight');
        expect(editInfo.topPercent).toBeCloseTo(0.195, 8);
        expect(editInfo.heightPx).toBeCloseTo(121, 8);
        expect(editInfo.widthPx).toBeCloseTo(60, 8);
        key(2, 'ArrowRight');
        expect(editInfo.topPercent).toBeCloseTo(0.19, 8);
        expect(editInfo.bottomPercent).toBeCloseTo(0.205, 8);
        expect(editInfo.heightPx).toBeCloseTo(121, 8);
    });

    it('does not crop for modified arrows or editing keys and stops propagation', () => {
        const listener = jasmine.createSpy('keydown');
        document.body.addEventListener('keydown', listener);
        key(0, 'ArrowLeft', { ctrlKey: true });
        key(0, 'ArrowLeft', { altKey: true });
        key(0, 'ArrowLeft', { metaKey: true });
        [' ', 'Delete', 'Backspace'].forEach(value =>
            expect(key(0, value).defaultPrevented).toBe(true)
        );
        expect(onCrop).not.toHaveBeenCalled();
        expect(listener).not.toHaveBeenCalled();
        document.body.removeEventListener('keydown', listener);
    });

    it('applies with Enter and cancels with Escape', () => {
        expect(key(0, 'Enter').defaultPrevented).toBe(true);
        expect(onFinish).toHaveBeenCalledWith(true, true);
        onFinish.calls.reset();
        expect(key(1, 'Escape').defaultPrevented).toBe(true);
        expect(onFinish).toHaveBeenCalledWith(false, true);
    });

    it('does not trap Tab at either end of the focus sequence', () => {
        expect(key(2, 'Tab').defaultPrevented).toBe(false);
        expect(key(0, 'Tab', { shiftKey: true }).defaultPrevented).toBe(false);
        expect(onFinish).not.toHaveBeenCalled();
    });

    it('uses handle names when labels are not supplied', () => {
        expect(target(0).getAttribute('aria-label')).toBe('Top left');
        expect(target(1).getAttribute('aria-label')).toBe('Bottom right');
        expect(target(2).getAttribute('aria-label')).toBe('Move Crop');
        [0, 1, 2].forEach(index => {
            expect(target(index).tabIndex).toBe(0);
        });
    });

    it('uses handle names and omits instructions when cropLabels is empty', () => {
        helper.dispose();
        helper = new ImageCropKeyboardHelper(
            wrapper,
            'cropImage',
            editInfo,
            { cropLabels: {} },
            onCrop,
            onFinish
        );
        expect(wrapper.querySelector('[id^="imageCropInstructions"]')).toBeNull();
        expect(target(0).getAttribute('aria-label')).toBe('Top left');
        expect(target(1).getAttribute('aria-label')).toBe('Bottom right');
        expect(target(2).getAttribute('aria-label')).toBe('Move Crop');
        [0, 1, 2].forEach(index => {
            expect(target(index).hasAttribute('aria-describedby')).toBe(false);
        });
    });

    it('uses handle names when labels are empty', () => {
        helper.dispose();
        helper = new ImageCropKeyboardHelper(
            wrapper,
            'cropImage',
            editInfo,
            { cropLabels: { handleLabel: () => '', moveCropLabel: '' } },
            onCrop,
            onFinish
        );
        expect(target(0).getAttribute('aria-label')).toBe('Top left');
        expect(target(1).getAttribute('aria-label')).toBe('Bottom right');
        expect(target(2).getAttribute('aria-label')).toBe('Move Crop');
    });

    it('uses supplied labels and removes them on disposal', () => {
        helper.dispose();
        helper = new ImageCropKeyboardHelper(
            wrapper,
            'cropImage',
            editInfo,
            {
                cropLabels: {
                    handleLabel: () => 'Crop corner',
                    moveCropLabel: 'Move viewport',
                },
            },
            onCrop,
            onFinish
        );
        expect(target(0).getAttribute('aria-label')).toBe('Crop corner');
        expect(target(1).getAttribute('aria-label')).toBe('Crop corner');
        expect(target(2).getAttribute('aria-label')).toBe('Move viewport');
        helper.dispose();
        expect(wrapper.querySelector('[aria-label]')).toBeNull();
    });

    it('omits instructions when not supplied', () => {
        expect(wrapper.querySelector('[id^="imageCropInstructions"]')).toBeNull();
        [0, 1, 2].forEach(index => {
            expect(target(index).hasAttribute('aria-describedby')).toBe(false);
        });
    });

    it('omits instructions when empty', () => {
        helper.dispose();
        helper = new ImageCropKeyboardHelper(
            wrapper,
            'cropImage',
            editInfo,
            { cropLabels: { instructions: '' } },
            onCrop,
            onFinish
        );
        expect(wrapper.querySelector('[id^="imageCropInstructions"]')).toBeNull();
        [0, 1, 2].forEach(index => {
            expect(target(index).hasAttribute('aria-describedby')).toBe(false);
        });
    });

    it('associates supplied instructions with every target and removes them on disposal', () => {
        helper.dispose();
        helper = new ImageCropKeyboardHelper(
            wrapper,
            'cropImage',
            editInfo,
            { cropLabels: { instructions: 'Use arrow keys to crop.' } },
            onCrop,
            onFinish
        );
        const instructions = wrapper.querySelector<HTMLElement>('[id^="imageCropInstructions"]')!;
        expect(instructions.id).toBe('imageCropInstructionscropImage');
        expect(instructions.textContent).toBe('Use arrow keys to crop.');
        [0, 1, 2].forEach(index => {
            expect(target(index).getAttribute('aria-describedby')).toBe(instructions.id);
        });
        helper.dispose();
        expect(document.getElementById(instructions.id)).toBeNull();
        expect(wrapper.querySelector('[aria-describedby]')).toBeNull();
    });

    it('supports localized labels and instructions', () => {
        helper.dispose();
        helper = new ImageCropKeyboardHelper(
            wrapper,
            'cropImage',
            editInfo,
            {
                cropLabels: {
                    handleLabel: direction => 'corner ' + direction,
                    moveCropLabel: 'viewport',
                    instructions: 'instructions',
                },
            },
            onCrop,
            onFinish
        );
        expect(target(0).getAttribute('aria-label')).toBe('corner nw');
        expect(target(1).getAttribute('aria-label')).toBe('corner se');
        expect(target(2).getAttribute('aria-label')).toBe('viewport');
        expect(
            document.getElementById(target(0).getAttribute('aria-describedby')!)!.textContent
        ).toBe('instructions');
    });
});
