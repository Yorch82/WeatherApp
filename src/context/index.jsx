import { useContext, createContext, useEffect, useState } from "react";
import axios from 'axios'

const StateContext = createContext()

export const StateContextProvider = ({ children }) => {
    const [weather, setWeather] = useState({})
    const [values, setvalues] = useState([])
    const [place, setPlace] = useState('Ibiza')
    const [location, setLocation] = useState('')
    const [lat, setLat] = useState('38.974390099999994')
    const [lon, setLon] = useState('1.4197463178515335')

    const getWeather = async () => {
        const options = {
            method: 'GET',
            url: `${import.meta.env.VITE_API_WEATHER}`,
            params: {
                ContentType: 'application/json',
                appid: `${import.meta.env.VITE_API_KEY}`,
                lat: lat,
                lon: lon,
                units: 'metric'
            }
        }

        try {
            const response = await axios.request(options)
            const thisData = Object.values(response.data)
            console.log(thisData.values)
            setLocation(thisData[11])
            setvalues(thisData.values)
            setWeather(thisData[3])
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        // getWeather()
    }, [])

    useEffect(() => {
        console.log(values)
    }, [values])

    return (
        <StateContext.Provider value={{
            weather,
            setPlace,
            values,
            location
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)
