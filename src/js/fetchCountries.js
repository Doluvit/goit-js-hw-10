const BASE_URL = 'https://restcountries.com/v3.1/';
const END_POINT = 'name/';

export function fetchCountries(name) {
  return fetch(
    `${BASE_URL}${END_POINT}${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}
