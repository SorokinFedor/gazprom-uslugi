import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    overflow-x: hidden;
  }
`;

const Background = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(270deg, #89f7fe, #66a6ff);
  background-size: 600% 600%;
  animation: gradientShift 15s ease infinite;
  z-index: -1;

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const Container = styled.div`
  padding: 50px 20px;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.h1`
  text-align: center;
  color: #0b3d91;
  margin-bottom: 30px;
  font-size: 3em;
  font-weight: bold;
`;

const Section = styled.section`
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 2em;
  color: #0b3d91;
  margin-bottom: 15px;
  border-bottom: 2px solid #0b3d91;
  display: inline-block;
  padding-bottom: 5px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background-color: #0b3d91;
  color: white;
  padding: 10px;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

const Admin = observer(() => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(Context).user;
  const token = useContext(Context).user.token; 

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/subscribers/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data);
      } catch (err) {
        console.error('Ошибка при загрузке пользователей', err);
        setError('Не удалось загрузить пользователей');
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchUsers();
    }
  }, [token]);
  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <GlobalStyle />
      <Background />
      <Container>
        <Header>Управление договорами</Header>
        <Section>
          <SectionTitle>Список пользователей</SectionTitle>
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Имя</Th>
                <Th>Email</Th>
                <Th>Телефон</Th>
                <Th>Роль</Th>
                <Th>Действия</Th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter(u => u.role === 'USER')
                .map(u => (
                    <tr key={u.subscriber_id}>
                      <Td>{u.subscriber_id}</Td>
                      <Td>{`${u.last_name} ${u.first_name} ${u.middle_name || ''}`}</Td>
                      <Td>{u.email}</Td>
                      <Td>{u.phone_number}</Td>
                      <Td>{u.role}</Td>
                      <Td>
                         <Link to={`/create/${u.subscriber_id}`}>Создать договор</Link>
                      </Td>
                    </tr>
                ))}
            </tbody>
          </Table>
        </Section>
      </Container>
    </>
  );
});
export default Admin;