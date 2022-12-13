import { Link, useNavigate } from 'react-router-dom';
import { FiEdit, FiRefreshCw, FiTrash2, FiPlusCircle } from 'react-icons/fi';
import { Container, Spinner, Table } from 'react-bootstrap';
import { getAll, remove } from '../../core/tags/tagSlice';
import Pill from '../../components/Pill';
import { useAppDispatch } from '../../core/redux/useAppDispatch';
import { useAppSelector } from '../../core/redux/useAppSelector';
import Button from '../../components/Button';

const TagList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tags = useAppSelector((x) => x.tags.tags);
  const loading = useAppSelector((x) => x.tags.loading);
  console.log('TagList', tags, loading);

  const onUpdate = async () => {
    await dispatch(getAll());
  };
  const onRemove = async (id: number) => {
    await dispatch(remove(id));
  };
  const onEdit = async (id: number) => {
    navigate(`/tag/${id}`);
  };

  return (
    <Container style={{ marginTop: 10 }}>
      <h2>Tags</h2>
      <Button
        style={{ marginBottom: 4, marginRight: 4 }}
        variant="success"
        type="button"
        disabled={loading}
        onClick={() => {
          onUpdate();
        }}
        content={
          loading ? <Spinner size="sm" animation="border" /> : <FiRefreshCw />
        }
      />
      <Button
        style={{ marginBottom: 4 }}
        variant="outline-primary"
        type="button"
        disabled={loading}
        content={
          <Link to="/tag/0">
            <FiPlusCircle />
          </Link>
        }
      />

      <Table bordered>
        <thead>
          <tr>
            <th style={{ width: 6 }}>#</th>
            <th style={{ width: 5 }}>Title</th>
            <th style={{ width: 5 }}>BG Color</th>
            <th style={{ width: 5 }}>Text Color</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((x) => {
            return (
              <tr key={x.id}>
                <td>
                  <Button
                    style={{ marginRight: 4 }}
                    variant="light"
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      onRemove(x.id);
                    }}
                    content={<FiTrash2 />}
                  />
                  <Button
                    style={{ marginRight: 4 }}
                    variant="light"
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      onEdit(x.id);
                    }}
                    content={<FiEdit />}
                  />
                  <span style={{ color: '#666', fontSize: 11 }}>
                    ID: {x.id}
                  </span>
                </td>
                <td>
                  <Pill
                    name={x.name}
                    bgColor={x.bgColor}
                    textColor={x.textColor}
                  />
                </td>
                <td>{x.bgColor}</td>
                <td>{x.textColor}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default TagList;
