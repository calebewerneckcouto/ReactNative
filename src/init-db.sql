CREATE TABLE public.alunos
(
id SERIAL PRIMARY KEY,
nome VARCHAR(255) NOT NULL,
email VARCHAR(255),
data_nascimento DATE,
nota_matematica NUMERIC(5,2),
nota_fisica NUMERIC(5,2),
nota_quimica NUMERIC(5,2)
);


CREATE TABLE public.login
(
id SERIAL PRIMARY KEY,
login VARCHAR(255) NOT NULL,
senha VARCHAR(255) NOT NULL,
token VARCHAR(255)
);

INSERT INTO public.login (login, senha) VALUES ('cwc3d', 'cwc3d');