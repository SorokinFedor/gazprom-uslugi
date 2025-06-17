import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

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
  max-width: 95%;
  margin: 60px auto;
  padding: 40px;
  background: #ffffffee;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

const Title = styled.h2`
  text-align: center;
  color: #0b3d91;
  font-size: 2.2em;
  margin-bottom: 30px;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 12px 20px;
  background-color: #0b3d91;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background-color: #094aaf;
  }
  &:not(:last-child) {
    margin-right: 10px;
  }
`;

const RemoveButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85em;
  &:hover {
    background-color: #c0392b;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  min-width: 1000px;
`;

const Th = styled.th`
  background-color: #0b3d91;
  color: white;
  padding: 10px;
  font-weight: bold;
  border: 1px solid #ccc;
  font-size: 0.9em;
  min-width: 120px;
`;

const Td = styled.td`
  padding: 8px;
  border: 1px solid #ccc;
  vertical-align: middle;
  min-width: 120px;
  user-select: none;
`;

const Input = styled.input`
  width: 100%;
  padding: 6px;
  font-size: 0.9em;
  border: 1px solid ${props => (props.$error ? 'red' : '#ccc')};
  border-radius: 6px;
  box-sizing: border-box;
`;

const CenteredCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 10px;
  color: #0b3d91;
`;

const ModalTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const ModalTh = styled.th`
  border: 1px solid #ccc;
  padding: 8px;
  background-color: #0b3d91;
  color: white;
  cursor: default;
`;

const ModalTd = styled.td`
  border: 1px solid #ccc;
  padding: 8px;
  cursor: pointer;
  &:hover {
    background-color: #e6f0ff;
  }
`;

const ModalFilterInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
`;

const Agreement = () => {
  const { subscriberId } = useParams();
  const navigate = useNavigate();

  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [equipmentForms, setEquipmentForms] = useState([]);
  const [errors, setErrors] = useState([]);

  const [equipmentFilter, setEquipmentFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [agreementNumber, setAgreementNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalFilter, setModalFilter] = useState('');
  const [modalType, setModalType] = useState(null);
  const [modalSelectedRow, setModalSelectedRow] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesRes, statusRes, equipmentRes] = await Promise.all([
          axios.get('http://localhost:5000/api/equipment/types'),
          axios.get('http://localhost:5000/api/equipment/statuses'),
          axios.get('http://localhost:5000/api/equipment')
        ]);
        setEquipmentTypes(typesRes.data);
        setStatuses(statusRes.data);
        setEquipments(equipmentRes.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };
    fetchData();
  }, []);

  const handleAddEquipment = () => {
    const today = new Date().toISOString().split('T')[0];
    setEquipmentForms([
      ...equipmentForms,
      {
        equipment_id: '',
        equipment_type_id: '',
        status_id: '',
        installation_date: today,
        last_inspection_date: '',
        next_inspection_date: '',
        installation_location: '',
        notes: ''
      }
    ]);
    setErrors([...errors, {}]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...equipmentForms];
    updated[index][field] = value;
    setEquipmentForms(updated);

    const updatedErrors = [...errors];
    if (updatedErrors[index]) {
      updatedErrors[index][field] = false;
      setErrors(updatedErrors);
    }
  };

  const handleRemove = (index) => {
    const updated = [...equipmentForms];
    updated.splice(index, 1);
    setEquipmentForms(updated);

    const updatedErrors = [...errors];
    updatedErrors.splice(index, 1);
    setErrors(updatedErrors);
  };

  const validateForm = () => {
    if (!agreementNumber.trim()) {
      alert('Введите номер договора');
      return false;
    }
    if (!startDate.trim()) {
      alert('Введите дату начала договора');
      return false;
    }
    const newErrors = equipmentForms.map(form => ({
      equipment_id: !form.equipment_id,
      equipment_type_id: !form.equipment_type_id,
      status_id: !form.status_id,
      installation_date: !form.installation_date,
      installation_location: !form.installation_location || form.installation_location.trim() === ''
    }));

    setErrors(newErrors);

    return newErrors.every(err =>
      !err.equipment_id &&
      !err.equipment_type_id &&
      !err.status_id &&
      !err.installation_date &&
      !err.installation_location
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const agreementPayload = {
        subscriber_id: Number(subscriberId),
        agreement_number: agreementNumber.trim(),
        start_date: startDate,
        end_date: endDate || null,
        notes: notes.trim()
      };
      const agreementResponse = await axios.post(
        'http://localhost:5000/api/agreements/create',
        agreementPayload
      );

      const agreementId = agreementResponse.data.agreement_id;

      if (equipmentForms.length > 0) {
        const cleanedEquipmentItems = equipmentForms.map(item => ({
          equipment_id: item.equipment_id ? Number(item.equipment_id) : null,
          equipment_type_id: item.equipment_type_id ? Number(item.equipment_type_id) : null,
          status_id: item.status_id ? Number(item.status_id) : null,
          installation_date: item.installation_date || null,
          last_inspection_date: item.last_inspection_date || null,
          next_inspection_date: item.next_inspection_date || null,
          installation_location: item.installation_location && item.installation_location.trim() !== '' ? item.installation_location.trim() : null,
          notes: item.notes || '',
          agreement_id: agreementId,
          subscriber_id: Number(subscriberId)
        }));

        await axios.post(
          'http://localhost:5000/api/installed-equipment/create-multiple',
          { equipment_items: cleanedEquipmentItems }
        );
      }

      alert('Договор успешно создан!');
      navigate('/admin');
    } catch (err) {
      if (err.response) {
        console.error('Ошибка сервера:', err.response.data);
        alert(`Ошибка: ${err.response.data.message || err.response.data.error || 'Неизвестная ошибка'}`);
      } else {
        console.error(err);
        alert('Ошибка при создании договора');
      }
    }
  };

  const getTypeName = (typeId) => {
    const type = equipmentTypes.find(t => t.equipment_type_id === typeId);
    return type ? type.name : '';
  };

  const getStatusName = (statusId) => {
    const status = statuses.find(s => s.status_id === statusId);
    return status ? status.status_name : '';
  };

  const openModal = (index, type) => {
    setModalSelectedRow(index);
    setModalType(type);
    setModalFilter('');
    setModalOpen(true);
  };

  const selectFromModal = (item) => {
    if (modalSelectedRow === null || !modalType) return;

    const updated = [...equipmentForms];

    if (modalType === 'equipment') {
      updated[modalSelectedRow].equipment_id = item.equipment_id;
      updated[modalSelectedRow].equipment_type_id = item.equipment_type_id;
      updated[modalSelectedRow].status_id = item.status_id || '';
    } else if (modalType === 'type') {
      updated[modalSelectedRow].equipment_type_id = item.equipment_type_id;
    } else if (modalType === 'status') {
      updated[modalSelectedRow].status_id = item.status_id;
    }

    setEquipmentForms(updated);

    const updatedErrors = [...errors];
    if (updatedErrors[modalSelectedRow]) {
      if (modalType === 'equipment') {
        updatedErrors[modalSelectedRow].equipment_id = false;
        updatedErrors[modalSelectedRow].equipment_type_id = false;
        updatedErrors[modalSelectedRow].status_id = false;
      } else if (modalType === 'type') {
        updatedErrors[modalSelectedRow].equipment_type_id = false;
      } else if (modalType === 'status') {
        updatedErrors[modalSelectedRow].status_id = false;
      }
      setErrors(updatedErrors);
    }

    setModalOpen(false);
  };

  const filteredModalItems = (() => {
    const filterLower = modalFilter.toLowerCase();
    if (modalType === 'equipment') {
      return equipments.filter(eq => {
        const nameMatch = eq.name.toLowerCase().includes(filterLower);
        const typeName = getTypeName(eq.equipment_type_id).toLowerCase();
        const typeMatch = typeName.includes(filterLower);
        return nameMatch || typeMatch;
      });
    }
    if (modalType === 'type') {
      return equipmentTypes.filter(type => type.name.toLowerCase().includes(filterLower));
    }
    if (modalType === 'status') {
      return statuses.filter(status => status.status_name.toLowerCase().includes(filterLower));
    }
    return [];
  })();

  return (
    <>
      <GlobalStyle />
      <Background />
      <Container>
        <Title>Создание договора для абонента №{subscriberId}</Title>

        <Table>
          <tbody>
            <tr>
              <Th>Номер договора</Th>
              <Td>
                <Input
                  type="text"
                  value={agreementNumber}
                  onChange={e => setAgreementNumber(e.target.value)}
                  placeholder="Введите номер договора"
                />
              </Td>
            </tr>
            <tr>
              <Th>Дата начала</Th>
              <Td>
                <Input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </Td>
            </tr>
            <tr>
              <Th>Дата окончания</Th>
              <Td>
                <Input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </Td>
            </tr>
            <tr>
              <Th>Примечание</Th>
              <Td>
                <Input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Введите примечание"
                />
              </Td>
            </tr>
          </tbody>
        </Table>

        <Button onClick={handleAddEquipment}>Добавить оборудование</Button>
        <Button onClick={() => { setEquipmentForms([]); setErrors([]); }}>Очистить всё</Button>

        {equipmentForms.length > 0 && (
          <>
            <FilterContainer>
              <Input
                placeholder="Поиск по оборудованию..."
                value={equipmentFilter}
                onChange={(e) => setEquipmentFilter(e.target.value)}
                style={{ maxWidth: '300px' }}
              />
              <Input
                placeholder="Поиск по типу оборудования..."
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{ maxWidth: '300px' }}
              />
            </FilterContainer>

            <Table>
              <thead>
                <tr>
                  <Th>Оборудование</Th>
                  <Th>Тип</Th>
                  <Th>Статус</Th>
                  <Th>Дата установки</Th>
                  <Th>Последняя поверка</Th>
                  <Th>Следующая поверка</Th>
                  <Th>Место установки</Th>
                  <Th>Примечание</Th>
                  <Th>Удалить</Th>
                </tr>
              </thead>
              <tbody>
                {equipmentForms.map((form, index) => {
                  const eqObj = equipments.find(eq => eq.equipment_id === form.equipment_id);
                  const eqName = eqObj ? eqObj.name : '';
                  const typeName = getTypeName(form.equipment_type_id);
                  if (
                    (equipmentFilter && !eqName.toLowerCase().includes(equipmentFilter.toLowerCase())) ||
                    (typeFilter && !typeName.toLowerCase().includes(typeFilter.toLowerCase()))
                  ) {
                    return null;
                  }
                  return (
                    <tr key={index}>
                      <Td
                        onDoubleClick={() => openModal(index, 'equipment')}
                        title="Двойной клик — выбрать оборудование"
                        style={{ cursor: 'pointer', backgroundColor: errors[index]?.equipment_id ? '#ffe6e6' : 'transparent' }}
                      >
                        {eqName || <i>не выбрано</i>}
                      </Td>
                      <Td
                        onDoubleClick={() => openModal(index, 'type')}
                        title="Двойной клик — выбрать тип"
                        style={{ cursor: 'pointer', backgroundColor: errors[index]?.equipment_type_id ? '#ffe6e6' : 'transparent' }}
                      >
                        {typeName || <i>не выбрано</i>}
                      </Td>
                      <Td
                        onDoubleClick={() => openModal(index, 'status')}
                        title="Двойной клик — выбрать статус"
                        style={{ cursor: 'pointer', backgroundColor: errors[index]?.status_id ? '#ffe6e6' : 'transparent' }}
                      >
                        {getStatusName(form.status_id) || <i>не выбрано</i>}
                      </Td>
                      <Td>
                        <Input
                          type="date"
                          value={form.installation_date}
                          $error={errors[index]?.installation_date}
                          onChange={(e) => handleChange(index, 'installation_date', e.target.value)}
                        />
                      </Td>
                      <Td>
                        <Input
                          type="date"
                          value={form.last_inspection_date}
                          onChange={(e) => handleChange(index, 'last_inspection_date', e.target.value)}
                        />
                      </Td>
                      <Td>
                        <Input
                          type="date"
                          value={form.next_inspection_date}
                          onChange={(e) => handleChange(index, 'next_inspection_date', e.target.value)}
                        />
                      </Td>
                      <Td>
                        <Input
                          value={form.installation_location}
                          $error={errors[index]?.installation_location}
                          onChange={(e) => handleChange(index, 'installation_location', e.target.value)}
                        />
                      </Td>
                      <Td>
                        <Input
                          value={form.notes}
                          onChange={(e) => handleChange(index, 'notes', e.target.value)}
                        />
                      </Td>
                      <Td>
                        <CenteredCell>
                          <RemoveButton onClick={() => handleRemove(index)}>Удалить</RemoveButton>
                        </CenteredCell>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </>
        )}

        <Button onClick={handleSubmit}>Создать договор</Button>
      </Container>

      {modalOpen && (
        <ModalOverlay onClick={() => setModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>
              {modalType === 'equipment' && 'Выберите оборудование'}
              {modalType === 'type' && 'Выберите тип оборудования'}
              {modalType === 'status' && 'Выберите статус оборудования'}
            </ModalTitle>
            <ModalFilterInput
              placeholder="Фильтр по названию"
              value={modalFilter}
              onChange={e => setModalFilter(e.target.value)}
              autoFocus
            />
            <ModalTable>
              <thead>
                <tr>
                  {modalType === 'equipment' && (
                    // Только колонка Название
                    <ModalTh>Название</ModalTh>
                  )}
                  {modalType === 'type' && <ModalTh>Название типа</ModalTh>}
                  {modalType === 'status' && <ModalTh>Название статуса</ModalTh>}
                </tr>
              </thead>
              <tbody>
                {filteredModalItems.length > 0 ? (
                  filteredModalItems.map(item => {
                    if (modalType === 'equipment') {
                      return (
                        <tr
                          key={item.equipment_id}
                          onClick={() => selectFromModal(item)}
                          style={{ cursor: 'pointer' }}
                        >
                          <ModalTd>{item.name}</ModalTd>
                        </tr>
                      );
                    }
                    if (modalType === 'type') {
                      return (
                        <tr
                          key={item.equipment_type_id}
                          onClick={() => selectFromModal(item)}
                          style={{ cursor: 'pointer' }}
                        >
                          <ModalTd>{item.name}</ModalTd>
                        </tr>
                      );
                    }
                    if (modalType === 'status') {
                      return (
                        <tr
                          key={item.status_id}
                          onClick={() => selectFromModal(item)}
                          style={{ cursor: 'pointer' }}
                        >
                          <ModalTd>{item.status_name}</ModalTd>
                        </tr>
                      );
                    }
                    return null;
                  })
                ) : (
                  <tr>
                    <ModalTd colSpan={1} style={{ textAlign: 'center', fontStyle: 'italic' }}>
                      Не найдено
                    </ModalTd>
                  </tr>
                )}
              </tbody>
            </ModalTable>
            <Button style={{ marginTop: '15px' }} onClick={() => setModalOpen(false)}>Закрыть</Button>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};
export default Agreement;