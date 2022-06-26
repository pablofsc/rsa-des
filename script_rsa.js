$(document).ready(() => {
    inserirPrimos();
    atualizar();
});

const atualizar = () => {
    const p = parseInt($('#p').val());
    const q = parseInt($('#q').val());
    const params = prepararRSA(p, q);

    $('#valores').html(`
        n = ${params.n} <br>
        φ = ${params.phi} <br>
        e = ${params.e} <br>
        d = ${params.d}
    `);

    if (p === q)
        $('#avisos').html(`
        <div class="text-bg-danger rounded-3 p-2">
            <small>
                <b>Os primos selecionados são iguais</b><br>
                O método RSA requer dois primos diferentes.
            </small>
        </div>
        `);
    else if (params.n < 400)
        $('#avisos').html(`
        <div class="text-bg-warning rounded-3 p-2">
            <small>
                <b>Os primos selecionados são muito pequenos</b><br>
                A descriptografia falha se a mensagem contiver um caractere cujo código seja maior que n. (tipicamente letras com acentos)
            </small>
        </div>
        `);
    else $('#avisos').html('');

    $('#chave-publica').html(`<small>(${params.e}, ${params.n})</small>`);
    $('#chave-privada').html(`<small>(${params.d}, ${params.n})</small>`);

    const mensagem = paraCodigos($('#entrada-cifrar').val());

    const cifrado = cifrarRSA(params, mensagem);
    $('#saida-cifrar').html(paraCaracteres(cifrado));
    $('#entrada-decifrar').html(paraCaracteres(cifrado));

    const decifrado = decifrarRSA(params, cifrado);
    $('#saida-decifrar').html(paraCaracteres(decifrado));
};

const inserirPrimos = () => {
    for (let num = 3; num <= 1000; num++) {
        let primo = true;

        for (let divisor = 2, s = Math.sqrt(num); divisor <= s; divisor++) {
            if (num % divisor === 0) {
                primo = false;
                break;
            }
        }

        if (primo) {
            $('#p').append(`<option value="${num}">${num}</option>`);
            $('#q').append(`<option value="${num}">${num}</option>`);
        }
    }

    $(`#p > *[value='19']`).attr('selected', '');
    $(`#q > *[value='23']`).attr('selected', '');
};

const n = (p, q) => {
    return p * q;
};

const phi = (p, q) => {
    return (p - 1) * (q - 1);
};

const publicKey = (phi) => {
    for (let e = 2; e < phi; e++) if (saoCoprimos(phi, e)) return e;
};

const privateKey = (e, phi) => {
    for (let d = 0; ; d++) if ((d * e) % phi === 1) return d;
};

const prepararRSA = (p, q) => {
    const N = n(p, q);
    const PHI = phi(p, q);
    const E = publicKey(PHI);
    const D = privateKey(E, PHI);

    return {
        p: p,
        q: q,
        n: N,
        phi: PHI,
        e: E,
        d: D,
    };
};

const cifrarRSA = (parametros, mensagem) => {
    let cifrado = [];
    for (let codigoCaractere of mensagem) {
        const c = expMod(codigoCaractere, parametros.e, parametros.n);
        cifrado.push(c);
    }

    return cifrado;
};

const decifrarRSA = (parametros, cifrado) => {
    let decifrado = [];
    for (let codigoCaractere of cifrado) {
        const d = expMod(codigoCaractere, parametros.d, parametros.n);
        decifrado.push(d);
    }

    return decifrado;
};
