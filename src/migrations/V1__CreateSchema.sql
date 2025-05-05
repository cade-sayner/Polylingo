CREATE TABLE "users" (
  "user_id" serial PRIMARY KEY,
  "google_id" varchar(30) UNIQUE NOT NULL,
  "email" varchar(255) UNIQUE NOT NULL,
  "name" varchar(255) NOT NULL,
  "role_id" int NOT NULL
);

CREATE TABLE "roles" (
  "id" serial PRIMARY KEY,
  "role" varchar(255) NOT NULL
);

CREATE TABLE "languages" (
  "language_id" serial PRIMARY KEY,
  "language_name" varchar(255) UNIQUE NOT NULL
);

CREATE TABLE "words" (
  "word_id" serial PRIMARY KEY,
  "word" varchar(64) NOT NULL,
  "language_id" int NOT NULL
);

CREATE TABLE "translation_questions" (
  "translation_question_id" serial PRIMARY KEY,
  "prompt_word" int NOT NULL,
  "answer_word" int NOT NULL,
  "distractors" varchar[] NOT NULL,
  "difficulty_score" int NOT NULL
);

CREATE TABLE "fill_blank_questions" (
  "fill_blank_questions_id" serial PRIMARY KEY,
  "placeholder_sentence" varchar(512),
  "missing_word_id" int NOT NULL,
  "distractors" varchar[] NOT NULL,
  "difficulty_score" int NOT NULL
);

CREATE TABLE "translation_questions_audit" (
  "translation_questions_audit_id" serial PRIMARY KEY,
  "user_id" int NOT NULL,
  "translation_question_id" int NOT NULL,
  "time_attempted" timestamp NOT NULL,
  "answer_correct" boolean NOT NULL
);

CREATE TABLE "fill_blank_questions_audit" (
  "fill_blank_questions_audit_id" serial PRIMARY KEY,
  "user_id" int NOT NULL,
  "fill_blank_question_id" int NOT NULL,
  "time_attempted" timestamp NOT NULL,
  "answer_correct" boolean NOT NULL
);

CREATE UNIQUE INDEX ON "words" ("word", "language_id");

ALTER TABLE "users" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id");

ALTER TABLE "words" ADD FOREIGN KEY ("language_id") REFERENCES "languages" ("language_id");

ALTER TABLE "translation_questions" ADD FOREIGN KEY ("prompt_word") REFERENCES "words" ("word_id");

ALTER TABLE "translation_questions" ADD FOREIGN KEY ("answer_word") REFERENCES "words" ("word_id");

ALTER TABLE "fill_blank_questions" ADD FOREIGN KEY ("missing_word_id") REFERENCES "words" ("word_id");

ALTER TABLE "translation_questions_audit" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

ALTER TABLE "translation_questions_audit" ADD FOREIGN KEY ("translation_question_id") REFERENCES "translation_questions" ("translation_question_id");

ALTER TABLE "fill_blank_questions_audit" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

ALTER TABLE "fill_blank_questions_audit" ADD FOREIGN KEY ("fill_blank_question_id") REFERENCES "fill_blank_questions" ("fill_blank_questions_id");
