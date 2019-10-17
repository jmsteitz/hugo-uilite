var _secretKey = "WeD0n'tL1keSpamBots";

function encrypt(plainText) {
    var cipherText = simpleCrypto.encrypt(plainText);
    console.log("Encrypted string is: " + cipherText);
};

function decrypt(cipherText) {
    var decipherText = simpleCrypto.decrypt(cipherText);
    return decipherText;
}

function openCryptLink(cryptmail) {
    location.href = 'mailto:' + decrypt(cryptmail);
}

if (typeof require !== 'undefined') {
    if(require.main == module) {
        if (process.argv.length < 3)
            console.log('Error: Call with string to encrypt as first argument!\nnode mailcrypt.js "somestring"');
        else {
            const crypto = require('../../node_modules/simple-crypto-js/build/SimpleCrypto');
            var simpleCrypto = new crypto.SimpleCrypto(_secretKey);
            encrypt(process.argv[2]);
        }
    }
} else {
    var simpleCrypto = new SimpleCrypto(_secretKey);
}
