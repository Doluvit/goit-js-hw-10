import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};
const DEBOUNCE_DELAY = 300;

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const countryName = e.target.value.trim();
  if (!countryName) {
    clearRequest();
    return;
  }
  fetchCountries(countryName)
    .then(data => {
      if (data.length > 10) {
        uniqueSelectionAlert();
        clearRequest();
        return;
      }
      renderMarkup(data);
    })
    .catch(e => {
      clearRequest();
      errorWarning();
    });
}

function renderMarkup(countries) {
  let country = '';
  let countriesList = '';
  clearRequest();

  if (countries.length === 1) {
    country = createCountry(countries);
    countriesList = refs.info;
  } else {
    country = createCountriesList(countries);
    countriesList = refs.list;
  }
  renderCountries(countriesList, country);
}

function createCountry(elements) {
  return elements
    .map(({ name, capital, population, flags, languages }) => {
      return `<div class="country-info-item"><img src="${flags.svg}" alt="${
        name.official
      }" width=30 />
        <h1>${name.official}</h1>
        </div>
        <ul class="country-info-list">
        <li>
        <p><span class="country-item">Capital: </span>${capital}</p>
        </li>
        <li>
        <p><span class="country-item">Population: </span>${population}</p>
        </li>
        <li>
        <p><span class="country-item">Languages: </span>${Object.values(
          languages
      )}</p>
        </li>
      </ul>`;
    })
    .join('');
}

function createCountriesList(elements) {
  return elements
    .map(({ name, flags }) => {
      return `<li class="country-list-item">
        <img src="${flags.svg}" alt="${name.official}" width="40" />
        <p>${name.official}</p>
        </li>`;
    })
    .join('');
}

function renderCountries(refs, country) {
  refs.innerHTML = country;
}

function clearRequest() {
  refs.list.innerHTML = '';
  refs.info.innerHTML = '';
}

function uniqueSelectionAlert() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
function errorWarning() {
  Notiflix.Notify.failure('Oops, there is no country with that name.');
}
