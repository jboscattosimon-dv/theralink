const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../supabase');

router.post('/registro', async (req, res) => {
  const { nome, email, senha, telefone } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
  const hash = await bcrypt.hash(senha, 10);
  const { data, error } = await supabase
    .from('pacientes')
    .insert([{ nome, email, telefone: telefone || null, senha: hash }])
    .select().single();
  if (error) return res.status(400).json({ erro: 'E-mail já cadastrado ou erro ao criar conta' });
  res.json({ mensagem: 'Conta criada com sucesso', paciente: { id: data.id, nome: data.nome, email: data.email } });
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const { data, error } = await supabase
    .from('pacientes')
    .select('*')
    .eq('email', email)
    .not('senha', 'is', null)
    .maybeSingle();
  if (!data) return res.status(401).json({ erro: 'Credenciais inválidas' });
  const valido = await bcrypt.compare(senha, data.senha);
  if (!valido) return res.status(401).json({ erro: 'Credenciais inválidas' });
  const token = jwt.sign(
    { id: data.id, email: data.email, tipo: 'paciente' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
  res.json({ token, paciente: { id: data.id, nome: data.nome, email: data.email, telefone: data.telefone } });
});

module.exports = router;
