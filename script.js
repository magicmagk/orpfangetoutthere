let scoreWin = localStorage.getItem('score_win') ? parseInt(localStorage.getItem('score_win')) : 0;
let scoreLose = localStorage.getItem('score_lose') ? parseInt(localStorage.getItem('score_lose')) : 0;

let targetNumber = Math.floor(Math.random() * 100) + 1;
let mines = [];
while (mines.length < 2) {
    let mine = Math.floor(Math.random() * 100) + 1;
    if (mine !== targetNumber && !mines.includes(mine)) {
        mines.push(mine);
    }
}

let attempts = 0;
let lowerBound = 1;
let upperBound = 100;
let timer;
let timeLeft = 7;

updateStats();

function startTimer() {
    clearInterval(timer);
    timeLeft = 7;
    document.getElementById('time-left').innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeout();
        }
    }, 1000);
}

function updateStats() {
    document.getElementById('stats').innerText = `Твоя позорная статистика: Побед: ${scoreWin} | Поражений: ${scoreLose}`;
    document.getElementById('bounds').innerText = `Границы: от ${lowerBound} до ${upperBound}`;
}

function makeGuess() {
    clearInterval(timer);
    const inputElement = document.getElementById('user-input');
    const userValue = parseInt(inputElement.value);
    const messageEl = document.getElementById('message');

    if (isNaN(userValue)) {
        attempts++;
        messageEl.style.color = '#ff4757';
        messageEl.innerText = `Эй, сиротка, это даже не число! Минус попытка. Потрачено: ${attempts}/10`;
        checkGameOver();
        return;
    }

    attempts++;

    if (mines.includes(userValue)) {
        scoreLose++;
        localStorage.setItem('score_lose', scoreLose);
        messageEl.style.color = '#ff4757';
        messageEl.innerText = `💥 БУМ! ТЫ НАСТУПИЛ НА МИНУ (${userValue})! Твои ноги оторвало, жалкий червь!\nЗагадано было: ${targetNumber}.`;
        endGame();
        return;
    }

    if (userValue > targetNumber) {
        if (userValue < upperBound) upperBound = userValue - 1;
        messageEl.style.color = '#ffa502';
        messageEl.innerText = `Меньше, чем возможности того, что кто-то тебя любит <3 (Попытка ${attempts}/10)`;
    } else if (userValue < targetNumber) {
        if (userValue > lowerBound) lowerBound = userValue + 1;
        messageEl.style.color = '#ffa502';
        messageEl.innerText = `Больше, как твоих ненавистников (Попытка ${attempts}/10)`;
    } else {
        scoreWin++;
        localStorage.setItem('score_win', scoreWin);
        messageEl.style.color = '#2ed573';
        messageEl.innerText = `🎉 Визунчик ):< Тупая СИРОТКА, как ты узнал число ${targetNumber}? Тебе понадобилось всего ${attempts} попыток!`;
        endGame();
        return;
    }

    updateStats();
    inputElement.value = '';
    
    if (attempts >= 10) {
        scoreLose++;
        localStorage.setItem('score_lose', scoreLose);
        messageEl.style.color = '#ff4757';
        messageEl.innerText = `ХАНИЧТОЖЕСТВО ПСИНА! У тебя кончились 10 попыток. Загадано было: ${targetNumber}.\nТеперь ты мой РАБ на веки >:D`;
        endGame();
    } else {
        startTimer();
    }
}

function handleTimeout() {
    attempts++;
    const messageEl = document.getElementById('message');
    messageEl.style.color = '#ff4757';
    messageEl.innerText = `⏱️ ХАХА ТОРМОЗ! Думал дольше 7 секунд. Минус попытка. Всего: ${attempts}/10`;
    
    if (attempts >= 10) {
        scoreLose++;
        localStorage.setItem('score_lose', scoreLose);
        messageEl.innerText += `\nХа, ничтожество! Загадано было: ${targetNumber}.`;
        endGame();
    } else {
        updateStats();
        startTimer();
    }
}

function endGame() {
    clearInterval(timer);
    document.getElementById('user-input').disabled = true;
    document.getElementById('submit-btn').disabled = true;
    setTimeout(() => {
        location.reload();
    }, 4000);
}

// Запускаем таймер для первой попытки
startTimer();