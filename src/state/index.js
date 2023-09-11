import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    lat: [],
    lon: [],
    city: "",
    data: []
}

export const authSlice = createSlice({
    name: 'api',
    initialState,
    reducers: {
        setLat: (state, action) => {
            state.lat = action.payload.lat
        },
        setLon: (state, action) => {
            state.lon = action.payload.lon
        },
    }    
})

export const { setLat, setLon } = authSlice.actions
export default authSlice.reducer