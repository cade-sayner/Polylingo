WITH af_lang AS (
  SELECT language_id FROM languages WHERE language_name = 'Afrikaans'
)
INSERT INTO words (word, language_id)
SELECT word, (SELECT language_id FROM af_lang)
FROM (VALUES
  ('skryf'),
  ('werk'),
  ('kombuis'),
  ('slaapkamer'),
  ('venster'),
  ('deur'),
  ('tafel'),
  ('vloer'),
  ('lig'),
  ('leeslamp'),
  ('vandag'),
  ('gister'),
  ('môre'),
  ('vroeg'),
  ('laat'),
  ('pen'),
  ('hard')
) AS w(word)
ON CONFLICT (word, language_id) DO NOTHING;

-- Insert level 3 and 4 Afrikaans fill-in-the-blank questions
INSERT INTO fill_blank_questions (
  placeholder_sentence,
  missing_word_id,
  distractors,
  difficulty_score
)
VALUES
-- Level 3 (difficulty_score = 3)
('Hy skryf met ''n ____', (SELECT word_id FROM words WHERE word = 'pen' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')), ARRAY['boek', 'deur', 'vloer'], 3),
('Die meisie werk in die ____', (SELECT word_id FROM words WHERE word = 'kombuis' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')), ARRAY['tuin', 'slaapkamer', 'klaskamer'], 3),
('Ek slaap in die ____', (SELECT word_id FROM words WHERE word = 'slaapkamer' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')), ARRAY['vloer', 'deur', 'huis'], 3),
('Die ____ is oop', (SELECT word_id FROM words WHERE word = 'deur' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')), ARRAY['lig', 'vloer', 'huis'], 3),
('Die kind sit aan die ____', (SELECT word_id FROM words WHERE word = 'tafel' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')), ARRAY['vloer', 'deur', 'venster'], 3),
('Ek kyk deur die ____', (SELECT word_id FROM words WHERE word = 'venster' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')), ARRAY['deur', 'tafel', 'vloer'], 3),
('Ons begin werk ____', (SELECT word_id FROM words WHERE word = 'vroeg' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')), ARRAY['laat', 'vandag', 'môre'], 3),
('Hy lees onder die ____', (SELECT word_id FROM words WHERE word = 'leeslamp' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')), ARRAY['deur', 'vloer', 'huis'], 3),

-- Level 4 (difficulty_score = 4)
('Ek sal dit ____ doen', (SELECT word_id FROM words WHERE word = 'môre' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')), ARRAY['vandag', 'gister', 'laat'], 4),
('Die vloer is nat van die ____', (SELECT word_id FROM words WHERE word = 'water' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')), ARRAY['lig', 'deur', 'stoel'], 4),
('Hy het die boek ____ gelees', (SELECT word_id FROM words WHERE word = 'gister' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')), ARRAY['vandag', 'môre', 'toe'], 4),
('Die lig is aan in die ____', (SELECT word_id FROM words WHERE word = 'kombuis' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')), ARRAY['venster', 'vloer', 'deur'], 4),
('Ek werk elke dag baie ____', (SELECT word_id FROM words WHERE word = 'hard' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')), ARRAY['laat', 'gister', 'eet'], 4),
('Ons gaan môre ____ koop', (SELECT word_id FROM words WHERE word = 'appel' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')), ARRAY['boek', 'deur', 'tafel'], 4),
('Hy sit stil op die ____', (SELECT word_id FROM words WHERE word = 'stoel' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')), ARRAY['vloer', 'lig', 'deur'], 4);
