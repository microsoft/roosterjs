import * as textMutationObserver from '../../../lib/corePlugin/cache/textMutationObserver';
import { TextMutationObserver } from 'roosterjs-content-model-types';

describe('TextMutationObserverImpl', () => {
    let observer: TextMutationObserver;

    afterEach(() => {
        observer?.stopObserving();
    });

    it('init', () => {
        const div = document.createElement('div');
        const onMutation = jasmine.createSpy('onMutation');
        textMutationObserver.createTextMutationObserver(div, onMutation);

        expect(onMutation).not.toHaveBeenCalled();
    });

    it('no text change', async () => {
        const div = document.createElement('div');
        const onMutation = jasmine.createSpy('onMutation');

        observer = textMutationObserver.createTextMutationObserver(div, onMutation);

        observer.startObserving();

        const br = document.createElement('br');
        div.appendChild(br);

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).toHaveBeenCalledTimes(1);
        expect(onMutation).toHaveBeenCalledWith({
            type: 'childList',
            addedNodes: [br],
            removedNodes: [],
        });
    });

    it('text change', async () => {
        const div = document.createElement('div');
        const text = document.createTextNode('test');

        div.appendChild(text);

        const onMutation = jasmine.createSpy('onMutation');
        observer = textMutationObserver.createTextMutationObserver(div, onMutation);

        observer.startObserving();

        text.nodeValue = '1';

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).toHaveBeenCalledTimes(1);
        expect(onMutation).toHaveBeenCalledWith({ type: 'text' });
    });

    it('text change in deeper node', async () => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        const text = document.createTextNode('test');

        span.appendChild(text);
        div.appendChild(span);

        const onMutation = jasmine.createSpy('onMutation');

        observer = textMutationObserver.createTextMutationObserver(div, onMutation);

        observer.startObserving();

        text.nodeValue = '1';

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).toHaveBeenCalledTimes(1);
        expect(onMutation).toHaveBeenCalledWith({ type: 'text' });
    });

    it('text and non-text change', async () => {
        const div = document.createElement('div');
        const text = document.createTextNode('test');

        div.appendChild(text);

        const onMutation = jasmine.createSpy('onMutation');

        observer = textMutationObserver.createTextMutationObserver(div, onMutation);

        observer.startObserving();

        text.nodeValue = '1';

        const br = document.createElement('br');
        div.appendChild(br);

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).toHaveBeenCalledTimes(2);
        expect(onMutation).toHaveBeenCalledWith({
            type: 'childList',
            addedNodes: [br],
            removedNodes: [],
        });
        expect(onMutation).toHaveBeenCalledWith({ type: 'text' });
    });

    it('flush mutation', async () => {
        const div = document.createElement('div');
        const text = document.createTextNode('test');

        div.appendChild(text);

        const onMutation = jasmine.createSpy('onMutation');
        observer = textMutationObserver.createTextMutationObserver(div, onMutation);

        observer.startObserving();

        text.nodeValue = '1';
        observer.flushMutations();

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).toHaveBeenCalledWith({
            type: 'text',
        });
    });

    it('flush mutation without change', async () => {
        const div = document.createElement('div');
        const text = document.createTextNode('test');

        div.appendChild(text);

        const onMutation = jasmine.createSpy('onMutation');
        observer = textMutationObserver.createTextMutationObserver(div, onMutation);

        observer.startObserving();
        observer.flushMutations();

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).not.toHaveBeenCalled();
    });

    it('flush mutation with a new model', async () => {
        const div = document.createElement('div');
        const text = document.createTextNode('test');

        div.appendChild(text);

        const onMutation = jasmine.createSpy('onMutation');
        observer = textMutationObserver.createTextMutationObserver(div, onMutation);

        observer.startObserving();

        text.nodeValue = '1';

        const newModel = 'MODEL' as any;
        observer.flushMutations(newModel);

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).not.toHaveBeenCalled();
    });

    it('flush mutation when type in new line - 1', async () => {
        const div = document.createElement('div');
        const br = document.createElement('br');
        const text = document.createTextNode('test');

        div.appendChild(br);

        const onMutation = jasmine.createSpy('onMutation');
        observer = textMutationObserver.createTextMutationObserver(div, onMutation);

        observer.startObserving();

        div.replaceChild(text, br);

        observer.flushMutations();

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).toHaveBeenCalledTimes(1);
        expect(onMutation).toHaveBeenCalledWith({
            type: 'childList',
            addedNodes: [text],
            removedNodes: [br],
        });
    });

    it('flush mutation when type in new line - 2', async () => {
        const div = document.createElement('div');
        const br = document.createElement('br');
        const text = document.createTextNode('');

        div.appendChild(br);

        const onMutation = jasmine.createSpy('onMutation');
        observer = textMutationObserver.createTextMutationObserver(div, onMutation);

        observer.startObserving();

        div.insertBefore(text, br);
        div.removeChild(br);
        text.nodeValue = 'test';

        observer.flushMutations();

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).toHaveBeenCalledTimes(2);
        expect(onMutation).toHaveBeenCalledWith({
            type: 'childList',
            addedNodes: [text],
            removedNodes: [br],
        });
        expect(onMutation).toHaveBeenCalledWith({ type: 'text' });
    });

    it('flush mutation when type in new line, fail to reconcile', async () => {
        const div = document.createElement('div');
        const br = document.createElement('br');
        const text = document.createTextNode('test');

        div.appendChild(br);

        const onMutation = jasmine.createSpy('onMutation');
        observer = textMutationObserver.createTextMutationObserver(div, onMutation);

        observer.startObserving();

        div.replaceChild(text, br);

        observer.flushMutations();

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).toHaveBeenCalledTimes(1);
        expect(onMutation).toHaveBeenCalledWith({
            type: 'childList',
            addedNodes: [text],
            removedNodes: [br],
        });
    });

    it('mutation happens in different root', async () => {
        const div = document.createElement('div');
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const br = document.createElement('br');
        const text = document.createTextNode('test');

        div1.appendChild(br);
        div.appendChild(div1);
        div.appendChild(div2);

        const onMutation = jasmine.createSpy('onMutation');
        observer = textMutationObserver.createTextMutationObserver(div, onMutation);

        observer.startObserving();

        div1.removeChild(br);
        div2.appendChild(text);

        observer.flushMutations();

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).toHaveBeenCalledTimes(1);
        expect(onMutation).toHaveBeenCalledWith({ type: 'unknown' });
    });

    it('attribute change', async () => {
        const div = document.createElement('div');
        const div1 = document.createElement('div');

        div.appendChild(div1);

        const onMutation = jasmine.createSpy('onMutation');
        observer = textMutationObserver.createTextMutationObserver(div, onMutation);

        observer.startObserving();

        div1.id = 'div1';

        observer.flushMutations();

        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 10);
        });

        expect(onMutation).toHaveBeenCalledTimes(1);
        expect(onMutation).toHaveBeenCalledWith({ type: 'unknown' });
    });
});
