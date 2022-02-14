// Declare the pbkdf2 library
var crypto = require('pbkdf2');
// Declare the settings variable
const settings = require("./settings.json"); 
// Helper function to determine if the string has a character
function HasChar(input, n){ return input.includes(n); }
// Helper function to return a clean url without ?
function SplitShiftChar(input, n){ return input.split(n).shift(); }
// Return the Password as an encrypted hash
function pbkdf2(username, password, passwordSalt, iterations, length) {
    var salt = passwordSalt + username;    
    var iv = crypto.pbkdf2Sync(password, salt, iterations, length, settings.cryptography.encryption);
    var hash = iv.toString('hex').toUpperCase().substring(0, length);
    return hash;
}
module.exports = { //Return the functions.
    HasChar: HasChar,
    pbkdf2: pbkdf2,
    SplitShiftChar: SplitShiftChar
};  