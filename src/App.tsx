import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import  MeetingScheduler  from './components/Agendamento/agendamento';
import Login from './components/Login/login';
import 'antd/dist/reset.css';
import './App.css';

const { Content } = Layout;

const App: React.FC = () => (
  <Router>
      <Content>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/agendamento" element={<MeetingScheduler />} />
        </Routes>
      </Content>
  </Router>
);

export default App;