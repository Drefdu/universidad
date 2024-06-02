const expect = require('chai').expect;
const validator = require(".");

const validSupported =
[
    "single-character-in-sld@x.org",
	"local@dash-in-sld.com",
	"letters-in-sld@123.com",
	"one-letter-sld@x.org",
	"test@test--1.com",
	"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@letters-in-local.org",
	"01234567890@numbers-in-local.net",
	"&'*+-./=?^_{}~@other-valid-characters-in-local.net",
	"mixed-1234-in-{+^}-local@sld.net",
	"a@single-character-in-local.org",
	"one-character-third-level@a.example.com",
	"uncommon-tld@sld.museum",
	"uncommon-tld@sld.travel",
	"uncommon-tld@sld.mobi",
	"country-code-tld@sld.uk",
	"country-code-tld@sld.rw",
	"local@sld.newTLD",
	"backticks`are`legit@test.com"
];

const validUnsupported =
[
    "\"escaped\\\"quote\"@sld.com",
	"\"back\\slash\"@sld.com",
	"punycode-numbers-in-tld@sld.xn--3e0b707e",
	"\"quoted\"@sld.com",
	"\"\\e\\s\\c\\a\\p\\e\\d\"@sld.com",
	"\"quoted-at-sign@sld.org\"@sld.com"
	
];

const invalidSupported =
[
	"@missing-local.org",
	"! #$%`|@invalid-characters-in-local.org",
	"(),:;`|@more-invalid-characters-in-local.org",
	"<>@[]\\`|@even-more-invalid-characters-in-local.org",
	".local-starts-with-dot@sld.com",
	"local-ends-with-dot.@sld.com",
	"two..consecutive-dots@sld.com",
	"partially.\"quoted\"@sld.com",
	"missing-sld@.com",
	"sld-starts-with-dashsh@-sld.com",
	"sld-ends-with-dash@sld-.com",
	"invalid-characters-in-sld@! \"#$%(),/;<>_[]`|.org",
	"missing-dot-before-tld@com",
	"missing-tld@sld.",
	"invalid",
	"missing-at-sign.net",
	"unbracketed-IP@127.0.0.1",
	"invalid-ip@127.0.0.1.26",
	"another-invalid-ip@127.0.0.256",
	"IP-and-port@127.0.0.1:25",
	"trailing-dots@test.de.",
	"dot-on-dot-in-domainname@te..st.de",
	"dot-first-in-domain@.test.de",
	"mg@ns.i"
];

describe('TESTING EMAILS AGAINST OUR NODE EMAIL VALIDATOR', () => {
	it('Should Be Valid', () => {
         validSupported.forEach( email => {
         	expect(validator.is_email_valid(email)).to.equal(true);
         });
	});

	it('Should Be Invalid', () => {
         invalidSupported.forEach( email => {
         	expect(validator.is_email_valid(email)).to.equal(false); 
         });
	});

	it('Should Be Invalid(UnSupported)', () => {
         validUnsupported.forEach( email => {
         	expect(validator.is_email_valid(email)).to.equal(false);
         });
	});
});
