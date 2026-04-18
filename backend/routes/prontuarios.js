const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supabase = require('../supabase');

router.get('/:paciente_id', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('prontuarios')
    .select('*')
    .eq('paciente_id', req.params.paciente_id)
    .order('criado_em', { ascending: false });
  if (error) return res.status(400).json({ erro: error.message });
  res.json(data);
});

router.post('/', auth, async (req, res) => {
  const { paciente_id, titulo, conteudo, tipo } = req.body;
  const { data, error } = await supabase
    .from('prontuarios')
    .insert([{ paciente_id, titulo, conteudo, tipo, psicologo_id: req.usuario.id }])
    .select().single();
  if (error) return res.status(400).json({ erro: error.message });
  res.json(data);
});

router.put('/:id', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('prontuarios')
    .update(req.body)
    .eq('id', req.params.id)
    .eq('psicologo_id', req.usuario.id)
    .select().single();
  if (error) return res.status(400).json({ erro: error.message });
  res.json(data);
});

module.exports = router;
