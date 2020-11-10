const   formSearch = document.querySelector('.form-search'),
        inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
        dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
        inputCitiesTo = formSearch.querySelector('.input__cities-to'),
        dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
        inputDateDepart = formSearch.querySelector('.input__date-depart');

// Массив данных

const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
        proxy = 'https://cors-anywhere.herokuapp.com/',
        API_KEY = '853c139c883e1864a947c2d64131e004',
        calendar = 'http://min-prices.aviasales.ru/calendar_preload'


let city = []

//Функции 

const getData = (url, callback) => {
    const request = new XMLHttpRequest()

    request.open('GET', url)

    request.addEventListener('readystatechange', () => {
       if(request.readyState !== 4) return;

       if(request.status === 200) {
            callback(request.response);
       } else {
           console.error(request.status);
       }
    })

    request.send()
}

const showCity = (input, list) => {
    list.textContent = '';

    if(input.value !== '' ) {
        console.log('инпут не пустой');
    
        const filterCity = city.filter((item) => {
            const fixItem = item.name.toLowerCase();
            return fixItem.includes(input.value.toLowerCase()); 
        });

        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item.name;
            list.append(li);
        });
    }
}

const selectCity = (event, input, list) => {
    const target = event.target;
    if(target.tagName.toLowerCase() === 'li') {
        input.value = target.textContent;
        list.textContent = '';
    }
}

const renderCheapDay = (cheapTicket) => {
    console.log(cheapTicket);
}

const renderCheapYear = (cheapTickets) => {
    console.log(cheapTickets);
}

const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data).best_prices;
    
    const cheapTicketDay = cheapTicketYear.filter((item) => {
        return item.depart_date === date;
    })

    renderCheapDay(cheapTicketDay)
    renderCheapYear(cheapTicketYear)
}


//Обработчкий функций

inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom)
});

inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo)
});


dropdownCitiesFrom.addEventListener('click', (event) => {
    selectCity(event, inputCitiesFrom, dropdownCitiesFrom)
})

dropdownCitiesTo.addEventListener('click', (event) => {
    selectCity(event, inputCitiesTo, dropdownCitiesTo)
})

formSearch.addEventListener('submit', (event) => {
    event.preventDefault()

    const cityFrom = city.find((item) => inputCitiesFrom.value === item.name)
    const cityTo = city.find((item) => inputCitiesTo.value === item.name)

    const formData = {
        from: cityFrom.code,
        to: cityTo.code,
        when: inputDateDepart.value,
    }

    const requestData = `?depart_date=${formData.when}&origin=${formData.from}&destination=${formData.to}&one_way=true`

    const requestData2 = '?depart_date=' + formData.when + '&origin=' + formData.from + '&destination=' + formData.to +
                        '&one_way=true&token=';
    
    getData(calendar + requestData, (response) => {
        renderCheap(response, formData.when)
    })          
    
 })

// Вызовы функций 
getData(proxy + citiesApi, (data) => {
    city = JSON.parse(data).filter(item => item.name)
    console.log(city); 
})



/* getData(proxy + calendar + '?depart_date=2020-05-25&origin=SVX&destination=KGD&one_way=true&token=' + API_KEY, (data) => {
    const cheapTicket = JSON.parse(data).best_prices.filter(item => item.depart_date === '2020-05-29')
    console.log(cheapTicket);
}) */