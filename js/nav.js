let nav = document.querySelectorAll(".nav li");
let transitionContainer = document.querySelector(".transition-container");
let transitionText = document.querySelector(".transition-text");
let isAnimating = false; // 添加标志变量，初始值为 false
let down = document.querySelector('.down');

function activeLink() {
    nav.forEach((item) => item.classList.remove("active"));
    this.classList.add("active");
}

function playTransition(event) {
    event.preventDefault(); // 阻止默认跳转
    setTimeout(() => {
        window.location.hash = this.querySelector("a").hash; // 跳转到目标区域
    }, 600)

    if (isAnimating) return; // 如果动画正在进行，直接返回，不执行后续代码
    isAnimating = true; // 标记动画开始

    // 触发动画
    transitionContainer.classList.add("svg-active");
    transitionText.style.animation = "strokeAnimation 3s ease-in-out forwards";

    // 动画完成后跳转
    setTimeout(() => {
        transitionContainer.classList.remove("svg-active");
        transitionText.style.animation = "none"; // 重置动画
        isAnimating = false; // 标记动画结束
    }, 2600); // 动画时长

}

nav.forEach((item) => {
    item.addEventListener("click", activeLink);
    item.addEventListener("click", playTransition);
});

down.addEventListener('click', function(e) {
    nav[1].classList.remove("active");
    nav[2].classList.add("active");
})
