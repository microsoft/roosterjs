import isDocumentFragment from '../typeUtils/isDocumentFragment';
import isHTMLElement from '../typeUtils/isHTMLElement';
import isHTMLOListElement from '../typeUtils/isHTMLOListElement';
import isHTMLTableCellElement from '../typeUtils/isHTMLTableCellElement';
import isHTMLTableElement from '../typeUtils/isHTMLTableElement';
import isNode from '../typeUtils/isNode';
import isRange from '../typeUtils/isRange';
import { getTargetWindow } from '../typeUtils/safeInstanceOf';

describe('typeUtils', () => {
    let iframe: HTMLIFrameElement;
    let iframeDocument: Document;

    beforeEach(() => {
        iframe = document.createElement('IFRAME') as HTMLIFrameElement;
        iframe.src = 'about:blank';
        document.body.appendChild(iframe);
        iframeDocument = iframe.contentDocument;
        iframeDocument.write('<html><body></body></html>');
    });

    afterEach(() => {
        document.body.removeChild(iframe);
        iframe = null;
        iframeDocument = null;
    });

    it('getTargetWindow for Node', () => {
        const localNode = document.createTextNode('test 1');
        const remoteNode = iframeDocument.createTextNode('test 2');
        const localWindow = getTargetWindow(localNode);
        const remoteWindow = getTargetWindow(remoteNode);
        expect(localWindow).toBe(<any>window, 'localNode => getTargetWindow');
        expect(localWindow).not.toBe(
            <any>iframeDocument.defaultView,
            'localNode => getTargetWindow'
        );
        expect(remoteWindow).not.toBe(<any>window, 'remoteNode => getTargetWindow');
        expect(remoteWindow).toBe(<any>iframeDocument.defaultView, 'remoteNode => getTargetWindow');
    });

    it('getTargetWindow for Range', () => {
        const localRange = document.createRange();
        const remoteRange = iframeDocument.createRange();
        const localWindow = getTargetWindow(localRange);
        const remoteWindow = getTargetWindow(remoteRange);
        expect(localWindow).toBe(<any>window, 'localNode => getTargetWindow');
        expect(localWindow).not.toBe(
            <any>iframeDocument.defaultView,
            'localNode => getTargetWindow'
        );
        expect(remoteWindow).not.toBe(<any>window, 'remoteNode => getTargetWindow');
        expect(remoteWindow).toBe(<any>iframeDocument.defaultView, 'remoteNode => getTargetWindow');
    });

    it('isNode', () => {
        const localNode = document.createTextNode('test 1');
        const remoteNode = iframeDocument.createTextNode('test 2');
        const localRange = document.createRange();
        const remoteRange = iframeDocument.createRange();
        const detachNode = getDetachedNode('test');

        expect(isNode(localNode)).toBeTruthy('local node => isNode');
        expect(isNode(remoteNode)).toBeTruthy('remote node => isNode');
        expect(isNode(localRange)).toBeFalsy('local range => isNode');
        expect(isNode(remoteRange)).toBeFalsy('remote range => isNode');
        expect(isNode(detachNode)).toBeTruthy('detached node => isNode');
        expect(isNode({})).toBeFalsy('object => isNode');
    });

    it('isRange', () => {
        const localNode = document.createTextNode('test 1');
        const remoteNode = iframeDocument.createTextNode('test 2');
        const localRange = document.createRange();
        const remoteRange = iframeDocument.createRange();

        expect(isRange(localNode)).toBeFalsy('local node => isRange');
        expect(isRange(remoteNode)).toBeFalsy('remote node => isRange');
        expect(isRange(localRange)).toBeTruthy('local range => isRange');
        expect(isRange(remoteRange)).toBeTruthy('remote range => isRange');
        expect(isRange({})).toBeFalsy('object => isRange');
    });

    it('isHTMLElement', () => {
        const localNode = document.createTextNode('test 1');
        const remoteNode = iframeDocument.createTextNode('test 2');
        const localElement = document.createElement('DIV');
        const remoteElement = iframeDocument.createElement('DIV');
        const detachNode = getDetachedNode('test');
        const detachElement = getDetachedNode('<div>test</div>');

        expect(isHTMLElement(localNode)).toBeFalsy('local node => isHTMLElement');
        expect(isHTMLElement(remoteNode)).toBeFalsy('remote node => isHTMLElement');
        expect(isHTMLElement(localElement)).toBeTruthy('local element => isHTMLElement');
        expect(isHTMLElement(remoteElement)).toBeTruthy('remote element => isHTMLElement');
        expect(isHTMLElement(detachNode)).toBeFalsy('detached node => isHTMLElement');
        expect(isHTMLElement(detachElement)).toBeTruthy('detached element => isHTMLElement');
        expect(isHTMLElement({})).toBeFalsy('object => isHTMLElement');
    });

    it('isDocumentFragment', () => {
        const localNode = document.createTextNode('test 1');
        const remoteNode = iframeDocument.createTextNode('test 2');
        const localFragment = document.createDocumentFragment();
        const remoteFragment = iframeDocument.createDocumentFragment();

        expect(isDocumentFragment(localNode)).toBeFalsy('local node => isDocumentFragment');
        expect(isDocumentFragment(remoteNode)).toBeFalsy('remote node => isDocumentFragment');
        expect(isDocumentFragment(localFragment)).toBeTruthy(
            'local fragment => isDocumentFragment'
        );
        expect(isDocumentFragment(remoteFragment)).toBeTruthy(
            'remote fragment => isDocumentFragment'
        );
        expect(isDocumentFragment({})).toBeFalsy('object => isDocumentFragment');
    });

    it('isHTMLOListElement', () => {
        const localNode = document.createTextNode('test 1');
        const remoteNode = iframeDocument.createTextNode('test 2');
        const localElement = document.createElement('OL');
        const remoteElement = iframeDocument.createElement('OL');
        const detachNode = getDetachedNode('test');
        const detachElement = getDetachedNode('<OL></OL>');

        expect(isHTMLOListElement(localNode)).toBeFalsy('local node => isHTMLOListElement');
        expect(isHTMLOListElement(remoteNode)).toBeFalsy('remote node => isHTMLOListElement');
        expect(isHTMLOListElement(localElement)).toBeTruthy('local element => isHTMLOListElement');
        expect(isHTMLOListElement(remoteElement)).toBeTruthy(
            'remote element => isHTMLOListElement'
        );
        expect(isHTMLOListElement(detachNode)).toBeFalsy('detached node => isHTMLOListElement');
        expect(isHTMLOListElement(detachElement)).toBeTruthy(
            'detached element => isHTMLOListElement'
        );
        expect(isHTMLOListElement({})).toBeFalsy('object => isHTMLOListElement');
    });

    it('isHTMLTableCellElement', () => {
        const localNode = document.createTextNode('test 1');
        const remoteNode = iframeDocument.createTextNode('test 2');
        const localElement = document.createElement('TD');
        const remoteElement = iframeDocument.createElement('TD');
        const detachNode = getDetachedNode('test');
        const detachElement = (<HTMLTableElement>(
            new DOMParser().parseFromString('<TABLE><TR><TD></TD></TR></TABLE>', 'text/html').body
                .firstChild
        )).rows[0].cells[0];

        expect(isHTMLTableCellElement(localNode)).toBeFalsy('local node => isHTMLTableCellElement');
        expect(isHTMLTableCellElement(remoteNode)).toBeFalsy(
            'remote node => isHTMLTableCellElement'
        );
        expect(isHTMLTableCellElement(localElement)).toBeTruthy(
            'local element => isHTMLTableCellElement'
        );
        expect(isHTMLTableCellElement(remoteElement)).toBeTruthy(
            'remote element => isHTMLTableCellElement'
        );
        expect(isHTMLTableCellElement(detachNode)).toBeFalsy(
            'detached node => isHTMLTableCellElement'
        );
        expect(isHTMLTableCellElement(detachElement)).toBeTruthy(
            'detached element => isHTMLTableCellElement'
        );
        expect(isHTMLTableCellElement({})).toBeFalsy('object => isHTMLTableCellElement');
    });

    it('isHTMLTableElement', () => {
        const localNode = document.createTextNode('test 1');
        const remoteNode = iframeDocument.createTextNode('test 2');
        const localElement = document.createElement('TABLE');
        const remoteElement = iframeDocument.createElement('TABLE');
        const detachNode = getDetachedNode('test');
        const detachElement = getDetachedNode('<TABLE></TABLE>');

        expect(isHTMLTableElement(localNode)).toBeFalsy('local node => isHTMLTableElement');
        expect(isHTMLTableElement(remoteNode)).toBeFalsy('remote node => isHTMLTableElement');
        expect(isHTMLTableElement(localElement)).toBeTruthy('local element => isHTMLTableElement');
        expect(isHTMLTableElement(remoteElement)).toBeTruthy(
            'remote element => isHTMLTableElement'
        );
        expect(isHTMLTableElement(detachNode)).toBeFalsy('detached node => isHTMLTableElement');
        expect(isHTMLTableElement(detachElement)).toBeTruthy(
            'detached element => isHTMLTableElement'
        );
        expect(isHTMLTableElement({})).toBeFalsy('object => isHTMLTableElement');
    });
});

function getDetachedNode(html: string) {
    return new DOMParser().parseFromString(html, 'text/html').body.firstChild;
}
