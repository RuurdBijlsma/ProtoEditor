document.addEventListener('DOMContentLoaded', init, false);

function init() {
	let decoder = new ProtoDecoder();
    let protoUrl = "!1m5!1m4!1i4!2i11!3i7!4i256!2m8!1e2!2ssvv!4m2!1scb_client!2sapiv3!4m2!1scc!2s*211m3*211e3*212b1*213e2*211m3*211e2*212b1*213e2!3m3!3sUS!12m1!1e68!4e0!23i1301875";
    console.log('Input:   ', protoUrl);
    let decoded = decoder.decode(protoUrl);
    console.log('Decoded: ', decoded);
    let encoded = decoder.encode(decoded);
    console.log("Encoded: ", encoded, "Success: ", encoded === protoUrl);

    document.querySelector('.right-pane').appendChild(new FormCreator().fromObject(decoded));
}