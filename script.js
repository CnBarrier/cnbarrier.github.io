// 背景图片数组
const backgroundImages = [
    'assets/background1.png',
    'assets/background2.png',
    'assets/background3.png',
    'assets/background4.png',
];

// 开屏动画的文字
const splashMessages = [
    { text: "上课！不要讲话！", author: "赵老师" },
    { text: "好了啊！（捶桌）", author: "赵老师" },
    { text: "其他同学在演讲，给我认真听", author: "赵老师" },
    { text: "别讲了！", author: "戴老师" },
    { text: "找抽啊？", author: "戴老师" },
    { text: "你们都是天才", author: "戴老师" },
    { text: "这题谁再给我错，我抽死你", author: "戴老师" },
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

    const { text, author } = splashMessages[Math.floor(Math.random() * splashMessages.length)];
    document.getElementById("quote-text").textContent = `“${text}”`;
    document.getElementById("quote-author").textContent = `—— ${author}`;
    splashscreen.classList.add("visible");

    // 设置淡出效果
    setTimeout(() => {
        splashscreen.classList.remove("visible");
        overlay.style.opacity = "0";
        setTimeout(() => {
            splashscreen.style.display = "none";
            overlay.style.display = "none";
        }, 1000);
    }, 2000);

    // 提取颜色
    extractColorFromImage(selectedImage); // 传入随机选择的背景图片
};

// 从背景图像提取主题色
function extractColorFromImage(imageSrc) {
    const img = new Image();
    img.src = imageSrc; // 使用传入的背景图像路径

    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const colorCount = {};
        let r, g, b, a;

        // 遍历图像数据，统计颜色
        for (let i = 0; i < data.length; i += 4) {
            r = data[i];
            g = data[i + 1];
            b = data[i + 2];
            a = data[i + 3];

            if (a > 0) { // 只考虑非透明的像素
                const colorKey = `${r},${g},${b}`;
                colorCount[colorKey] = (colorCount[colorKey] || 0) + 1;
            }
        }

        // 找到出现最多的颜色
        let dominantColor = '';
        let maxCount = 0;
        for (const color in colorCount) {
            if (colorCount[color] > maxCount) {
                maxCount = colorCount[color];
                dominantColor = color;
            }
        }

        // 更新主题色
        document.documentElement.style.setProperty('--primary-color', `rgba(${dominantColor}, 0.8)`);
        document.documentElement.style.setProperty('--primary-color-hover', `rgba(${dominantColor}, 1)`);
    };

    img.onerror = function() {
        console.error('无法加载背景图像');
    };
}

// K-means 算法实现
function kMeans(data, k) {
    let centroids = initializeCentroids(data, k);
    let assignments = new Array(data.length);
    let changed = true;

    while (changed) {
        changed = false;

        // 分配每个点到最近的质心
        for (let i = 0; i < data.length; i++) {
            const closest = findClosestCentroid(data[i], centroids);
            if (assignments[i] !== closest) {
                assignments[i] = closest;
                changed = true;
            }
        }

        // 更新质心
        for (let j = 0; j < k; j++) {
            centroids[j] = calculateCentroid(data, assignments, j);
        }
    }

    return { centroids, assignments };
}

function initializeCentroids(data, k) {
    const shuffled = data.slice().sort(() => Math.random() - 0.5);
    return shuffled.slice(0, k);
}

function findClosestCentroid(point, centroids) {
    let closest = 0;
    let minDistance = Infinity;

    for (let i = 0; i < centroids.length; i++) {
        const distance = euclideanDistance(point, centroids[i]);
        if (distance < minDistance) {
            minDistance = distance;
            closest = i;
        }
    }

    return closest;
}

function calculateCentroid(data, assignments, k) {
    const points = data.filter((_, i) => assignments[i] === k);
    const dimension = data[0].length;

    if (points.length === 0) return new Array(dimension).fill(0);

    const centroid = new Array(dimension).fill(0);
    points.forEach(point => {
        point.forEach((value, index) => {
            centroid[index] += value;
        });
    });

    return centroid.map(value => value / points.length);
}

function euclideanDistance(pointA, pointB) {
    return Math.sqrt(pointA.reduce((sum, value, index) => {
        return sum + Math.pow(value - pointB[index], 2);
    }, 0));
}

// 切换更新日志的显示状态
function toggleUpdateLog() {
    const updateLog = document.querySelector('.update-log');
    const updateLogButton = document.querySelector('.update-log-button');

    // 禁用按钮，防止重复点击
    updateLogButton.disabled = true;

    if (updateLog.classList.contains('visible')) {
        updateLog.classList.remove('visible'); // 隐藏更新日志
        setTimeout(() => {
            updateLog.style.display = "none"; // 在动画结束后隐藏
            updateLogButton.style.backgroundColor = ''; // 恢复原色
            updateLogButton.disabled = false; // 恢复按钮
        }, 300); // 等待过渡结束
    } else {
        updateLog.style.display = "block"; // 显示更新日志
        setTimeout(() => {
            updateLog.classList.add('visible'); // 过渡动画
            updateLogButton.style.backgroundColor = '#ccc'; // 灰白色
            updateLogButton.disabled = false; // 恢复按钮
        }, 10); // 小延迟确保样式生效
    }
}

// 显示更新日志
document.getElementById('update-log').classList.remove('hidden');

// 隐藏更新日志
document.getElementById('update-log').classList.add('hidden');

// 点击事件监听器
window.addEventListener('click', function(event) {
    const updateLog = document.querySelector('.update-log');
    const updateLogButton = document.querySelector('.update-log-button');

    // 如果点击的不是更新日志和按钮，则隐藏更新日志
    if (!updateLog.contains(event.target) && !updateLogButton.contains(event.target)) {
        updateLog.classList.remove('visible');
        updateLogButton.style.backgroundColor = ''; // 恢复原色
        updateLogButton.disabled = false; // 恢复按钮
    }
});

// 抽签系统配置
const minNumber = 1, maxNumber = 57, drawnNumbers = [];

// 抽签逻辑
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

    const duration = 2000, startTime = Date.now();
    let finalNumber;

    function displayRandomNumber() {
        do {
            finalNumber = getRandomNumber();
        } while (drawnNumbers.includes(finalNumber)); // 检查是否重复抽取
        
        resultElement.innerText = finalNumber;

        if (Date.now() - startTime < duration) {
            setTimeout(displayRandomNumber, 1);
        } else {
            showFinalResult();
        }
    }

    function showFinalResult() {
        drawnNumbers.push(finalNumber); // 将抽取的学号添加到已抽取列表
        resultElement.innerText = `${finalNumber} 号，站！`;
        button.disabled = true; // 禁用按钮
        setTimeout(() => {
            button.disabled = false; // 500ms后恢复按钮
            button.style.backgroundColor = ""; // 恢复按钮样式
        }, 500);
    }

    displayRandomNumber();
}

// 生成指定范围内的随机数
function getRandomNumber() {
    return Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
}

// 课程表
function showSchedule() {
    alert("课程表功能正在开发中，敬请期待！");
}
