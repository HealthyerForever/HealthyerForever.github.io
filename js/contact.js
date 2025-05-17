let canvas; // 用于存储 canvas 元素
let animationFrameId; // 用于存储 requestAnimationFrame 的 ID

// 获取 contact 节点
const contactSection = document.getElementById('contact');

// 定义停止动画的函数
function stopContactAnimation() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId); // 停止动画
        animationFrameId = null; // 清空动画帧 ID
    }
    if (canvas) {
        canvas.remove(); // 移除 canvas 元素
        canvas = null; // 清空 canvas 变量
    }
}

// 定义启动动画的函数
function startContactAnimation() {
    // 定义常量
    const STAR_COLOR = '#f6fed8'; // 星星颜色
    const STAR_SIZE = 3; // 星星大小
    const STAR_MIN_SCALE = 0.2; // 星星最小缩放比例
    const OVERFLOW_THRESHOLD = 50; // 溢出阈值
    const STAR_COUNT = (window.innerWidth + window.innerHeight) / 10; // 星星数量

    // 创建 canvas 元素
    canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById('contact').appendChild(canvas);

    const context = canvas.getContext('2d');

    // 动态变量
    let scale = window.devicePixelRatio || 1; // 设备像素比例
    let width, height; // 画布宽度和高度
    let stars = []; // 星星数组
    let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0009 }; // 速度对象

    // 初始化
    generateStars();
    resizeCanvas();
    step();

    // 监听窗口大小变化
    window.onresize = resizeCanvas;

    // 生成星星
    function generateStars() {
        width = canvas.width;
        height = canvas.height;
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE)
            });
        }
    }

    // 调整画布大小
    function resizeCanvas() {
        scale = window.devicePixelRatio || 1;
        width = window.innerWidth * scale;
        height = window.innerHeight * scale;
        canvas.width = width;
        canvas.height = height;
        generateStars();
    }

    // 更新星星位置
    function updateStars() {
        velocity.tx *= 0.96;
        velocity.ty *= 0.96;
        velocity.x += (velocity.tx - velocity.x) * 0.8;
        velocity.y += (velocity.ty - velocity.y) * 0.8;

        stars.forEach(star => {
            star.x += velocity.x * star.z;
            star.y += velocity.y * star.z;
            star.x += (star.x - width / 2) * velocity.z * star.z;
            star.y += (star.y - height / 2) * velocity.z * star.z;
            star.z += velocity.z;

            // 检测星星是否超出屏幕范围
            if (
                star.x < -OVERFLOW_THRESHOLD ||
                star.x > width + OVERFLOW_THRESHOLD ||
                star.y < -OVERFLOW_THRESHOLD ||
                star.y > height + OVERFLOW_THRESHOLD
            ) {
                recycleStar(star); // 回收星星
            }
        });
    }

    // 回收星星并重新放置到新的位置
    function recycleStar(star) {
        // 初始化方向为 'z'（默认在屏幕中心重新生成）
        let direction = 'z';

        // 获取速度的绝对值
        let vx = Math.abs(velocity.x);
        let vy = Math.abs(velocity.y);

        // 如果速度的绝对值大于1，则根据速度的大小随机确定方向
        if (vx > 1 || vy > 1) {
            let axis;
            // 如果水平速度大于垂直速度，则根据水平速度的比例随机确定水平或垂直方向
            if (vx > vy) {
                axis = Math.random() < vx / (vx + vy) ? 'h' : 'v';
            } else {
                axis = Math.random() < vy / (vx + vy) ? 'v' : 'h';
            }

            // 根据方向确定具体的移动方向
            if (axis === 'h') {
                direction = velocity.x > 0 ? 'l' : 'r'; // 水平方向：左或右
            } else {
                direction = velocity.y > 0 ? 't' : 'b'; // 垂直方向：上或下
            }
        }

        // 随机设置星星的缩放比例
        star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);

        // 根据方向设置星星的位置
        switch (direction) {
            case 'z': // 如果方向为 'z'，则将星星放置在屏幕中心
                star.x = Math.random() * width;
                star.y = Math.random() * height;
                break;
            case 'l': // 如果方向为 'l'，则将星星放置在屏幕左侧
                star.x = -OVERFLOW_THRESHOLD;
                star.y = Math.random() * height;
                break;
            case 'r': // 如果方向为 'r'，则将星星放置在屏幕右侧
                star.x = width + OVERFLOW_THRESHOLD;
                star.y = Math.random() * height;
                break;
            case 't': // 如果方向为 't'，则将星星放置在屏幕顶部
                star.x = Math.random() * width;
                star.y = -OVERFLOW_THRESHOLD;
                break;
            case 'b': // 如果方向为 'b'，则将星星放置在屏幕底部
                star.x = Math.random() * width;
                star.y = height + OVERFLOW_THRESHOLD;
                break;
        }
    }

    // 绘制星星
    function renderStars() {
        context.clearRect(0, 0, width, height);
        stars.forEach(star => {
            context.beginPath();
            context.lineCap = 'round';
            context.lineWidth = STAR_SIZE * star.z * scale;
            context.globalAlpha = 0.5 + 0.5 * Math.random();
            context.strokeStyle = STAR_COLOR;

            const tailX = velocity.x * 2;
            const tailY = velocity.y * 2;

            context.moveTo(star.x, star.y);
            context.lineTo(star.x + tailX, star.y + tailY);
            context.stroke();
        });
    }

    // 动画的每一帧
    function step() {
        updateStars();
        renderStars();
        animationFrameId = requestAnimationFrame(step);
    }
}

// 定义 IntersectionObserver 的回调函数
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // 如果 contact 节点进入视口
            startContactAnimation();
        } else {
            // 如果 contact 节点离开视口
            stopContactAnimation();
        }
    });
};

// 创建 IntersectionObserver 实例
const observer = new IntersectionObserver(observerCallback, {
    root: null, // 使用浏览器视口作为根节点
    rootMargin: '0px', // 不设置额外的边界
    threshold: 0.1 // 当目标元素至少有 10% 可见时触发回调
});

// 开始监听 contact 节点
if (contactSection) {
    observer.observe(contactSection);
}

const contactIcons = document.querySelectorAll('.contact-icon');
const lis = document.querySelectorAll('.satellite-container li');
const qrcode = document.querySelector(".qrcode");

contactIcons.forEach((icon) => {
    icon.addEventListener('mouseover', function () {
        lis.forEach(li => li.style.animationPlayState = 'paused');
        contactIcons.forEach(contactIcon => contactIcon.style.animationPlayState = 'paused');
        const index = this.style.getPropertyValue("--i");
        qrcode.style.backgroundImage = `url("../image/code${index}.png")`;
        qrcode.style.display = "block";
    });

    icon.addEventListener('mouseout', function () {
        lis.forEach(li => li.style.animationPlayState = 'running');
        contactIcons.forEach(contactIcon => contactIcon.style.animationPlayState = 'running');
        qrcode.style.display = "none";
    });
});
