/* eslint-disable react/prop-types */
import { useDate } from '../Utils/useDate'
import '../index.css'

const WeatherCard = ({
  temperature,
  windspeed,
  humidity,
  place,
  heatIndex,
  iconString,
  conditions,
}) => {

  const { time } = useDate()

  return (
    <div className='w-[22rem] min-w-[22rem] h-[30rem] card p-4'>
      <div className='flex w-full just-center, items-center gap-4 mt-12 mb-4'>
        <img src={iconString} alt="weather_icon" />
        <span className='font-bold text-5xl flex justify-center items-center' >{temperature} &deg;C</span>
      </div>
      <div className='font-bold text-center text-xl'>
        {place}
      </div>
      <div className='w-full flex justify-between items-center mt-4'>
        <span className='flex-1 text-center p-2'>{new Date().toDateString()}</span>
        <span className='flex-1 text-center p-2'>{time}</span>
      </div>
      <div className='w-full flex justify-between items-center mt-4 gap-4'>
        <span className='flex-1 text-center p-2 font-bold bg-blue-600 shadow rounded-lg'>Wind Speed <span className='font-normal'>{windspeed} km/h</span></span>
        <span className='flex-1 text-center p-2 h-16 font-bold rounded-lg bg-green-600'>Humidity <span className='font-normal'>{humidity} g/m&#179;</span></span>
      </div>
      <div className='w-full p-3 mt-4 flex justify-between items-center'>
        <span className='font-semibold text-lg'>Feels like</span>
        <span className='text-lg'>{heatIndex ? heatIndex : 'N/A'}</span>
      </div>
      <hr className='bg-slate-600' />
      <div className='w-full p-4 flex justify-center items-center text-3xl font-semibold capitalize'>
        {conditions}
      </div>
    </div>
  )
}

export default WeatherCard