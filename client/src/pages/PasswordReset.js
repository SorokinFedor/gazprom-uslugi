import React, { useState } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

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
  box-sizing: border-box;

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
  margin-bottom: 15px;

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
  color: ${({ error }) => (error ? '#d32f2f' : '#388e3c')};
  user-select: none;
`;

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    if (email.trim() === '') {
      setMessage('Пожалуйста, введите ваш email.');
      setError(true);
    } else {
      setMessage('На ваш email отправлено письмо с кодом восстановления.');
      setError(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Background />
      <Wrapper>
        <Card>
          <Title>Восстановление пароля</Title>
          <Form onSubmit={handleReset}>
            <Input
              type="email"
              placeholder="Введите ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            <Button type="submit" disabled={!email.trim()}>
              Отправить код
            </Button>
          </Form>
          {message && <Message error={error}>{message}</Message>}
        </Card>
      </Wrapper>
    </>
  );
};
export default PasswordReset;