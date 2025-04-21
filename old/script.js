// 背景图片
const backgroundImages = [
    'assets/background/background1.png',
    'assets/background/background2.png',
    'assets/background/background3.png',
    'assets/background/background4.png',
    'assets/background/background5.png',
    'assets/background/background6.png',
    'assets/background/background7.png',
    'assets/background/background8.png',
    'assets/background/background9.png',

];

// 开屏动画的文字
const splashMessages = [
    { text: "所谓开拓，就是沿着前人未尽的道路，走出更遥远的距离。", author: "姬子" },
    { text: "生命因何而沉睡，是因为人们害怕从梦中醒来", author: "星期日" },
    { text: "希望在旅途的终点，每个人都能抵达向往的结局", author: "流萤" },
    { text: "失败的人生同样是人生，他们有权品尝至最后，也只有摔倒在地无人扶起的时候，愚者才能领悟如何站起", author: "真理医生" },
    { text: "寰宇方圆，星罗棋布，每一手都是抉择。而抉择，铸就命运", author: "景元" },
    { text: "说书也好，幻戏也罢，故事的结局都是注定的。人生和命运也是同样的道理，无论结局是否注定，都值得一过", author: "景元" },
    { text: "人心总是追求合理，拼拼凑凑便把不相干的东西组成了一出看起来有意义的幻戏故事，取名人生", author: "符玄" },
    { text: "所谓不可能之事，只是尚未到来之事", author: "黄泉" },
    { text: "当最后的鸟儿终于飞上天际，却看到光芒的尽头并非太阳，而是漆黑的大日，那我们究竟是为了什么，才要向光而行", author: "黄泉" },
    { text: "我的过去，或许不在从前，而是在我的未来里。所以，我一定会一站一站的走下去，哪怕有一天，没有列车", author: "三月七" },
    { text: "人们并非只有“齐唱”一种选择，即便发出各异的声音，它们也能彼此串联", author: "知更鸟" },
    { text: "鸟儿，生来就属于天空", author: "知更鸟" },
    { text: "如果夜空中总有什么要亮起，那么在第一颗星星落下后，还会有无数的流星划过天际", author: "丹恒" },
    { text: "生命是一座迂回的迷宫，除了记忆，我们一无所有", author: "？？？" },

];

// 页面加载完成后显示开屏动画
window.onload = function() {
    const splashscreen = document.getElementById("splashscreen");
    const overlay = document.querySelector(".overlay");
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    const selectedImage = backgroundImages[randomIndex];

    // 设置背景图像
    document.body.style.backgroundImage = `url(${selectedImage})`;
    document.body.style.backgroundSize = 'cover'; // 使背景图像覆盖整个屏幕
    document.body.style.backgroundPosition = 'center'; // 使背景图像居中

    // 随机选择开屏消息
    const { text, author } = splashMessages[Math.floor(Math.random() * splashMessages.length)];
    document.getElementById("quote-text").textContent = `${text}`;
    document.getElementById("quote-author").textContent = `—— ${author}`;
    splashscreen.classList.add("visible");

    // 分开淡出效果
    setTimeout(() => {
        fadeOutSplashText(splashscreen);
    }, 3000); // 文字淡出时间

    setTimeout(() => {
        fadeOutOverlay(overlay);
    }, 3500); // 背景淡出时间

    // 提取颜色
    extractColorFromImage(selectedImage); // 传入随机选择的背景图片
};

// 淡出开屏文字
function fadeOutSplashText(splashscreen) {
    splashscreen.classList.remove("visible");
    setTimeout(() => {
        splashscreen.style.display = "none";
    }, 1500);
}

// 淡出覆盖层
function fadeOutOverlay(overlay) {
    overlay.style.opacity = "0";
    setTimeout(() => {
        overlay.style.display = "none";
    }, 1000);
}

// 从背景图像提取主题色
function extractColorFromImage(imageSrc) {
    const img = new Image();
    img.src = imageSrc;

    img.onload = function() {
        const canvas = createCanvasForImage(img);
        const colorCount = countColorsInImage(canvas);

        // 找到出现最多的颜色，默认使用指定颜色
        const dominantColor = findDominantColor(colorCount) || '0,0,0'; // 默认黑色

        // 更新主题色
        document.documentElement.style.setProperty('--primary-color', `rgba(${dominantColor}, 0.8)`);
        document.documentElement.style.setProperty('--primary-color-hover', `rgba(${dominantColor}, 1)`);

        // 如果取到的颜色是灰色，则使用指定的颜色
        if (dominantColor === '248,248,248') { // 灰色 RGB
            document.documentElement.style.setProperty('--primary-color', 'rgba(0, 0, 0, 0.8)');
            document.documentElement.style.setProperty('--primary-color-hover', 'rgb(0, 0, 0)');
        }
    };

    img.onerror = () => {
        console.error('无法加载背景图像');
        // 加载失败时使用指定颜色
        document.documentElement.style.setProperty('--primary-color', 'rgba(0, 0, 0, 0.8)');
        document.documentElement.style.setProperty('--primary-color-hover', 'rgb(0, 0, 0)');
    };
}

// 创建用于绘制图像的canvas
function createCanvasForImage(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    return canvas;
}

// 统计图像中的颜色，优化颜色精度
function countColorsInImage(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const colorCount = {};

    for (let i = 0; i < data.length; i += 4) {
        const r = Math.floor(data[i] / 8) * 8; // 分组
        const g = Math.floor(data[i + 1] / 8) * 8; // 分组
        const b = Math.floor(data[i + 2] / 8) * 8; // 分组
        const a = data[i + 3];

        if (a > 0 && r + g + b > 0) { // 只考虑非透明像素和有效颜色
            const colorKey = `${r},${g},${b}`;
            colorCount[colorKey] = (colorCount[colorKey] || 0) + 1;
        }
    }

    return colorCount;
}

// 找到出现最多的颜色
function findDominantColor(colorCount) {
    let dominantColor = '';
    let maxCount = 0;

    for (const color in colorCount) {
        if (colorCount[color] > maxCount) {
            maxCount = colorCount[color];
            dominantColor = color;
        }
    }

    return dominantColor || ''; // 如果没有找到，返回空字符串
}

// 切换更新日志的显示状态
function toggleUpdateLog() {
    const updateLog = document.querySelector('.update-log');
    const updateLogButton = document.querySelector('.update-log-button');

    updateLogButton.disabled = true;

    if (updateLog.classList.contains('visible')) {
        hideUpdateLog(updateLog, updateLogButton);
    } else {
        showUpdateLog(updateLog, updateLogButton);
    }
}

// 显示更新日志
function showUpdateLog(updateLog, updateLogButton) {
    updateLog.style.display = "block";
    setTimeout(() => {
        updateLog.classList.add('visible');
        updateLogButton.style.backgroundColor = '#ccc';
        updateLogButton.disabled = false;
    }, 10);
}

// 隐藏更新日志
function hideUpdateLog(updateLog, updateLogButton) {
    updateLog.classList.remove('visible');
    setTimeout(() => {
        updateLog.style.display = "none";
        updateLogButton.style.backgroundColor = '';
        updateLogButton.disabled = false;
    }, 300);
}

// 点击事件监听器
window.addEventListener('click', function(event) {
    const updateLog = document.querySelector('.update-log');
    const updateLogButton = document.querySelector('.update-log-button');

    if (!updateLog.contains(event.target) && !updateLogButton.contains(event.target)) {
        hideUpdateLog(updateLog, updateLogButton);
    }
});

// 抽签逻辑
const minNumber = 1;
const maxNumber = 57;
const drawnNumbers = [];

function drawLot() {
    const button = document.querySelector("button");
    const resultElement = document.getElementById("result");

    if (drawnNumbers.length >= maxNumber - minNumber + 1) {
        alert("一节课叫了56个人？");
        return;
    }

    button.disabled = true;
    button.style.backgroundColor = "#ccc";
    resultElement.style.cssText = "display: flex; justify-content: center; align-items: center; font-size: 10em;";

    const duration = 2000;
    const startTime = Date.now();
    
    displayRandomNumber(resultElement, startTime, duration, button);
}

// 显示随机数字
function displayRandomNumber(resultElement, startTime, duration, button) {
    let finalNumber;

    function generateRandomNumber() {
        do {
            finalNumber = getRandomNumber();
        } while (drawnNumbers.includes(finalNumber));

        resultElement.innerText = finalNumber;

        if (Date.now() - startTime < duration) {
            setTimeout(generateRandomNumber, 1);
        } else {
            showFinalResult(finalNumber, resultElement, button);
        }
    }

    generateRandomNumber();
}

// 显示最终结果
function showFinalResult(finalNumber, resultElement, button) {
    drawnNumbers.push(finalNumber);
    resultElement.innerText = `${finalNumber} 号，站！`;
    button.disabled = true;

    setTimeout(() => {
        button.disabled = false;
        button.style.backgroundColor = ""; 
    }, 500);
}

// 生成指定范围内的随机数
function getRandomNumber() {
    return Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
}

// 课程表功能
function showSchedule() {
    alert("课程表功能正在开发中，敬请期待！");
}
