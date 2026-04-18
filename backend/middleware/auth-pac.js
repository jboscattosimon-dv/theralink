const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Token não fornecido' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.tipo !== 'paciente') return res.status(403).json({ erro: 'Acesso negado' });
    req.paciente = payload;
    next();
  } catch {
    res.status(401).json({ erro: 'Token inválido' });
  }
};
