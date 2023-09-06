const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

var progressBar = $(".progress-bar");
var progress = $(".progress");

var progressBarWidth = progressBar.clientWidth;
var progressDot = $("span");
var isDrag = false;
var initialClientX = 0;
var initialRate = 0;
var rate = 0;
var hanldeChange = function (value) {
    console.log(value);
};
var audio = $(".audio");

var currentTimeElement = progressBar.previousElementSibling;
var durationTimeElement = progressBar.nextElementSibling;

var playBtn = $(".play-btn");
var playIcon = `<i class="fa-solid fa-play"></i>`;
var pauseIcon = `<i class="fa-solid fa-pause"></i>`;
var getTime = function (seconds) {
    var mins = Math.floor(seconds / 60);
    var sec = Math.floor(seconds - mins * 60);
    if (mins > 10 || sec < 10) {
        return `0${mins}:0${sec}`;
    }
    return `${mins}:${sec}`;
};
progressBar.addEventListener("mousedown", function (e) {
    //   Tinh ti le phan tram giua vi tri click voi chieu rong
    if (e.which === 1) {
        var rate = (e.offsetX * 100) / progressBarWidth;
        progress.style.width = `${rate}%`;
        initialRate = rate; // vị trị khi click
        isDrag = true;
        initialClientX = e.clientX;
        var currentTime = (audio.duration * rate) / 100;
        currentTimeElement.innerHTML = getTime(currentTime);
        audio.currentTime = currentTime;
    }
});
progressDot.addEventListener("mousedown", function (e) {
    e.stopPropagation(); // xu ly tình trạng nổi bọt của span
    isDrag = true;
    initialClientX = e.clientX;
});

document.addEventListener("mousemove", function (e) {
    if (isDrag) {
        var space = e.clientX - initialClientX;
        rate = (space * 100) / progressBarWidth + initialRate;
        if (rate >= 0 && rate <= 100) {
            progress.style.width = `${rate}%`;
        }
    }
});
document.addEventListener("mouseup", function () {
    isDrag = false;
    initialRate = rate;
    var currentTime = (audio.duration * rate) / 100;
    currentTimeElement.innerText = getTime(currentTime);
    audio.currentTime = currentTime;
});

/*
    Khi bấm chuột  vào chấm :
        lấy ra vị trí clientX
    Khi kéo chuột :
        lấy clientX theo vị trí
        tính khoảng cách kéo : clientX mới - clientX ban đầu
*/

audio.addEventListener("loadeddata", function () {
    // dinh dang ve so phut gay
    durationTimeElement.innerText = getTime(audio.duration);
});

playBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (audio.paused) {
        audio.play();
        this.innerHTML = pauseIcon;
    } else {
        audio.pause();
        this.innerHTML = playIcon;
    }
});

audio.addEventListener("timeupdate", function () {
    if (!isDrag) {
        currentTimeElement.innerHTML = getTime(this.currentTime);

        // Tinh ty le phan tram
        var rate = (this.currentTime / this.duration) * 100;
        // Update vao timer
        progress.style.width = `${rate}%`;
    }
});

var timer = $(".timer");
progressBar.addEventListener("mousemove", function (e) {
    timer.style.display = "block";
    timer.style.left = `${e.offsetX}px`;
    var rate = (e.offsetX * 100) / this.clientWidth;
    var currentTime = (audio.duration * rate) / 100;
    timer.innerText = getTime(currentTime);
});
progressBar.addEventListener("mouseout", function () {
    timer.style.display = "none";
});

audio.addEventListener("ended", function () {
    rate = 0;
    audio.currentTime = 0;
    progress.style.width = 0;
    playBtn.innerHTML = playIcon;
});
