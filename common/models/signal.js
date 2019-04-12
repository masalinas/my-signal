'use strict';

var fs = require('fs');
var DSP = require('dsp.js/dsp.js');
var exec = require('child_process').exec;
var path = require('path');

module.exports = function(Signal) {
    Signal.eventmoc = function(cb) {
        var event = path.resolve(__dirname, '../../events/19092057.txt');

        fs.readFile(event, 'utf8', (err, result) => {
            if (err) return cb(err);
            
            var signal = {t: [],
                          x: [],
                          y: [],
                          z: []};

            result.split(/\r?\n/).forEach(function(line) {
                if (!line.includes("#")) {
                    var data = line.split(' ');
                    
                    signal.t.push(parseFloat(data[0]));
                    signal.x.push(parseFloat(data[1]));
                    signal.y.push(parseFloat(data[2]));
                    signal.z.push(parseFloat(data[3]));
                }
            });

            cb(null, signal);        
        });
    };   

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

    Signal.octave = function(data, cb) {
        Signal.fft(data, function (err, result) {
            if (err) return cb(err);

            var signal = [];
            for (var j = 0; j < result.length; j++) {            
                signal.push(result[j]['1']);
            }

            var command = 'python ' + path.resolve(__dirname, '../../python/octave.py ') + JSON.stringify(signal);

            exec(command, (err, stdout, stderr) => {
                if (err) return cb(err);

                cb(null, JSON.parse(stdout));        
            });
        });
    }

    Signal.remoteMethod(
        'eventmoc',
        {
            description: 'Event MOC',
            returns: {arg: 'result', type: 'object', root: true},
            http: {verb: 'post',  path: '/eventmoc'}
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
        'octave',
        {
            description: 'Octave Domain',
            accepts: {arg: 'data', type: 'object', description: 'Octave Data', required: true, http: {source: 'body'}},
            returns: {arg: 'result', type: 'array', root: true},
            http: {verb: 'post',  path: '/octave'}
        }
    );
};
