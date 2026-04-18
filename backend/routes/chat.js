const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supabase = require('../supabase');

router.get('/:paciente_id', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('mensagens')
    .select('*')
    .eq('paciente_id', req.params.paciente_id)
    .eq('psicologo_id', req.usuario.id)
    .order('criado_em');
  if (error) return res.status(400).json({ erro: error.message });
  res.json(data);
});

router.post('/', auth, async (req, res) => {
  const { paciente_id, conteudo, remetente } = req.body;
  const { data, error } = await supabase
    .from('mensagens')
    .insert([{ paciente_id, conteudo, remetente, psicologo_id: req.usuario.id }])
    .select().single();
  if (error) return res.status(400).json({ erro: error.message });
  res.json(data);
});

module.exports = router;
