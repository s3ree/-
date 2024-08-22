import express from 'express';
import { Expense } from '../models/initmodels.js';
import { ensureAuthenticated } from '../config/auth.js';

const router = express.Router();

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    res.render('dashboard', { expenses });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/', (req, res) => {
  res.render('home');
});

export default router;

module.exports = router;
