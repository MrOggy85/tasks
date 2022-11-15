import type { ReactNode } from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';

type Props = {
  variant:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'dark'
    | 'light'
    | 'outline-primary'
    | 'outline-secondary'
    | 'outline-success'
    | 'outline-danger'
    | 'outline-warning'
    | 'outline-info'
    | 'outline-dark'
    | 'outline-light';
  content: ReactNode;
  onClick: () => void;
  style?: React.CSSProperties | undefined;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

const Button = ({
  content,
  variant,
  onClick,
  disabled,
  style,
  type,
}: Props) => {
  return (
    <BootstrapButton
      style={style}
      variant={variant}
      type={type || 'button'}
      disabled={disabled}
      onClick={onClick}
    >
      {content}
    </BootstrapButton>
  );
};

export default Button;
