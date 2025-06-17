import React, { useState, useEffect, useContext} from 'react';
import { AGREEMENT_ROUTE, GAZPROM_ROUTE } from '../utils/consts';
import { Link, useNavigate} from 'react-router-dom';
import { observer } from 'mobx-react-lite'; 
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { Context } from '../index'
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    overflow-x: hidden;
  }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Background = styled.div`
  position: fixed;
  top: 0; 
  left: 0; 
  right: 0; 
  bottom: 0;
  background: linear-gradient(270deg, #89f7fe, #66a6ff);
  background-size: 600% 600%;
  animation: ${gradientShift} 15s ease infinite;
  z-index: -1; 
`;

const Container = styled.div`
  max-width: 700px;
  margin: 40px auto;
  padding: 30px 25px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  color: #333;
  position: relative; 
  background-color: white; 
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.div`
  font-weight: bold;
  font-size: 22px;
  text-transform: uppercase;
  color: #007bff;
`;

const SubTitle = styled.div`
  font-size: 16px;
  color: #777;
  margin-top: 4px;
`;

const Section = styled.div`
  padding: 20px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #f0f4f8, #e8eef1);
  border-radius: 12px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
`;

const SectionHeader = styled.h2`
  font-size: 1.8em;
  margin-bottom: 12px;
  color: #007bff;
  border-bottom: 2px solid #007bff;
  padding-bottom: 4px;
`;

const InfoText = styled.p`
  font-size: 16px;
  margin-bottom: 8px;
  line-height: 1.5;
`;

const ButtonLink = styled.button`
  display: inline-block;
  margin-top: 12px;
  font-size: 14px;
  color: #007bff;
  cursor: pointer;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #007bff;
  background: transparent;
  transition: all 0.3s ease;

  &:hover {
    background: #007bff;
    color: #fff;
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
    transform: translateY(-2px);
  }

  &.delete {
    background-color: #dc3545;
    color: #fff;

    &:hover {
      background-color: #c82333;
    }
  }
`;
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px 25px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  position: relative;
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 20px;
  color: #007bff;
  font-size: 1.6em;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  font-size: 16px;
  border-radius: 8px;
  border: 1.5px solid #ccc;
  margin-bottom: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const ModalButton = styled.button`
  padding: 10px 18px;
  font-size: 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  min-width: 90px;

  &.primary {
    background-color: #007bff;
    color: white;

    &:disabled {
      background-color: #7aaefc;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      background-color: #0056b3;
    }
  }

  &.secondary {
    background-color: #eee;
    color: #333;

    &:hover {
      background-color: #ddd;
    }
  }

  &.danger {
    background-color: #dc3545;
    color: white;

    &:hover {
      background-color: #a71d2a;
    }
  }
`;

const ErrorText = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: -12px;
  margin-bottom: 12px;
`;

const CaptchaImage = styled.div`
  user-select: none;
  background-color: #f0f0f0;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  font-size: 28px;
  text-align: center;
  padding: 14px 0;
  margin-bottom: 12px;
  letter-spacing: 4px;
  color: #333;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  // Усиленный фоновой шум: много маленьких точек и линий
  &:before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background:
      radial-gradient(rgba(0,0,0,0.05) 1px, transparent 2px),
      repeating-linear-gradient(45deg, rgba(0,0,0,0.03), rgba(0,0,0,0.03) 2px, transparent 2px, transparent 6px),
      repeating-linear-gradient(-45deg, rgba(0,0,0,0.03), rgba(0,0,0,0.03) 2px, transparent 2px, transparent 6px);
    background-size: 20px 20px, 10px 10px, 10px 10px;
    pointer-events: none;
    opacity: 0.3;
    z-index: 1;
  }

  // Линии пересекающие текст
  &:after {
    content: '';
    position: absolute;
    top: 10%;
    left: -10%;
    width: 120%;
    height: 80%;
    background:
      repeating-linear-gradient(
        135deg,
        transparent,
        transparent 4px,
        rgba(0, 0, 0, 0.1) 5px,
        rgba(0, 0, 0, 0.1) 6px
      );
    pointer-events: none;
    opacity: 0.4;
    z-index: 2;
    transform: rotate(-10deg);
  }

  & > span {
    display: inline-block;
    position: relative;
    color: #007bff;
    font-weight: 900;
    font-size: 28px;
    user-select: none;
    /* Добавим случайное смещение, вращение, масштаб */
    transform-origin: center;
    transition: transform 0.3s ease;
    z-index: 3;
  }
`;
const ChangePasswordModal = ({ onClose, onChangePassword }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validatePassword = (password) => {
    return password.length >= 6; 
  };

  const handleSave = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    if (!validatePassword(newPassword)) {
      setError('Новый пароль должен содержать минимум 6 символов');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    setError('');
    onChangePassword(currentPassword, newPassword);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <ModalTitle>Сменить пароль</ModalTitle>
      <Input
        type="password"
        placeholder="Текущий пароль"
        value={currentPassword}
        onChange={e => setCurrentPassword(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Новый пароль"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Подтвердите новый пароль"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
      />
      {error && <ErrorText>{error}</ErrorText>}
      <ModalButtons>
        <ModalButton className="secondary" onClick={onClose}>Отмена</ModalButton>
        <ModalButton className="primary" onClick={handleSave}>Сохранить</ModalButton>
      </ModalButtons>
    </Modal>
  );
};
const Modal = ({ children, onClose }) => {
  useEffect(() => {
    const onEsc = e => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [onClose]);

  return (
    <ModalOverlay onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <ModalContent>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

const PhoneModal = ({ currentPhone, onClose, onSave }) => {
  const [phone, setPhone] = useState(currentPhone);
  const [error, setError] = useState('');

  const validatePhone = (value) => {
    const regex = /^\+7\d{10}$/;
    return regex.test(value);
  };

 const handleSave = async () => {
  if (!validatePhone(phone)) {
    setError('Введите корректный номер телефона, начиная с +7 и всего 11 цифр');
    return;
  }
  setError('');
  try {
    await onSave(phone);  
    onClose();
  } catch (err) {
    setError(err.message || 'Ошибка при сохранении номера');
  }
};
  return (
    <Modal onClose={onClose}>
      <ModalTitle>Изменить номер телефона</ModalTitle>
      <Input
        type="tel"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder="+7XXXXXXXXXX"
        maxLength={12}
      />
      {error && <ErrorText>{error}</ErrorText>}
      <ModalButtons>
        <ModalButton className="secondary" onClick={onClose}>Не изменять</ModalButton>
        <ModalButton className="primary" onClick={handleSave}>Сохранить</ModalButton>
      </ModalButtons>
    </Modal>
  );
};

const EmailModal = ({ currentEmail, onClose, onSave }) => {
  const [email, setEmail] = useState(currentEmail);
  const [error, setError] = useState('');

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleSave = () => {
    if (!validateEmail(email)) {
      setError('Введите корректный адрес электронной почты');
      return;
    }
    setError('');
    onSave(email);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <ModalTitle>Изменить адрес электронной почты</ModalTitle>
      <Input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="example@mail.com"
      />
      {error && <ErrorText>{error}</ErrorText>}
      <ModalButtons>
        <ModalButton className="secondary" onClick={onClose}>Не изменять</ModalButton>
        <ModalButton className="primary" onClick={handleSave}>Сохранить</ModalButton>
      </ModalButtons>
    </Modal>
  );
};
const DeleteAccountModal = ({ onClose, onDelete }) => {
  const [password, setPassword] = useState('');
  const [captchaString, setCaptchaString] = useState(''); 
  const [captchaElements, setCaptchaElements] = useState([]); 
  const [inputCaptcha, setInputCaptcha] = useState(''); 
  const [error, setError] = useState('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaString(result); 
    // отрисовка капчи
    const getRandomColor = () => {
      const colors = ['#007bff', '#dc3545', '#28a745', '#ffc107', '#17a2b8'];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    const getRandomAngle = () => {
      return Math.floor(Math.random() * 15) - 7; 
    };
    const elements = result.split('').map((char, index) => {
      const color = getRandomColor();
      const rotate = getRandomAngle();
      const translateX = Math.floor(Math.random() * 10) - 5; 
      const translateY = Math.floor(Math.random() * 10) - 5; 
      const scale = 0.8 + Math.random() * 0.6; 
      const opacity = 0.7 + Math.random() * 0.3; 
      
      return (
        <span
          key={index}
          style={{
            color,
            transform: `rotate(${rotate}deg) translate(${translateX}px, ${translateY}px) scale(${scale})`,
            opacity,
            position: 'relative',
            zIndex: 3,
            userSelect: 'none',
            fontWeight: '900',
            fontSize: '28px',
            letterSpacing: '-2px',
          }}
        >
          {char}
        </span>
      );
    });

    setCaptchaElements(elements);
  };
  useEffect(() => {
    generateCaptcha(); 
  }, []);

  const refreshCaptcha = () => {
    generateCaptcha(); 
    setInputCaptcha(''); 
  };

  const handleDelete = () => {
    if (!password) {
      setError('Введите текущий пароль');
      return;
    }
    if (inputCaptcha.toUpperCase() !== captchaString.toUpperCase()) {
      setError('Неверный код с картинки');
      return;
    }
    setError('');
    onDelete(password);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <ModalTitle>Удалить учётную запись</ModalTitle>
      <Input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Текущий пароль"
        autoFocus
      />
      <CaptchaImage onClick={refreshCaptcha} title="Нажмите, чтобы обновить капчу">
        {captchaElements}
      </CaptchaImage>
      <Input
        type="text"
        value={inputCaptcha} 
        onChange={e => setInputCaptcha(e.target.value)} 
        placeholder="Введите код с картинки"
        maxLength={6}
      />
      {error && <ErrorText>{error}</ErrorText>}
      <ModalButtons>
        <ModalButton className="secondary" onClick={onClose}>Отмена</ModalButton>
        <ModalButton className="danger" onClick={handleDelete}>Удалить</ModalButton>
      </ModalButtons>
    </Modal>
  );
};
const Profile = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: '',
    subscriber_id: null,
  });
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
  if (!user.isAuth) {
    navigate(GAZPROM_ROUTE);
  } else if (user.user) {
      const { first_name, last_name, middle_name, phone_number, email, subscriber_id } = user.user || {};
      setUserData({
        name: `${last_name || ''} ${first_name || ''} ${middle_name || ''}`.trim(),
        phone: phone_number || '',
        email: email || '',
        subscriber_id,
      });
    } 
  }, [user.isAuth, user.user, navigate]);
  const closeModal = () => setModal(null);
  const onEditPhone = () => setModal('phone');
  const onEditEmail = () => setModal('email');
  const onChangePassword = () => setModal('password');
  const onDeleteAccount = () => setModal('delete');

  const updateUserData = async (data) => {
  const token = user.token; 
  if (!token) {
      throw new Error('Токен отсутствует. Пожалуйста, выполните вход.');
  }

  setLoading(true);
  setError('');
  try {
      const response = await fetch(`http://localhost:5000/api/subscribers/${data.subscriber_id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(data),
      });
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Ошибка при обновлении данных');
      }
      const updatedSubscriber = await response.json();

      setUserData(prev => ({
          ...prev,
          ...updatedSubscriber,
      }));

      user.setUser({
        ...user.user,
        ...updatedSubscriber,
      });

      alert('Данные успешно обновлены');
      closeModal();
  } catch (error) {
      setError(error.message);
      console.error('Ошибка при обновлении данных:', error);
  } finally {
      setLoading(false);
  }
};
  const savePhone = (newPhone) => updateUserData({ subscriber_id: user.user.subscriber_id, phone_number: newPhone });
  const saveEmail = (newEmail) => updateUserData({ subscriber_id: user.user.subscriber_id, email: newEmail });


  const handleChangePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/subscribers/${userData.subscriber_id}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при смене пароля');
      }

      alert('Пароль успешно изменён');
      closeModal();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (password) => {
    if (!window.confirm('Вы уверены, что хотите удалить свою учетную запись? Это действие необратимо.')) {
        return; 
    }
    setLoading(true);
    setError('');
    try {
        const response = await fetch(`http://localhost:5000/api/subscribers/${userData.subscriber_id}/delete-account`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${user.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при удалении аккаунта');
        }

        alert('Учётная запись удалена');
        closeModal();
        user.setUser ({});
        user.setIsAuth(false);
        navigate(GAZPROM_ROUTE);
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
};
  return (
    <>
      <GlobalStyle />
      <Background />
      <Container>
        <Header>
          <NameBlock>
            <Name>{userData.name.toUpperCase()}</Name>
            <SubTitle>Подтверждённая учётная запись</SubTitle>
          </NameBlock>
        </Header>

        {error && <ErrorText>{error}</ErrorText>}

        <Section>
          <SectionHeader>Ваш текущий номер</SectionHeader>
          <InfoText>{userData.phone}</InfoText>
          <ButtonLink onClick={onEditPhone} disabled={loading}>Изменить</ButtonLink>
        </Section>

        <Section>
          <SectionHeader>Ваш текущий адрес электронной почты</SectionHeader>
          <InfoText>{userData.email.toUpperCase()}</InfoText>
          <ButtonLink onClick={onEditEmail} disabled={loading}>Изменить</ButtonLink>
        </Section>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
          <ButtonLink onClick={onChangePassword} disabled={loading}>Сменить пароль</ButtonLink>
          <ButtonLink onClick={onDeleteAccount} className="delete" disabled={loading}>Удалить учётную запись</ButtonLink>
  
          {user.user.role.toLowerCase() !== 'admin' && (
            <Link to={AGREEMENT_ROUTE} style={{ textAlign: 'center', marginTop: '12px', color: '#007bff' }}>
              Посмотреть мои договоры
            </Link>
          )}
        </div>


        {modal === 'phone' && (
          <PhoneModal
            currentPhone={userData.phone}
            onClose={closeModal}
            onSave={savePhone}
          />
        )}

        {modal === 'email' && (
          <EmailModal
            currentEmail={userData.email}
            onClose={closeModal}
            onSave={saveEmail}
          />
        )}

        {modal === 'password' && (
          <ChangePasswordModal
            onClose={closeModal}
            onChangePassword={handleChangePassword}
          />
        )}

        {modal === 'delete' && (
          <DeleteAccountModal
            onClose={closeModal}
            onDelete={deleteAccount}
          />
        )}
      </Container>
    </>
  );
});
export default Profile;