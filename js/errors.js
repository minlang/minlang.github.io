/***
Errors.

***/


function NotImplementedError(message) {
    this.name = 'NotImplementedError';
    this.message = (message || '');
}

NotImplementedError.prototype = Error.prototype;


function ArgumentError(message) {
    this.name = 'ArgumentError';
    this.message = (message || '');
}

ArgumentError.prototype = Error.prototype;
