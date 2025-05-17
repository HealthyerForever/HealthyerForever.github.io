let star = document.querySelectorAll('.star');

document.addEventListener('mousemove', function(e) {
    let x =  0.067 * e.pageX;
    let y = 0.117 * e.pageY;
    star[0].style.left = 10 + 0.026 * x + 'vw';
    star[0].style.top = 10 + 0.015 *  y + 'vh';

    star[1].style.left = 85 - 0.012 * x + 'vw';
    star[1].style.top = 6 + 0.013 *  y + 'vh';

    star[2].style.left = 18 + 0.03 * x + 'vw';
    star[2].style.top = 70 - 0.018 *  y + 'vh';

    star[3].style.left = 76 - 0.01 * x + 'vw';
    star[3].style.top = 65 - 0.01 *  y + 'vh';
})