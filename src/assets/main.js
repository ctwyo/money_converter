import Freecurrencyapi from './api';

const api = new Freecurrencyapi();

const submitButton = document.querySelector('.exchange');
const result = document.querySelector('.result');
const getValuesButton = document.querySelector('.get__values');

const firstSelect = document.getElementById('first');
const secondSelect = document.getElementById('second');

function createSelectValues(code, name, select) {
  const optionElement = document.createElement('option');
  optionElement.classList.add('value');
  optionElement.value = code
  optionElement.textContent = name
  
  if (code === 'RUB' && select.id === 'second') {
    optionElement.selected = true
  } else if (code === 'USD' && select.id === 'first') {
    optionElement.selected = true
  }

  select.add(optionElement);
}

function loadCurrencies() {
  return new Promise((resolve, reject) => {
    api.currencies()
      .then(response => {
        const currencyCodes = Object.keys(response.data)
        const sortedCurrencyCodes = currencyCodes.sort()
        sortedCurrencyCodes.forEach((code) => {
          const valueName = response.data[code].name
          createSelectValues(code, valueName, firstSelect)
          createSelectValues(code, valueName, secondSelect)
        })
      resolve()
    })
    .catch(err => {
      console.log('Error: ', err);
      reject(err)
    })
  })
}

window.addEventListener('DOMContentLoaded', () => {
  loadCurrencies()
    .then(() => {
      console.log('Currencies loaded successfully.');
    })
    .catch((err) => {
      console.error('Error loading currencies: ', err);
    })
})

const firstValueInput = document.getElementById('first-value');
const secondValueInput = document.getElementById('second-value');

firstValueInput.addEventListener('input', () => {
  const baseCurrency = firstSelect.value;
  const targetCurrency = secondSelect.value;
  const amount = parseFloat(firstValueInput.value)

  api.latest({
    base_currency: baseCurrency,
    currencies: targetCurrency
  })
    .then(response => {
      const exchangeRate = response.data[targetCurrency];
      const convertedAmount = amount * exchangeRate;
      secondValueInput.value = convertedAmount.toFixed(2);
    })
    .catch(err => {
      console.log('Error while latest', err);
    });
})

secondValueInput.addEventListener('input', () => {
  const baseCurrency = secondSelect.value;
  const targetCurrency = firstSelect.value;
  const amount = parseFloat(secondValueInput.value);

  api.latest({
    base_currency: baseCurrency,
    currencies: targetCurrency
  })
    .then(response => {
      const exchangeRate = response.data[targetCurrency];
      const convertedAmount = amount * exchangeRate;
      firstValueInput.value = convertedAmount.toFixed(2);
    })
    .catch(err => {
      console.log('Error while latest', err);
    });
});