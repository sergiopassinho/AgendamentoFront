import { useEffect, useState } from 'react';
import { Calendar, Badge, Modal, Form, DatePicker, TimePicker, Select, Button, Layout, Menu, InputNumber, notification } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Header } from 'antd/es/layout/layout';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { Scheduling } from '../../models/agendamento';

const MeetingScheduler = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [time, setTime] = useState<Dayjs>();
  const [selectedDate, setSelectedDate] = useState();
  const [selectedDateFormated, setSelectedDateFormated] = useState<string>("");
  const [selectedHour, setSelectHour] = useState<string>("");
  const [selectRoom, setSelectRoom] = useState<string>("");
  const [selectDuration, setSelectDuration] = useState<number | null>(null);
  const [schedulings, setSchedulings] = useState<Scheduling[]>([]);
  const [toggle, setToggle] = useState<boolean>(false);

  const rooms = [
    { id: 1, name: 'LAB 601' },
    { id: 2, name: 'LAB 602' },
    { id: 3, name: 'LAB 603' }
  ];
  
  useEffect(() => {
    const fetchSchedulings = async () => {
      try {
        const response = await axios.get('/agendamentos');
        setSchedulings(response.data);
      } catch (e) {
        console.log(e);
      }
    }

    fetchSchedulings();
  }, [toggle]);

  const onSelectDate = (date: any) => {
    setSelectDuration(null);
    setSelectedDate(undefined);
    setTime(undefined);
    setSelectRoom("");
    form.resetFields();

    setSelectedDate(date);
    setSelectedDateFormated(date.format("YYYY-MM-DD"));
    setModalVisible(true);
  };

  const dateCellRender = (value: any) => {
    const formattedDate = value.format('YYYY-MM-DD');
    const dayMeetings = schedulings.filter(meeting => meeting.data === formattedDate);

    return (
      <ul className="events">
        {dayMeetings.map((meeting) => (
          <Badge status="error" text={`${meeting.horario} - ${addMinutesToTime(meeting.horario, meeting.duracao)} ${meeting.sala}`} />
        ))}
      </ul>
    );
  };

  const onTimeChange = (time: Dayjs) => {
    if(time) {
      setSelectHour(time.format("HH:mm"));
      setTime(time);
    }
  };

  const handleDurationChange = (value: any) => {
    setSelectDuration(value);
  };

  const onRoomChange = (value: string) => {
    setSelectRoom(value);
  };

  function addMinutesToTime(initialTime: string, minutesToAdd: number) {
    const [hours, minutes] = initialTime.split(':').map(Number);

    let totalMinutes = hours * 60 + minutes;

    totalMinutes += minutesToAdd;

    const resultingHours = Math.floor(totalMinutes / 60);
    const resultingMinutes = totalMinutes % 60;


    const formattedHours = String(resultingHours).padStart(2, '0');
    const formattedMinutes = String(resultingMinutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
  }

  const onAgendarClick = async () => { 
    try {
      await axios.post('/agendar',
        {
          data: selectedDateFormated,
          horario: selectedHour,
          sala: selectRoom,
          duracao: selectDuration
        }
      );

      setSelectDuration(null);
      setSelectedDate(undefined);
      setTime(undefined);
      setSelectRoom("");

      setToggle(!toggle);
      setModalVisible(false);
    } catch (e) {
      notification.error({
        message: 'Erro',
        description: 'Falha ao agendar o laboratório',
      });
    }
  };

  const disabledDate = (current: Dayjs | null) => {
    return current ? current.isBefore(dayjs().startOf('day')) : false;
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#001529' }}>
      <Header style={{padding: 0}}>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Link to="/agendamento">Agendamento</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Calendar cellRender={dateCellRender} onSelect={onSelectDate} disabledDate={disabledDate} />

      <Modal
        title="Agendar Reunião"
        open={modalVisible}
        onClose={() => form.resetFields()}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Data" initialValue={selectedDate} hidden>
            <DatePicker defaultValue={selectedDate} disabledDate={disabledDate} />
          </Form.Item>

          <Form.Item label="Hora" rules={[{ required: true, message: 'Por favor insira a hora da reunião' }]}>
            <TimePicker value={time} onChange={onTimeChange} format="HH:mm" />
          </Form.Item>

          <Form.Item name="duration" label="Duração (minutos)" rules={[{ required: true, message: 'Por favor insira a duração em segundos' }]}>
            <InputNumber min={0} value={selectDuration} onChange={handleDurationChange} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Sala" rules={[{ required: true, message: 'Por favor selecione a sala da reunião' }]}>
            <Select value={selectRoom} onChange={onRoomChange} placeholder="Selecione a sala">
              {rooms.map(room => (
                <Select.Option key={room.id} value={room.name}>{room.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={onAgendarClick}>
              Agendar
            </Button>

          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default MeetingScheduler;
