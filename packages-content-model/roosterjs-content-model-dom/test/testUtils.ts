export function expectHtml(actualHtml: string, expectedHtml: string | string[]) {
    expectedHtml = Array.isArray(expectedHtml) ? expectedHtml : [expectedHtml];
    expect(expectedHtml.indexOf(actualHtml)).toBeGreaterThanOrEqual(0, actualHtml);
}

export function createRange(node1: Node, offset1?: number, node2?: Node, offset2?: number): Range {
    const range = document.createRange();

    if (typeof offset1 == 'number') {
        range.setStart(node1, offset1);
    } else {
        range.selectNode(node1);
    }

    if (node2 && typeof offset2 == 'number') {
        range.setEnd(node2, offset2);
    }

    return range;
}

declare var __karma__: any;

export function itChromeOnly(
    expectation: string,
    assertion?: jasmine.ImplementationCallback,
    timeout?: number
) {
    const func = __karma__.config.browser == 'Chrome' ? it : xit;
    return func(expectation, assertion, timeout);
}
