// Получение всего, что связано с аналоговыми часами
let monthAndDayBlock = document.querySelector('.month_and_day'),
    weekDayBlock = document.querySelector('.week_day'),
    hourArrow = document.querySelector('.hour_arrow'),
    minuteArrow = document.querySelector('.minute_arrow'),
    secondArrow = document.querySelector('.second_arrow');

// Получение всего, что связано с цифровыми часами
let weekDaysList = document.querySelector('.week_days_list'),
    hourBlock = document.querySelector('.time_block_hour'),
    minuteBlock = document.querySelector('.time_block_minute'),
    secondsBlock = document.querySelector('.time_block_seconds');

// Получение кнопки смены видов часов, и "обертки" самих часов
let changeClockBtn = document.querySelector('#change_clock'),
    analogClock = document.querySelector('.analog_clock'),
    digitalClock = document.querySelector('.digital_clock');

// Получение всего, что связано с будильником
let alarmWrap = document.querySelector('.alarm_wrap'),
    alarmHour = document.querySelector('#alarm_hour'),
    alarmMinute = document.querySelector('#alarm_minute'),
    alarmSeconds = document.querySelector('#alarm_seconds'),
    alarmOnBtn = document.querySelector('.alarm_on'),
    alarmOffBtn = document.querySelector('.alarm_off'),
    alarmAudio = document.querySelector('.alarm_audio');

// Получение всего, что связано с таймером
let timerWrap = document.querySelector('.timer_wrap'),
    timerMinute = document.querySelector('.timer_mm'),
    timerSeconds = document.querySelector('.timer_ss'),
    timerMinSelect = document.querySelector('#tm_min'),
    timerSecSelect = document.querySelector('#tm_sec'),
    timerStart = document.querySelector('.timer_start'),
    timerReset = document.querySelector('.timer_reset'),
    timerAudio = document.querySelector('.timer_audio');

let stopwatchMinBlock = document.querySelector('.sw_minute'),
    stopwatchSecBlock = document.querySelector('.sw_seconds'),
    stopwatchMillisecBlock = document.querySelector('.sw_milliseconds'),
    stopwatchStartBtn = document.querySelector('.sw_start'),
    stopwatchStopBtn = document.querySelector('.sw_stop'),
    stopwatchResetBtn = document.querySelector('.sw_reset');

// Массивы с месяцами и днями недели, т.к new Date() при получение месяца или дня недели возвращает число, это число можно использовать как индекс
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Свитчер вида часов
changeClockBtn.addEventListener('click', (e) => {
    if (e.target.classList.contains('digital')) {
        e.target.classList.remove('digital');
        e.target.classList.add('analog');
        e.target.textContent = 'Analog Clock';
        analogClock.classList.add('hide_analog_clock');
        digitalClock.classList.remove('hide_digital_clock');
    } else {
        e.target.classList.remove('analog');
        e.target.classList.add('digital');
        e.target.textContent = 'Digital Clock';
        analogClock.classList.remove('hide_analog_clock');
        digitalClock.classList.add('hide_digital_clock');
    }
});

// Функция в которой из объекта Date получаем текущую дату. Уже после получаем необходимые компоненты даты, такие как час, минута, секунда и тд. Возврает объект, для дальнейшего использования
let getCurrentDate = () => {
    let currentDate = new Date();
    
    let month = currentDate.getMonth();
    let weekDay = currentDate.getDay();
    let day = currentDate.getDate();
    let hour = currentDate.getHours();
    let minute = currentDate.getMinutes();
    let seconds = currentDate.getSeconds();

    return {
        'month': month,
        'week day': weekDay,
        'day': day,
        'hour': hour,
        'minute': minute,
        'seconds': seconds
    };
};

// Аналоговые часы
// Функция установки всеx параметров для аналоговых часов, основываяюсь на данных полученых из функции getCurrentDate;
let setClock = () => {
    let currentDate = getCurrentDate();

    // Вывод текущего месяца, дня недели и дня в соответсвующие блоки
    monthAndDayBlock.textContent = `${MONTHS[currentDate.month].toUpperCase()} ${currentDate.day}`;
    weekDayBlock.textContent = WEEK_DAYS[currentDate['week day']].toLocaleUpperCase();

    // Движение стрелок часов
    // Умножение на 6 нужно для корректного поворота стрелок секунд и минут. Т.к цифербалт круглый, получается 360 градусов (360 делить на 60 сек == 6), чтобы повернуть секундную стрелку нужно текущую секунду умножить на 6. Например 12 секунд это будет 12 * 6 = 72градуса. Часовую стрелку умножаем на 30, получили из 360градусов делить на 12 часов = 30 градусов. Плюс надо учитывать минутную стрелку.
    secondArrow.style.transform = `rotate(${currentDate.seconds * 6}deg)`;
    minuteArrow.style.transform = `rotate(${currentDate.minute * 6}deg)`;
    hourArrow.style.transform = `rotate(${currentDate.hour * 30 + ((currentDate.minute * 6) / 12)}deg)`;
};

// Сразу вызываем функцию setClock, что бы задать стрелкам часов текущее положение в соответсвии с временем, а уже после в интервале 1 сек обновляем. Если просто функию setClock передать в интервал, то только через секунду произойдет обновление часов.
setClock();
let clockUpdate = setInterval(setClock, 1000);


// Цифровые часы
// Функция для создания блоков с классов wd, которые будут показавать дни недели на основе массива WEEK_DAYS, и эти блоки помещать в заранее подготовленый контейнер weekDaysList
let setWeekDays = (weekArr, container) => {
    weekArr.forEach(weekDayName => {
        let dayBlock = document.createElement('div');
        dayBlock.classList.add('wd');
        dayBlock.textContent = weekDayName.toUpperCase();
        container.append(dayBlock);
    });
}
setWeekDays(WEEK_DAYS, weekDaysList);

// Функция установки всеx параметров для цифровых часов, основываяюсь на данных полученых из функции getCurrentDate;
let setDigitalClock = () => {
    // В переменную currentDate записывается объект с текущими данными даты (месяц, день недели, число, час, мин, сек) передаваемый функцие getCurrentDate;
    let currentDate = getCurrentDate();
    let weekDayBlocks = document.querySelectorAll('.wd');

    let hour = currentDate.hour;
    let minute = currentDate.minute;
    let seconds = currentDate.seconds;

    // Добаление класса current_wd блоку с текущем днем недели
    weekDayBlocks.forEach((item, i) => {
        if (currentDate['week day'] == i) {
            item.classList.remove('current_wd');
            item.classList.add('current_wd');
        };

    });

    // В блоки час, минуты, секунды записываются текущее час, мин, сек.
    // Если число меньше 10 к нему дописывается 0;
    hourBlock.textContent = hour < 10 ?  `0${hour}` : hour;
    minuteBlock.textContent = minute < 10 ? `0${minute}` : minute;
    secondsBlock.textContent = seconds < 10 ? `0${seconds}` : seconds;

};
// Сразу вызываем функцию setDigitalClock для установки текущего времени, а потом эту функцию передаем в интервал, для ежесекундного обновления
setDigitalClock();
let digitalClockUpd = setInterval(setDigitalClock, 1000);


// Будильник
// Создать optionы в селекты
// Функция для создания необходимого кол-ва option для селекта (ч = 24, м = 60, с = 60);
let optionsForSelect = (container, num, className) => {
    for (let i = 0; i < num; i++) {
        let option = document.createElement('option');
        option.classList.add(className);
        option.value = i;

        if (i < 10) {
            i = `0${i}`;
        }
        option.textContent = i;
        container.append(option);
    }
};
// Создание option для количесва часов, минут, секунд
optionsForSelect(alarmHour, 24, 'alarm_hour_opt');
optionsForSelect(alarmMinute, 60, 'alarm_min_opt');
optionsForSelect(alarmSeconds, 60, 'alarm_sec_opt');

// Функция аларм получает текущее время, и сравнивает со значением из селектов
let alarm = () => {
    let currentDate = getCurrentDate();

    // текущие час, минута, секунда
    let currentHour = currentDate.hour,
        currentMinute = currentDate.minute,
        currentSeconds = currentDate.seconds;

    // час, минута, секунда установление на будилнике 
    let hourFormSelect = +alarmHour.value,
        minuteFromSelect = +alarmMinute.value,
        secondsFromSelect = +alarmSeconds.value;
        
    // если текущее время равно тому, что установили в селектах будильника уставливается анимация и звукой сигнал
    if (hourFormSelect === currentHour && minuteFromSelect === currentMinute && secondsFromSelect === currentSeconds) {
        // добавления класса с "обертке" будильника, в которой прописана анимация тряски
        alarmWrap.classList.add('alarm_wrap_shake');
        // Воспроизведение звука будильника и его зацикливание
        alarmAudio.play();
        alarmAudio.loop = true;
    };
}
// Переменная куда будет записываться setInterval для будильника, и в дальнейшем его очистка clearInteral.
let checkAlarm = null;

// При нажатии на кнопку ON, будильник включается
// Кнопка окрашивается в зеленый, запускается интервал, в которую передается функция alarm, написанная выше
alarmOnBtn.addEventListener('click', (e) => {
    e.target.style.backgroundColor = 'green'
    checkAlarm = setInterval(alarm, 1000);
});

// При нажатии на кнопку OFF, кнопке ON убираем зеленый цвет, удаляем класс alarm_wrap_shake с "оберки" будильника, в которой прописана анимация, воспроизведение звука останавлиется, интервал очищается
alarmOffBtn.addEventListener('click', (e) => {
    alarmOnBtn.style.backgroundColor = '#fff'
    alarmWrap.classList.remove('alarm_wrap_shake');
    alarmAudio.pause();
    if (checkAlarm != null) {
        clearInterval(checkAlarm);
    }
})


// Timer
// Заполенение селектов таймера ранее описаной фунцией
optionsForSelect(timerMinSelect, 60, 'timer_min');
optionsForSelect(timerSecSelect, 60, 'timer_sec');

// Для дальнейшего очищение интервала
let timerId = null;

// Функция старта таймера
let startTimer = () => {
    clearInterval(timerId);

    // получаем минуты и секунды на основе выбраных option селекта
    let min = +timerMinSelect.value,
        sec = +timerSecSelect.value;

    // Из полученых минут и секунд получаем общее время в сек
    let totalSec = (min * 60) + sec;

    // если на таймере 00:00 таймер не будет рабоать
    if (min == 0 && sec == 0) {
       return false;
    };

    // Запись минут и сек в соответвующие блоки для этого
    timerMinute.textContent = min < 10 ? `0${min}` : min;
    timerSeconds.textContent = sec < 10 ? `0${sec}` : sec;

    // интервал таймера
    timerId = setInterval(() => {
        // уменьшаем общее время в сек
        totalSec--;
        // получение минут и секунд на остнове общее количества сек
        let mm = (totalSec / 60) % 60 | 0,
            ss = totalSec % 60 | 0;
          // Запись минут и сек в соответвующие блоки для этого
        timerMinute.textContent = mm < 10 ? `0${mm}` : mm;
        timerSeconds.textContent = ss < 10 ? `0${ss}` : ss;

        // Если общее количество сек будет равно нулю, "обертке" таймера задается класс timer_wrap_shake, в котором прописана анимация, включается сигнал таймера
        if (totalSec == 0) {
            timerWrap.classList.add('timer_wrap_shake')
            timerAudio.play();
            timerAudio.loop = true;
            clearInterval(timerId);
        };
    }, 1000);
}
timerStart.addEventListener('click', startTimer);


// Функция сброса таймера.
// Таймер очищается. Класс удаляется с таймера, чтобы убрать анимацию, пауза сигнала таймера
let resetTimer = () => {
    clearInterval(timerId)
    timerWrap.classList.remove('timer_wrap_shake')
    timerAudio.pause();
    timerMinute.textContent = `00`;
    timerSeconds.textContent = `00`;
};
timerReset.addEventListener('click', resetTimer);


// Stopwatch
// переменные для секундомера, которые будем увеличивать
let swMin = 0,
    swSec = 0,
    swMilliSec = 0,
    swInterval = null;


// Функция запуска секундомера
let stopwatchStart = () => {
    // очищаем интервал секундомера, потому что если несколько раз нажимать на кнопку старт, которая запускает данную функцию, секундомер начинал работать быстрее:)
    clearInterval(swInterval);

    swInterval = setInterval(() => {
        swMilliSec++;
        // если переменная swMilliSec больше 99, то ее обнуляем а swSec увеливаем на 1
        if (swMilliSec > 99) {
            swMilliSec = 0;
            swSec++;
            
            // если переменная swSec больше 59, то ее обнуляем а swMin увеливаем на 1
            if (swSec > 59) {
                swSec = 0;
                swMin++;
            };
        };        

        // запись миллисекунд, секунд и минут в блоки секундомера
        stopwatchMinBlock.textContent = swMin < 10 ? `0${swMin}` : swMin;
        stopwatchSecBlock.textContent = swSec < 10 ? `0${swSec}` : swSec;
        stopwatchMillisecBlock.textContent = swMilliSec < 10 ? `0${swMilliSec}` : swMilliSec;
        // секундомер обновляется  каждые 10 миллисек -_-;
    }, 1000/100);

};
stopwatchStartBtn.addEventListener('click', stopwatchStart)


// Функция остановки секундомера.
let stopwatchStop = () => {
    clearInterval(swInterval);
}
stopwatchStopBtn.addEventListener('click', stopwatchStop)


// Функция для сброса секундомера
// Очищаем интервал, переменные обнуляем, и записываем в блоки
let stopwatchReset = () => {
    clearInterval(swInterval);
    swMin = 0,
    swSec = 0,
    swMilliSec = 0;

    stopwatchMinBlock.textContent = `0${swMin}`;
    stopwatchSecBlock.textContent = `0${swSec}`;
    stopwatchMillisecBlock.textContent = `0${swMilliSec}`;
}
stopwatchResetBtn.addEventListener('click', stopwatchReset)








