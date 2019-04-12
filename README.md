# my-signal
Signal Proof of Concept

# Description
A Signal Proof of Concept for:
* Plot an example temporal serial
* Plot the derivate of an example temporal serial
* Plot the integration of an example temporal serial
* Plot the FFT of an example temporal serial

# Javascript Dependencies
* Loopback: Backend Framework
* dsp.js 1.0.1: FFT Transform
* Jquery 3.3.1: JQuery library
* AngularJS 1.7.8: Angular Framework
* Dygraphs 2.1.0: Graphication
* Angular Dygraphs 1.1.6: Angular directives Graphication

# Python 2.7 Dependencies
* numpy 1.14.6: Gradient temporal series
* scipy 1.1.0: Integrate temporal series
* cython 0.29.6
* acoustics 0.1.2

# Generate Loopback AngularJS services
```lb-ng ./server/server.js ./client/app/js/lb-services.js```