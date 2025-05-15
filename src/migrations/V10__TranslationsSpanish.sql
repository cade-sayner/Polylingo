-- 1. Insert Spanish Language
INSERT INTO languages (language_name) VALUES 
  ('Spanish')
ON CONFLICT (language_name) DO NOTHING;

-- 2. Insert Spanish Words
WITH spanish_lang AS (
  SELECT language_id FROM languages WHERE language_name = 'Spanish'
)
INSERT INTO words (word, language_id) VALUES
  ('perro', (SELECT language_id FROM spanish_lang)),  -- dog
  ('gato', (SELECT language_id FROM spanish_lang)),   -- cat
  ('casa', (SELECT language_id FROM spanish_lang)),   -- house
  ('coche', (SELECT language_id FROM spanish_lang))   -- car
ON CONFLICT DO NOTHING;

-- 3. Insert Spanish → English Translation Questions
WITH
  spanish AS (
    SELECT word, word_id FROM words
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'Spanish')
  ),
  english AS (
    SELECT word, word_id FROM words
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'English')
  )
INSERT INTO translation_questions (prompt_word, answer_word, distractors, difficulty_score) VALUES
  (
    (SELECT word_id FROM spanish WHERE word = 'perro'),
    (SELECT word_id FROM english WHERE word = 'dog'),
    ARRAY['cat', 'car', 'house'],
    1
  ),
  (
    (SELECT word_id FROM spanish WHERE word = 'gato'),
    (SELECT word_id FROM english WHERE word = 'cat'),
    ARRAY['dog', 'car', 'house'],
    1
  ),
  (
    (SELECT word_id FROM spanish WHERE word = 'casa'),
    (SELECT word_id FROM english WHERE word = 'house'),
    ARRAY['car', 'dog', 'cat'],
    2
  ),
  (
    (SELECT word_id FROM spanish WHERE word = 'coche'),
    (SELECT word_id FROM english WHERE word = 'car'),
    ARRAY['house', 'cat', 'dog'],
    2
  );
