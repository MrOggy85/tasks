import type { ComponentProps } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
// import {
//   Input,
//   InputGroup,
//   InputGroupText,
// } from 'reactstrap';

type FormProps = ComponentProps<typeof Form.Control>;

type Props = {
  label: string;
  value: FormProps['value'];
  onChange: (newValue: string) => void;
  displayAfter?: string;
  type: FormProps['type'];
  disabled?: boolean;
  step?: number;
};

const InputField = ({
  label,
  value,
  onChange,
  displayAfter,
  disabled,
  step,
  type,
}: Props) => (
  <Form.Group className="mb-3">
    <Form.Label style={{ display: 'block', fontWeight: 'bold' }}>
      {label}
    </Form.Label>
    <Form.Control
      step={step}
      disabled={disabled}
      type={type}
      value={value}
      onChange={({ target: { value } }) => {
        onChange(value);
      }}
    />
    {displayAfter && <InputGroup.Text>{displayAfter}</InputGroup.Text>}
  </Form.Group>
);

export default InputField;
