document.addEventListener('DOMContentLoaded', init, false);

function init() {
    decoder = new ProtoDecoder();
    decodeInput(document.querySelector('.input > textarea').value);
    encodeInput();
}

function encodeInput() {
    let decodedObject = new FormCreator().toObject(document.querySelector('.right-pane > form'));
    console.log(decodedObject);
    showEncoded(decodedObject);
}

function decodeInput(input) {
    let decodedObject = decoder.decode(input);
    console.log(decodedObject);
    showDecoded(decodedObject);
    showEncoded(decodedObject);
}

function showEncoded(decodedObject) {
    let pane = document.querySelector('.output > div');
    pane.innerHTML = decoder.encode(decodedObject);
}

function showDecoded(decodedObject) {
    let pane = document.querySelector('.right-pane');
    while (pane.hasChildNodes())
        pane.removeChild(pane.lastChild);

    pane.appendChild(new FormCreator().fromObject(decodedObject));
}