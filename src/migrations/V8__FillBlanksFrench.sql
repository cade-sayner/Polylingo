WITH fr_lang AS (
  SELECT language_id FROM languages WHERE language_name = 'French'
)
INSERT INTO words (word, language_id)
SELECT word, (SELECT language_id FROM fr_lang)
FROM (VALUES
  ('écrire'),
  ('travailler'),
  ('cuisine'),
  ('chambre'),
  ('fenêtre'),
  ('porte'),
  ('table'),
  ('sol'),
  ('lumière'),
  ('lampe'),
  ('aujourd''hui'),
  ('hier'),
  ('demain'),
  ('tôt'),
  ('tard'),
  ('stylo'),
  ('dur'),
  ('eau'),
  ('pomme'),
  ('chaise')
) AS w(word)
ON CONFLICT (word, language_id) DO NOTHING;

INSERT INTO fill_blank_questions (
  placeholder_sentence,
  missing_word_id,
  distractors,
  difficulty_score
)
VALUES
-- Level 3 (difficulty_score = 3)
('Il écrit avec un ____', (SELECT word_id FROM words WHERE word = 'stylo' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'French')), ARRAY['livre', 'porte', 'sol'], 3),
('La fille travaille dans la ____', (SELECT word_id FROM words WHERE word = 'cuisine' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'French')), ARRAY['jardin', 'chambre', 'classe'], 3),
('Je dors dans la ____', (SELECT word_id FROM words WHERE word = 'chambre' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'French')), ARRAY['sol', 'porte', 'maison'], 3),
('La ____ est ouverte', (SELECT word_id FROM words WHERE word = 'porte' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'French')), ARRAY['lumière', 'sol', 'maison'], 3),
('L''enfant est assis à la ____', (SELECT word_id FROM words WHERE word = 'table' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'French')), ARRAY['sol', 'porte', 'fenêtre'], 3),
('Je regarde par la ____', (SELECT word_id FROM words WHERE word = 'fenêtre' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'French')), ARRAY['porte', 'table', 'sol'], 3),
('Nous commençons à travailler ____', (SELECT word_id FROM words WHERE word = 'tôt' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'French')), ARRAY['tard', 'aujourd''hui', 'demain'], 3),
('Il lit sous la ____', (SELECT word_id FROM words WHERE word = 'lampe' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'French')), ARRAY['porte', 'sol', 'maison'], 3),

-- Level 4 (difficulty_score = 4)
('Je le ferai ____', (SELECT word_id FROM words WHERE word = 'demain' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'French')), ARRAY['aujourd''hui', 'hier', 'tard'], 4),
('Le sol est mouillé à cause de l''____', (SELECT word_id FROM words WHERE word = 'eau' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'French')), ARRAY['lumière', 'porte', 'chaise'], 4),
('Il a lu le livre ____', (SELECT word_id FROM words WHERE word = 'hier' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'French')), ARRAY['aujourd''hui', 'demain', 'vite'], 4),
('La lumière est allumée dans la ____', (SELECT word_id FROM words WHERE word = 'cuisine' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'French')), ARRAY['fenêtre', 'sol', 'porte'], 4),
('Je travaille très ____ tous les jours', (SELECT word_id FROM words WHERE word = 'dur' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'French')), ARRAY['tard', 'hier', 'manger'], 4),
('Nous allons acheter une ____ demain', (SELECT word_id FROM words WHERE word = 'pomme' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'French')), ARRAY['livre', 'porte', 'table'], 4),
('Il est assis tranquillement sur la ____', (SELECT word_id FROM words WHERE word = 'chaise' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'French')), ARRAY['sol', 'lumière', 'porte'], 4);
