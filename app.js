import express from 'express';
import session from 'express-session';
import sequelize from './config/db.js';
import { User, Expense } from './models/initmodels.js';
import path from 'path';

const app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'mysecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));


app.get('/', (req, res) => {
  res.render('home');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user && user.password === password) { 
      req.session.userId = user.id;
      console.log("User logged in, session ID:", req.session.userId); 
      console.log("Session data:", req.session); 
      res.redirect('/dashboard');
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newUser = await User.create({ username, email, password });
    res.send('User registered successfully');
  } catch (err) {
    res.status(500).send('Error registering user');
  }
});

app.get('/dashboard', async (req, res) => {
  try {
      console.log("Session user ID at /dashboard:", req.session.userId); 

      if (!req.session.userId) {
          return res.status(401).send('User not authenticated');
      }

      const expenses = await Expense.findAll({
          where: {
              userId: req.session.userId
          }
      });

      res.render('dashboard', { expenses });
  } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).send('Error loading dashboard');
  }
});

app.get('/view-expense', async (req, res) => {
  try {
      const expenses = await Expense.findAll({ 
          where: { userId: req.session.userId } 
      });
      res.render('view-expense', { expenses });
  } catch (err) {
      console.error('Error fetching expenses:', err);
      res.status(500).send('Internal Server Error');
  }
});


app.get('/add-expense', (req, res) => {
  res.render('add-expense');
});

app.post('/add-expense', async (req, res) => {
  const { description, amount, date } = req.body;

  try {
      const expenseDate = new Date(date);
      await Expense.create({
          description,
          amount,
          date: expenseDate,
          userId: req.session.userId
      });

      res.redirect('/view-expense');
  } catch (err) {
      console.error('Error adding expense:', err);
      res.status(500).send('Internal Server Error');
  }
});


app.get('/edit-expense/:id', async (req, res) => {
  const expenseId = req.params.id;
  try {
    const expense = await Expense.findByPk(expenseId);
    if (expense && expense.userId === req.session.userId) { 
      res.render('edit-expense', { expense });
    } else {
      res.status(404).send('Expense not found');
    }
  } catch (err) {
    console.error('Error fetching expense:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/edit-expense/:id', async (req, res) => {
  const expenseId = req.params.id;
  const { description, amount, date } = req.body;
  try {
    const expense = await Expense.findByPk(expenseId);
    if (expense && expense.userId === req.session.userId) {
      await expense.update({ description, amount, date });
      res.redirect('/view-expense');
    } else {
      res.status(404).send('Expense not found');
    }
  } catch (err) {
    console.error('Error updating expense:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/delete-expense/:id', async (req, res) => {
  try {
      const expenseId = req.params.id;
      const expense = await Expense.findOne({ where: { id: expenseId } });

      if (!expense) {
          return res.status(404).send('Expense not found');
      }

      await expense.destroy();
      res.redirect('/view-expense');
  } catch (error) {
      console.error('Error deleting expense:', error);
      res.status(500).send('Error deleting expense');
  }
});

sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Database & tables created!');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log('Error creating tables: ' + err));

  export default app;