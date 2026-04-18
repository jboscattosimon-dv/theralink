const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supabase = require('../supabase');

router.get('/', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('sessoes')
    .select('*, pacientes(nome)')
    .eq('psicologo_id', req.usuario.id)
    .order('data_hora');
  if (error) return res.status(400).json({ erro: error.message });
  res.json(data);
});

router.post('/', auth, async (req, res) => {
  const { paciente_id, data_hora, duracao_min, modalidade, valor } = req.body;
  // Gera link único para videochamada (integração Daily.co)
  const sala = `theralink-${req.usuario.id}-${Date.now()}`;
  const { data, error } = await supabase
    .from('sessoes')
    .insert([{ paciente_id, data_hora, duracao_min, modalidade, valor, sala_video: sala, psicologo_id: req.usuario.id }])
    .select().single();
  if (error) return res.status(400).json({ erro: error.message });
  res.json(data);
});

router.put('/:id', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('sessoes')
    .update(req.body)
    .eq('id', req.params.id)
    .eq('psicologo_id', req.usuario.id)
    .select().single();
  if (error) return res.status(400).json({ erro: error.message });
  res.json(data);
});

module.exports = router;
