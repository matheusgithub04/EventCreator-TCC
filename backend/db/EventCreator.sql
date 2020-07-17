DROP DATABASE IF EXISTS EventCreator;
CREATE DATABASE EventCreator;
USE EventCreator;

CREATE TABLE login(
	cpf VARCHAR(11) PRIMARY KEY UNIQUE,
    senha VARCHAR(100) NOT NULL
);

CREATE TABLE users(
	id_users INTEGER PRIMARY KEY AUTO_INCREMENT,
    cpf VARCHAR(11) NOT NULl,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(13),
    logradouro VARCHAR(200) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    complemento VARCHAR(100),
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
	CONSTRAINT fk_login FOREIGN KEY (cpf) REFERENCES login (cpf) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE team(
	id_time INTEGER PRIMARY KEY AUTO_INCREMENT,
    nome_time VARCHAR(200) NOT NULL,
    id_part INTEGER NOT NULL,
    id_event INTEGER NOT NULL,
    status BOOLEAN NOT NULL,
    CONSTRAINT fk_org_team FOREIGN KEY (id_part) REFERENCES users (id_users) ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE evento(
	id_event INTEGER PRIMARY KEY AUTO_INCREMENT,
    localidade VARCHAR(255) NOT NULL,
    modalidade VARCHAR(20) NOT NULL,
    datainicio DATE NOT NULL,
    datafinal DATE NOT NULL,
    state BOOLEAN NOT NULL,
    id_org INTEGER NOT NULL,
    win_end INTEGER, 
    CONSTRAINT fk_org FOREIGN KEY (id_org) REFERENCES users (id_users) ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE matches(
	id_matches INTEGER PRIMARY KEY AUTO_INCREMENT,
    partida INTEGER NOT NULL,
    pri_part INTEGER NOT NULL,
    seg_part INTEGER NOT NULL,
    id_evento INTEGER NOT NULL,
    state BOOLEAN NOT NULL,
    resultado VARCHAR(20),
    CONSTRAINT fk_evento FOREIGN KEY (id_evento) REFERENCES evento (id_event) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_pri_part FOREIGN KEY (pri_part) REFERENCES team (id_time) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_seg_part FOREIGN KEY (seg_part) REFERENCES team (id_time) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE participants(
	id_part INTEGER NOT NULL,
    id_team INTEGER NOT NULL,
    CONSTRAINT fk_user_part FOREIGN KEY (id_part) REFERENCES users (id_users) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_team_part FOREIGN KEY (id_team) REFERENCES team (id_time) ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE team ADD CONSTRAINT fk_event FOREIGN KEY (id_event) REFERENCES evento (id_event) ON UPDATE CASCADE ON DELETE CASCADE;

INSERT INTO login VALUES("45523007846", password("123456"));
INSERT INTO login VALUES("10644672021", password("123456"));
INSERT INTO login VALUES("80908578091", password("123456"));
INSERT INTO login VALUES("16178431058", password("123456"));

INSERT INTO users VALUES(DEFAULT, "45523007846", "David Tolentino", "19981413209", "Av Santo amaro", "2209", "bela vista 2", "sobrado", "artur nogueira", "SP");
INSERT INTO users VALUES(DEFAULT, "10644672021", "Matheus Eduardo", "19981413209", "Pedro morais", "312", "bela vista 2", null, "artur nogueira", "SP");
INSERT INTO users VALUES(DEFAULT, "80908578091", "Fabricio", "19981413209", "sei la ", "54", "teste", null, "jaguariuna", "SP");
INSERT INTO users VALUES(DEFAULT, "16178431058", "Fulano", "19981413209", "Av Santo amaro", "232", "tesfdsfds", null, "Limeira", "SP");

INSERT INTO evento VALUES(DEFAULT, "Avenida Santo Amaro, 2209, Artur Nogueira-SP", "LUTA", curdate(), curdate(), true, 1, null);

INSERT INTO evento VALUES(DEFAULT, "Avenida Santo Amaro, 2209, Artur Nogueira-SP", "FUTEBOL", curdate(), curdate(), true, 2, null);

CREATE TRIGGER tr_eliminate_team BEFORE INSERT ON matches FOR EACH ROW UPDATE team SET status = false WHERE id_event = NEW.id_evento;
        
CREATE TRIGGER tr_finish_event BEFORE INSERT ON matches FOR EACH ROW UPDATE evento SET state = false, win_end = NEW.resultado WHERE id_event = NEW.id_evento and NEW.state = false;
        

INSERT INTO team VALUES(DEFAULT, "David", 1, 1, true);
INSERT INTO team VALUES(DEFAULT, "Matheus", 2, 1, true);
INSERT INTO team VALUES(DEFAULT, "Fabricio", 3, 1, true);
INSERT INTO team VALUES(DEFAULT, "Fulano", 4, 1, true);

INSERT INTO matches VALUES(DEFAULT, 1, 2, 3, 1, true, 2);
INSERT INTO matches VALUES(DEFAULT, 2, 4, 1, 1, true, 1);
INSERT INTO matches VALUES(DEFAULT, 3, 2, 1, 1, false, 2);

INSERT INTO team VALUES(DEFAULT, "Brabos de kONoha", 1, 2, true);
INSERT INTO participants VALUES(1, 5);
INSERT INTO participants VALUES(3, 5);

INSERT INTO team VALUES(DEFAULT, "Brabos da Akatsuki", 2, 2, true);
INSERT INTO participants VALUES(2, 6);
INSERT INTO participants VALUES(4, 6);
        
INSERT INTO matches VALUES(DEFAULT, 1, 5, 6, 2, false, 5);

SELECT * FROM login;
SELECT * FROM users;
SELECT * FROM evento;
SELECT * FROM team;
SELECT * FROM participants;



