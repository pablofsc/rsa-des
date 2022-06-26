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
            <div class="text-bg-danger rounded-2 p-2">
                <small>
                    <b>Os primos selecionados são iguais</b><br>
                    O método RSA requer dois primos diferentes.
                </small>
            </div>
        `);
    else if (params.n < 400)
        $('#avisos').html(`
            <div class="text-bg-warning rounded-2 p-2">
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

    const cifrado = cifrarRSA(mensagem, params.e, params.n);
    $('#saida-cifrar').html(paraCaracteres(cifrado));
    $('#entrada-decifrar').html(paraCaracteres(cifrado));

    const decifrado = decifrarRSA(cifrado, params.d, params.n);
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

const prepararRSA = (p, q) => {
    const n = (p, q) => p * q;
    const phi = (p, q) => (p - 1) * (q - 1);

    const publicKey = (phi) => {
        for (let e = 2; e < phi; e++) if (saoCoprimos(phi, e)) return e;
    };

    const privateKey = (e, phi) => {
        for (let d = 0; ; d++) if ((d * e) % phi === 1) return d;
    };

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

const cifrarRSA = (mensagem, e, n) => {
    let cifrado = [];
    for (let codigoCaractere of mensagem) {
        const letraCifrada = expMod(codigoCaractere, e, n);
        cifrado.push(letraCifrada);
    }

    return cifrado;
};

const decifrarRSA = (cifrado, d, n) => {
    let decifrado = [];
    for (let codigoCaractere of cifrado) {
        const letraDecifrada = expMod(codigoCaractere, d, n);
        decifrado.push(letraDecifrada);
    }

    return decifrado;
};
