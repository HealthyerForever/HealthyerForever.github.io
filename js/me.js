let clock = document.querySelector('.clock');
let addZero = (num) => {
    if (num >= 10) return num;
    else return `0${num}`;
}
let updateTime = () => {
    let now = new Date();
    let time = addZero(now.getHours()) + ":"
        + addZero(now.getMinutes()) + ":"
        + addZero(now.getSeconds());
    clock.innerHTML = time;
}
updateTime();
setInterval(updateTime, 1000);