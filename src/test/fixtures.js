export const currentWeather = {
  coord: { lon: -3.7038, lat: 40.4168 },
  weather: [
    { id: 800, main: 'Clear', description: 'cielo claro', icon: '01d' },
  ],
  main: {
    temp: 22.4,
    feels_like: 21.8,
    temp_min: 19,
    temp_max: 25.2,
    pressure: 1015,
    humidity: 45,
  },
  visibility: 10000,
  wind: { speed: 3.6, deg: 210 },
  clouds: { all: 0 },
  dt: 1760000000,
  timezone: 7200,
  sys: {
    country: 'ES',
    sunrise: 1759990000,
    sunset: 1760040000,
  },
  name: 'Madrid',
  id: 3117735,
};

const forecastList = Array.from({ length: 40 }, (_, index) => ({
  dt: 1760000000 + index * 3 * 60 * 60,
  main: {
    temp: 20 + (index % 6),
    temp_min: 17 + (index % 5),
    temp_max: 24 + (index % 4),
    humidity: 50,
    pressure: 1014,
  },
  weather: [
    {
      id: index % 3 === 0 ? 801 : 800,
      main: 'Clouds',
      description: index % 3 === 0 ? 'algo de nubes' : 'cielo claro',
      icon: index % 2 === 0 ? '02d' : '01n',
    },
  ],
  wind: { speed: 3.2, deg: 200 },
  clouds: { all: 15 },
  pop: (index % 4) * 0.2,
  dt_txt: '2025-10-09 12:00:00',
}));

export const forecast = {
  city: {
    id: 3117735,
    name: 'Madrid',
    country: 'ES',
    timezone: 7200,
    sunrise: 1759990000,
    sunset: 1760040000,
  },
  list: forecastList,
};

export const cities = [
  {
    id: 3117735,
    name: 'Madrid',
    state: 'Comunidad de Madrid',
    country: 'ES',
    lat: 40.4168,
    lon: -3.7038,
    label: 'Madrid, Comunidad de Madrid, ES',
  },
  {
    id: 3128026,
    name: 'Madridejos',
    state: 'Castilla-La Mancha',
    country: 'ES',
    lat: 39.4682,
    lon: -3.5326,
    label: 'Madridejos, Castilla-La Mancha, ES',
  },
];
