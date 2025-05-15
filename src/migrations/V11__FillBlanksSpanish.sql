-- Insert Spanish words
WITH es_lang AS (
  SELECT language_id FROM languages WHERE language_name = 'Spanish'
)
INSERT INTO words (word, language_id)
SELECT word, (SELECT language_id FROM es_lang)
FROM (VALUES
  ('escribir'),     -- write
  ('trabajar'),     -- work
  ('cocina'),       -- kitchen
  ('dormitorio'),   -- bedroom
  ('ventana'),      -- window
  ('puerta'),       -- door
  ('mesa'),         -- table
  ('suelo'),        -- floor
  ('luz'),          -- light
  ('agua'),          -- water
  ('manzana'),          -- water
  ('silla'),          -- water
  ('lámpara'),      -- lamp
  ('hoy'),          -- today
  ('ayer'),         -- yesterday
  ('mañana'),       -- tomorrow
  ('temprano'),     -- early
  ('tarde'),        -- late
  ('bolígrafo'),    -- pen
  ('duro')          -- hard
) AS w(word)
ON CONFLICT (word, language_id) DO NOTHING;

-- Insert level 3 and 4 Spanish fill-in-the-blank questions
INSERT INTO fill_blank_questions (
  placeholder_sentence,
  missing_word_id,
  distractors,
  difficulty_score
)
VALUES
-- Level 3
('Él escribe con un ____', (SELECT word_id FROM words WHERE word = 'bolígrafo' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Spanish')), ARRAY['libro', 'puerta', 'suelo'], 3),
('La niña trabaja en la ____', (SELECT word_id FROM words WHERE word = 'cocina' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Spanish')), ARRAY['jardín', 'dormitorio', 'aula'], 3),
('Duermo en el ____', (SELECT word_id FROM words WHERE word = 'dormitorio' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Spanish')), ARRAY['suelo', 'puerta', 'casa'], 3),
('La ____ está abierta', (SELECT word_id FROM words WHERE word = 'puerta' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Spanish')), ARRAY['luz', 'suelo', 'casa'], 3),
('El niño se sienta en la ____', (SELECT word_id FROM words WHERE word = 'mesa' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Spanish')), ARRAY['suelo', 'puerta', 'ventana'], 3),
('Miro por la ____', (SELECT word_id FROM words WHERE word = 'ventana' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Spanish')), ARRAY['puerta', 'mesa', 'suelo'], 3),
('Empezamos a trabajar ____', (SELECT word_id FROM words WHERE word = 'temprano' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Spanish')), ARRAY['tarde', 'hoy', 'mañana'], 3),
('Lee debajo de la ____', (SELECT word_id FROM words WHERE word = 'lámpara' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Spanish')), ARRAY['puerta', 'suelo', 'casa'], 3),

-- Level 4
('Lo haré ____', (SELECT word_id FROM words WHERE word = 'mañana' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Spanish')), ARRAY['hoy', 'ayer', 'tarde'], 4),
('El suelo está mojado por el ____', (SELECT word_id FROM words WHERE word = 'agua' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Spanish')), ARRAY['luz', 'puerta', 'silla'], 4),
('Leyó el libro ____', (SELECT word_id FROM words WHERE word = 'ayer' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Spanish')), ARRAY['hoy', 'mañana', 'entonces'], 4),
('La luz está encendida en la ____', (SELECT word_id FROM words WHERE word = 'cocina' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Spanish')), ARRAY['ventana', 'suelo', 'puerta'], 4),
('Trabajo muy ____ cada día', (SELECT word_id FROM words WHERE word = 'duro' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Spanish')), ARRAY['tarde', 'ayer', 'comer'], 4),
('Vamos a comprar una ____ mañana', (SELECT word_id FROM words WHERE word = 'manzana' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Spanish')), ARRAY['libro', 'puerta', 'mesa'], 4),
('Él se sienta quieto en la ____', (SELECT word_id FROM words WHERE word = 'silla' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Spanish')), ARRAY['suelo', 'luz', 'puerta'], 4);
