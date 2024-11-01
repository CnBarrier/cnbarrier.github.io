// 抽签系统配置
const minNumber = 1;
const maxNumber = 57;
const drawnNumbers = [];
const specialOutputs = {
    17: "17号，谁家创始人？",
    15: "韩子敖",
    25: "吕振华",
    27: "石斌，想你了！",
    56: "朱峪林",
};

// 抽签逻辑
function drawLot() {
    const button = document.querySelector("button");
    const resultElement = document.getElementById("result");

    // 检查是否已抽完所有学号
    if (drawnNumbers.length >= maxNumber - minNumber + 1) {
        alert("一节课叫了56个人？");
        return;
    }

    // 禁用按钮并显示动画
    button.disabled = true;
    button.style.backgroundColor = "#ccc";
    button.style.cursor = "not-allowed";
    resultElement.style.display = "flex";
    resultElement.style.justifyContent = "center";
    resultElement.style.alignItems = "center";
    resultElement.style.fontSize = "10em";

    const duration = 2000;
    const startTime = Date.now();
    let finalNumber;

    // 显示随机数
    function displayRandomNumber() {
        // 设置不同的概率
        do {
            const rand = Math.random();
            if (rand < 0.2) {
                finalNumber = 3; // 20%的概率抽到3号
            } else if (rand >= 0.2 && rand < 0.3) {
                finalNumber = 56; // 10%的概率抽到56号
            } else if (rand >= 0.3 && rand < 0.306) {
                finalNumber = 17; // 0.6%的概率抽到17号
            } else {
                finalNumber = getRandomNumber(); // 其他情况下生成一个随机数
            }
        } while (drawnNumbers.includes(finalNumber));

        resultElement.innerText = finalNumber;

        // 控制显示速度
        if (Date.now() - startTime < duration) {
            setTimeout(displayRandomNumber, 1);
        } else {
            showFinalResult();
        }
    }

    // 显示最终结果并冷却按钮
    function showFinalResult() {
        drawnNumbers.push(finalNumber);
        resultElement.innerText = specialOutputs[finalNumber] || `${finalNumber} 号，站！`;
        button.style.backgroundColor = ""; // 恢复按钮默认背景颜色

        // 冷却结束恢复按钮可点击
        setTimeout(() => {
            button.disabled = false;
            button.style.cursor = "";
        }, 500);
    }

    displayRandomNumber();
}

// 生成随机数
function getRandomNumber() {
    return Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
}
