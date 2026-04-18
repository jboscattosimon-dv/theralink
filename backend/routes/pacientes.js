const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supabase = require('../supabase');

router.get('/', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('pacientes')
    .select('*')
    .eq('psicologo_id', req.usuario.id)
    .order('nome');
  if (error) return res.status(400).json({ erro: error.message });
  res.json(data);
});

router.post('/', auth, async (req, res) => {
  const { nome, email, telefone, data_nascimento, convenio } = req.body;
  const { data, error } = await supabase
    .from('pacientes')
    .insert([{ nome, email, telefone, data_nascimento, convenio, psicologo_id: req.usuario.id }])
    .select().single();
  if (error) return res.status(400).json({ erro: error.message });
  res.json(data);
});

router.put('/:id', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('pacientes')
    .update(req.body)
    .eq('id', req.params.id)
    .eq('psicologo_id', req.usuario.id)
    .select().single();
  if (error) return res.status(400).json({ erro: error.message });
  res.json(data);
});

router.delete('/:id', auth, async (req, res) => {
  const { error } = await supabase
    .from('pacientes')
    .delete()
    .eq('id', req.params.id)
    .eq('psicologo_id', req.usuario.id);
  if (error) return res.status(400).json({ erro: error.message });
  res.json({ mensagem: 'Paciente removido' });
});

module.exports = router;
