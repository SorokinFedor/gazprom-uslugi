import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { Context } from '../index';
import { GAZPROM_ROUTE } from '../utils/consts';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    overflow-x: hidden;
    background: #f0f2f5;
  }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Background = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(270deg, #89f7fe, #66a6ff, #0b3d91);
  background-size: 600% 600%;
  animation: ${gradientShift} 20s ease infinite;
  z-index: -1;
`;

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Card = styled.div`
  background: #fff;
  padding: 40px 35px 35px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(11, 61, 145, 0.15);
  max-width: 420px;
  width: 100%;
  position: relative;
`;

const Title = styled.h2`
  margin: 0 0 30px;
  text-align: center;
  color: #0b3d91;
  font-weight: 700;
  font-size: 2.5rem;
  user-select: none;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 14px 16px;
  margin-bottom: 20px;
  border: 2px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  outline: none;
  &:focus {
    border-color: #0b3d91;
    box-shadow: 0 0 8px rgba(11, 61, 145, 0.3);
  }
`;

const Button = styled.button`
  padding: 14px 0;
  background-color: #0b3d91;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  user-select: none;

  &:hover {
    background-color: #095a8b;
  }

  &:disabled {
    background-color: #7a8dbf;
    cursor: not-allowed;
  }
`;

const Message = styled.p`
  text-align: center;
  font-weight: 500;
  margin-top: 10px;
  color: ${({ error }) => (error ? '#d32f2f' : '#388e3c')};
  user-select: none;
`;

const ConfirmCode = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(Context);

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess(false);

      const response = await axios.post('http://localhost:5000/api/activate', { activationCode: code });

      if (response.data.token) {
        const { first_name, last_name } = response.data;
        user.setIsAuth(true);
        user.setUser({ first_name, last_name });

        setSuccess(true);
        alert('Код подтвержден!');
        navigate(GAZPROM_ROUTE);
      } else {
        setError('Неверный код. Попробуйте еще раз.');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Неверный код. Попробуйте еще раз.');
      } else {
        setError('Произошла ошибка. Попробуйте снова.');
      }
      setSuccess(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Background />
      <Wrapper>
        <Card>
          <Title>Подтверждение кода</Title>
          <Form onSubmit={handleConfirm}>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Введите код активации"
              required
              autoFocus
            />
            <Button type="submit" disabled={!code.trim()}>
              Подтвердить
            </Button>
          </Form>
          {error && <Message error>{error}</Message>}
          {success && <Message>Код успешно подтвержден!</Message>}
        </Card>
      </Wrapper>
    </>
  );
};
export default ConfirmCode;