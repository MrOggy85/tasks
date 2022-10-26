import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container, InputGroup, Spinner } from 'react-bootstrap';
import { add, update } from '../../core/tags/tagSlice';
import InputField from '../../components/InputField';
import Pill from '../../components/Pill';
import { useAppDispatch } from '../../core/redux/useAppDispatch';
import { useAppSelector } from '../../core/redux/useAppSelector';

const TagDetail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const tags = useAppSelector((x) => x.tags.tags);
  const loading = useAppSelector((x) => x.tags.loading);

  const id = Number(params.id);
  const currentTag = id ? tags.find((x) => x.id === id) : undefined;
  const [name, setName] = useState(currentTag?.name || '');
  const [bgColor, setBgColor] = useState(currentTag?.bgColor || '');
  const [textColor, setTextColor] = useState(currentTag?.textColor || '');

  const onAdd = async () => {
    const action = await dispatch(
      add({
        name,
        bgColor,
        textColor,
      }),
    );

    if (action.type === add.fulfilled.type) {
      navigate('/tag');
    } else {
      alert('Something went wrong');
    }
  };

  const onEdit = async () => {
    const action = await dispatch(
      update({
        id,
        name,
        bgColor,
        textColor,
      }),
    );

    if (action.type === update.fulfilled.type) {
      navigate('/tag');
    } else {
      alert('Something went wrong');
    }
  };

  return (
    <Container style={{ marginTop: 10 }}>
      <h2>{id > 0 ? 'Edit' : 'New'} Tag</h2>
      <p style={{ margin: 0, color: '#666', fontSize: 11 }}>ID: {id}</p>
      {currentTag?.createdAt && (
        <p style={{ margin: 0, color: '#666', fontSize: 11 }}>
          createdAt: {currentTag.createdAt}
        </p>
      )}
      {currentTag?.updatedAt && (
        <p style={{ margin: 0, color: '#666', fontSize: 11 }}>
          updatedAt: {currentTag.updatedAt}
        </p>
      )}

      <div style={{ marginBottom: 10 }}>
        <p style={{ marginBottom: 4 }}>Preview</p>
        <Pill name={name} bgColor={bgColor} textColor={textColor} />
      </div>

      <InputField label="Name" value={name} onChange={setName} type="text" />
      <InputField
        label="Bg Color"
        value={bgColor}
        onChange={setBgColor}
        type="color"
      />
      <InputField
        label="Text Color"
        value={textColor}
        onChange={setTextColor}
        type="color"
      />

      <InputGroup className="mb-3 mt-3">
        <Button
          disabled={loading}
          color={id ? 'success' : 'primary'}
          type="button"
          onClick={() => {
            if (id) {
              onEdit();
            } else {
              onAdd();
            }
          }}
        >
          {loading ? (
            <Spinner size="sm" animation="border" />
          ) : id ? (
            'UPDATE'
          ) : (
            'ADD'
          )}
        </Button>
      </InputGroup>
    </Container>
  );
};

export default TagDetail;
