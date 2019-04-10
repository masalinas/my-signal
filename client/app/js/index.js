var app = angular.module('fftApp', ['lbServices', 'angular-dygraphs']);

app.controller('fftController', ['$scope', 'Signal', function($scope, Signal) {
    // default signal test
    $scope.x = [];
    $scope.y = [];
    $scope.sam = 1000;
    $scope.fre = 14;
    $scope.buf = 1024;

    // default graph configuration
    $scope.graph = {
        data: [
        ],
        options: {
            showPopover: false            
        }
    };

    function initSignal() {
        $scope.x = [];
        $scope.y = [];

        for (i = 0 ; i<$scope.buf; i++) {
            $scope.x.push(i);
            $scope.y.push(3*Math.cos(Math.PI * 2 * i / $scope.sam * $scope.fre*2.7) + Math.sin(Math.PI * 2 * i / $scope.sam * $scope.fre));
        }

        plot($scope.y);
    }

    function gradient() {
        Signal.gradient({signal: {x: $scope.x, y: $scope.y}})
            .$promise
            .then(function(result, responseHeaders) {                                
                plot(result);
            },
            function(httpResponse) {
                var error;

                if (httpResponse.error == undefined)
                    error = httpResponse.data.error
                else
                    error = httpResponse.error
                 
                console.log('Error gradient - ' + error.status + ": " + error.message);
            });
    }

    function integration() {
        Signal.integration({signal: {x: $scope.x, y: $scope.y}})
            .$promise
            .then(function(result, responseHeaders) {                                
                plot(result);
            },
            function(httpResponse) {
                var error;

                if (httpResponse.error == undefined)
                    error = httpResponse.data.error
                else
                    error = httpResponse.error
                 
                console.log('Error integration - ' + error.status + ": " + error.message);
            });
    }

    // calculate FFT from signal, bufferSize and samplingRate
    function fft() {
        Signal.fft({signal: {x: $scope.x, y: $scope.y},
                       bufferSize: $scope.buf,
                       samplingRate: $scope.sam})
            .$promise
            .then(function(result, responseHeaders) {                                
                plotFFT(result);
            },
            function(httpResponse) {
                var error;

                if (httpResponse.error == undefined)
                    error = httpResponse.data.error
                else
                    error = httpResponse.error
                 
                console.log('Error FFT - ' + error.status + ": " + error.message);
            });
    }

    // plot signal
    function plot(plotData) {
        $scope.graph.data = [];

        for (var j = 0; j < plotData.length; j++) {
            $scope.graph.data.push([j, plotData[j]]);
        }
    }

    // plot FFT signal
    function plotFFT(plotData) {
        $scope.graph.data = [];

        for (var j = 0; j < plotData.length; j++) {            
            $scope.graph.data.push([plotData[j]['0'], plotData[j]['1']]);
        }
    }

    // configure scope functions
    $scope.initSignal = initSignal;
    $scope.fft = fft;
    $scope.gradient = gradient;
    $scope.integration = integration;

    // intialize signals
    initSignal();
}]);
