const paraCaracteres = (codigos) => {
    let convertido = '';
    for (let codigo of codigos) convertido += String.fromCharCode(Number(codigo));
    return convertido;
};

const paraCodigos = (texto) => {
    let convertido = [];
    for (let caractere of texto) convertido.push(caractere.charCodeAt(0));
    return convertido;
};

const saoCoprimos = (a, b) => {
    const menor = a > b ? a : b;

    for (let divisor = 2; divisor < menor; divisor++) {
        if (a % divisor == 0 && b % divisor == 0) return false;
    }

    return true;
};

function expMod(mensagem, expoente, n) {
    res = 1;
    pow = mensagem;
    e1 = expoente;

    while (e1 != 0) {
        d = e1 % 2;
        if (d == 1) res = (res * pow) % n;

        e1 = Math.floor(e1 / 2);
        pow = (pow * pow) % n;
    }

    if (res < 0) res += n;

    return res;
}
