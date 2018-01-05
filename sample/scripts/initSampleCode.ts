export default function initSampleCode() {
    insertHtmlSampleCode();
    insertJsSampleCode();

    var fileref=document.createElement('script');
    fileref.setAttribute("type","text/javascript");
    fileref.setAttribute("src", "https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js");
    document.getElementsByTagName("head")[0].appendChild(fileref);
}

function insertHtmlSampleCode() {
    let htmlSampleCode = document.getElementsByClassName('htmlSample')[0];
    let codeString: string = [
        '<html>',
        '   <body>',
        '       <div id="editorDiv" style="width: 500px; height: 300px; overflow: auto;',
        '       border: solid 1px black"></div>',
        '       <script src="editor.js"></script>',
        '   </body>',
        '</html>',
    ].join("\n");
    htmlSampleCode.appendChild(createElementFromContent('htmlSampleCode', codeString, 'prettyprint lang-html'));
}

function insertJsSampleCode() {
    let jsSampleCode = document.getElementsByClassName('jsSample')[0];
    let codeString: string = [
        'var roosterjs = require(\'roosterjs\');',
        'var editorDiv = document.getElementById(\'editorDiv\');',
        'var editor = roosterjs.createEditor(editorDiv);',
        'editor.setContent(\'Welcome to <b>RoosterJs</b>!\');',
    ].join("\n");
    jsSampleCode.appendChild(createElementFromContent('jsSampleCode', codeString, 'prettyprint lang-js'));
}

function createElementFromContent(id: string, content: string, className: string): HTMLElement {
    let node = document.createElement('xmp');
    node.id = id;
    node.className = className;
    document.body.insertBefore(node, document.body.childNodes[0]);
    node.innerHTML = content;

    return node;
}