import safeInstanceOf, { getTargetWindow } from '../../lib/utils/safeInstanceOf';

describe('safeInstanceOf', () => {
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

    it('Node', () => {
        const localNode = document.createTextNode('test 1');
        const remoteNode = iframeDocument.createTextNode('test 2');
        const localRange = document.createRange();
        const remoteRange = iframeDocument.createRange();
        const detachNode = getDetachedNode('test');

        expect(safeInstanceOf(localNode, 'Node')).toBeTruthy('local node => Node');
        expect(safeInstanceOf(remoteNode, 'Node')).toBeTruthy('remote node => Node');
        expect(safeInstanceOf(localRange, 'Node')).toBeFalsy('local range => Node');
        expect(safeInstanceOf(remoteRange, 'Node')).toBeFalsy('remote range => Node');
        expect(safeInstanceOf(detachNode, 'Node')).toBeTruthy('detached node => Node');
        expect(safeInstanceOf({}, 'Node')).toBeFalsy('object => Node');
    });

    it('Range', () => {
        const localNode = document.createTextNode('test 1');
        const remoteNode = iframeDocument.createTextNode('test 2');
        const localRange = document.createRange();
        const remoteRange = iframeDocument.createRange();

        expect(safeInstanceOf(localNode, 'Range')).toBeFalsy('local node => Range');
        expect(safeInstanceOf(remoteNode, 'Range')).toBeFalsy('remote node => Range');
        expect(safeInstanceOf(localRange, 'Range')).toBeTruthy('local range => Range');
        expect(safeInstanceOf(remoteRange, 'Range')).toBeTruthy('remote range => Range');
        expect(safeInstanceOf({}, 'Range')).toBeFalsy('object => Range');
    });

    it('HTMLElement', () => {
        const localNode = document.createTextNode('test 1');
        const remoteNode = iframeDocument.createTextNode('test 2');
        const localElement = document.createElement('DIV');
        const remoteElement = iframeDocument.createElement('DIV');
        const detachNode = getDetachedNode('test');
        const detachElement = getDetachedNode('<div>test</div>');

        expect(safeInstanceOf(localNode, 'HTMLElement')).toBeFalsy('local node => HTMLElement');
        expect(safeInstanceOf(remoteNode, 'HTMLElement')).toBeFalsy('remote node => HTMLElement');
        expect(safeInstanceOf(localElement, 'HTMLElement')).toBeTruthy(
            'local element => HTMLElement'
        );
        expect(safeInstanceOf(remoteElement, 'HTMLElement')).toBeTruthy(
            'remote element => HTMLElement'
        );
        expect(safeInstanceOf(detachNode, 'HTMLElement')).toBeFalsy('detached node => HTMLElement');
        expect(safeInstanceOf(detachElement, 'HTMLElement')).toBeTruthy(
            'detached element => HTMLElement'
        );
        expect(safeInstanceOf({}, 'HTMLElement')).toBeFalsy('object => HTMLElement');
    });

    it('DocumentFragment', () => {
        const localNode = document.createTextNode('test 1');
        const remoteNode = iframeDocument.createTextNode('test 2');
        const localFragment = document.createDocumentFragment();
        const remoteFragment = iframeDocument.createDocumentFragment();

        expect(safeInstanceOf(localNode, 'DocumentFragment')).toBeFalsy(
            'local node => DocumentFragment'
        );
        expect(safeInstanceOf(remoteNode, 'DocumentFragment')).toBeFalsy(
            'remote node => DocumentFragment'
        );
        expect(safeInstanceOf(localFragment, 'DocumentFragment')).toBeTruthy(
            'local fragment => DocumentFragment'
        );
        expect(safeInstanceOf(remoteFragment, 'DocumentFragment')).toBeTruthy(
            'remote fragment => DocumentFragment'
        );
        expect(safeInstanceOf({}, 'DocumentFragment')).toBeFalsy('object => DocumentFragment');
    });

    it('HTMLOListElement', () => {
        const localNode = document.createTextNode('test 1');
        const remoteNode = iframeDocument.createTextNode('test 2');
        const localElement = document.createElement('OL');
        const remoteElement = iframeDocument.createElement('OL');
        const detachNode = getDetachedNode('test');
        const detachElement = getDetachedNode('<OL></OL>');

        expect(safeInstanceOf(localNode, 'HTMLOListElement')).toBeFalsy(
            'local node => HTMLOListElement'
        );
        expect(safeInstanceOf(remoteNode, 'HTMLOListElement')).toBeFalsy(
            'remote node => HTMLOListElement'
        );
        expect(safeInstanceOf(localElement, 'HTMLOListElement')).toBeTruthy(
            'local element => HTMLOListElement'
        );
        expect(safeInstanceOf(remoteElement, 'HTMLOListElement')).toBeTruthy(
            'remote element => HTMLOListElement'
        );
        expect(safeInstanceOf(detachNode, 'HTMLOListElement')).toBeFalsy(
            'detached node => HTMLOListElement'
        );
        expect(safeInstanceOf(detachElement, 'HTMLOListElement')).toBeTruthy(
            'detached element => HTMLOListElement'
        );
        expect(safeInstanceOf({}, 'HTMLOListElement')).toBeFalsy('object => HTMLOListElement');
    });

    it('HTMLTableCellElement', () => {
        const localNode = document.createTextNode('test 1');
        const remoteNode = iframeDocument.createTextNode('test 2');
        const localElement = document.createElement('TD');
        const remoteElement = iframeDocument.createElement('TD');
        const detachNode = getDetachedNode('test');
        const detachElement = (<HTMLTableElement>(
            new DOMParser().parseFromString('<TABLE><TR><TD></TD></TR></TABLE>', 'text/html').body
                .firstChild
        )).rows[0].cells[0];

        expect(safeInstanceOf(localNode, 'HTMLTableCellElement')).toBeFalsy(
            'local node => HTMLTableCellElement'
        );
        expect(safeInstanceOf(remoteNode, 'HTMLTableCellElement')).toBeFalsy(
            'remote node => HTMLTableCellElement'
        );
        expect(safeInstanceOf(localElement, 'HTMLTableCellElement')).toBeTruthy(
            'local element => HTMLTableCellElement'
        );
        expect(safeInstanceOf(remoteElement, 'HTMLTableCellElement')).toBeTruthy(
            'remote element => HTMLTableCellElement'
        );
        expect(safeInstanceOf(detachNode, 'HTMLTableCellElement')).toBeFalsy(
            'detached node => HTMLTableCellElement'
        );
        expect(safeInstanceOf(detachElement, 'HTMLTableCellElement')).toBeTruthy(
            'detached element => HTMLTableCellElement'
        );
        expect(safeInstanceOf({}, 'HTMLTableCellElement')).toBeFalsy(
            'object => HTMLTableCellElement'
        );
    });

    it('HTMLTableElement', () => {
        const localNode = document.createTextNode('test 1');
        const remoteNode = iframeDocument.createTextNode('test 2');
        const localElement = document.createElement('TABLE');
        const remoteElement = iframeDocument.createElement('TABLE');
        const detachNode = getDetachedNode('test');
        const detachElement = getDetachedNode('<TABLE></TABLE>');

        expect(safeInstanceOf(localNode, 'HTMLTableElement')).toBeFalsy(
            'local node => HTMLTableElement'
        );
        expect(safeInstanceOf(remoteNode, 'HTMLTableElement')).toBeFalsy(
            'remote node => HTMLTableElement'
        );
        expect(safeInstanceOf(localElement, 'HTMLTableElement')).toBeTruthy(
            'local element => HTMLTableElement'
        );
        expect(safeInstanceOf(remoteElement, 'HTMLTableElement')).toBeTruthy(
            'remote element => HTMLTableElement'
        );
        expect(safeInstanceOf(detachNode, 'HTMLTableElement')).toBeFalsy(
            'detached node => HTMLTableElement'
        );
        expect(safeInstanceOf(detachElement, 'HTMLTableElement')).toBeTruthy(
            'detached element => HTMLTableElement'
        );
        expect(safeInstanceOf({}, 'HTMLTableElement')).toBeFalsy('object => HTMLTableElement');
    });
});

function getDetachedNode(html: string) {
    return new DOMParser().parseFromString(html, 'text/html').body.firstChild;
}
