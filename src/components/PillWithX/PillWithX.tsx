import { useState } from 'react';
import { FiX } from 'react-icons/fi';

type Props = {
  name: string;
  bgColor: string;
  textColor: string;
  onClick: () => void;
};

const PillWithX = ({ name, bgColor, textColor, onClick }: Props) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 6,
        backgroundColor: bgColor,
        color: textColor,
        cursor: 'pointer',
        border: hover ? '1px solid red' : '',
      }}
      onMouseOver={() => {
        setHover(true);
      }}
      onMouseOut={() => {
        setHover(false);
      }}
      onClick={onClick}
    >
      {name}
      <FiX />
    </div>
  );
};

export default PillWithX;
