import { Form } from 'react-bootstrap';

type Props = {
  label: string;
  emptyOptionLabel?: string;
  options: {
    value: string;
    label: string;
  }[];
  value: string;
  setValue: (v: string) => void;
};

const Input = ({
  label,
  emptyOptionLabel,
  options,
  value,
  setValue,
}: Props) => {
  return (
    <Form.Group>
      <Form.Label style={{ display: 'block', fontWeight: 'bold' }}>
        {label}
      </Form.Label>
      <Form.Select
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      >
        <option>{emptyOptionLabel || ''}</option>
        {options.map((x) => (
          <option key={x.value} value={x.value}>
            {x.label}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default Input;
