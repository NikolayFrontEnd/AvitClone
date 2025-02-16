const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ItemTypes = {
  REAL_ESTATE: 'Недвижимость',
  AUTO: 'Авто',
  SERVICES: 'Услуги',
};

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory хранилище для объявлений
let items = [];
let users = [];
const makeCounter = () => {
  let count = 0;
  return () => count++;
};
const itemsIdCounter = makeCounter();


//храним данные о пользователе
const makeCounterUser = () => {
  let count = 0;
  return () => count++;
};

const userIdCounter = makeCounterUser();

// Создание нового объявления
app.post('/items', (req, res) => {
  const { name, description, location, type, ...rest } = req.body;

  // Validate common required fields
  if (!name || !description || !location || !type) {
    return res.status(400).json({ error: 'Missing required common fields' });
  }

  switch (type) {
    case ItemTypes.REAL_ESTATE:
      if (!rest.propertyType || !rest.area || !rest.rooms || !rest.price) {
        return res
          .status(400)
          .json({ error: 'Missing required fields for Real estate' });
      }
      break;
    case ItemTypes.AUTO:
      if (!rest.brand || !rest.model || !rest.year || !rest.mileage) {
        return res
          .status(400)
          .json({ error: 'Missing required fields for Auto' });
      }
      break;
    case ItemTypes.SERVICES:
      if (!rest.serviceType || !rest.experience || !rest.cost) {
        return res
          .status(400)
          .json({ error: 'Missing required fields for Services' });
      }
      break;
    default:
      return res.status(400).json({ error: 'Invalid type' });
  }

  const item = {
    id: itemsIdCounter(),
    name,
    description,
    location,
    type,
    ...rest,
  };

  items.push(item);
  res.status(201).json(item);

});

app.post('/Createuser', (req, res) => {
  try {
    const {name, password} = req.body;
    

    if (!name || !password) {
      return res.status(400).json({ error: 'Name and password are required' });
    }

    const user = {
      id: userIdCounter(),
      name,
      password // в реальном приложении пароль нужно хешировать
    };
    
    users.push(user);
    res.status(201).json({ id: user.id });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Получение всех объявлений
app.get('/items', (req, res) => {
  res.json(items);
});

// Получение объявления по его id
app.get('/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id, 10));
  if (item) {
    res.json(item);
  } else {
    res.status(404).send('Item not found');
  }
});

// Обновление объявления по его id
app.put('/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id, 10));
  if (item) {
    Object.assign(item, req.body);
    res.json(item);
  } else {
    res.status(404).send('Item not found');
  }
});

// Удаление объявления по его id
app.delete('/items/:id', (req, res) => {
  const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id, 10));
  if (itemIndex !== -1) {
    items.splice(itemIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Item not found');
  }
});

//const PORT = process.env.PORT || 3000;

app.listen(3000, '0.0.0.0');