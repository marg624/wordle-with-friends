import Link from 'next/link'
import arrow from '../public/assets/arrow-icon.png';
import mainImage from '../public/assets/cover.png';
import playImage from '../public/assets/play.png';

type Props = {
    onClick: React.MouseEventHandler<HTMLButtonElement>
}

const StartGame = ({
  onClick,
}: Props) => {

  return (
    <div className="flex justify-center" >
      <h1 className="text-7xl mb-4 leading-snug">
        <img src={mainImage.src} width="100%" className="opacity-100" /> 
        <div className="bg-white bg-opacity-50" style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          width: '100%'
        }}>
          [ May luck be in your favor ] <br/>
          <button onClick={onClick} className="hover:scale-110" > 
            <img src={playImage.src} width="100px" /> 
          </button>
        </div>
      </h1>
    </div>    
  )
}

export default StartGame