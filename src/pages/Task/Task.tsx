import { ComponentProps, useEffect, useState } from 'react';
import format from 'date-fns/format';
import { FiTrash2 } from 'react-icons/fi';
import { parseCronExpression } from 'cron-schedule';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Form, InputGroup, Spinner } from 'react-bootstrap';
import getPrio from '../../core/getPrio';
import type { RootState } from '../../core/redux/store';
import { add, update } from '../../core/tasks/taskSlice';
import getCron from '../../core/getCron';
import PillWithX from '../../components/PillWithX';
import { useAppSelector } from '../../core/redux/useAppSelector';
import { useAppDispatch } from '../../core/redux/useAppDispatch';

type Task = RootState['tasks']['tasks'][0];
type CronType = Parameters<typeof getCron>[0];

type InputFieldProps = {
  label: string;
  value: ComponentProps<typeof Form.Control>['value'];
  onChange: (newValue: string) => void;
  displayAfter?: string;
  type: ComponentProps<typeof Form.Control>['type'];
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
}: InputFieldProps) => (
  <InputGroup>
    <InputGroup.Text>{label}</InputGroup.Text>
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
  </InputGroup>
);

const Task = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const tasks = useAppSelector((x) => x.tasks.tasks);
  console.log('Task', tasks);
  const loading = useAppSelector((x) => x.tasks.loading);
  const tags = useAppSelector((x) => x.tags.tags);

  const id = Number(params.id);
  const currentTask = id ? tasks.find((x) => x.id === id) : undefined;
  console.log('currentTask', currentTask);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<Task['priority']>(0);
  const [chosenTags, setChosenTags] = useState<number[]>([]);
  const [tagSelect, setTagSelect] = useState<number>(0);
  const [repeatHelper, setRepeatHelper] = useState<CronType | ''>('');
  const [repeatCronPattern, setRepeatCronPattern] = useState('');
  const [repeatType, setRepeatType] =
    useState<Task['repeatType']>('completionDate');

  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title);

      setStartDate(
        currentTask.startDate ? new Date(currentTask.startDate) : undefined,
      );
      setEndDate(
        currentTask.endDate ? new Date(currentTask.endDate) : undefined,
      );
      setPriority(currentTask.priority || 0);
      setChosenTags(currentTask.tags.map((x) => x.id) || []);
      setRepeatCronPattern(currentTask.repeat);
      setRepeatType(currentTask.repeatType);
    }
  }, [currentTask]);

  const onAdd = async () => {
    const action = await dispatch(
      add({
        title,
        description,
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined,
        priority,
        repeat: repeatCronPattern,
        repeatType,
        tagIds: chosenTags,
      }),
    );

    if (action.type === add.fulfilled.type) {
      navigate('/');
    } else {
      alert('Something went wrong');
    }
  };

  const onEdit = async () => {
    const action = await dispatch(
      update({
        id,
        title,
        description,
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined,
        priority,
        repeat: repeatCronPattern,
        repeatType,
        tagIds: chosenTags,
      }),
    );

    if (action.type === update.fulfilled.type) {
      navigate('/');
    } else {
      alert('Something went wrong');
    }
  };

  let nextDate: Date | undefined = undefined;
  try {
    nextDate = repeatCronPattern
      ? parseCronExpression(repeatCronPattern).getNextDate(
          repeatType === 'endDate' ? endDate : undefined,
        )
      : undefined;
  } catch (error) {
    console.log('Failed to parse Cron');
  }

  return (
    <Container style={{ marginTop: 10, maxWidth: 600 }}>
      <h2>{id > 0 ? 'Edit' : 'New'} Task</h2>
      <p style={{ margin: 0, color: '#666', fontSize: 11 }}>ID: {id}</p>
      {currentTask?.createdAt && (
        <p style={{ margin: 0, color: '#666', fontSize: 11 }}>
          createdAt: {currentTask.createdAt}
        </p>
      )}
      {currentTask?.updatedAt && (
        <p style={{ margin: 0, color: '#666', fontSize: 11 }}>
          updatedAt: {currentTask.updatedAt}
        </p>
      )}
      <InputField label="Title" value={title} onChange={setTitle} type="text" />
      <InputField
        label="Description"
        value={description}
        onChange={setDescription}
        type="textarea"
      />

      <div style={{ display: 'flex' }}>
        <InputGroup className="mb-3 mt-3">
          <InputField
            label="Start Date"
            value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
            onChange={(newValue) => {
              if (!newValue) {
                return;
              }
              const now = new Date();
              const year = Number(newValue.split('-')[0]) || now.getFullYear();
              const month =
                Number(newValue.split('-')[1]) - 1 || now.getMonth();
              const date = Number(newValue.split('-')[2]) || now.getDate();
              const hour =
                startDate?.getHours() !== undefined
                  ? startDate.getHours()
                  : now.getHours();
              const minute =
                startDate?.getMinutes() !== undefined
                  ? startDate.getMinutes()
                  : now.getMinutes();
              setStartDate(new Date(year, month, date, hour, minute));
            }}
            type="date"
          />
          <InputField
            label="Start Time"
            value={startDate ? format(startDate, 'HH:mm') : ''}
            onChange={(newValue) => {
              if (!newValue) {
                return;
              }
              const now = new Date();
              const year = startDate?.getFullYear() || now.getFullYear();
              const month = startDate?.getMonth() || now.getMonth();
              const date = startDate?.getDate() || now.getDate();
              const hour = Number(newValue.split(':')[0]);
              const minute = Number(newValue.split(':')[1]);
              setStartDate(new Date(year, month, date, hour, minute));
            }}
            type="time"
          />
          <Button
            color="danger"
            type="button"
            onClick={() => {
              setStartDate(undefined);
            }}
          >
            <FiTrash2 />
          </Button>
        </InputGroup>

        <InputGroup className="mb-3 mt-3">
          <InputField
            label="End Date"
            value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
            onChange={(newValue) => {
              if (!newValue) {
                return;
              }
              const now = new Date();
              const year = Number(newValue.split('-')[0]) || now.getFullYear();
              const month =
                Number(newValue.split('-')[1]) - 1 || now.getMonth();
              const date = Number(newValue.split('-')[2]) || now.getDate();
              const hour =
                endDate?.getHours() !== undefined
                  ? endDate.getHours()
                  : now.getHours();
              const minute =
                endDate?.getMinutes() !== undefined
                  ? endDate.getMinutes()
                  : now.getMinutes();
              setEndDate(new Date(year, month, date, hour, minute));
            }}
            type="date"
          />
          <InputField
            label="End Time"
            value={endDate ? format(endDate, 'HH:mm') : ''}
            onChange={(newValue) => {
              if (!newValue) {
                return;
              }
              const now = new Date();
              const year = endDate?.getFullYear() || now.getFullYear();
              const month = endDate?.getMonth() || now.getMonth();
              const date = endDate?.getDate() || now.getDate();
              const hour = Number(newValue.split(':')[0]);
              const minute = Number(newValue.split(':')[1]);
              setEndDate(new Date(year, month, date, hour, minute));
            }}
            type="time"
          />
          <Button
            color="danger"
            type="button"
            onClick={() => {
              setEndDate(undefined);
            }}
          >
            <FiTrash2 />
          </Button>
        </InputGroup>
      </div>

      <InputGroup style={{ marginBottom: 5 }}>
        <InputGroup.Text>Priority</InputGroup.Text>
        <Form.Select
          value={priority}
          onChange={(event) => {
            setPriority(
              (event.target.value as unknown as Task['priority'] | undefined) ||
                0,
            );
          }}
        >
          {([1, 2, 3, 4] as Task['priority'][]).map((x) => (
            <option key={x} value={x}>
              {getPrio(x).content}
            </option>
          ))}
        </Form.Select>
      </InputGroup>

      <div style={{ marginBottom: 10 }}>
        <InputGroup style={{ marginBottom: 5 }}>
          <InputGroup.Text>Tags</InputGroup.Text>
          <Form.Select
            value={tagSelect}
            onChange={(event) => {
              setTagSelect(Number(event.target.value));
            }}
          >
            <option></option>
            {tags.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </Form.Select>
          <Button
            disabled={chosenTags.includes(tagSelect) || !tagSelect}
            onClick={() => {
              setChosenTags([...chosenTags, tagSelect]);
            }}
          >
            ADD
          </Button>
        </InputGroup>
        {chosenTags.map((x) => {
          const tag = tags.find((t) => t.id === x);
          return (
            <PillWithX
              key={x}
              name={tag?.name || 'Unknown'}
              bgColor={tag?.bgColor || ''}
              textColor={tag?.textColor || ''}
              onClick={() => {
                setChosenTags(chosenTags.filter((t) => t !== x));
              }}
            />
          );
        })}
      </div>

      <InputGroup style={{ marginBottom: 5 }}>
        <InputGroup.Text>Repeat</InputGroup.Text>
        <Form.Select
          value={repeatHelper}
          onChange={(event) => {
            const value = event.target.value as CronType | undefined;
            console.log('value', value);
            if (!value) {
              setRepeatCronPattern('');
            } else {
              setRepeatCronPattern(getCron(value, endDate, repeatType));
            }
            setRepeatHelper(value || '');
          }}
        >
          <option value="">None</option>
          {(
            [
              'daily',
              'weekdays',
              'weekends',
              'weekly',
              'monthly',
              'yearly',
            ] as CronType[]
          ).map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </Form.Select>
      </InputGroup>

      <InputField
        label="Repeat CRON pattern"
        value={repeatCronPattern}
        onChange={setRepeatCronPattern}
        type="text"
      />
      <p style={{ margin: 0, color: '#666', fontSize: 11 }}>
        {nextDate
          ? `Next Date: ${nextDate.toISOString()} UTC - ${nextDate.toLocaleString()} JST`
          : ''}
      </p>
      <p style={{ margin: 0, color: '#666', fontSize: 11 }}>
        {nextDate
          ? `Now Date: ${new Date().toISOString()} UTC - ${new Date().toLocaleString()} JST`
          : ''}
      </p>

      <InputGroup style={{ marginBottom: 5 }}>
        <InputGroup.Text>RepeatType</InputGroup.Text>
        <Form.Select
          value={repeatType}
          onChange={(event) => {
            setRepeatType(event.target.value as Task['repeatType']);
          }}
        >
          {(['completionDate', 'endDate'] as Task['repeatType'][]).map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </Form.Select>
      </InputGroup>

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
            <Spinner animation="border" size="sm" />
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

export default Task;
