import React from 'react'
interface CardProps {
  img: string;
  description: string;
  name: string;
  link: string;
  color:string
}

const Card: React.FC<CardProps> = ({ img, description, name, link, color }) => {
  return (
    <div className=' h-[100vh] flex items-center justify-center sticky top-0'>
        <div className={`${color} w-[55vw] h-[30vw] rounded-lg`}>
            <div className='w-[100%] h-[4vw] text-white text-[2vw] flex items-center justify-center  '>
                <h1 className=''>{name}</h1>
            </div>
            <div className='flex items-center justify-center w-[100%] h-[24vw]'>
                <div className='h-[24vw] w-[60%]  flex items-center justify-center'><h3 className=' text-[90%] text-center flex items-center justify-center'>{description}</h3></div>
                <div className='h-[24vw] w-[40%] flex items-center justify-center relative'>
                    <div className="imagediv w-[80%] rounded-lg absolute top-[-2vw]"><img src={img}  alt=""  className='w-[100%] h-[100%] object-cover rounded-lg'/></div>
                </div>
            </div>
            <a href={link}><h5 className='px-[2vw]'>LinkedIn</h5></a>
        </div>
    </div>
  )
}

export default Card