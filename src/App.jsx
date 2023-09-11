import { useEffect, useState } from 'react'
import { BiSearchAlt2 } from 'react-icons/bi'
import WeatherCard from './components/Weathercard'
import MiniCard from './components/MiniCard'

function App () {
  const [input, setInput] = useState('')
  const [lon, setLon] = useState('1.4197463178515335')
  const [lat, setLat] = useState('38.974390099999994')
  const [weather, setWeather] = useState([])
  const [forecast, setForecast] = useState([])

  const getCity = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_GEO}/direct?q=${input}&limit=1&appid=${import.meta.env.VITE_API_KEY}`)
    const data = await response.json()

    setLat(data[0].lat)
    setLon(data[0].lon)    
  }

  const getWeather = async () => {
    const weather = await fetch(`${import.meta.env.VITE_API_WEATHER}/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_API_KEY}&units=metric`)
    const data = await weather.json()

    setWeather({data})
  }

  const getForecast = async () => {
    const weather = await fetch(`${import.meta.env.VITE_API_WEATHER}/forecast?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_API_KEY}&units=metric`)
    const data = await weather.json()
 
    const weatherList = data.list
    
    const newArray = []
    for (let i = 0; i < weatherList.length; i += 8) {
      newArray.push(weatherList[i]);
    }

    setForecast(newArray)
  }

  useEffect(() => {
    getWeather()
    getForecast()
  }, [lon])  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='w-full h-screen text-white px-8'>
      <nav className='w-full p-3 flex justify-between items-center'>
        <h1 className='font-bold tracking-wide text-3xl'>Weather App</h1>
        <div className='bg-white w-[15rem] overflow-hidden shadow-2xl rounded flex items-center p-2 gap-2'>
          <BiSearchAlt2 className='w-[2rem] h-[2rem] text-black' />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                getCity()
              }
            }}
            placeholder='Search city'
            className='focus:outline-none w-full text-[#212121] text-lg'
          />
        </div>
      </nav>
      <main className='w-full flex flex-wrap gap-8 py-4 px-[10%] items-center justify-center'>
        <WeatherCard
          place={weather?.data?.name}
          windspeed={weather?.data?.wind.speed}
          humidity={weather?.data?.main.humidity}
          temperature={weather?.data?.main.temp}
          heatIndex={weather?.data?.main.feels_like}
          iconString={`/images/weather_icons/${weather?.data?.weather[0].icon}.png`}
          conditions={weather?.data?.weather[0].description}
        />

        <div className='flex justify-center gap-8 flex-wrap w-[60%]'>
          {            
            forecast?.map(curr => {
              return (               
                <MiniCard
                  key={curr?.dt}
                  time={curr?.dt_txt}
                  tempMin={curr?.main?.temp_min}
                  tempMax={curr?.main?.temp_max}
                  iconString={`/images/weather_icons/${curr?.weather[0].icon}.png`}
                />
              )
            })
          }
        </div>
      </main>
    </div>
  )
}

export default App
