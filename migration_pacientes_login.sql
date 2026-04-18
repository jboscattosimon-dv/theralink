-- Executar no Supabase SQL Editor

-- Adicionar coluna senha para pacientes com login próprio
ALTER TABLE pacientes ADD COLUMN IF NOT EXISTS senha text;

-- Tornar psicologo_id opcional (pacientes auto-cadastrados não têm psicólogo inicial)
ALTER TABLE pacientes ALTER COLUMN psicologo_id DROP NOT NULL;
