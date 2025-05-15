-- Insert zulu language
INSERT INTO languages (language_name) VALUES
('Zulu');


-- Insert Zulu words
INSERT INTO words (word, language_id) VALUES
('Sawubona',           (SELECT language_id FROM languages WHERE language_name = 'Zulu')),
('Hamba kahle',    (SELECT language_id FROM languages WHERE language_name = 'Zulu')),
('Ngiyacela',     (SELECT language_id FROM languages WHERE language_name = 'Zulu')),
('Ngiyabonga',         (SELECT language_id FROM languages WHERE language_name = 'Zulu'));
