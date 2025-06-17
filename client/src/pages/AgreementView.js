import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';
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

  &:hover:not(:disabled) {
    background-color: #094aaf;
  }

  &:not(:last-child) {
    margin-right: 10px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
  transition: background-color 0.3s;
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
  text-align: center;       
  vertical-align: middle;  
`;

// Обратите внимание: заменили isEditable на транзиентный $isEditable
const Td = styled.td`
  padding: 8px;
  border: 1px solid #ccc;
  vertical-align: middle;
  min-width: 120px;
  text-align: center;       
  user-select: none;
  cursor: ${props => (props.$isEditable ? 'pointer' : 'default')};
  background-color: ${props => (props.error ? '#ffe6e6' : 'transparent')};
`;

const Input = styled.input`
  width: 100%;
  padding: 6px;
  font-size: 0.9em;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;

  &:disabled {
    background-color: #f5f5f5;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #0b3d91;
`;

const FieldWrapper = styled.div`
  margin-bottom: 15px;
  max-width: 400px;
`;

/* Модальные стили */
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
  max-width: 600px;
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

const AgreementView = () => {
  const { id } = useParams();
  const { user } = useContext(Context);
  const userRole = user?.user?.role?.toLowerCase() || '';
  const canEdit = userRole === 'admin';

  const [agreement, setAgreement] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [equipments, setEquipments] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); 
  const [modalFilter, setModalFilter] = useState('');
  const [modalSelectedRow, setModalSelectedRow] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [agreementRes, equipmentsRes, typesRes, statusesRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/agreements/${id}`),
          axios.get('http://localhost:5000/api/equipment'),
          axios.get('http://localhost:5000/api/equipment/types'),
          axios.get('http://localhost:5000/api/equipment/statuses'),
        ]);

        const loadedAgreement = agreementRes.data;
        if (!loadedAgreement.InstalledEquipments) {
          loadedAgreement.InstalledEquipments = [];
        }

        setAgreement(loadedAgreement);
        setEquipments(equipmentsRes.data);
        setEquipmentTypes(typesRes.data);
        setStatuses(statusesRes.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        alert('Ошибка при загрузке договора или справочников');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!canEdit) setIsEditing(false);
  }, [canEdit]);

  if (loading) return <Container>Загрузка...</Container>;
  if (!agreement) return <Container>Договор не найден</Container>;

  const getEquipmentName = (equipment_id) =>
    equipments.find(e => e.equipment_id === equipment_id)?.name || '';
  const getEquipmentTypeName = (equipment_type_id) =>
    equipmentTypes.find(t => t.equipment_type_id === equipment_type_id)?.name || '';
  const getStatusName = (status_id) =>
    statuses.find(s => s.status_id === status_id)?.status_name || '';

  const handleAgreementChange = (field, value) => {
    setAgreement(prev => ({ ...prev, [field]: value }));
  };
  const handleEquipmentChange = (index, field, value) => {
    if (!agreement.InstalledEquipments) return;
    const updatedItems = [...agreement.InstalledEquipments];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setAgreement(prev => ({ ...prev, InstalledEquipments: updatedItems }));
  };
  const handleAddEquipment = () => {
    const newEquipment = {
      installed_equipment_id: null,
      equipment_id: null,
      equipment_type_id: null,
      status_id: null,
      installation_date: '',
      last_inspection_date: '',
      next_inspection_date: '',
      installation_location: '',
      notes: ''
    };
    setAgreement(prev => ({
      ...prev,
      InstalledEquipments: [...(prev.InstalledEquipments || []), newEquipment]
    }));
  };
  const handleRemoveEquipment = (index) => {
    if (!agreement.InstalledEquipments) return;
    const updatedItems = [...agreement.InstalledEquipments];
    updatedItems.splice(index, 1);
    setAgreement(prev => ({ ...prev, InstalledEquipments: updatedItems }));
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`http://localhost:5000/api/agreements/${id}`, {
        agreement_number: agreement.agreement_number,
        start_date: agreement.start_date,
        end_date: agreement.end_date,
        notes: agreement.notes,
      });

      await axios.put('http://localhost:5000/api/installed-equipment/update-multiple', {
        equipment_items: agreement.InstalledEquipments
      });

      alert('Договор и оборудование успешно обновлены');
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  const openModal = (index, type) => {
    if (!isEditing || !canEdit) return;
    setModalSelectedRow(index);
    setModalType(type);
    setModalFilter('');
    setModalOpen(true);
  };

  const selectFromModal = (item) => {
    if (modalSelectedRow === null || !modalType) return;

    const updated = [...agreement.InstalledEquipments];

    if (modalType === 'equipment') {
      updated[modalSelectedRow].equipment_id = item.equipment_id;
      updated[modalSelectedRow].equipment_type_id = item.equipment_type_id;
      updated[modalSelectedRow].status_id = item.status_id || null;
    } else if (modalType === 'type') {
      updated[modalSelectedRow].equipment_type_id = item.equipment_type_id;
    } else if (modalType === 'status') {
      updated[modalSelectedRow].status_id = item.status_id;
    }

    setAgreement(prev => ({ ...prev, InstalledEquipments: updated }));
    setModalOpen(false);
  };

  const filteredModalItems = (() => {
    const filterLower = modalFilter.toLowerCase();
    if (modalType === 'equipment') {
      return equipments.filter(eq => eq.name.toLowerCase().includes(filterLower));
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
        <Title>Договор на техническое обслуживание №{agreement.agreement_number || id}</Title>

        <FieldWrapper>
          <Label>Номер договора:</Label>
          <Input
            type="text"
            value={agreement.agreement_number || ''}
            onChange={e => handleAgreementChange('agreement_number', e.target.value)}
            disabled={!isEditing || !canEdit}
          />
        </FieldWrapper>

        <FieldWrapper>
          <Label>Дата начала:</Label>
          <Input
            type="date"
            value={agreement.start_date ? agreement.start_date.split('T')[0] : ''}
            onChange={e => handleAgreementChange('start_date', e.target.value)}
            disabled={!isEditing || !canEdit}
          />
        </FieldWrapper>

        <FieldWrapper>
          <Label>Дата окончания:</Label>
          <Input
            type="date"
            value={agreement.end_date ? agreement.end_date.split('T')[0] : ''}
            onChange={e => handleAgreementChange('end_date', e.target.value)}
            disabled={!isEditing || !canEdit}
          />
        </FieldWrapper>

        <FieldWrapper style={{ maxWidth: '600px' }}>
          <Label>Примечание:</Label>
          <Input
            type="text"
            value={agreement.notes || ''}
            onChange={e => handleAgreementChange('notes', e.target.value)}
            disabled={!isEditing || !canEdit}
          />
        </FieldWrapper>

        <Title as="h3" style={{ marginTop: '40px' }}>Оборудование</Title>

        <Table>
          <thead>
            <tr>
              <Th>Оборудование</Th>
              <Th>Тип оборудования</Th>
              <Th>Статус</Th>
              <Th>Дата установки</Th>
              <Th>Последняя поверка</Th>
              <Th>Следующая поверка</Th>
              <Th>Место установки</Th>
              <Th>Примечание</Th>
              {isEditing && canEdit && <Th>Действия</Th>}
            </tr>
          </thead>
          <tbody>
            {agreement.InstalledEquipments?.map((item, index) => (
              <tr key={item.installed_equipment_id || index}>
                <Td
                  $isEditable={isEditing && canEdit}
                  onDoubleClick={() => openModal(index, 'equipment')}
                  title={isEditing && canEdit ? 'Двойной клик — выбрать оборудование' : ''}
                >
                  {isEditing ? (
                    getEquipmentName(item.equipment_id) || <i>не выбрано</i>
                  ) : (
                    getEquipmentName(item.equipment_id)
                  )}
                </Td>

                <Td
                  $isEditable={isEditing && canEdit}
                  onDoubleClick={() => openModal(index, 'type')}
                  title={isEditing && canEdit ? 'Двойной клик — выбрать тип оборудования' : ''}
                >
                  {isEditing ? (
                    getEquipmentTypeName(item.equipment_type_id) || <i>не выбрано</i>
                  ) : (
                    getEquipmentTypeName(item.equipment_type_id)
                  )}
                </Td>

                <Td
                  $isEditable={isEditing && canEdit}
                  onDoubleClick={() => openModal(index, 'status')}
                  title={isEditing && canEdit ? 'Двойной клик — выбрать статус' : ''}
                >
                  {isEditing ? (
                    getStatusName(item.status_id) || <i>не выбрано</i>
                  ) : (
                    getStatusName(item.status_id)
                  )}
                </Td>

                <Td>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={item.installation_date ? item.installation_date.split('T')[0] : ''}
                      onChange={e => handleEquipmentChange(index, 'installation_date', e.target.value)}
                      disabled={!canEdit}
                    />
                  ) : (
                    item.installation_date ? item.installation_date.split('T')[0] : ''
                  )}
                </Td>

                <Td>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={item.last_inspection_date ? item.last_inspection_date.split('T')[0] : ''}
                      onChange={e => handleEquipmentChange(index, 'last_inspection_date', e.target.value)}
                      disabled={!canEdit}
                    />
                  ) : (
                    item.last_inspection_date ? item.last_inspection_date.split('T')[0] : ''
                  )}
                </Td>

                <Td>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={item.next_inspection_date ? item.next_inspection_date.split('T')[0] : ''}
                      onChange={e => handleEquipmentChange(index, 'next_inspection_date', e.target.value)}
                      disabled={!canEdit}
                    />
                  ) : (
                    item.next_inspection_date ? item.next_inspection_date.split('T')[0] : ''
                  )}
                </Td>

                <Td>
                  {isEditing ? (
                    <Input
                      value={item.installation_location || ''}
                      onChange={e => handleEquipmentChange(index, 'installation_location', e.target.value)}
                      disabled={!canEdit}
                    />
                  ) : (
                    item.installation_location
                  )}
                </Td>

                <Td>
                  {isEditing ? (
                    <Input
                      value={item.notes || ''}
                      onChange={e => handleEquipmentChange(index, 'notes', e.target.value)}
                      disabled={!canEdit}
                    />
                  ) : (
                    item.notes
                  )}
                </Td>

                {isEditing && canEdit && (
                  <Td>
                    <RemoveButton
                      onClick={() => handleRemoveEquipment(index)}
                      type="button"
                      title="Удалить оборудование"
                    >
                      Удалить
                    </RemoveButton>
                  </Td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>

        {isEditing && canEdit && (
          <Button onClick={handleAddEquipment} type="button">
            Добавить оборудование
          </Button>
        )}

        <div>
          {!isEditing && canEdit && (
            <Button onClick={() => setIsEditing(true)} type="button">
              Редактировать
            </Button>
          )}

          {isEditing && (
            <>
              <Button onClick={handleSave} disabled={saving} type="button">
                {saving ? 'Сохраняем...' : 'Сохранить'}
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                type="button"
                style={{ marginLeft: '10px', backgroundColor: '#777' }}
              >
                Отмена
              </Button>
            </>
          )}
        </div>
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
                  <ModalTh>
                    {modalType === 'equipment' && 'Название'}
                    {modalType === 'type' && 'Название типа'}
                    {modalType === 'status' && 'Название статуса'}
                  </ModalTh>
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
                    <ModalTd style={{ textAlign: 'center', fontStyle: 'italic' }}>
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

export default AgreementView;