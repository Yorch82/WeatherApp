import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import weatherService from '../../services/weatherService';
import { getWeatherErrorMessage } from '../../utils/errors';
import { getLocationKey } from '../../utils/weather';

const initialState = {
  location: null,
  current: null,
  forecast: null,
  status: 'idle',
  error: null,
  lastUpdated: null,
};

const buildLocation = (location, current) => {
  const lat = Number(location?.lat ?? current?.coord?.lat);
  const lon = Number(location?.lon ?? current?.coord?.lon);
  return {
    lat,
    lon,
    name: current?.name || location?.name || 'Ubicación',
    country: current?.sys?.country || location?.country || '',
    state: location?.state || '',
    key: getLocationKey(lat, lon),
  };
};

export const loadWeatherByCoords = createAsyncThunk(
  'weather/loadByCoords',
  async ({ lat, lon, name = '', country = '', state = '' }, { getState, rejectWithValue }) => {
    try {
      const units = getState().settings.units;
      const { current, forecast } = await weatherService.fetchWeatherBundle({
        lat,
        lon,
        units,
      });
      return {
        current,
        forecast,
        location: buildLocation({ lat, lon, name, country, state }, current),
      };
    } catch (error) {
      return rejectWithValue(getWeatherErrorMessage(error));
    }
  }
);

export const loadWeatherByCity = createAsyncThunk(
  'weather/loadByCity',
  async (query, { getState, rejectWithValue }) => {
    try {
      const units = getState().settings.units;
      const { current, forecast, location } =
        await weatherService.fetchWeatherByCity(query, units);
      return {
        current,
        forecast,
        location: buildLocation(location, current),
      };
    } catch (error) {
      return rejectWithValue(getWeatherErrorMessage(error));
    }
  }
);

export const refreshWeather = createAsyncThunk(
  'weather/refresh',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { location } = getState().weather;
      if (!location) throw new Error('No location');
      const units = getState().settings.units;
      const { current, forecast } = await weatherService.fetchWeatherBundle({
        lat: location.lat,
        lon: location.lon,
        units,
      });
      return {
        current,
        forecast,
        location: buildLocation(location, current),
      };
    } catch (error) {
      return rejectWithValue(getWeatherErrorMessage(error));
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearWeather: (state) => {
      state.location = null;
      state.current = null;
      state.forecast = null;
      state.status = 'idle';
      state.error = null;
      state.lastUpdated = null;
    },
    clearWeatherError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.status = 'loading';
      state.error = null;
    };
    const fulfilled = (state, action) => {
      state.status = 'succeeded';
      state.current = action.payload.current;
      state.forecast = action.payload.forecast;
      state.location = action.payload.location;
      state.lastUpdated = Date.now();
      state.error = null;
    };
    const rejected = (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    };

    builder
      .addCase(loadWeatherByCoords.pending, pending)
      .addCase(loadWeatherByCoords.fulfilled, fulfilled)
      .addCase(loadWeatherByCoords.rejected, rejected)
      .addCase(loadWeatherByCity.pending, pending)
      .addCase(loadWeatherByCity.fulfilled, fulfilled)
      .addCase(loadWeatherByCity.rejected, rejected)
      .addCase(refreshWeather.pending, pending)
      .addCase(refreshWeather.fulfilled, fulfilled)
      .addCase(refreshWeather.rejected, rejected);
  },
});

export const { clearWeather, clearWeatherError } = weatherSlice.actions;

export const selectWeather = (state) => state.weather;
export const selectCurrentWeather = (state) => state.weather.current;
export const selectForecast = (state) => state.weather.forecast;
export const selectLocation = (state) => state.weather.location;
export const selectWeatherStatus = (state) => state.weather.status;
export const selectWeatherError = (state) => state.weather.error;
export const selectLastUpdated = (state) => state.weather.lastUpdated;

export default weatherSlice.reducer;
