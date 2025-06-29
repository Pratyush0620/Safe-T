import Card from '../components/Card';
const data = [
  {
    img: "https://images.pexels.com/photos/28262879/pexels-photo-28262879/free-photo-of-a-man-in-a-hat-sitting-on-a-chair.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    name: "Name 1",
    description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum necessitatibus ",
    link: "https://en.wikipedia.org/wiki/Whale_fall",
    color:"bg-[#FF5733]"
  },
  {
    img: "https://images.pexels.com/photos/17980629/pexels-photo-17980629/free-photo-of-woman-sitting-and-posing-in-leather-clothes.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
    name: "Name 2",
    description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum necessitatibus ",
    link: "https://en.wikipedia.org/wiki/Sarcosuchus",
    color:"bg-[#3498DB]"
  },
  {
    img: "https://images.pexels.com/photos/19619174/pexels-photo-19619174/free-photo-of-elegant-young-woman-posing-in-studio.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
    name: "Name 3",
    description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum necessitatibus ",
    link: "https://en.wikipedia.org/wiki/Human_skeleton",
    color:"bg-[#3357FF]"
  },
  {
    img: "https://images.pexels.com/photos/22718571/pexels-photo-22718571/free-photo-of-model-wearing-silver-boots-posing-on-a-metal-chair.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    name: "Name 4",
    description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum necessitatibus ",
    link: "https://en.wikipedia.org/wiki/Human_skeleton",
    color:"bg-[#F39C12]"
  },
  {
    img: "https://images.pexels.com/photos/17022653/pexels-photo-17022653/free-photo-of-model-in-wide-pants.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
    name: "Name 5",
    description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum necessitatibus ",
    link: "https://en.wikipedia.org/wiki/Human_skeleton",
    color:"bg-[#9B59B6]"
  },
  {
    img: "https://images.pexels.com/photos/3049508/pexels-photo-3049508.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
    name: "Name 6",
    description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum necessitatibus ",
    link: "https://en.wikipedia.org/wiki/Human_skeleton",
    color:"bg-[#1ABC9C]"
  },
  {
    img: "https://images.pexels.com/photos/27275339/pexels-photo-27275339/free-photo-of-a-woman-in-a-black-and-white-photo-posing.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
    name: "Name 7",
    description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum necessitatibus ",
    link: "https://en.wikipedia.org/wiki/Human_skeleton",
    color:"bg-[#E74C3C]"
  },
]
const Carousel = () => {
  return (
    <div className='my-[30vw]'>
        {
          data.map((info,index)=>{
            return <Card key={index} {...info}/>
          })
        }
    </div>
  )
}

export default Carousel