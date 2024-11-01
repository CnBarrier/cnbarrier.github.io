// 设置抽签的学号范围
const minNumber = 1;  // 最小值
const maxNumber = 57; // 最大值

// 存储已经抽取的学号
let drawnNumbers = [];

// 特定学号输出结果的映射
const specialOutputs = {
    17: "17号创始人",
    27: "牢斌，想你了！",
    25: "吕振华",
    16: "韩子敖",
    46: "朱峪林", 
};

// 抽签逻辑函数
function drawLot() {
    const button = document.querySelector("button");
    
    // 禁用按钮并设置为灰色
    button.disabled = true;
    button.style.backgroundColor = "#ccc"; // 灰色背景
    button.style.cursor = "not-allowed"; // 更改鼠标样式为不可点击

    // 检查是否所有学号都已抽取
    if (drawnNumbers.length >= maxNumber - minNumber + 1) {
        alert("不是哥们，全抽完了？");
        // 恢复按钮状态
        button.disabled = false;
        button.style.backgroundColor = ""; // 恢复默认背景颜色
        button.style.cursor = ""; // 恢复鼠标样式
        return; // 如果所有学号都抽取完，停止抽取
    }

    const duration = 3000; // 动画持续时间（毫秒）
    const startTime = Date.now(); // 记录开始时间
    const resultElement = document.getElementById("result");
    let lastRandomNum; // 用于保存最后一个随机数

    function displayRandomNumber() {
        // 设置动画期间的字体大小
        resultElement.style.fontSize = "10em"; // 动画期间的字体大小

        // 生成随机数并显示，确保不重复
        do {
            // 计算随机数，调整46号的概率为5%
            const randomNum = Math.floor(Math.random() * 100); // 生成0到99的随机数
            if (randomNum < 5) {
                lastRandomNum = 46; // 5%的概率抽到46号
            } else {
                lastRandomNum = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
            }
        } while (drawnNumbers.includes(lastRandomNum)); // 如果已抽取过，则重新生成

        resultElement.innerText = lastRandomNum; // 显示当前随机数

        // 计算当前已过时间，控制速度
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1); // 限制进度最大为1

        if (progress < 1) {
            const currentSpeed = 25; // 每次更新的时间间隔
            setTimeout(displayRandomNumber, currentSpeed);
        } else {
            // 动画结束后，显示最后一个生成的随机数作为最终结果
            drawnNumbers.push(lastRandomNum); // 将抽取的结果添加到已抽取数组中

            // 获取特定学号的输出结果
            const output = getSpecialOutput(lastRandomNum);

            resultElement.innerText = output; // 显示输出结果
            resultElement.style.fontSize = "10em"; // 最终结果的字体大小

            // 恢复按钮状态
            button.disabled = false;
            button.style.backgroundColor = ""; // 恢复默认背景颜色
            button.style.cursor = ""; // 恢复鼠标样式
        }
    }

    displayRandomNumber(); // 启动随机数显示
}

// 获取特定学号的输出结果
function getSpecialOutput(number) {
    return specialOutputs[number] || `${number} 号，站！`; // 默认输出
}

// 在页面加载完成后显示 splash screen
window.onload = function() {
    const splashscreen = document.getElementById("splashscreen");
    splashscreen.classList.add("visible"); // 添加可见类，触发淡入效果

    setTimeout(() => {
        splashscreen.classList.remove("visible"); // 移除可见类，触发淡出效果
        // 等待动画结束后再将元素从 DOM 中移除
        setTimeout(() => {
            splashscreen.style.display = "none"; // 隐藏 splash screen
        }, 500); // 等待500毫秒以匹配过渡效果
    }, 3000); // 3秒后开始淡出 
};
