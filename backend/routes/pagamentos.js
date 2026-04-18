const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supabase = require('../supabase');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.get('/', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('pagamentos')
    .select('*, pacientes(nome)')
    .eq('psicologo_id', req.usuario.id)
    .order('criado_em', { ascending: false });
  if (error) return res.status(400).json({ erro: error.message });
  res.json(data);
});

router.post('/checkout', auth, async (req, res) => {
  const { paciente_id, sessao_id, valor, descricao } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'brl',
          product_data: { name: descricao || 'Sessão de Psicologia' },
          unit_amount: Math.round(valor * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/pagamento-sucesso.html`,
      cancel_url: `${process.env.FRONTEND_URL}/pagamento-cancelado.html`,
    });
    await supabase.from('pagamentos').insert([{
      paciente_id, sessao_id, valor, status: 'pendente',
      stripe_session_id: session.id, psicologo_id: req.usuario.id
    }]);
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
