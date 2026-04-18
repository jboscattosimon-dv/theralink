const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('psicologos')
    .select('id, nome, crp, foto_url, criado_em')
    .order('nome');
  if (error) return res.status(400).json({ erro: error.message });
  res.json(data);
});

module.exports = router;
