const express = require('express');
const router = express.Router();
const authPac = require('../middleware/auth-pac');
const supabase = require('../supabase');

router.get('/:psicologo_id', authPac, async (req, res) => {
  const { data, error } = await supabase
    .from('mensagens')
    .select('*')
    .eq('paciente_id', req.paciente.id)
    .eq('psicologo_id', req.params.psicologo_id)
    .order('criado_em');
  if (error) return res.status(400).json({ erro: error.message });
  res.json(data);
});

router.post('/', authPac, async (req, res) => {
  const { psicologo_id, conteudo } = req.body;
  if (!psicologo_id || !conteudo) return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
  const { data, error } = await supabase
    .from('mensagens')
    .insert([{ paciente_id: req.paciente.id, psicologo_id, conteudo, remetente: 'paciente' }])
    .select().single();
  if (error) return res.status(400).json({ erro: error.message });
  res.json(data);
});

module.exports = router;
