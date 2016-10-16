/*jslint node:true,vars:true,bitwise:true,unparam:true */

/*jshint unused:true */

/*
The Local Temperature Node.js sample application distributed within Intel® XDK IoT Edition under the IoT with Node.js Projects project creation option showcases how to read analog data from a Grover Starter Kit Plus – IoT Intel® Edition Temperature Sensor, start a web server and communicate wirelessly using WebSockets.

MRAA - Low Level Skeleton Library for Communication on GNU/Linux platforms
Library in C/C++ to interface with Galileo & other Intel platforms, in a structured and sane API with port nanmes/numbering that match boards & with bindings to javascript & python.

Steps for installing MRAA & UPM Library on Intel IoT Platform with IoTDevKit Linux* image
Using a ssh client: 
1. echo "src maa-upm http://iotdk.intel.com/repos/1.1/intelgalactic" > /etc/opkg/intel-iotdk.conf
2. opkg update
3. opkg upgrade

Article: https://software.intel.com/en-us/html5/articles/iot-local-temperature-nodejs-and-html5-samples
*/


function updateSrv(temp, lightOn){

var http = require("http");
var options = {
  hostname: '10.33.77.138',
  port: 3000,
  path: /Room1/,
  method: 'PUT',
  headers: {
      'Content-Type': 'application/json',
  }
};


    
var req = http.request(options, function(res) {
  console.log('Status: ' + res.statusCode);
  console.log('Headers: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (body) {
    console.log('Body: ' + body);
  });
});
req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
// write data to request body

//if(resPath == "/Room1/"){
//
//    req.write(JSON.stringify({ time: (date = new Date()), value: resValue }));
    
    
//}else
    
    
        
        req.write(JSON.stringify({ status: { id: 1, msg: 'OK' },
  temperature: { value: temp },
  temperature_History: [],
  light: { value: lightOn } }));

 
   
 req.end();
}

var B = 3975;
var mraa = require("mraa");
var isLightOn;
var currentTemp;

//GROVE Kit A0 Connector --> Aio(0)
var myAnalogPin = new mraa.Aio(0);
console.log("Good Grief");
/*
Function: startSensorWatch(socket)
Parameters: socket - client communication channel
Description: Read Temperature Sensor and send temperature in degrees of Fahrenheit every 4 seconds
*/
function startSensorWatch(socket) {
    'use strict';
    setInterval(function () {
        var a = myAnalogPin.read(); 
        console.log("Analog Pin (A0) Output: " + a);
        //console.log("Checking....");
        
        var resistance = (1023 - a) * 10000 / a; //get the resistance of the sensor;
        //console.log("Resistance: "+resistance);
        var celsius_temperature = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15;//convert to temperature via datasheet ;
        //console.log("Celsius Temperature "+celsius_temperature); 
        var fahrenheit_temperature = (celsius_temperature * (9 / 5)) + 32;
        currentTemp = fahrenheit_temperature;
        console.log("Fahrenheit Temperature: " + fahrenheit_temperature);
        socket.emit("message", fahrenheit_temperature);
    }, 4000);
}

setInterval(function readTemperature(){
console.log("Sample Reading Grove Kit Temperature Sensor");
var a = myAnalogPin.read(); 
        console.log("Analog Pin (A0) Output: " + a);
        //console.log("Checking....");
        
        var resistance = (1023 - a) * 10000 / a; //get the resistance of the sensor;
        //console.log("Resistance: "+resistance);
        var celsius_temperature = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15;//convert to temperature via datasheet ;
        //console.log("Celsius Temperature "+celsius_temperature); 
        var fahrenheit_temperature = (celsius_temperature * (9 / 5)) + 32;
        console.log("Fahrenheit Temperature: " + fahrenheit_temperature);
        currentTemp = fahrenheit_temperature;
    
        updateSrv(currentTemp, isLightOn);
    
       
}, 30000)



// Load Grove module
var groveSensor = require('jsupm_grove');

// Create the light sensor object using AIO pin 0
var light = new groveSensor.GroveLight(2);

// Read the input and print both the raw value and a rough lux value,
// waiting one second between readings
function readLightSensorValue() {
    
    
   if (light.value() >=20) {
	isLightOn = true;
   updateSrv(currentTemp, isLightOn);
       //console.log("On");
   }
  else{
	isLightOn = false;
       updateSrv(currentTemp, isLightOn);
      //console.log("Off");
}

}
setInterval(readLightSensorValue, 10000);

readLightSensorValue();



//Create Socket.io server
var http = require('http');
var app = http.createServer(function (req, res) {
    'use strict';
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('<h1>Hello world from Intel IoT platform!</h1>');
}).listen(1337);
var io = require('socket.io')(app);

//Attach a 'connection' event handler to the server
io.on('connection', function (socket) {
    'use strict';
    console.log('a user connected');
    //Emits an event along with a message
    socket.emit('connected', 'Welcome');

    //Start watching Sensors connected to Galileo board
    startSensorWatch(socket);

    //Attach a 'disconnect' event handler to the socket
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

