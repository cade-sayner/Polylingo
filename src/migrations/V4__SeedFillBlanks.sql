-- Ensure Afrikaans language exists
INSERT INTO languages (language_name)
VALUES ('Afrikaans')
ON CONFLICT (language_name) DO NOTHING;

-- Insert Afrikaans words
WITH af_lang AS (
  SELECT language_id FROM languages WHERE language_name = 'Afrikaans'
)
INSERT INTO words (word, language_id)
SELECT word, (SELECT language_id FROM af_lang)
FROM (VALUES
  ('kat'),
  ('toe'),
  ('hond'),
  ('appel'),
  ('boom'),
  ('huis'),
  ('ek'),
  ('eet'),
  ('n'),
  ('speel'),
  ('in'),
  ('die'),
  ('tuin'),
  ('kind'),
  ('loop'),
  ('skool'),
  ('water'),
  ('drink'),
  ('boek'),
  ('lees'),
  ('stoel')
) AS w(word)
ON CONFLICT (word, language_id) DO NOTHING;

-- Insert 10 Afrikaans fill-in-the-blank questions
INSERT INTO fill_blank_questions (
  placeholder_sentence,
  missing_word_id,
  distractors,
  difficulty_score
)
VALUES
(
  'Ek eet ''n ____',
  (SELECT word_id FROM words WHERE word = 'appel' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')),
  ARRAY['kat', 'huis', 'boom'],
  1
),
(
  'Die ____ sit op die mat',
  (SELECT word_id FROM words WHERE word = 'kat' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')),
  ARRAY['appel', 'huis', 'hond'],
  1
),
(
  'Die hond speel in die ____',
  (SELECT word_id FROM words WHERE word = 'tuin' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')),
  ARRAY['huis', 'kat', 'boom'],
  1
),
(
  'Die kind gaan skool ____',
  (SELECT word_id FROM words WHERE word = 'toe' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')),
  ARRAY['in', 'huis', 'uit'],
  2
),
(
  'Ek ____ water',
  (SELECT word_id FROM words WHERE word = 'drink' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')),
  ARRAY['eet', 'speel', 'lees'],
  1
),
(
  'Die kind ____ in die park',
  (SELECT word_id FROM words WHERE word = 'speel' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')),
  ARRAY['drink', 'lees', 'sit'],
  1
),
(
  'Die boom is in die ____',
  (SELECT word_id FROM words WHERE word = 'tuin' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')),
  ARRAY['stoel', 'huis', 'kat'],
  1
),
(
  'Die vrou lees ''n ____',
  (SELECT word_id FROM words WHERE word = 'boek' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')),
  ARRAY['appel', 'boom', 'kat'],
  1
),
(
  'Ek sit op die ____',
  (SELECT word_id FROM words WHERE word = 'stoel' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')),
  ARRAY['huis', 'boom', 'boek'],
  1
),
(
  'Hy ____ vinnig na die skool',
  (SELECT word_id FROM words WHERE word = 'loop' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')),
  ARRAY['eet', 'sit', 'lees'],
  2
);
