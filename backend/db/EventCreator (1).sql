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
    uri VARCHAR(255),
    wins INTEGER(11) default(0),
	CONSTRAINT fk_login FOREIGN KEY (cpf) REFERENCES login (cpf) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE team(
	id_time INTEGER PRIMARY KEY AUTO_INCREMENT,
    nome_time VARCHAR(200) NOT NULL,
    id_part INTEGER NOT NULL,
    id_event INTEGER,
    status BOOLEAN NOT NULL,
    modalidade VARCHAR(20),
    id_chaveamento INTEGER NOT NULL,
    uri VARCHAR(255),
    wins INTEGER(11) default(0),
    CONSTRAINT fk_org_team FOREIGN KEY (id_part) REFERENCES users (id_users) ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE evento(
	id_event INTEGER PRIMARY KEY AUTO_INCREMENT,
    localidade VARCHAR(255) NOT NULL,
    modalidade VARCHAR(20) NOT NULL,
    lat VARCHAR(30),
    lon VARCHAR(30),
    datainicio DATE NOT NULL,
    datafinal DATE NOT NULL,
    horaevento TIME NOT NULL,
    state BOOLEAN NOT NULL,
    id_org INTEGER NOT NULL,
    win_end INTEGER,
    qtdParticipantes INTEGER NOT NULL,
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
    perdedor VARCHAR(20),
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

CREATE trigger tr_eliminate_team BEFORE INSERT ON matches for each ROW UPDATE team SET status = false WHERE id_event = new.id_evento AND id_part = new.perdedor;
CREATE trigger tr_eliminate_team_win BEFORE INSERT ON matches for each ROW UPDATE team SET status = false WHERE id_event = new.id_evento AND id_part = new.resultado;

CREATE trigger tr_eliminate_update_team BEFORE UPDATE ON matches for each ROW UPDATE team SET status = false WHERE id_event = new.id_evento AND id_part = new.perdedor;
CREATE trigger tr_eliminate_update_team_win BEFORE UPDATE ON matches for each ROW UPDATE team SET status = false WHERE id_event = new.id_evento AND id_part = new.resultado;
        
CREATE trigger tr_finish_event BEFORE INSERT ON matches for each ROW UPDATE evento SET state = false, win_end = new.resultado WHERE id_event = new.id_evento AND new.state = false;
CREATE trigger tr_finish_update_event BEFORE UPDATE ON matches for each ROW UPDATE evento SET state = false, win_end = new.resultado WHERE id_event = new.id_evento AND new.state = false;

CREATE trigger tr_finish_event_fut BEFORE INSERT ON matches for each ROW UPDATE team SET status = true, id_chaveamento = null WHERE id_event = new.id_evento AND new.state = false AND modalidade = "FUTEBOL";
CREATE trigger tr_finish_update_event_fut BEFORE UPDATE ON matches for each ROW UPDATE team SET status = true, id_chaveamento = null WHERE id_event = new.id_evento AND new.state = false AND modalidade = "FUTEBOL";

CREATE trigger tr_add_point_lut BEFORE UPDATE ON matches for each ROW UPDATE users a INNER JOIN team b on a.id_users = b.id_part set a.wins = a.wins+1 WHERE b.modalidade = "LUTA" AND b.id_time = new.resultado AND new.state = false;
CREATE trigger tr_add_point_fut BEFORE UPDATE ON matches for each ROW UPDATE team set wins = wins+1 WHERE modalidade = "FUTEBOL" AND id_time = new.resultado AND new.state = false;

CREATE trigger tr_add_point_lut_ins BEFORE INSERT ON matches for each ROW UPDATE users a INNER JOIN team b on a.id_users = b.id_part set a.wins = a.wins+1 WHERE b.modalidade = "LUTA" AND b.id_time = new.resultado AND new.state = false;

CREATE trigger tr_add_point_fut_ins BEFORE INSERT ON matches for each ROW UPDATE team set wins = wins+1 WHERE modalidade = "FUTEBOL" AND id_time = new.resultado AND new.state = false;

INSERT INTO LOGIN VALUES("45523007846", "123456");
INSERT INTO LOGIN VALUES("10644672021", "123456");
INSERT INTO LOGIN VALUES("80908578091", "123456");
INSERT INTO LOGIN VALUES("16178431058", "123456");

INSERT INTO USERS VALUES(default, "45523007846", "David Tolentino", "19981413209", "Av Santo amaro", "2209", "bela vista 2", "sobrado", "artur nogueira", "SP", "terno.jpeg", default);
INSERT INTO USERS VALUES(default, "10644672021", "Matheus Eduardo", "19981413209", "Pedro morais", "312", "bela vista 2", null, "artur nogueira", "SP", "terno.jpeg", default);
INSERT INTO USERS VALUES(default, "80908578091", "Fabricio", "19981413209", "sei la ", "54", "teste", null, "jaguariuna", "SP", "terno.jpeg", default);
INSERT INTO USERS VALUES(default, "16178431058", "Fulano", "19981413209", "Av Santo amaro", "232", "tesfdsfds", null, "Limeira", "SP", "terno.jpeg", default);

INSERT INTO EVENTO VALUES(default, "Avenida Santo Amaro,fff 2209, Artur Nogueira-SP", "LUTA", "23", "23", curdate(), curdate(), curtime(), true, 1, null, 4);

INSERT INTO EVENTO VALUES(default, "Avenida Santo Amaro, 2209, Artur Nogueira-SP", "FUTEBOL", "21", "23", curdate(), curdate(), curtime(), true, 2, null, 2);

INSERT INTO TEAM VALUES(default, "David", 1, 1, true, "LUTA", 1, 'terno.jpeg', default);
INSERT INTO TEAM VALUES(default, "Matheus", 2, 1, true, "LUTA", 2, 'terno.jpeg', default);
INSERT INTO TEAM VALUES(default, "Fabricio", 4, 1, true, "LUTA", 3, 'terno.jpeg', default);
INSERT INTO TEAM VALUES(default, "Fulano", 3, 1, true, "LUTA", 4, 'terno.jpeg', default);

INSERT INTO MATCHES VALUES(default, 1, 2, 3, 1, true, 2, 3);
INSERT INTO MATCHES VALUES(default, 2, 4, 1, 1, true, 1, 4);
INSERT INTO MATCHES VALUES(default, 3, 2, 1, 1, false, 1, 2);

INSERT INTO TEAM VALUES(default, "Artur Nogueira F.C", 1, 2, true, "FUTEBOL", 1, 'terno.jpeg', default);
INSERT INTO PARTICIPANTS VALUES(1, 5);
INSERT INTO PARTICIPANTS VALUES(3, 5);

INSERT INTO TEAM VALUES(default, "Jaguariuna F.C", 2, 2, true, "FUTEBOL", 2, 'terno.jpeg', default);
INSERT INTO PARTICIPANTS VALUES(2, 6);
INSERT INTO PARTICIPANTS VALUES(4, 6);

INSERT INTO MATCHES VALUES(default, 1, 5, 6, 2, false, 5, 6);

#update team a INNER JOIN matches b on a.id_time = b.resultado set state = false where b.id_matches = 4;
#update users a inner join team b on a.id_users = b.id_part set a.wins = a.wins+1 WHERE b.modalidade = "LUTA" AND b.id_time = 2;

SELECT * FROM login;
SELECT * FROM users;
SELECT * FROM evento;
SELECT * FROM team;
SELECT * FROM matches;
SELECT * FROM participants;
