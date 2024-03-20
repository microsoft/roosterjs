import { EditorCore } from 'roosterjs-content-model-types';
import { setLogicalRoot } from '../../../lib/coreApi/setLogicalRoot/setLogicalRoot';

describe('setLogicalRoot', () => {
    let core: EditorCore;
    let triggerEventSpy: jasmine.Spy;
    let physicalRoot: HTMLDivElement;
    let insideElement1: HTMLDivElement;
    let insideElement2: HTMLDivElement;

    beforeEach(() => {
        physicalRoot = document.createElement('div');
        insideElement1 = document.createElement('div');
        insideElement2 = document.createElement('div');
        physicalRoot.appendChild(insideElement1);
        physicalRoot.appendChild(insideElement2);
        physicalRoot.contentEditable = 'true';

        triggerEventSpy = jasmine.createSpy('triggerEvent');

        core = ({
            physicalRoot: physicalRoot,
            logicalRoot: physicalRoot,
            api: {
                triggerEvent: triggerEventSpy,
            },
            selection: {},
            cache: {},
        } as any) as EditorCore;
    });

    describe('logical root has not been set (is physical root)', () => {
        beforeEach(() => {
            setLogicalRoot(core, physicalRoot);
            (core.api.triggerEvent as jasmine.Spy).calls.reset();
        });

        it('is called with null', () => {
            setLogicalRoot(core, null);

            expect(core.physicalRoot).toBe(physicalRoot);
            expect(core.logicalRoot).toBe(physicalRoot);
            expect(physicalRoot.contentEditable).toBe('true');
            expect(insideElement1.contentEditable).not.toBe('true');
            expect(insideElement2.contentEditable).not.toBe('true');
            expect(triggerEventSpy).not.toHaveBeenCalled();
        });

        it('is called with nested element', () => {
            setLogicalRoot(core, insideElement1);

            expect(core.physicalRoot).toBe(physicalRoot);
            expect(core.logicalRoot).toBe(insideElement1);
            expect(physicalRoot.contentEditable).not.toBe('true');
            expect(insideElement1.contentEditable).toBe('true');
            expect(insideElement2.contentEditable).not.toBe('true');
            expect(triggerEventSpy).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'logicalRootChanged',
                    logicalRoot: insideElement1,
                },
                false
            );
        });

        it('is called with unrelated, non-nested element', () => {
            const unrelatedElement = document.createElement('div');
            setLogicalRoot(core, unrelatedElement);

            expect(core.physicalRoot).toBe(physicalRoot);
            expect(core.logicalRoot).toBe(physicalRoot);
            expect(physicalRoot.contentEditable).toBe('true');
            expect(insideElement1.contentEditable).not.toBe('true');
            expect(insideElement2.contentEditable).not.toBe('true');
            expect(triggerEventSpy).not.toHaveBeenCalled();
        });
    });

    describe('logical root has been set', () => {
        beforeEach(() => {
            setLogicalRoot(core, insideElement1);
            (core.api.triggerEvent as jasmine.Spy).calls.reset();
        });

        it('is called with null', () => {
            setLogicalRoot(core, null);

            expect(core.physicalRoot).toBe(physicalRoot);
            expect(core.logicalRoot).toBe(physicalRoot); // logicalRoot is reset to physicalRoot
            expect(physicalRoot.contentEditable).toBe('true');
            expect(insideElement1.contentEditable).not.toBe('true');
            expect(insideElement2.contentEditable).not.toBe('true');
            expect(triggerEventSpy).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'logicalRootChanged',
                    logicalRoot: physicalRoot,
                },
                false
            );
        });

        it('is called with same nested element', () => {
            setLogicalRoot(core, insideElement1);

            expect(core.physicalRoot).toBe(physicalRoot);
            expect(core.logicalRoot).toBe(insideElement1);
            expect(physicalRoot.contentEditable).not.toBe('true');
            expect(insideElement1.contentEditable).toBe('true');
            expect(insideElement2.contentEditable).not.toBe('true');
            expect(triggerEventSpy).not.toHaveBeenCalled();
        });

        it('is called with different nested element', () => {
            setLogicalRoot(core, insideElement2);

            expect(core.physicalRoot).toBe(physicalRoot);
            expect(core.logicalRoot).toBe(insideElement2);
            expect(physicalRoot.contentEditable).not.toBe('true');
            expect(insideElement1.contentEditable).not.toBe('true');
            expect(insideElement2.contentEditable).toBe('true');
            expect(triggerEventSpy).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'logicalRootChanged',
                    logicalRoot: insideElement2,
                },
                false
            );
        });

        it('is called with unrelated, non-nested element', () => {
            const unrelatedElement = document.createElement('div');
            setLogicalRoot(core, unrelatedElement);

            expect(core.physicalRoot).toBe(physicalRoot);
            expect(core.logicalRoot).toBe(insideElement1); // logicalRoot is not changed
            expect(physicalRoot.contentEditable).not.toBe('true');
            expect(insideElement1.contentEditable).toBe('true');
            expect(insideElement2.contentEditable).not.toBe('true');
            expect(triggerEventSpy).not.toHaveBeenCalled();
        });
    });
});
