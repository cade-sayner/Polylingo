-- 1. Insert Languages
INSERT INTO languages (language_name) VALUES 
  ('English'),
  ('Afrikaans')
ON CONFLICT (language_name) DO NOTHING;

-- 2. Insert English Words
WITH english_lang AS (
  SELECT language_id FROM languages WHERE language_name = 'English'
)
INSERT INTO words (word, language_id) VALUES
  ('dog', (SELECT language_id FROM english_lang)),
  ('cat', (SELECT language_id FROM english_lang)),
  ('house', (SELECT language_id FROM english_lang)),
  ('car', (SELECT language_id FROM english_lang))
ON CONFLICT DO NOTHING;

-- 3. Insert Afrikaans Words
WITH afrikaans_lang AS (
  SELECT language_id FROM languages WHERE language_name = 'Afrikaans'
)
INSERT INTO words (word, language_id) VALUES
  ('hond', (SELECT language_id FROM afrikaans_lang)),
  ('kat', (SELECT language_id FROM afrikaans_lang)),
  ('huis', (SELECT language_id FROM afrikaans_lang)),
  ('motor', (SELECT language_id FROM afrikaans_lang))
ON CONFLICT DO NOTHING;

-- 4. Insert Afrikaans → English Translation Questions
WITH
  afrikaans AS (
    SELECT word, word_id FROM words
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')
  ),
  english AS (
    SELECT word, word_id FROM words
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'English')
  )
INSERT INTO translation_questions (prompt_word, answer_word, distractors, difficulty_score) VALUES
  (
    (SELECT word_id FROM afrikaans WHERE word = 'hond'),
    (SELECT word_id FROM english WHERE word = 'dog'),
    ARRAY['cat', 'car', 'house'],
    1
  ),
  (
    (SELECT word_id FROM afrikaans WHERE word = 'kat'),
    (SELECT word_id FROM english WHERE word = 'cat'),
    ARRAY['dog', 'car', 'house'],
    1
  ),
  (
    (SELECT word_id FROM afrikaans WHERE word = 'huis'),
    (SELECT word_id FROM english WHERE word = 'house'),
    ARRAY['car', 'dog', 'cat'],
    2
  ),
  (
    (SELECT word_id FROM afrikaans WHERE word = 'motor'),
    (SELECT word_id FROM english WHERE word = 'car'),
    ARRAY['house', 'cat', 'dog'],
    2
  );
