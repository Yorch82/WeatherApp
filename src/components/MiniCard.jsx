/* eslint-disable react/prop-types */

const MiniCard = ({ time, tempMin, tempMax, iconString }) => {

  return (
    <div className='card w-[10rem] h-[10rem] p-4 flex flex-col'>
      <p className='text-center'>
        {new Date(time).toLocaleTimeString('en', { weekday: 'long' }).split(" ")[0]}
      </p>
      <hr />
      <div className='w-full flex justify-center items-center flex-1'>
        <img src={iconString} alt="forecast not available" className='w-[4rem] h-[4rem]' />
      </div>
      <p className='text-center font-bold'>Min {tempMin}&deg;C</p>
      <p className='text-center font-bold'>Max {tempMax}&deg;C</p>
    </div>
  )
}

export default MiniCard
