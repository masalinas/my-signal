'use strict';

var DSP = require('dsp.js/dsp.js');
var exec = require('child_process').exec;
var path = require('path');

module.exports = function(Signal) {
    Signal.gradient = function(data, cb) {   
        var command = 'python ' + path.resolve(__dirname, '../../python/gradient.py ') + JSON.stringify(data.signal.y);

        exec(command, (err, stdout, stderr) => {
            if (err) return cb(err);

            cb(null, JSON.parse(stdout));        
        });
    }

    Signal.integration = function(data, cb) {        
        var command = 'python ' + path.resolve(__dirname, '../../python/integration.py ') + JSON.stringify(data.signal.x) + ' ' + JSON.stringify(data.signal.y);

        exec(command, (err, stdout, stderr) => {
            if (err) return cb(err);

            cb(null, JSON.parse(stdout));        
        });
    }

    Signal.fft = function(data, cb) {
        //console.log(data.signal.x.toString());
        //console.log(data.signal.x.toString());

        var signal = [];

        var fft = new DSP.FFT(data.bufferSize, data.samplingRate);
        fft.forward(data.signal.y);
        var spectrum = fft.spectrum;

        var frequencyIncrement = parseFloat(data.samplingRate)/2/spectrum.length;

        for (var j = 0; j < spectrum.length; j++) {
            signal.push([frequencyIncrement*j, spectrum[j]]);    
        }

        return cb(null, signal);
    }

    Signal.remoteMethod(
        'fft',
        {
            description: 'FFT Domain',
            accepts: {arg: 'data', type: 'object', description: 'FFT Data', required: true, http: {source: 'body'}},
            returns: {arg: 'result', type: 'array', root: true},
            http: {verb: 'post',  path: '/fft'}
        }
    );

    Signal.remoteMethod(
        'gradient',
        {
            description: 'Signal Gradient',
            accepts: {arg: 'data', type: 'object', description: 'Gradient Data', required: true, http: {source: 'body'}},
            returns: {arg: 'result', type: 'array', root: true},
            http: {verb: 'post',  path: '/gradient'}
        }
    );    

    Signal.remoteMethod(
        'integration',
        {
            description: 'Signal Integration',
            accepts: {arg: 'data', type: 'object', description: 'Integration Data', required: true, http: {source: 'body'}},
            returns: {arg: 'result', type: 'array', root: true},
            http: {verb: 'post',  path: '/integration'}
        }
    );     
};
