document.addEventListener('DOMContentLoaded', function() {
    const API_KEY = '8a1a3e88743adcee111d3725';
    const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;


    const convertButton = document.querySelector('.button_convert');
    const changeButton = document.querySelector('.button_change');
    const resetButton = document.querySelector('.button_reset');
    //Получение значений и элементов с сайта

    const inputVal = document.querySelector('.input_val');
    const outputVal = document.querySelector('.output_val');
    const startCurrency = document.querySelector('#start_currency_select');
    const endCurrency = document.querySelector('#end_currency_select');

    const selectedStartCurrency = startCurrency.value;
    
    //Асинхронная функция получения курса валют
    async function getExchangeRate(baseCurrency) 
    {
        try {
            const response = await fetch(`${API_URL}${baseCurrency}`);
            if(!response.ok)
            {
                throw new Error('Ошибка сети');
            }
            const data = await response.json();
            if (data.result === 'error')
            {
                throw new Error(data['error-type']);
            }
            return data.conversion_rates;
        }
        catch(error)
        {
            console.error('Ошибка при получении курса валют', error);
        }
    }
    //Кнопка конвертировать
    convertButton.addEventListener('click', async function() {
        const inputValue = parseFloat(inputVal.value);

        if(isNaN(inputValue))
        {
            alert('Необходимо ввести число');
            return;
        }

        const baseCurrency = startCurrency.value;
        const targetCurrency = endCurrency.value;

        const rates = await getExchangeRate(baseCurrency);
        if(!rates) {
            alert('Не удаётся получить курс валют');
            return;
        }
        const conversionRate = rates[targetCurrency];
        if(!conversionRate) {
            alert('Не удалось найти курс для выбранной валюты');
            return;
        }
        outputVal.value = (inputValue * conversionRate).toFixed(2);
    });

    //Кнопка для смены значений
    changeButton.addEventListener('click', function() {
        const tempValue = inputVal.value;
        inputVal.value = outputVal.value;
        outputVal.value = tempValue;

        const tempCurrency = startCurrency.value;
        startCurrency.value = endCurrency.value;
        endCurrency.value = tempCurrency  
    });

    //Кнопка сброса
    resetButton.addEventListener('click', function() {
        inputVal.value = 0;
        outputVal.value = 0;
    })
})