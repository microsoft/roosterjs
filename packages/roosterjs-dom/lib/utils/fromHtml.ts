// Creates a HTMLElement array from html
export default function fromHtml(htmlFragment: string): Node[] {
    let element = document.createElement('DIV');
    element.innerHTML = htmlFragment;

    let children: Node[] = [];
    for (let index = 0; index < element.childNodes.length; index++) {
        children.push(element.childNodes.item(index));
    }

    return children;
}
