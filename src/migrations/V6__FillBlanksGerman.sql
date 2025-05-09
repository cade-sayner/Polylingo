-- Ensure German language exists
INSERT INTO languages (language_name)
VALUES ('German')
ON CONFLICT (language_name) DO NOTHING;

-- Insert basic German words
WITH de_lang AS (
  SELECT language_id FROM languages WHERE language_name = 'German'
)
INSERT INTO words (word, language_id)
SELECT word, (SELECT language_id FROM de_lang)
FROM (VALUES
  ('Katze'),
  ('Hund'),
  ('Apfel'),
  ('Baum'),
  ('Haus'),
  ('ich'),
  ('esse'),
  ('spiele'),
  ('im'),
  ('der'),
  ('Garten'),
  ('Kind'),
  ('zur'),
  ('Schule'),
  ('Wasser'),
  ('trinke'),
  ('Buch'),
  ('lese'),
  ('Stuhl'),
  ('Fenster'),
  ('Tür'),
  ('Tisch'),
  ('heute'),
  ('gestern'),
  ('morgen')
) AS w(word)
ON CONFLICT (word, language_id) DO NOTHING;

-- Insert German fill-in-the-blank questions (levels 1–3)
INSERT INTO fill_blank_questions (
  placeholder_sentence,
  missing_word_id,
  distractors,
  difficulty_score
)
VALUES
-- Level 1
('Ich esse einen ____', (SELECT word_id FROM words WHERE word = 'Apfel' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'German')), ARRAY['Hund', 'Katze', 'Baum'], 1),
('Die ____ schläft', (SELECT word_id FROM words WHERE word = 'Katze' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'German')), ARRAY['Schule', 'Wasser', 'Haus'], 1),
('Der ____ ist groß', (SELECT word_id FROM words WHERE word = 'Baum' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'German')), ARRAY['Tisch', 'Stuhl', 'Katze'], 1),
('Ich ____ Wasser', (SELECT word_id FROM words WHERE word = 'trinke' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'German')), ARRAY['lese', 'spiele', 'esse'], 1),
('Das ____ ist offen', (SELECT word_id FROM words WHERE word = 'Fenster' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'German')), ARRAY['Buch', 'Garten', 'Tür'], 1),

-- Level 2
('Das Kind geht zur ____', (SELECT word_id FROM words WHERE word = 'Schule' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'German')), ARRAY['Katze', 'Tür', 'Tisch'], 2),
('Ich spiele im ____', (SELECT word_id FROM words WHERE word = 'Garten' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'German')), ARRAY['Fenster', 'Stuhl', 'Haus'], 2),
('Der Hund sitzt auf dem ____', (SELECT word_id FROM words WHERE word = 'Stuhl' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'German')), ARRAY['Fenster', 'Tisch', 'Baum'], 2),
('Ich lese ein ____', (SELECT word_id FROM words WHERE word = 'Buch' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'German')), ARRAY['Katze', 'Tür', 'Apfel'], 2),
('Der ____ ist zu', (SELECT word_id FROM words WHERE word = 'Tür' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'German')), ARRAY['Hund', 'Buch', 'Fenster'], 2),

-- Level 3
('Ich esse ____', (SELECT word_id FROM words WHERE word = 'heute' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'German')), ARRAY['morgen', 'gestern', 'Haus'], 3),
('Das ____ ist im Haus', (SELECT word_id FROM words WHERE word = 'Kind' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'German')), ARRAY['Tisch', 'Fenster', 'Baum'], 3),
('Wir gehen ____ zur Schule', (SELECT word_id FROM words WHERE word = 'morgen' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'German')), ARRAY['gestern', 'heute', 'Katze'], 3),
('Ich spiele mit dem ____', (SELECT word_id FROM words WHERE word = 'Hund' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'German')), ARRAY['Tür', 'Fenster', 'Apfel'], 3),
('Der Apfel liegt auf dem ____', (SELECT word_id FROM words WHERE word = 'Tisch' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'German')), ARRAY['Stuhl', 'Garten', 'Fenster'], 3);
