INSERT INTO fill_blank_questions (
    placeholder_sentence,
    missing_word_id,
    distractors,
    difficulty_score
)
VALUES
-- Level 3 (difficulty_score = 3)
('Hi sungula ntirho ____', (SELECT word_id FROM words WHERE word = 'nimpundzu' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), ARRAY['movha', 'yindlo', 'munhu'], 3),
('Imani ____ ra wena', (SELECT word_id FROM words WHERE word = 'vito' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), ARRAY['ximanga', 'famba', 'movha'], 3),
('Ni ____ mati', (SELECT word_id FROM words WHERE word = 'kombela' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), ARRAY['inkomu', 'ximanga', 'famba'], 3),
('____ kahle', (SELECT word_id FROM words WHERE word = 'famba' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), ARRAY['vito', 'yindlo', 'inkomu'], 3),
('Ni chava ti____', (SELECT word_id FROM words WHERE word = 'mbyana' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), ARRAY['yindlo', 'juzi', 'avuxeni'], 3),

-- Level 4 (difficulty_score = 4)
('Ni kombela ____ bya wena', (SELECT word_id FROM words WHERE word = 'vuxokoxoko' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), ARRAY['munhu', 'famba', 'avuxeni'], 4),
('Yindlo yi tale hi ____ ya mpfula', (SELECT word_id FROM words WHERE word = 'mati' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), ARRAY['kombela', 'vito', 'ntirho'], 4),
('Vanhu va dakwa hi  ____ ', (SELECT word_id FROM words WHERE word = 'byalwa' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), ARRAY['mati', 'juzi', 'avuxeni'], 4),
('____ xa wena a xi twali', (SELECT word_id FROM words WHERE word = 'xivutiso' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), ARRAY['vuxokoxoko', 'ntirho', 'mati'], 4),
('____ ya wena ya luma?', (SELECT word_id FROM words WHERE word = 'mbyana' AND language_id = (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), ARRAY['xikombelo', 'famba', 'kunjhani'], 4);
