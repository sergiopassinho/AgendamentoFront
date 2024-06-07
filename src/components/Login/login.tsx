import React from 'react';
import { Form, Input, Button, Checkbox, Card, Layout, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;

const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      await axios.post('/autenticar',
      {
        usuario: values.username,
        senha: values.password
      });

      navigate('/agendamento');

    } catch (e) {
      notification.error({
        message: 'Erro',
        description: 'Ocorreu um erro ao processar sua solicitação.',
      });
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#001529' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card title="Login" style={{ width: 300 }}>
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Por favor insira seu nome de usuário!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nome de usuário" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Por favor insira sua senha!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Senha" />
            </Form.Item>

            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Lembrar-me</Checkbox>
              </Form.Item>

              <a style={{ float: 'right' }} href="">
                Esqueceu a senha?
              </a>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Entrar
              </Button>
            </Form.Item>
            
            <Form.Item>
              <a href="" style={{ float: 'right' }}>
                Registrar agora!
              </a>
            </Form.Item>
          </Form>

        </Card>
      </Content>
    </Layout>
  );
};

export default Login;
