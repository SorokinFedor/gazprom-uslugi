require('dotenv').config();

const sequelize = require('../db');
const { EquipmentType, EquipmentStatus, Equipment } = require('../models/models');

async function seed() {
  await sequelize.sync({ force: false });

  await EquipmentType.bulkCreate([
    { name: 'Термометр' },
    { name: 'Манометр' },
    { name: 'Датчик давления' },
    { name: 'Тепловой счетчик' },
    { name: 'Влагомер' },
    { name: 'Газоанализатор' },
    { name: 'Клапан' },
    { name: 'Насос' },
    { name: 'Трансформатор' },
    { name: 'Реле' },
    { name: 'Счетчик газа' },
    { name: 'Счетчик воды' },
    { name: 'Датчик температуры' },
    { name: 'Датчик влажности' },
    { name: 'Контроллер' },
    { name: 'Инвертор' },
    { name: 'Тахометр' },
    { name: 'Термопара' },
    { name: 'Преобразователь давления' },
    { name: 'Теплообменник' }
  ], { ignoreDuplicates: true });

  await EquipmentStatus.bulkCreate([
    { status_name: 'Рабочее' },
    { status_name: 'На ремонте' },
    { status_name: 'Списано' },
    { status_name: 'В резерве' }
  ], { ignoreDuplicates: true });

  await Equipment.bulkCreate([
    { name: 'Термометр ТМ-100', description: 'Точный термометр', power: null, inspectionPeriod: 12, serviceLife: 60, hasThermometer: true },
    { name: 'Манометр МН-200', description: 'Манометр высокого давления', power: null, inspectionPeriod: 24, serviceLife: 120, hasThermometer: false },
    { name: 'Датчик давления ДД-300', description: 'Датчик давления с цифровым выходом', power: 5.0, inspectionPeriod: 12, serviceLife: 60, hasThermometer: false },
    { name: 'Тепловой счетчик ТС-400', description: 'Счетчик тепла с ЖК-дисплеем', power: 12.0, inspectionPeriod: 36, serviceLife: 180, hasThermometer: true },
    { name: 'Влагомер ВМ-500', description: 'Измеритель влажности газа', power: 3.5, inspectionPeriod: 12, serviceLife: 72, hasThermometer: false },
    { name: 'Газоанализатор ГА-600', description: 'Анализатор состава газа', power: 15.0, inspectionPeriod: 6, serviceLife: 84, hasThermometer: false },
    { name: 'Клапан КЛ-700', description: 'Запорный клапан с электроприводом', power: 7.5, inspectionPeriod: 24, serviceLife: 96, hasThermometer: false },
    { name: 'Насос НС-800', description: 'Центробежный насос для газоснабжения', power: 22.0, inspectionPeriod: 12, serviceLife: 120, hasThermometer: true },
    { name: 'Трансформатор ТР-900', description: 'Трансформатор напряжения', power: null, inspectionPeriod: 36, serviceLife: 240, hasThermometer: false },
    { name: 'Реле РЛ-1000', description: 'Реле контроля давления', power: 1.2, inspectionPeriod: 12, serviceLife: 60, hasThermometer: false },
    { name: 'Счетчик газа СГ-1100', description: 'Счетчик расхода газа', power: 5.0, inspectionPeriod: 24, serviceLife: 120, hasThermometer: false },
    { name: 'Счетчик воды СВ-1200', description: 'Счетчик расхода воды', power: 2.5, inspectionPeriod: 24, serviceLife: 120, hasThermometer: false },
    { name: 'Датчик температуры ДТ-1300', description: 'Датчик температуры среды', power: 0.8, inspectionPeriod: 12, serviceLife: 60, hasThermometer: true },
    { name: 'Датчик влажности ДВ-1400', description: 'Датчик влажности воздуха', power: 0.5, inspectionPeriod: 12, serviceLife: 60, hasThermometer: false },
    { name: 'Контроллер КТР-1500', description: 'Контроллер управления оборудованием', power: 10.0, inspectionPeriod: 12, serviceLife: 96, hasThermometer: false },
    { name: 'Инвертор ИНВ-1600', description: 'Инвертор частоты', power: 20.0, inspectionPeriod: 24, serviceLife: 144, hasThermometer: true },
    { name: 'Тахометр ТХ-1700', description: 'Измеритель скорости вращения', power: 1.0, inspectionPeriod: 12, serviceLife: 60, hasThermometer: false },
    { name: 'Термопара ТП-1800', description: 'Термопара для измерения температуры', power: null, inspectionPeriod: 6, serviceLife: 48, hasThermometer: true },
    { name: 'Преобразователь давления ПП-1900', description: 'Преобразователь давления газа', power: 4.0, inspectionPeriod: 12, serviceLife: 72, hasThermometer: false },
    { name: 'Теплообменник ТХ-2000', description: 'Теплообменник для системы отопления', power: null, inspectionPeriod: 36, serviceLife: 180, hasThermometer: false }
  ], { ignoreDuplicates: true });

  console.log('Данные для оборудования заполнены');
}
seed()
  .then(() => {
    console.log('Скрипт выполнен успешно');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Ошибка при заполнении данных:', err);
    process.exit(1);
  });