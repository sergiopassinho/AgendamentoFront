import { useState } from 'react';
import { Calendar, Badge, Modal, Form, DatePicker, TimePicker, Select, Button, Layout, Menu } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Header } from 'antd/es/layout/layout';
import { Link } from 'react-router-dom';

const rooms = [
  { id: 1, name: 'LAB 601' },
  { id: 2, name: 'LAB 602' },
  { id: 3, name: 'LAB 603' }
];

const existingMeetings = [
  { date: '2024-06-10', time: '10:00', room: 'LAB 601'},
  { date: '2024-06-10', time: '14:00', room: 'LAB 602'}
];

const MeetingScheduler = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState(null);

  const onSelectDate = (date: any) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const onSubmit = (values: any) => {
    console.log('Reunião marcada:', values.room);
    console.log(values.date.format("HH:mm"))
    console.log(values.time.format("YYYY/MM/DD"))

    form.resetFields();
    setModalVisible(false);
  };

  const dateCellRender = (value: any) => {
    const formattedDate = value.format('YYYY-MM-DD');
    const dayMeetings = existingMeetings.filter(meeting => meeting.date === formattedDate);

    return (
      <ul className="events">
        {dayMeetings.map((meeting, index) => (
          <li key={index}>
            <Badge status="success" text={`${meeting.time} - ${meeting.room}`} />
          </li>
        ))}
      </ul>
    );
  };

  const disabledDate = (current: Dayjs | null) => {
    // Retorna true se a data for anterior ao dia atual, desabilitando-a
    return current ? current.isBefore(dayjs().startOf('day')) : false;
  };

  const disabledTime = () => {
    const now = dayjs();
    const hour = now.hour();
    const minute = now.minute();
    const second = now.second();
  
    // Retorna undefined para habilitar todas as horas
    return {
      disabledHours: () => [],
      disabledMinutes: (selectedHour: number) => selectedHour === hour ? Array.from({ length: minute }, (_, i) => i) : [],
      disabledSeconds: (selectedHour: number, selectedMinute: number) => (selectedHour === hour && selectedMinute === minute) ? Array.from({ length: second }, (_, i) => i) : []
    };
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
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={onSubmit} layout="vertical">
          <Form.Item name="date" label="Data" initialValue={selectedDate} hidden>
            <DatePicker defaultValue={selectedDate} disabledDate={disabledDate} />
          </Form.Item>

          <Form.Item name="time" label="Hora" rules={[{ required: true, message: 'Por favor insira a hora da reunião' }]}>
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.Item name="room" label="Sala" rules={[{ required: true, message: 'Por favor selecione a sala da reunião' }]}>
            <Select placeholder="Selecione a sala">
              {rooms.map(room => (
                <Select.Option key={room.id} value={room.name}>{room.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Agendar
            </Button>

          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default MeetingScheduler;
