import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f0f4f8;
    overflow-x: hidden;
  }
`;

const Background = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(135deg, #89f7fe, #66a6ff);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  z-index: -1;

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const Container = styled.div`
  max-width: 700px;
  margin: 60px auto;
  padding: 40px;
  background: #ffffffee;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  min-height: 80vh;
`;

const Title = styled.h1`
  text-align: center;
  color: #0b3d91;
  font-size: 2.4em;
  margin-bottom: 30px;
`;

const SearchInput = styled.input`
  padding: 10px 14px;
  width: 300px;
  font-size: 1em;
  border-radius: 8px;
  border: 1px solid #ccc;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #0b3d91;
    box-shadow: 0 0 5px rgba(11, 61, 145, 0.5);
  }
`;

const InfoText = styled.div`
  margin: 15px 0;
  font-size: 1.1em;
  color: #333;
`;

const RefreshButton = styled.button`
  padding: 10px 20px;
  background-color: #0b3d91;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 30px;

  &:hover:not(:disabled) {
    background-color: #094aaf;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const AgreementListWrapper = styled.ul`
  list-style: none;
  padding-left: 10px;
  max-width: 100%;
  margin: 0 auto;
  text-align: left;
`;

const AgreementItem = styled.li`
  margin-bottom: 15px;
  font-size: 1.05em;
  display: flex;
  align-items: center;
  justify-content: space-between;

  a {
    text-decoration: none;
    color: #0b3d91;
    transition: color 0.3s;
    flex-grow: 1;

    &:hover {
      color: #094aaf;
      text-decoration: underline;
    }
  }
`;

const DeleteButton = styled.button`
  margin-left: 15px;
  color: red;
  cursor: pointer;
  background: none;
  border: 1.5px solid red;
  border-radius: 6px;
  padding: 4px 10px;
  font-weight: 600;
  transition: background-color 0.3s, color 0.3s;
  flex-shrink: 0;

  &:hover {
    background-color: red;
    color: white;
  }
`;

const AgreementList = observer(() => {
  const { user } = useContext(Context);
  const [agreements, setAgreements] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const userRole = user?.user?.role?.toLowerCase() || '';
  const canDelete = userRole === 'admin';
  const subscriberId = user?.user?.subscriber_id;

  const fetchAgreements = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/agreements');
      const data = Array.isArray(response.data) ? response.data : response.data.rows || [];
      setAgreements(data);
    } catch (error) {
      console.error('Ошибка при загрузке договоров:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Вы действительно хотите удалить этот договор?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/agreements/${id}`);
      setAgreements(prev => prev.filter(item => item.agreement_id !== id));
    } catch (error) {
      console.error('Ошибка при удалении договора:', error);
      alert('Не удалось удалить договор. Попробуйте позже.');
    }
  };
  const filteredByUser = canDelete
    ? agreements
    : agreements.filter(item => item.subscriber_id === subscriberId);

  const filterLower = filter.toLowerCase();
  const filteredAgreements = filteredByUser.filter(({ agreement_id, agreement_number }) => {
    return (
      agreement_id.toString().toLowerCase().includes(filterLower) ||
      (agreement_number && agreement_number.toString().toLowerCase().includes(filterLower))
    );
  });

  return (
    <>
      <GlobalStyle />
      <Background />
      <Container>
        <Title>{canDelete ? 'Управление договорами' : 'Мои договоры'}</Title>

        <SearchInput
          type="text"
          placeholder="Поиск по номеру договора..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Поиск по номеру договора"
        />

        <InfoText>Найдено договоров: {filteredAgreements.length}</InfoText>

        <RefreshButton onClick={fetchAgreements} disabled={loading}>
          {loading ? 'Загрузка...' : 'Обновить список'}
        </RefreshButton>

        <AgreementListWrapper>
          {filteredAgreements.length > 0 ? (
            filteredAgreements.map(({ agreement_id, subscriber_id, agreement_number }) => (
              <AgreementItem key={agreement_id}>
                <Link to={`/agreement/${agreement_id}`}>
                  Договор на техническое обслуживание №{agreement_number} (ID: {agreement_id}), абонент №{subscriber_id}
                </Link>
                {canDelete && (
                  <DeleteButton
                    onClick={() => handleDelete(agreement_id)}
                    aria-label={`Удалить договор №${agreement_number}`}
                    title="Удалить договор"
                  >
                    Удалить из базы
                  </DeleteButton>
                )}
              </AgreementItem>
            ))
          ) : (
            <InfoText>Договоры не найдены.</InfoText>
          )}
        </AgreementListWrapper>
      </Container>
    </>
  );
});
export default AgreementList;