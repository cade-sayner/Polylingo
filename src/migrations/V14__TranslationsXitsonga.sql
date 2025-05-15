WITH
    xitsonga AS (
        SELECT word, word_id FROM words
        WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')
    ),
    english AS (
        SELECT word, word_id FROM words
        WHERE language_id = (SELECT language_id FROM languages WHERE language_name = 'English')
    )
INSERT INTO translation_questions (prompt_word, answer_word, distractors, difficulty_score) VALUES
  (
    (SELECT word_id FROM xitsonga WHERE word = 'mbyana'),
    (SELECT word_id FROM english WHERE word = 'dog'),
    ARRAY['mat', 'car', 'people'],
    1
  ),
  (
    (SELECT word_id FROM xitsonga WHERE word = 'ximanga'),
    (SELECT word_id FROM english WHERE word = 'cat'),
    ARRAY['run', 'car', 'pig'],
    1
  ),
  (
    (SELECT word_id FROM xitsonga WHERE word = 'yindlo'),
    (SELECT word_id FROM english WHERE word = 'house'),
    ARRAY['flat', 'go', 'mansion'],
    2
  ),
  (
    (SELECT word_id FROM xitsonga WHERE word = 'movha'),
    (SELECT word_id FROM english WHERE word = 'car'),
    ARRAY['sit', 'yacht', 'dog'],
    2
  );
