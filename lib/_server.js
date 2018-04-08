"use strict";


const WebSocketServer = require('ws').Server;
const Splitter        = require('stream-split');
const merge           = require('mout/object/merge');

const NALseparator    = new Buffer([0,0,0,1]);//NAL break



/*Sensor stuff*/
var i2c = require('i2c-bus');
var i2c2 = i2c.openSync(1);
var Promise = require('promise');
var now = require('performance-now');
var MS5803 = require('ms5803_rpi');
var MS5803 = require('ms5803_rpi');
var sensor = new MS5803({address: 0x76, device: '/dev/i2c-1'});
var PythonShell = require('python-shell');
var AHRS = require('ahrs');


var arduinoThrusters_ADDR = 0x08;
var arduinoThrusters_REG = 0x00;
var arduinoThrusters_DATA_LENGTH = 0x08;
var buf0 = new Buffer(0x00);

/*_Server Stuff*/
class _Server {

  constructor(server, options) {

    this.options = merge({
        width : 960,
        height: 540,

    }, options);

    this.wss = new WebSocketServer({ server });

    this.new_client = this.new_client.bind(this);
    this.start_feed = this.start_feed.bind(this);
    this.broadcast  = this.broadcast.bind(this);

    this.wss.on('connection', this.new_client);

    this.ws.send('Sensor:' + Sensor-Val);
  }


  start_feed() {
    var readStream = this.get_feed();
    this.readStream = readStream;

    readStream = readStream.pipe(new Splitter(NALseparator));
    readStream.on("data", this.broadcast);
  }

  get_feed() {
    throw new Error("to be implemented");
  }

  broadcast(data) {
    this.wss.clients.forEach(function(socket) {

      if(socket.buzy)
        return;

      socket.buzy = true;
      socket.buzy = false;

      socket.send(Buffer.concat([NALseparator, data]), { binary: true}, function ack(error) {
        socket.buzy = false;
      });
    });
  }

  new_client(socket) {

    var self = this;
    console.log('New guy');

    socket.send(JSON.stringify({
      action : "init",
      width  : this.options.width,
      height : this.options.height,
    }));

    socket.on("message", function(data){
      var cmd = "" + data, action = data.split(' ')[0];
      console.log("Incomming action '%s'", action);
/*Controller Catch*/
if(action == "buttonB")
console.log("i2c calls here");
if(action == "buttonA")
console.log("i2c calls here");
if(action == "buttonX")
console.log("i2c calls here");
if(action == "buttonY")
console.log("i2c calls here");
if(action == "buttonX")
console.log("i2c calls here");
if(action == "buttonRTH")
console.log("i2c calls here");
if(action == "buttonLTH")
console.log("i2c calls here");
if(action == "buttonRB")
console.log("i2c calls here");
if(action == "buttonLB")
console.log("i2c calls here");
if(action == "buttonLT")
console.log("i2c calls here");
if(action == "buttonRT")
console.log("i2c calls here");
if(action == "buttonStart")
console.log("i2c calls here");
if(action == "buttonBack")
console.log("i2c calls here");
if(action == "buttonDL")
console.log("i2c calls here");
if(action == "buttonDR")
console.log("i2c calls here");
if(action == "buttonDU")
console.log("i2c calls here");
if(action == "buttonDD")
console.log("i2c calls here");
if(action == "buttonRTH")
console.log("i2c calls here");
/*Controller Catch*/
      if(action == "REQUESTSTREAM")
        self.start_feed();
      if(action == "STOPSTREAM")
        self.readStream.pause();
    });

    socket.on('close', function() {
      self.readStream.end();
      console.log('stopping client interval');
    });
  }

};






var madgwick = new AHRS({

    /*
     * The sample interval, in Hz.
     */
    sampleInterval: 1,

    /*
     * Choose from the `Madgwick` or `Mahony` filter.
     */
    algorithm: 'Madgwick',

    /*
     * The filter noise value, smaller values have
     * smoother estimates, but have higher latency.
     * This only works for the `Madgwick` filter.
     */
    beta: 0.4,

    /*
     * The filter noise values for the `Mahony` filter.
     */
    kp: 0.5,
    ki: 0
});

var totalRun = 0;

var lastTime = now(); // milliseconds
var orientation = {
	pitch:0.0,
	roll:0.0
};

var interval = setInterval(function() {
	totalRun++;
//commenting for test	console.log("Run: ",totalRun,"\n\n");

sensor.read(function (data) {
  // data is { pressure: 1013.0 , temp: 68.9 }
  //wss.on('connection', function(ws) {
    //ws.on('message', function(Sensor-val){
      //console.log('recieved: %s', Sensor-val);
      ws.send("data");
    //});
  //});
//Once sensor is installed this should be able to read the data to console
  // console.log(data);
});

//Adafruit 9DOF GYRO/ACCEL/MAG
	var promises = [];

	promises.push(lsm303PY(), l3gd20PY());

	Promise.all(promises).then(data => {

		var accel = data[0].slice(0,3);
		var mag = data[0].slice(3,6);
		var gyro = data[1];

		//console.log("accel: ", accel, "\nmag: ", mag, "\ngyro: ", gyro);
		var deltaT = (now() - lastTime) * 0.001;
	//commenting for test	console.log("Time in seconds: ", deltaT);
		lastTime = now();
                madgwick.update(gyro[0], gyro[1], gyro[2], accel[0], accel[1], accel[2], [ mag[0], mag[1], mag[2], deltaT ]);

		//compFilter(data[0],data[1]);
	}).then( nodata => {
		var angles = madgwick.getEulerAngles();
		console.log(angles);
		//for (var key in angles) { console.log( angles[key] * 57.295779513) ; }
	});

}, 5000);//ms


// Sensitivity = -2 to 2 G at 16Bit -> 2G = 32768 && 0.5G = 8192
// we are functioning at 10 bit mode... fix this in the sensitivity
var GYROSCOPE_SENSITIVITY = 65.536;
var dt = 0.1; // 100ms sample rate

function compFilter(accData, gyrData) {
	var pitchAcc, rollAcc;
	//console.log("Accel: ",accData);
	//console.log("Gyro: ",gyrData);
	console.log("Pitch: ",orientation.pitch,", Roll: ",orientation.roll)
	//return;

	var pitchAcc, rollAcc;

	// update dt to match our time units
	dt = (now() - lastTime)/100;
	lastTime = now();

	// establish new angle around x and y axes //
	orientation.pitch += (gyrData[0] / GYROSCOPE_SENSITIVITY) * dt;
	orientation.roll  += (gyrData[1] / GYROSCOPE_SENSITIVITY) * dt;

	// compensate for drift using accelerometer data,
	// if that data is not obviously faulty (think a minor correction)
	var forceMagnitudeApprox = abs(accData[0]) + abs(accData[1]) + abs(accData[2]);

	// is our data !bullshit?
	// Sensitivity = -2 to 2 G at 16Bit -> 2G = 32768 && 0.5G = 8192
	if (forceMagnitudeApprox > 8192 && forceMagnitudeApprox < 32768) {
		// turning about the x ax results in a vec on the y ax
		pitchAcc = atan2(accData[1], accData[2]) * 180 / PI;
		orientation.pitch = orientation.pitch * 0.98 + pitchAcc * 0.02;

		// turning about the y ax results in a vec on the x ax
		rollAcc = atan2(accData[0], accData[2]) * 180 / PI;
		orientation.roll = orientation.roll * 0.98 + rollAcc * 0.02;
	}
}

var LSMopts = {
  mode: 'text',
  pythonPath: '/usr/bin/python',
  pythonOptions: ['-u'],
  scriptPath: '.',
  args: []
};

var L3Gopts = {
  mode: 'text',
  pythonPath: '/usr/bin/python',
  pythonOptions: ['-u'],
  scriptPath: '.',
  args: []
};

function lsm303PY(){
	return new Promise(function(resolve, reject) {
		var data = PythonShell.run('./LSM303-low-res.py', LSMopts, function (err, results) {
			// received a message sent from the Python script (a simple "print" statement)
			//console.log("Accel: ",results);

			/* Convert m/ss to g's */
			for (var i = 0 ; i < 3; i++) { results[i] = (results[i] / 100.0) * 0.101972;}

			if (err) reject("LSM303 did not return data");
			resolve(results);
		});
	});
}

function l3gd20PY() {
	return new Promise (function(resolve, reject) {
		PythonShell.run('./L3GD20.py', L3Gopts, function (err, results) {
			// received a message sent from the Python script (a simple "print" statement)
			//console.log("Gyro: ",results);

                        /* Convert deg/s to rads/s */
                        for (var i = 0 ; i < 3; i++) { results[i] = (results[i]  * 0.017453293 );}

			if (err) reject("L3GD20 did not return data");
			resolve(results);
		});
	});
}

/*------------------------Controller i2c write*/
function map_range(value, low1, high1, low2, high2) {
    return Math.round(low2 + (high2 - low2) * (value - low1) / (high1 - low1));
}
var fromLow = -1;
var fromHigh = 1;
var toLow = 0;
var toHigh = 255;

const arr = new Uint8Array(arduinoThrusters_DATA_LENGTH);
const sticks = new Array(4); // L/LR, L/UD, R/LR, R/UD

function sendThrust(power) {

	buf0 = Buffer.from(arr.buffer);
	i2c2.i2cWriteSync(arduinoThrusters_ADDR, arduinoThrusters_DATA_LENGTH, buf0);
	while(i2c2.i2cReadSync(arduinoThrusters_ADDR, arduinoThrusters_DATA_LENGTH, buf0) === 0){}
	console.log("ALL DONE THRUSTING!!!");
}

function updateStick(stickNum, power) {
	power = map_range(power,fromLow,fromHigh,toLow,toHigh);
	sticks[stickNum] = power;
	console.log(sticks);
	sendThrust(power);
}



module.exports = _Server;
