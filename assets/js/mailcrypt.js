/*
 * Contact-detail obfuscation against spam bots, built on the Web Crypto API.
 *
 * This is obfuscation, not secrecy: the passphrase below ships to every
 * visitor, so anybody who wants the plaintext can have it. The point is only
 * that a scraper has to execute JavaScript and AES-GCM instead of running a
 * regular expression over the page source.
 *
 * Ciphertext format: base64( 12-byte IV || AES-GCM ciphertext+tag ).
 * The AES-256 key is the raw SHA-256 digest of the passphrase; there is no
 * PBKDF2 stretching because a passphrase published in the page bundle gains
 * nothing from it, and a KDF would only slow every page load down.
 *
 * Generate new ciphertexts with:  node mailcrypt.js "somestring"
 */
var MAILCRYPT_PASSPHRASE = "WeD0n'tL1keSp4mB0ts!";

(function (root) {
    var IV_BYTES = 12;
    var subtle = root.crypto && root.crypto.subtle;
    var keyPromise = null;

    function utf8(text) {
        return new TextEncoder().encode(text);
    }

    // Imported once and memoised: every reveal on the page shares one key.
    function getKey() {
        if (!keyPromise) {
            keyPromise = subtle.digest("SHA-256", utf8(MAILCRYPT_PASSPHRASE)).then(function (digest) {
                return subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
            });
        }
        return keyPromise;
    }

    function toBase64(bytes) {
        var latin1 = "";
        for (var i = 0; i < bytes.length; i++) {
            latin1 += String.fromCharCode(bytes[i]);
        }
        return btoa(latin1);
    }

    function fromBase64(text) {
        var latin1 = atob(text);
        var bytes = new Uint8Array(latin1.length);
        for (var i = 0; i < latin1.length; i++) {
            bytes[i] = latin1.charCodeAt(i);
        }
        return bytes;
    }

    function encrypt(plainText) {
        var iv = root.crypto.getRandomValues(new Uint8Array(IV_BYTES));
        return getKey()
            .then(function (key) {
                return subtle.encrypt({ name: "AES-GCM", iv: iv }, key, utf8(plainText));
            })
            .then(function (buffer) {
                var packed = new Uint8Array(IV_BYTES + buffer.byteLength);
                packed.set(iv, 0);
                packed.set(new Uint8Array(buffer), IV_BYTES);
                return toBase64(packed);
            });
    }

    function decrypt(cipherText) {
        var packed = fromBase64(cipherText);
        return getKey()
            .then(function (key) {
                return subtle.decrypt(
                    { name: "AES-GCM", iv: packed.subarray(0, IV_BYTES) },
                    key,
                    packed.subarray(IV_BYTES)
                );
            })
            .then(function (buffer) {
                return new TextDecoder().decode(buffer);
            });
    }

    /*
     * Replaces an element's placeholder content with its decrypted value.
     * An element carrying data-crypt-scheme also gets a real href, so the
     * contact details behave like ordinary links -- middle-click, "copy link
     * address" and the status bar all work, which they did not while these
     * were javascript: pseudo-URLs.
     */
    function reveal(element) {
        var cipherText = element.getAttribute("data-crypt");
        var scheme = element.getAttribute("data-crypt-scheme");
        return decrypt(cipherText).then(function (plainText) {
            element.textContent = plainText;
            if (scheme) {
                // RFC 3966 wants no whitespace in a tel: URI, while the
                // displayed number keeps its grouping spaces.
                element.href = scheme + ":" + (scheme === "tel" ? plainText.replace(/\s+/g, "") : plainText);
            }
            element.removeAttribute("data-crypt");
        });
    }

    function revealAll() {
        var elements = document.querySelectorAll("[data-crypt]");
        for (var i = 0; i < elements.length; i++) {
            reveal(elements[i]).catch(function (error) {
                console.error("mailcrypt: could not decrypt a contact detail", error);
            });
        }
    }

    root.mailcrypt = { encrypt: encrypt, decrypt: decrypt, reveal: reveal, revealAll: revealAll };

    if (typeof document === "undefined") {
        return;
    }

    if (!subtle) {
        // crypto.subtle only exists in a secure context (https, or localhost
        // during development). The placeholders in the markup stay put.
        console.warn("mailcrypt: Web Crypto is unavailable, contact details stay hidden");
    } else if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", revealAll);
    } else {
        revealAll();
    }
})(typeof globalThis !== "undefined" ? globalThis : window);

// Command-line mode, for generating the ciphertexts stored in data/config.yml.
if (typeof window === "undefined" && typeof process !== "undefined") {
    if (process.argv.length < 3) {
        console.error('Error: Call with string to encrypt as first argument!\nnode mailcrypt.js "somestring"');
        process.exitCode = 1;
    } else {
        globalThis.mailcrypt.encrypt(process.argv[2]).then(function (cipherText) {
            console.log(cipherText);
        });
    }
}
