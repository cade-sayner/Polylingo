-- Insert Xitsonga language
INSERT INTO languages (language_name) VALUES
('Xitsonga');


-- Insert Xitsonga words
INSERT INTO words (word, language_id) VALUES
('avuxeni',           (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), -- good morning
('famba',           (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), -- go
('xivutiso',         (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), -- question
('xikombiso',         (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), -- example
('xikombelo',         (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), -- request
('kombela',    (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), -- Ask
('inkomu',         (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), -- thanks
('ntirho',         (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), -- work
('vito',         (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), -- name
('munhu',         (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), -- person
('vuxokoxoko',         (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), --information
('kunjhani',         (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), --how are you
('byalwa',         (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), -- beer
('mati',         (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), -- water
('juzi',         (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), -- Juice
('mbyana',         (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), -- Dog
('ximanga',         (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), -- Cat
('movha',         (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')), -- Car
('yindlo',         (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')),-- House
('nimpundzu',         (SELECT language_id FROM languages WHERE language_name = 'Xitsonga')); -- Morning