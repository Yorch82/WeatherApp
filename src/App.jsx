import { useState } from 'react'
import { BiSearchAlt2 } from 'react-icons/bi'
import WeatherCard from './components/Weathercard'
import MiniCard from './components/MiniCard'

function App() {
  const [input, setInput] = useState('')

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
                // submit
              }
            }}
            placeholder='Search city'
            className='focus:outline-none w-full text-[#212121] text-lg'
          />
        </div>
      </nav>
      <main className='w-full flex flex-wrap gap-8 py-4 px-[10%] items-center justify-center'>
        <WeatherCard
          place="Ibiza"
          windspeed="100"
          humidity="120"
          temperature="23"
          heatIndex="35.7"
          iconString="/images/weather_icons/01d.png"
          conditions="clear"
        />

        {/* <div className='flex justify-center gap-8 flex-wrap w-[60%]'>
          {
            values?.slice(1, 7).map(curr => {
              return (
                <MiniCard
                  key={curr.datetime}
                  time={curr.datetime}
                  temp={curr.temp}
                  iconString={curr.conditions}
                />
              )
            })
          }
        </div> */}
      </main>
    </div>
  )
}

export default App
