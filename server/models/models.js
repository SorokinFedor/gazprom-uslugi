const sequelize = require('../db');
const { DataTypes } = require('sequelize');

// Таблица адресов
const Address = sequelize.define('Address', {
  address_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  region: {
    type: DataTypes.STRING(100)
  },
  district: {
    type: DataTypes.STRING(100)
  },
  city: {
    type: DataTypes.STRING(100)
  },
  street: {
    type: DataTypes.STRING(100)
  },
  house_number: {
    type: DataTypes.STRING(20)
  },
  apartment_number: {
    type: DataTypes.STRING(20)
  },
  zip_code: {
    type: DataTypes.STRING(6),
    allowNull: false,
    validate: {
      is: /^\d{6}$/,
      notNull: {
        msg: "Почтовый индекс не может быть пустым"
      }
    }
  }
}, { timestamps: false });

// Абоненты
const Subscriber = sequelize.define('Subscriber', {
  subscriber_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Имя не должно быть пустым.'
      }
    }
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Фамилия не должна быть пустой.'
      }
    }
  },
  middle_name: {
    type: DataTypes.STRING(100)
  },
  date_of_birth: {
    type: DataTypes.DATEONLY
  },
  phone_number: {
    type: DataTypes.STRING(20),
    validate: {
      isPhoneNumber: function(value) {
        if (!value) return true;
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(value)) {
          throw new Error('Некорректный формат номера телефона.');
        }
        return true;
      }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    validate: {
      isEmail: {
        msg: 'Некорректный формат электронной почты.'
      }
    }
  },
  snils: {
    type: DataTypes.STRING(11),
    unique: true,
    validate: {
      isSnils: function(value) {
        if (!value) return true;
        if (!/^\d{11}$/.test(value)) {
          throw new Error('Некорректный формат СНИЛС. Ожидается 11 цифр.');
        }
        return true;
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isActivated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  activationCode: {
    type: DataTypes.STRING
  },
  activationCodeExpires: {
    type: DataTypes.DATE
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'USER'
  },
  activationEmailStatus: {
    type: DataTypes.STRING, // 'pending', 'sent', 'failed'
    defaultValue: 'pending'
  }
});

// Типы оборудования
const EquipmentType = sequelize.define('EquipmentType', {
  equipment_type_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Наименование типа оборудования не должно быть пустым.'
      }
    }
  }
});

// Модели оборудования
const Equipment = sequelize.define('Equipment', {
  equipment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Поле "Наименование" не должно быть пустым.'
      }
    }
  },
  description: {
    type: DataTypes.TEXT
  },
  power: {
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      isNumeric: {
        msg: 'Поле "Мощность" должно быть числовым значением.'
      },
      isPositive: function(value) {
        if (value !== null && value !== undefined && value !== "" && parseFloat(value) < 0) {
          throw new Error("Мощность не может быть отрицательной.");
        }
      }
    }
  },
  inspectionPeriod: {
    type: DataTypes.INTEGER,
    validate: {
      isPositive: {
        msg: 'Период поверки должен быть положительным числом.'
      }
    }
  },
  serviceLife: {
    type: DataTypes.INTEGER,
    validate: {
      isPositive: {
        msg: 'Срок службы должен быть положительным числом.'
      }
    }
  },
  hasThermometer: {
    type: DataTypes.BOOLEAN
  }
});

// Состояния оборудования
const EquipmentStatus = sequelize.define('EquipmentStatus', {
  status_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Поле "Наименование состояния" не должно быть пустым.'
      }
    }
  },
  description: {
    type: DataTypes.TEXT
  }
});

// Таблица договоров (новая сущность)
const Agreement = sequelize.define('Agreement', {
  agreement_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  subscriber_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Subscribers',
      key: 'subscriber_id'
    }
  },
  agreement_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Номер договора не должен быть пустым.'
      }
    }
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  end_date: {
    type: DataTypes.DATEONLY,
    validate: {
      isDate: true
    }
  },
  notes: {
    type: DataTypes.TEXT
  }
}, { timestamps: false });

// Установленное оборудование
const InstalledEquipment = sequelize.define('InstalledEquipment', {
  installed_equipment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  subscriber_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Subscribers',
      key: 'subscriber_id'
    }
  },
  agreement_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Agreements',
      key: 'agreement_id'
    }
  },
  equipment_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'EquipmentTypes',
      key: 'equipment_type_id'
    }
  },
  status_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'EquipmentStatuses',
      key: 'status_id'
    }
  },
  equipment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Equipments',
      key: 'equipment_id'
    }
  },
  installation_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Поле "Дата установки" должно быть корректной датой.'
      }
    }
  },
  installation_location: {
    type: DataTypes.STRING(255),
    validate: {
      notEmpty: {
        msg: 'Поле "Место установки" не должно быть пустым.'
      }
    }
  },
  last_inspection_date: {
    type: DataTypes.DATEONLY,
    validate: {
      isDate: {
        msg: 'Поле "Дата последней поверки" должно быть корректной датой.'
      }
    }
  },
  next_inspection_date: {
    type: DataTypes.DATEONLY,
    validate: {
      isDate: {
        msg: 'Поле "Дата следующей поверки" должно быть корректной датой.'
      }
    }
  },
  notes: {
    type: DataTypes.TEXT
  }
});

// Организации
const Organization = sequelize.define('Organization', {
  organization_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Поле "Наименование" не должно быть пустым.'
      }
    }
  },
  address: {
    type: DataTypes.STRING(255)
  },
  phone_number: {
    type: DataTypes.STRING(20)
  },
  contact_person: {
    type: DataTypes.STRING(255)
  }
});

// Проверки оборудования
const Verification = sequelize.define('Verification', {
  verification_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  verification_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Поле "Дата поверки" должно быть корректной датой.'
      }
    }
  },
  verifier_name: {
    type: DataTypes.STRING(255)
  },
  description: {
    type: DataTypes.TEXT
  },
  result: {
    type: DataTypes.STRING(255)
  }
});

// --- Ассоциации ---

// Адрес и абоненты
Subscriber.belongsTo(Address, { foreignKey: 'address_id' });
Address.hasMany(Subscriber, { foreignKey: 'address_id' });

// Абонент и договоры
Agreement.belongsTo(Subscriber, { foreignKey: 'subscriber_id' });
Subscriber.hasMany(Agreement, { foreignKey: 'subscriber_id' });

// Оборудование и договор
InstalledEquipment.belongsTo(Agreement, { foreignKey: 'agreement_id' });
Agreement.hasMany(InstalledEquipment, { foreignKey: 'agreement_id' });

// Оборудование и абонент
InstalledEquipment.belongsTo(Subscriber, { foreignKey: 'subscriber_id' });
Subscriber.hasMany(InstalledEquipment, { foreignKey: 'subscriber_id' });

// Оборудование и тип оборудования
InstalledEquipment.belongsTo(EquipmentType, { foreignKey: 'equipment_type_id' });
EquipmentType.hasMany(InstalledEquipment, { foreignKey: 'equipment_type_id' });

// Оборудование и состояние
InstalledEquipment.belongsTo(EquipmentStatus, { foreignKey: 'status_id' });
EquipmentStatus.hasMany(InstalledEquipment, { foreignKey: 'status_id' });

// Оборудование и базовая модель оборудования
InstalledEquipment.belongsTo(Equipment, { foreignKey: 'equipment_id' });
Equipment.hasMany(InstalledEquipment, { foreignKey: 'equipment_id' });

// Проверки и оборудование
Verification.belongsTo(InstalledEquipment, { foreignKey: 'installed_equipment_id' });
InstalledEquipment.hasMany(Verification, { foreignKey: 'installed_equipment_id' });

// Проверки и организации
Verification.belongsTo(Organization, { foreignKey: 'organization_id' });
Organization.hasMany(Verification, { foreignKey: 'organization_id' });

module.exports = {
  Address,
  Subscriber,
  EquipmentType,
  Equipment,
  EquipmentStatus,
  Agreement,
  InstalledEquipment,
  Organization,
  Verification
};