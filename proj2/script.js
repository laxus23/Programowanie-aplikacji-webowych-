var Drumkit = /** @class */ (function () {
    function Drumkit() {
        var _this = this;
        this.sounds = [];
        document.querySelectorAll('audio').forEach(function (el) {
            _this.sounds.push(el);
        });
        console.log(this.sounds);
        new DrumkitUI(this.sounds);
    }
    return Drumkit;
}());
var DrumkitUI = /** @class */ (function () {
    function DrumkitUI(sounds) {
        var _this = this;
        this.statsSection = document.getElementById('UI-section');
        this.channels = [[]];
        this.sounds = [];
        this.soundButtons = [];
        this.channelsDOMElements = [];
        this.activeChannel = null;
        // Sound mapping into class variable
        // Create event listener
        this.sounds = sounds.map(function (element) { return ({
            element: element,
            key: element.dataset.key
        }); });
        document.body.addEventListener('keypress', function (ev) { return _this.onKeyDown(ev); });
        this.renderButtons(sounds);
        this.createChannels();
    }
    // Define what happend on holding key down
    DrumkitUI.prototype.onKeyDown = function (ev) {
        var key = ev.key;
        var time = ev.timeStamp;
        if (this.activeChannel !== null) {
            this.channels[this.activeChannel].push({
                key: key,
                time: time
            });
        }
        console.log(this.channels);
        this.playSound(key);
    };
    DrumkitUI.prototype.renderButtons = function (sounds) {
        var _this = this;
        var container = document.getElementById('buttons');
        // Create buttons in DOM
        sounds.forEach(function (element) {
            var soundBtn = document.createElement('button');
            soundBtn.innerText = "" + element.dataset.key;
            // Assign each button a key
            soundBtn.dataset.soundKey = element.dataset.key;
            // Separate each event for each button.
            soundBtn.addEventListener('click', function (ev) { return _this.onClick(element.dataset.key, ev); });
            // Save the button similar to the sound elements in the class.
            _this.soundButtons.push(soundBtn);
            container.appendChild(soundBtn);
        });
    };
    // Define what happend on click
    DrumkitUI.prototype.onClick = function (key, ev) {
        var time = ev.timeStamp;
        if (this.activeChannel !== null) {
            this.channels[this.activeChannel].push({
                key: key,
                time: time
            });
        }
        this.playSound(key);
    };
    DrumkitUI.prototype.playSound = function (key) {
        if (key === void 0) { key = null; }
        // Do not play sound where there is none
        if (key) {
            var btn = this.soundButtons.find(function (el) { return el.dataset.soundKey === key; });
            var element = this.sounds.find(function (v) { return v.key === key; }).element;
            element.currentTime = 0;
            element.play();
        }
    };
    DrumkitUI.prototype.createChannels = function () {
        var _this = this;
        var container = document.getElementById('channels');
        var _loop_1 = function (i) {
            var channelContainer = document.createElement('div');
            channelContainer.classList.add("channelContainer");
            // Record buttons
            var recordBtn = document.createElement('button');
            recordBtn.className = "recordBtn";
            recordBtn.addEventListener('click', function (ev) { return _this.activateChannel(i, ev); });
            channelContainer.appendChild(recordBtn);
            // Play buttons
            var playBtn = document.createElement('button');
            playBtn.className = "playBtn";
            playBtn.disabled = true;
            var s = playBtn.addEventListener('click', function (ev) { return _this.onPlayStopChannel(i); });
            channelContainer.appendChild(playBtn);
            // Record progress bar 
            var progressBarContainer = document.createElement('div');
            progressBarContainer.className = "progressBar";
            var progressBar = document.createElement('span');
            progressBar.addEventListener('animationend', function () {
                progressBar.style.animation = null;
                _this.channelsDOMElements[i].playBtn.disabled = false;
            });
            progressBarContainer.appendChild(progressBar);
            channelContainer.appendChild(progressBarContainer);
            this_1.channelsDOMElements.push({
                playBtn: playBtn,
                recordBtn: recordBtn,
                progressBar: progressBar
            });
            container.appendChild(channelContainer);
        };
        var this_1 = this;
        for (var i = 0; i < 1; i++) {
            _loop_1(i);
        }
    };
    DrumkitUI.prototype.activateChannel = function (channelIndex, event) {
        // The click event control recording time
        this.channels[channelIndex] = [{
                time: event.timeStamp,
                key: null
            }];
        this.activeChannel = channelIndex;
        this.channelsDOMElements.forEach(function (el) {
            el.recordBtn.disabled = true;
        });
        this.channelsDOMElements[channelIndex].playBtn.disabled = false;
        this.channelsDOMElements[channelIndex].playBtn.classList.add('stopBtn');
    };
    DrumkitUI.prototype.onPlayStopChannel = function (channelIndex) {
        var _this = this;
        if (this.activeChannel === channelIndex) {
            this.stopRecording(channelIndex);
        }
        else {
            // Play the sounds
            var channel = this.channels[channelIndex];
            var prevTime_1 = channel[0].time;
            this.initPlayingBehavior(channelIndex);
            channel.forEach(function (sound) {
                var time = sound.time - prevTime_1;
                setTimeout(function () {
                    _this.playSound(sound.key);
                }, time);
            });
        }
    };
    DrumkitUI.prototype.stopRecording = function (channelIndex) {
        var _this = this;
        this.channelsDOMElements[channelIndex].playBtn.classList.remove('stopBtn');
        var channel = this.channels[channelIndex];
        var recordingTime = channel[channel.length - 1].time - channel[0].time;
        this.channelsDOMElements[channelIndex].progressBar.parentElement.querySelectorAll('time').forEach(function (v) { return v.remove(); });
        this.channelsDOMElements.forEach(function (el) {
            el.recordBtn.disabled = false;
        });
        if (recordingTime) {
            channel.forEach(function (sound) {
                var timeMoment = document.createElement('time');
                var percentageTime = (sound.time - channel[0].time) / recordingTime * 100;
                console.log(percentageTime);
                timeMoment.className = "timeMoment";
                timeMoment.style.left = percentageTime + "%";
                _this.channelsDOMElements[channelIndex].progressBar.parentElement.appendChild(timeMoment);
            });
        }
        else {
            this.channelsDOMElements[channelIndex].playBtn.disabled = true;
        }
        this.activeChannel = null;
    };
    DrumkitUI.prototype.initPlayingBehavior = function (channelIndex) {
        this.channelsDOMElements[channelIndex].playBtn.disabled = true;
        // Create animation for the progress bar
        var channel = this.channels[channelIndex];
        var prevTime = channel[0].time;
        var recordingTime = (channel[channel.length - 1].time - prevTime).toFixed() + "ms";
        this.channelsDOMElements[channelIndex].progressBar.style.animation = "progressBarAnim " + recordingTime + " forwards linear";
    };
    return DrumkitUI;
}());
var drumkit = new Drumkit();
