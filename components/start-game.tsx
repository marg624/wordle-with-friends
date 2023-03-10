import Link from 'next/link'
import arrow from '../public/assets/arrow-icon.png';
import mainImage from '../public/assets/cover.png';

type Props = {
    onClick: React.MouseEventHandler<HTMLButtonElement>
}

const StartGame = ({
  onClick,
}: Props) => {

  return (
    <div className="flex justify-center" >
      <h3 className="text-3xl mb-3 leading-snug">
      <button onClick={onClick} className="hover:text-gray-700"> <img src={mainImage.src} width="100%"/> [ May luck be in your favor ] </button>
      </h3>
    </div>
  )
}

export default StartGame
