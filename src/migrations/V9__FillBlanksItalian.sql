-- Step 1: Insert Italian words
WITH it_lang AS (
  SELECT language_id FROM languages WHERE language_name = 'Italian'
)
INSERT INTO words (word, language_id)
SELECT word, (SELECT language_id FROM it_lang)
FROM (VALUES
  ('scrivere'),
  ('lavorare'),
  ('cucina'),
  ('camera'),
  ('finestra'),
  ('porta'),
  ('tavolo'),
  ('pavimento'),
  ('luce'),
  ('lampada'),
  ('oggi'),
  ('ieri'),
  ('domani'),
  ('presto'),
  ('tardi'),
  ('penna'),
  ('duro'),
  ('acqua'),
  ('mela'),
  ('sedia'),
  ('libro'),
  ('giardino'),
  ('classe'),
  ('mangiare'),
  ('veloce')
) AS w(word)
ON CONFLICT (word, language_id) DO NOTHING;

-- Step 2: Insert Italian fill-in-the-blank questions (Levels 1–4)
INSERT INTO fill_blank_questions (
  placeholder_sentence,
  missing_word_id,
  distractors,
  difficulty_score
)
VALUES

-- Level 1 (difficulty_score = 1)
('Io uso una ____ per scrivere.', (SELECT word_id FROM words WHERE word = 'penna' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Italian')), ARRAY['porta', 'libro', 'luce'], 1),
('La ____ è aperta.', (SELECT word_id FROM words WHERE word = 'porta' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Italian')), ARRAY['tavolo', 'finestra', 'penna'], 1),
('Il gatto dorme sulla ____.', (SELECT word_id FROM words WHERE word = 'sedia' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Italian')), ARRAY['lampada', 'acqua', 'porta'], 1),
('Bevo un po'' d''____.', (SELECT word_id FROM words WHERE word = 'acqua' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Italian')), ARRAY['luce', 'penna', 'libro'], 1),

-- Level 2 (difficulty_score = 2)
('Il bambino guarda fuori dalla ____.', (SELECT word_id FROM words WHERE word = 'finestra' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Italian')), ARRAY['porta', 'luce', 'penna'], 2),
('La ____ è in cucina.', (SELECT word_id FROM words WHERE word = 'lampada' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Italian')), ARRAY['sedia', 'porta', 'libro'], 2),
('Io mangio una ____.', (SELECT word_id FROM words WHERE word = 'mela' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Italian')), ARRAY['penna', 'porta', 'acqua'], 2),
('Metto il libro sul ____.', (SELECT word_id FROM words WHERE word = 'tavolo' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Italian')), ARRAY['pavimento', 'porta', 'penna'], 2),

-- Level 3 (difficulty_score = 3)
('Io lavoro nella ____.', (SELECT word_id FROM words WHERE word = 'cucina' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Italian')), ARRAY['camera', 'giardino', 'classe'], 3),
('Lui dorme nella ____.', (SELECT word_id FROM words WHERE word = 'camera' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Italian')), ARRAY['luce', 'cucina', 'porta'], 3),
('Inizio a lavorare ____.', (SELECT word_id FROM words WHERE word = 'presto' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Italian')), ARRAY['tardi', 'oggi', 'domani'], 3),
('Leggo sotto la ____.', (SELECT word_id FROM words WHERE word = 'lampada' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Italian')), ARRAY['porta', 'luce', 'penna'], 3),

-- Level 4 (difficulty_score = 4)
('Lo farò ____.', (SELECT word_id FROM words WHERE word = 'domani' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Italian')), ARRAY['oggi', 'ieri', 'tardi'], 4),
('Il pavimento è bagnato per l''____.', (SELECT word_id FROM words WHERE word = 'acqua' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Italian')), ARRAY['luce', 'libro', 'porta'], 4),
('Ha letto il libro ____.', (SELECT word_id FROM words WHERE word = 'ieri' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Italian')), ARRAY['oggi', 'domani', 'veloce'], 4),
('La luce è accesa nella ____.', (SELECT word_id FROM words WHERE word = 'cucina' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Italian')), ARRAY['camera', 'porta', 'sedia'], 4),
('Lavoro ogni giorno molto ____.', (SELECT word_id FROM words WHERE word = 'duro' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Italian')), ARRAY['tardi', 'mangiare', 'veloce'], 4),
('Domani compriamo una ____.', (SELECT word_id FROM words WHERE word = 'mela' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Italian')), ARRAY['lampada', 'porta', 'libro'], 4),
('Lui è seduto sulla ____.', (SELECT word_id FROM words WHERE word = 'sedia' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Italian')), ARRAY['luce', 'pavimento', 'porta'], 4);
