const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../supabase');

router.post('/registro', async (req, res) => {
  const { nome, email, senha, crp } = req.body;
  const hash = await bcrypt.hash(senha, 10);
  const { data, error } = await supabase
    .from('psicologos')
    .insert([{ nome, email, senha: hash, crp }])
    .select().single();
  if (error) return res.status(400).json({ erro: error.message });
  res.json({ mensagem: 'Cadastro realizado com sucesso', psicologo: data });
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const { data, error } = await supabase
    .from('psicologos')
    .select('*')
    .eq('email', email)
    .single();
  if (error || !data) return res.status(401).json({ erro: 'Credenciais inválidas' });
  const valido = await bcrypt.compare(senha, data.senha);
  if (!valido) return res.status(401).json({ erro: 'Credenciais inválidas' });
  const token = jwt.sign({ id: data.id, email: data.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, psicologo: { id: data.id, nome: data.nome, email: data.email, crp: data.crp } });
});

module.exports = router;
