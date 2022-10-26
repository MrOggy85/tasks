type Props = {
  name: string;
  bgColor: string;
  textColor: string;
};

const Pill = ({ name, bgColor, textColor }: Props) => {
  return (
    <div
      style={{
        display: 'inline-block',
        padding: '0 8px',
        borderRadius: 6,
        backgroundColor: bgColor,
        color: textColor,
        border: '1px solid #d1d4d6',
        fontSize: '0.8em',
      }}
    >
      {name}
    </div>
  );
};

export default Pill;
