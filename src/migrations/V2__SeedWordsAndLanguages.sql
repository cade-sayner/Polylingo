-- Insert supported languages
INSERT INTO languages (language_name) VALUES
  ('Afrikaans'),
  ('German'),
  ('French'),
  ('Italian');

-- Insert Afrikaans words
INSERT INTO words (word, language_id) VALUES
  ('hallo',         (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')),
  ('totsiens',      (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')),
  ('asseblief',     (SELECT language_id FROM languages WHERE language_name = 'Afrikaans')),
  ('dankie',        (SELECT language_id FROM languages WHERE language_name = 'Afrikaans'));

-- Insert German words
INSERT INTO words (word, language_id) VALUES
  ('hallo',         (SELECT language_id FROM languages WHERE language_name = 'German')),
  ('auf wiedersehen',(SELECT language_id FROM languages WHERE language_name = 'German')),
  ('bitte',         (SELECT language_id FROM languages WHERE language_name = 'German')),
  ('danke',         (SELECT language_id FROM languages WHERE language_name = 'German'));

-- Insert French words
INSERT INTO words (word, language_id) VALUES
  ('bonjour',        (SELECT language_id FROM languages WHERE language_name = 'French')),
  ('au revoir',      (SELECT language_id FROM languages WHERE language_name = 'French')),
  ('merci',          (SELECT language_id FROM languages WHERE language_name = 'French')),
  ('s''il vous plaît',(SELECT language_id FROM languages WHERE language_name = 'French'));

-- Insert Italian words
INSERT INTO words (word, language_id) VALUES
  ('ciao',           (SELECT language_id FROM languages WHERE language_name = 'Italian')),
  ('arrivederci',    (SELECT language_id FROM languages WHERE language_name = 'Italian')),
  ('per favore',     (SELECT language_id FROM languages WHERE language_name = 'Italian')),
  ('grazie',         (SELECT language_id FROM languages WHERE language_name = 'Italian'));
