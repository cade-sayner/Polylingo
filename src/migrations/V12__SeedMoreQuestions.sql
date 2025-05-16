-- Step 1: Add new English words to the database
WITH en_lang AS (
  SELECT language_id FROM languages WHERE language_name = 'English'
)
INSERT INTO words (word, language_id)
VALUES
  ('book', (SELECT language_id FROM en_lang)),
  ('tree', (SELECT language_id FROM en_lang)),
  ('school', (SELECT language_id FROM en_lang)),
  ('water', (SELECT language_id FROM en_lang)),
  ('table', (SELECT language_id FROM en_lang)),
  ('chair', (SELECT language_id FROM en_lang)),
  ('window', (SELECT language_id FROM en_lang)),
  ('door', (SELECT language_id FROM en_lang)),
  ('pen', (SELECT language_id FROM en_lang)),
  ('apple', (SELECT language_id FROM en_lang))
ON CONFLICT (word, language_id) DO NOTHING;

-- Step 2: Add corresponding words for each supported language

-- Afrikaans words
WITH af_lang AS (
  SELECT language_id FROM languages WHERE language_name = 'Afrikaans'
)
INSERT INTO words (word, language_id)
VALUES
  ('boek', (SELECT language_id FROM af_lang)),      -- book
  ('boom', (SELECT language_id FROM af_lang)),      -- tree  
  ('skool', (SELECT language_id FROM af_lang)),     -- school
  ('water', (SELECT language_id FROM af_lang)),     -- water
  ('tafel', (SELECT language_id FROM af_lang)),     -- table
  ('stoel', (SELECT language_id FROM af_lang)),     -- chair
  ('venster', (SELECT language_id FROM af_lang)),   -- window
  ('deur', (SELECT language_id FROM af_lang)),      -- door
  ('pen', (SELECT language_id FROM af_lang)),       -- pen
  ('appel', (SELECT language_id FROM af_lang))      -- apple
ON CONFLICT (word, language_id) DO NOTHING;

-- German words
WITH de_lang AS (
  SELECT language_id FROM languages WHERE language_name = 'German'
)
INSERT INTO words (word, language_id)
VALUES
  ('Buch', (SELECT language_id FROM de_lang)),      -- book
  ('Baum', (SELECT language_id FROM de_lang)),      -- tree
  ('Schule', (SELECT language_id FROM de_lang)),    -- school
  ('Wasser', (SELECT language_id FROM de_lang)),    -- water
  ('Tisch', (SELECT language_id FROM de_lang)),     -- table
  ('Stuhl', (SELECT language_id FROM de_lang)),     -- chair
  ('Fenster', (SELECT language_id FROM de_lang)),   -- window
  ('Tür', (SELECT language_id FROM de_lang)),       -- door
  ('Stift', (SELECT language_id FROM de_lang)),     -- pen
  ('Apfel', (SELECT language_id FROM de_lang))      -- apple
ON CONFLICT (word, language_id) DO NOTHING;

-- French words
WITH fr_lang AS (
  SELECT language_id FROM languages WHERE language_name = 'French'
)
INSERT INTO words (word, language_id)
VALUES
  ('livre', (SELECT language_id FROM fr_lang)),     -- book
  ('arbre', (SELECT language_id FROM fr_lang)),     -- tree
  ('école', (SELECT language_id FROM fr_lang)),     -- school
  ('eau', (SELECT language_id FROM fr_lang)),       -- water
  ('table', (SELECT language_id FROM fr_lang)),     -- table
  ('chaise', (SELECT language_id FROM fr_lang)),    -- chair
  ('fenêtre', (SELECT language_id FROM fr_lang)),   -- window
  ('porte', (SELECT language_id FROM fr_lang)),     -- door
  ('stylo', (SELECT language_id FROM fr_lang)),     -- pen
  ('pomme', (SELECT language_id FROM fr_lang))      -- apple
ON CONFLICT (word, language_id) DO NOTHING;

-- Italian words
WITH it_lang AS (
  SELECT language_id FROM languages WHERE language_name = 'Italian'
)
INSERT INTO words (word, language_id)
VALUES
  ('libro', (SELECT language_id FROM it_lang)),     -- book
  ('albero', (SELECT language_id FROM it_lang)),    -- tree
  ('scuola', (SELECT language_id FROM it_lang)),    -- school
  ('acqua', (SELECT language_id FROM it_lang)),     -- water
  ('tavolo', (SELECT language_id FROM it_lang)),    -- table
  ('sedia', (SELECT language_id FROM it_lang)),     -- chair
  ('finestra', (SELECT language_id FROM it_lang)),  -- window
  ('porta', (SELECT language_id FROM it_lang)),     -- door
  ('penna', (SELECT language_id FROM it_lang)),     -- pen
  ('mela', (SELECT language_id FROM it_lang))       -- apple
ON CONFLICT (word, language_id) DO NOTHING;

-- Spanish words
WITH es_lang AS (
  SELECT language_id FROM languages WHERE language_name = 'Spanish'
)
INSERT INTO words (word, language_id)
VALUES
  ('libro', (SELECT language_id FROM es_lang)),     -- book
  ('árbol', (SELECT language_id FROM es_lang)),     -- tree
  ('escuela', (SELECT language_id FROM es_lang)),   -- school
  ('agua', (SELECT language_id FROM es_lang)),      -- water
  ('mesa', (SELECT language_id FROM es_lang)),      -- table
  ('silla', (SELECT language_id FROM es_lang)),     -- chair
  ('ventana', (SELECT language_id FROM es_lang)),   -- window
  ('puerta', (SELECT language_id FROM es_lang)),    -- door
  ('bolígrafo', (SELECT language_id FROM es_lang)), -- pen
  ('manzana', (SELECT language_id FROM es_lang))    -- apple
ON CONFLICT (word, language_id) DO NOTHING;

-- Step 3: Create translation questions from English to each language

-- English to Afrikaans
WITH 
  en_words AS (
    SELECT word, word_id FROM words 
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'English')
  ),
  af_words AS (
    SELECT word, word_id FROM words 
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')
  )
INSERT INTO translation_questions (prompt_word, answer_word, distractors, difficulty_score)
VALUES
  -- book -> boek
  (
    (SELECT word_id FROM en_words WHERE word = 'book'),
    (SELECT word_id FROM af_words WHERE word = 'boek'),
    ARRAY['boom', 'skool', 'pen'],
    2
  ),
  -- tree -> boom
  (
    (SELECT word_id FROM en_words WHERE word = 'tree'),
    (SELECT word_id FROM af_words WHERE word = 'boom'),
    ARRAY['boek', 'venster', 'deur'],
    2
  ),
  -- school -> skool
  (
    (SELECT word_id FROM en_words WHERE word = 'school'),
    (SELECT word_id FROM af_words WHERE word = 'skool'),
    ARRAY['tafel', 'stoel', 'appel'],
    2
  );

-- English to German
WITH 
  en_words AS (
    SELECT word, word_id FROM words 
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'English')
  ),
  de_words AS (
    SELECT word, word_id FROM words 
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'German')
  )
INSERT INTO translation_questions (prompt_word, answer_word, distractors, difficulty_score)
VALUES
  -- book -> Buch
  (
    (SELECT word_id FROM en_words WHERE word = 'book'),
    (SELECT word_id FROM de_words WHERE word = 'Buch'),
    ARRAY['Baum', 'Schule', 'Stift'],
    2
  ),
  -- tree -> Baum
  (
    (SELECT word_id FROM en_words WHERE word = 'tree'),
    (SELECT word_id FROM de_words WHERE word = 'Baum'),
    ARRAY['Buch', 'Fenster', 'Tür'],
    2
  ),
  -- school -> Schule
  (
    (SELECT word_id FROM en_words WHERE word = 'school'),
    (SELECT word_id FROM de_words WHERE word = 'Schule'),
    ARRAY['Tisch', 'Stuhl', 'Apfel'],
    2
  );

-- English to French
WITH 
  en_words AS (
    SELECT word, word_id FROM words 
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'English')
  ),
  fr_words AS (
    SELECT word, word_id FROM words 
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'French')
  )
INSERT INTO translation_questions (prompt_word, answer_word, distractors, difficulty_score)
VALUES
  -- book -> livre
  (
    (SELECT word_id FROM en_words WHERE word = 'book'),
    (SELECT word_id FROM fr_words WHERE word = 'livre'),
    ARRAY['arbre', 'école', 'stylo'],
    2
  ),
  -- tree -> arbre
  (
    (SELECT word_id FROM en_words WHERE word = 'tree'),
    (SELECT word_id FROM fr_words WHERE word = 'arbre'),
    ARRAY['livre', 'fenêtre', 'porte'],
    2
  ),
  -- school -> école
  (
    (SELECT word_id FROM en_words WHERE word = 'school'),
    (SELECT word_id FROM fr_words WHERE word = 'école'),
    ARRAY['table', 'chaise', 'pomme'],
    2
  );

-- English to Italian
WITH 
  en_words AS (
    SELECT word, word_id FROM words 
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'English')
  ),
  it_words AS (
    SELECT word, word_id FROM words 
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'Italian')
  )
INSERT INTO translation_questions (prompt_word, answer_word, distractors, difficulty_score)
VALUES
  -- book -> libro
  (
    (SELECT word_id FROM en_words WHERE word = 'book'),
    (SELECT word_id FROM it_words WHERE word = 'libro'),
    ARRAY['albero', 'scuola', 'penna'],
    2
  ),
  -- tree -> albero
  (
    (SELECT word_id FROM en_words WHERE word = 'tree'),
    (SELECT word_id FROM it_words WHERE word = 'albero'),
    ARRAY['libro', 'finestra', 'porta'],
    2
  ),
  -- school -> scuola
  (
    (SELECT word_id FROM en_words WHERE word = 'school'),
    (SELECT word_id FROM it_words WHERE word = 'scuola'),
    ARRAY['tavolo', 'sedia', 'mela'],
    2
  );

-- English to Spanish
WITH 
  en_words AS (
    SELECT word, word_id FROM words 
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'English')
  ),
  es_words AS (
    SELECT word, word_id FROM words 
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'Spanish')
  )
INSERT INTO translation_questions (prompt_word, answer_word, distractors, difficulty_score)
VALUES
  -- book -> libro
  (
    (SELECT word_id FROM en_words WHERE word = 'book'),
    (SELECT word_id FROM es_words WHERE word = 'libro'),
    ARRAY['árbol', 'escuela', 'bolígrafo'],
    2
  ),
  -- tree -> árbol
  (
    (SELECT word_id FROM en_words WHERE word = 'tree'),
    (SELECT word_id FROM es_words WHERE word = 'árbol'),
    ARRAY['libro', 'ventana', 'puerta'],
    2
  ),
  -- school -> escuela
  (
    (SELECT word_id FROM en_words WHERE word = 'school'),
    (SELECT word_id FROM es_words WHERE word = 'escuela'),
    ARRAY['mesa', 'silla', 'manzana'],
    2
  );

-- Step 4: Create reverse translation questions (from other languages to English)

-- Afrikaans to English
WITH 
  af_words AS (
    SELECT word, word_id FROM words 
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')
  ),
  en_words AS (
    SELECT word, word_id FROM words 
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'English')
  )
INSERT INTO translation_questions (prompt_word, answer_word, distractors, difficulty_score)
VALUES
  -- water -> water
  (
    (SELECT word_id FROM af_words WHERE word = 'water'),
    (SELECT word_id FROM en_words WHERE word = 'water'),
    ARRAY['book', 'tree', 'school'],
    2
  ),
  -- tafel -> table
  (
    (SELECT word_id FROM af_words WHERE word = 'tafel'),
    (SELECT word_id FROM en_words WHERE word = 'table'),
    ARRAY['chair', 'window', 'door'],
    2
  ),
  -- stoel -> chair
  (
    (SELECT word_id FROM af_words WHERE word = 'stoel'),
    (SELECT word_id FROM en_words WHERE word = 'chair'),
    ARRAY['table', 'window', 'pen'],
    2
  );

-- German to English
WITH 
  de_words AS (
    SELECT word, word_id FROM words 
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'German')
  ),
  en_words AS (
    SELECT word, word_id FROM words 
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'English')
  )
INSERT INTO translation_questions (prompt_word, answer_word, distractors, difficulty_score)
VALUES
  -- Wasser -> water
  (
    (SELECT word_id FROM de_words WHERE word = 'Wasser'),
    (SELECT word_id FROM en_words WHERE word = 'water'),
    ARRAY['book', 'tree', 'school'],
    2
  ),
  -- Tisch -> table
  (
    (SELECT word_id FROM de_words WHERE word = 'Tisch'),
    (SELECT word_id FROM en_words WHERE word = 'table'),
    ARRAY['chair', 'window', 'door'],
    2
  ),
  -- Stuhl -> chair
  (
    (SELECT word_id FROM de_words WHERE word = 'Stuhl'),
    (SELECT word_id FROM en_words WHERE word = 'chair'),
    ARRAY['table', 'window', 'pen'],
    2
  );

-- French to English
WITH 
  fr_words AS (
    SELECT word, word_id FROM words 
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'French')
  ),
  en_words AS (
    SELECT word, word_id FROM words 
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'English')
  )
INSERT INTO translation_questions (prompt_word, answer_word, distractors, difficulty_score)
VALUES
  -- eau -> water
  (
    (SELECT word_id FROM fr_words WHERE word = 'eau'),
    (SELECT word_id FROM en_words WHERE word = 'water'),
    ARRAY['book', 'tree', 'school'],
    2
  ),
  -- table -> table
  (
    (SELECT word_id FROM fr_words WHERE word = 'table'),
    (SELECT word_id FROM en_words WHERE word = 'table'),
    ARRAY['chair', 'window', 'door'],
    2
  ),
  -- chaise -> chair
  (
    (SELECT word_id FROM fr_words WHERE word = 'chaise'),
    (SELECT word_id FROM en_words WHERE word = 'chair'),
    ARRAY['table', 'window', 'pen'],
    2
  );

-- Italian to English
WITH 
  it_words AS (
    SELECT word, word_id FROM words 
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'Italian')
  ),
  en_words AS (
    SELECT word, word_id FROM words 
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'English')
  )
INSERT INTO translation_questions (prompt_word, answer_word, distractors, difficulty_score)
VALUES
  -- acqua -> water
  (
    (SELECT word_id FROM it_words WHERE word = 'acqua'),
    (SELECT word_id FROM en_words WHERE word = 'water'),
    ARRAY['book', 'tree', 'school'],
    2
  ),
  -- tavolo -> table
  (
    (SELECT word_id FROM it_words WHERE word = 'tavolo'),
    (SELECT word_id FROM en_words WHERE word = 'table'),
    ARRAY['chair', 'window', 'door'],
    2
  ),
  -- sedia -> chair
  (
    (SELECT word_id FROM it_words WHERE word = 'sedia'),
    (SELECT word_id FROM en_words WHERE word = 'chair'),
    ARRAY['table', 'window', 'pen'],
    2
  );

-- Spanish to English
WITH 
  es_words AS (
    SELECT word, word_id FROM words 
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'Spanish')
  ),
  en_words AS (
    SELECT word, word_id FROM words 
    WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'English')
  )
INSERT INTO translation_questions (prompt_word, answer_word, distractors, difficulty_score)
VALUES
  -- agua -> water
  (
    (SELECT word_id FROM es_words WHERE word = 'agua'),
    (SELECT word_id FROM en_words WHERE word = 'water'),
    ARRAY['book', 'tree', 'school'],
    2
  ),
  -- mesa -> table
  (
    (SELECT word_id FROM es_words WHERE word = 'mesa'),
    (SELECT word_id FROM en_words WHERE word = 'table'),
    ARRAY['chair', 'window', 'door'],
    2
  ),
  -- silla -> chair
  (
    (SELECT word_id FROM es_words WHERE word = 'silla'),
    (SELECT word_id FROM en_words WHERE word = 'chair'),
    ARRAY['table', 'window', 'pen'],
    2
  );

-- Step 5: Create fill-in-the-blank questions for each language

-- English fill-in-the-blank
WITH en_lang AS (
  SELECT language_id FROM languages WHERE language_name = 'English'
)
INSERT INTO fill_blank_questions (
  placeholder_sentence,
  missing_word_id,
  distractors,
  difficulty_score
)
VALUES
  (
    'The student reads a ____.',
    (SELECT word_id FROM words WHERE word = 'book' AND language_id = (SELECT language_id FROM en_lang)),
    ARRAY['tree', 'water', 'pen'],
    2
  ),
  (
    'Birds live in the ____.',
    (SELECT word_id FROM words WHERE word = 'tree' AND language_id = (SELECT language_id FROM en_lang)),
    ARRAY['book', 'chair', 'window'],
    2
  ),
  (
    'Children go to ____ to learn.',
    (SELECT word_id FROM words WHERE word = 'school' AND language_id = (SELECT language_id FROM en_lang)),
    ARRAY['window', 'table', 'door'],
    2
  ),
  (
    'Fish swim in ____.',
    (SELECT word_id FROM words WHERE word = 'water' AND language_id = (SELECT language_id FROM en_lang)),
    ARRAY['book', 'tree', 'school'],
    1
  ),
  (
    'We eat dinner at the ____.',
    (SELECT word_id FROM words WHERE word = 'table' AND language_id = (SELECT language_id FROM en_lang)),
    ARRAY['chair', 'window', 'door'],
    1
  ),
  (
    'Please sit on the ____.',
    (SELECT word_id FROM words WHERE word = 'chair' AND language_id = (SELECT language_id FROM en_lang)),
    ARRAY['table', 'window', 'pen'],
    1
  ),
  (
    'You can see outside through the ____.',
    (SELECT word_id FROM words WHERE word = 'window' AND language_id = (SELECT language_id FROM en_lang)),
    ARRAY['door', 'book', 'apple'],
    1
  ),
  (
    'Please close the ____ when you leave.',
    (SELECT word_id FROM words WHERE word = 'door' AND language_id = (SELECT language_id FROM en_lang)),
    ARRAY['window', 'table', 'chair'],
    1
  ),
  (
    'I write with a ____.',
    (SELECT word_id FROM words WHERE word = 'pen' AND language_id = (SELECT language_id FROM en_lang)),
    ARRAY['book', 'apple', 'water'],
    1
  ),
  (
    'An ____ a day keeps the doctor away.',
    (SELECT word_id FROM words WHERE word = 'apple' AND language_id = (SELECT language_id FROM en_lang)),
    ARRAY['pen', 'water', 'tree'],
    2
  );

-- Afrikaans fill-in-the-blank
WITH af_lang AS (
  SELECT language_id FROM languages WHERE language_name = 'Afrikaans'
)
INSERT INTO fill_blank_questions (
  placeholder_sentence,
  missing_word_id,
  distractors,
  difficulty_score
)
VALUES
  (
    'Die student lees ''n ____.',
    (SELECT word_id FROM words WHERE word = 'boek' AND language_id = (SELECT language_id FROM af_lang)),
    ARRAY['boom', 'water', 'pen'],
    2
  ),
  (
    'Voëls woon in die ____.',
    (SELECT word_id FROM words WHERE word = 'boom' AND language_id = (SELECT language_id FROM af_lang)),
    ARRAY['boek', 'stoel', 'venster'],
    2
  ),
  (
    'Kinders gaan na ____ om te leer.',
    (SELECT word_id FROM words WHERE word = 'skool' AND language_id = (SELECT language_id FROM af_lang)),
    ARRAY['venster', 'tafel', 'deur'],
    2
  );

-- German fill-in-the-blank
WITH de_lang AS (
  SELECT language_id FROM languages WHERE language_name = 'German'
)
INSERT INTO fill_blank_questions (
  placeholder_sentence,
  missing_word_id,
  distractors,
  difficulty_score
)
VALUES
  (
    'Der Student liest ein ____.',
    (SELECT word_id FROM words WHERE word = 'Buch' AND language_id = (SELECT language_id FROM de_lang)),
    ARRAY['Baum', 'Wasser', 'Stift'],
    2
  ),
  (
    'Vögel leben in dem ____.',
    (SELECT word_id FROM words WHERE word = 'Baum' AND language_id = (SELECT language_id FROM de_lang)),
    ARRAY['Buch', 'Stuhl', 'Fenster'],
    2
  ),
  (
    'Kinder gehen zur ____ zum Lernen.',
    (SELECT word_id FROM words WHERE word = 'Schule' AND language_id = (SELECT language_id FROM de_lang)),
    ARRAY['Fenster', 'Tisch', 'Tür'],
    2
  );

-- French fill-in-the-blank
WITH fr_lang AS (
  SELECT language_id FROM languages WHERE language_name = 'French'
)
INSERT INTO fill_blank_questions (
  placeholder_sentence,
  missing_word_id,
  distractors,
  difficulty_score
)
VALUES
  (
    'L''étudiant lit un ____.',
    (SELECT word_id FROM words WHERE word = 'livre' AND language_id = (SELECT language_id FROM fr_lang)),
    ARRAY['arbre', 'eau', 'stylo'],
    2
  ),
  (
    'Les oiseaux vivent dans l''____.',
    (SELECT word_id FROM words WHERE word = 'arbre' AND language_id = (SELECT language_id FROM fr_lang)),
    ARRAY['livre', 'chaise', 'fenêtre'],
    2
  ),
  (
    'Les enfants vont à l''____ pour apprendre.',
    (SELECT word_id FROM words WHERE word = 'école' AND language_id = (SELECT language_id FROM fr_lang)),
    ARRAY['fenêtre', 'table', 'porte'],
    2
  );

-- Italian fill-in-the-blank
WITH it_lang AS (
  SELECT language_id FROM languages WHERE language_name = 'Italian'
)
INSERT INTO fill_blank_questions (
  placeholder_sentence,
  missing_word_id,
  distractors,
  difficulty_score
)
VALUES
  (
    'Lo studente legge un ____.',
    (SELECT word_id FROM words WHERE word = 'libro' AND language_id = (SELECT language_id FROM it_lang)),
    ARRAY['albero', 'acqua', 'penna'],
    2
  ),
  (
    'Gli uccelli vivono nell''____.',
    (SELECT word_id FROM words WHERE word = 'albero' AND language_id = (SELECT language_id FROM it_lang)),
    ARRAY['libro', 'sedia', 'finestra'],
    2
  ),
  (
    'I bambini vanno a ____ per imparare.',
    (SELECT word_id FROM words WHERE word = 'scuola' AND language_id = (SELECT language_id FROM it_lang)),
    ARRAY['finestra', 'tavolo', 'porta'],
    2
  );

-- Spanish fill-in-the-blank
WITH es_lang AS (
  SELECT language_id FROM languages WHERE language_name = 'Spanish'
)
INSERT INTO fill_blank_questions (
  placeholder_sentence,
  missing_word_id,
  distractors,
  difficulty_score
)
VALUES
  (
    'El estudiante lee un ____.',
    (SELECT word_id FROM words WHERE word = 'libro' AND language_id = (SELECT language_id FROM es_lang)),
    ARRAY['árbol', 'agua', 'bolígrafo'],
    2
  ),
  (
    'Los pájaros viven en el ____.',
    (SELECT word_id FROM words WHERE word = 'árbol' AND language_id = (SELECT language_id FROM es_lang)),
    ARRAY['libro', 'silla', 'ventana'],
    2
  ),
  (
    'Los niños van a la ____ para aprender.',
    (SELECT word_id FROM words WHERE word = 'escuela' AND language_id = (SELECT language_id FROM es_lang)),
    ARRAY['ventana', 'mesa', 'puerta'],
    2
  );
