'use strict';

var assert = require('assert');
var sjcl = require('ripple-lib').sjcl;
var getKeyPair = require('ripple-lib').getKeyPair;

/*eslint max-nested-callbacks: [1, 3]*/

describe('SJCL ECDSA Canonicalization', function() {
  describe('canonicalizeSignature', function() {
    var keyPair = getKeyPair({key_type: 'secp256k1',
                              impl: 'sjcl',
                              base58: 'saESc82Vun7Ta5EJRzGJbrXb5HNYk'});

    it('should canonicalize non-canonical signatures', function() {

      var sig = '27ce1b914045ba7e8c11a2f2882cb6e0' +
                '7a19d4017513f12e3e363d71dc3fff0f' +
                'b0a0747ecc7b4ca46e45b3b32b6b2a06' +
                '6aa0249c027ef11e5bce93dab756549c';

      var rs = sjcl.codec.hex.toBits(sig);
      rs = sjcl.ecc.ecdsa.secretKey.prototype
               .canonicalizeSignature.call(keyPair.secretKey, rs);

      assert.strictEqual(sjcl.codec.hex.fromBits(rs),
        ('27ce1b914045ba7e8c11a2f2882cb6e0' +
         '7a19d4017513f12e3e363d71dc3fff0f4' +
         'f5f8b813384b35b91ba4c4cd494d5f850' +
         '0eb84aacc9af1d6403cab218dfeca5'));
    });

    it('should not touch canonical signatures', function() {
      var sig = '5c32bc2b4d34e27af9fb66eeea0f47f6' +
                 'afb3d433658af0f649ebae7b872471ab' +
                 '7d23860688aaf9d8131f84cfffa6c56b' +
                 'f9c32fd8b315b2ef9d6bcb243f7a686c';

      var rs = sjcl.codec.hex.toBits(sig);
      rs = sjcl.ecc.ecdsa.secretKey.prototype
               .canonicalizeSignature.call(keyPair.secretKey, rs);

      assert.strictEqual(sjcl.codec.hex.fromBits(rs),
          '5c32bc2b4d34e27af9fb66eeea0f47f6' +
           'afb3d433658af0f649ebae7b872471ab' +
           '7d23860688aaf9d8131f84cfffa6c56b' +
           'f9c32fd8b315b2ef9d6bcb243f7a686c');
    });
  });
});

// vim:sw=2:sts=2:ts=8:et
