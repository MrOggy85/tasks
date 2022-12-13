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
  onClick?: () => void;
  style?: React.CSSProperties | undefined;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

const Button = ({
  content,
  variant,
  onClick,
  disabled,
  style,
  className,
  type,
}: Props) => {
  return (
    <BootstrapButton
      style={style}
      className={className}
      variant={variant}
      type={type || 'button'}
      disabled={disabled}
      onClick={onClick}
      size="sm"
    >
      {content}
    </BootstrapButton>
  );
};

export default Button;
