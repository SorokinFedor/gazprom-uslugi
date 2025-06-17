import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { registration, login } from '../http/userAPI';
import { CONFIRM_CODE, GAZPROM_ROUTE } from '../utils/consts';
import { Context } from '../index';

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

const ErrorMessage = styled.div`
  color: #d32f2f;
  margin-bottom: 20px;
  font-weight: 500;
  text-align: center;
`;

const SwitchMode = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 0.95rem;
  color: #555;
  user-select: none;

  a {
    color: #0b3d91;
    text-decoration: underline;
    cursor: pointer;
    transition: color 0.3s ease;
    &:hover {
      color: #095a8b;
    }
  }
`;

const HelpButton = styled.button`
  margin-top: 25px;
  background: none;
  border: none;
  color: #0b3d91;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.95rem;
  user-select: none;
  display: block;
  margin-left: auto;
  margin-right: auto;

  &:hover {
    color: #095a8b;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(11, 61, 145, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 14px;
  max-width: 400px;
  width: 90%;
  padding: 25px 30px;
  box-shadow: 0 10px 30px rgba(11, 61, 145, 0.2);
  user-select: none;
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  color: #0b3d91;
  font-weight: 700;
`;

const ModalList = styled.ul`
  padding-left: 20px;
  margin-bottom: 20px;
  color: #333;
  font-size: 1rem;
  line-height: 1.5;
`;

const ModalListItem = styled.li`
  margin-bottom: 10px;
`;

const ModalLink = styled(Link)`
  color: #0b3d91;
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: #095a8b;
  }
`;

const ModalCloseButton = styled.button`
  background-color: #0b3d91;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 22px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  user-select: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #095a8b;
  }
`;

const Auth = () => {
  const { user } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();

  const [title, setTitle] = useState('GazUsluga');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [snils, setSnils] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState('');

  const isRegistration = location.pathname === '/registration';

  useEffect(() => {
    setTitle(isRegistration ? 'Регистрация' : 'Авторизация');

    if (user.isAuth) {
      navigate(GAZPROM_ROUTE);
    }
  }, [isRegistration, user.isAuth, navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistration) {
        if (password !== confirmPassword) {
          setError('Пароли не совпадают!');
          return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
          setError('Введите корректный email!');
          return;
        }

        if (!/^\+7\d{10}$/.test(phoneNumber)) {
          setError('Номер телефона должен начинаться с +7 и содержать 10 цифр!');
          return;
        }

        const response = await registration({
          first_name: firstName,
          last_name: lastName,
          middle_name: middleName,
          date_of_birth: dateOfBirth,
          phone_number: phoneNumber,
          email,
          snils,
          password,
        });

        user.setUser({
          first_name: response.first_name,
          last_name: response.last_name,
        });
        user.setIsAuth(true);
        alert(`Регистрация успешна! Пожалуйста, проверьте вашу почту для активации.`);
        navigate(CONFIRM_CODE);
      } else {
        const { token, user: userData } = await login(email, password);
        user.setUser(userData);
        user.setIsAuth(true);
        user.setToken(token);
        alert(`Вход успешен!`);
        navigate(GAZPROM_ROUTE);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при выполнении запроса.');
    }
  };

  return (
    <>
      <GlobalStyle />
      <Background />
      <Wrapper>
        <Card>
          <Title>{title}</Title>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Form onSubmit={handleAuth}>
            {isRegistration ? (
              <>
                <Input
                  type="text"
                  placeholder="Имя"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <Input
                  type="text"
                  placeholder="Фамилия"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                <Input
                  type="text"
                  placeholder="Отчество"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                />
                <Input
                  type="date"
                  placeholder="Дата рождения"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />
                <Input
                  type="text"
                  placeholder="Номер телефона"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
                <Input
                  type="text"
                  placeholder="СНИЛС"
                  value={snils}
                  onChange={(e) => setSnils(e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Подтверждение пароля"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button type="submit">Зарегистрироваться</Button>
                <SwitchMode>
                  Уже есть аккаунт? <Link to="/login">Войдите</Link>
                </SwitchMode>
              </>
            ) : (
              <>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button type="submit">Войти</Button>
                <SwitchMode>
                  Нет аккаунта? <Link to="/registration">Зарегистрируйтесь</Link>
                </SwitchMode>
              </>
            )}
          </Form>
          <HelpButton onClick={() => setShowHelp(true)}>Не удается войти?</HelpButton>

          {showHelp && (
            <ModalOverlay onClick={() => setShowHelp(false)}>
              <ModalContent onClick={e => e.stopPropagation()}>
                <ModalTitle>Не удаётся войти?</ModalTitle>
                <ModalList>
                  <ModalListItem>Проверьте корректность вводимых данных – без тире и пробелов, язык ввода, клавишу «Caps Lock».</ModalListItem>
                  <ModalListItem>
                    Воспользуйтесь функцией{' '}
                    <ModalLink to="/reset-password" onClick={() => setShowHelp(false)}>
                      восстановления пароля
                    </ModalLink>.
                  </ModalListItem>
                </ModalList>
                <p>
                  Ещё один способ — личное обращение в филиал Газпрома города Твери.
                </p>
                <ModalCloseButton onClick={() => setShowHelp(false)}>Закрыть</ModalCloseButton>
              </ModalContent>
            </ModalOverlay>
          )}
        </Card>
      </Wrapper>
    </>
  );
};
export default Auth;