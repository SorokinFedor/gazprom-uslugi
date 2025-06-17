import React, { useState } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
`;

const Item = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  &:hover {
    background: #f0f0f0;
  }
`;

const ModalSearch = ({ items, onSelect, onClose }) => {
  const [query, setQuery] = useState('');

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={e => e.stopPropagation()}>
        <h3>Поиск оборудования</h3>
        <Input
          placeholder="Введите название..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {filtered.map(item => (
          <Item key={item.equipment_id} onClick={() => onSelect(item.equipment_id)}>
            {item.name}
          </Item>
        ))}
      </ModalBox>
    </Overlay>
  );
};
export default ModalSearch;