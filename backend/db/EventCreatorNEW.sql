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

INSERT INTO LOGIN VALUES("45523007846", "123456"),
("10644672021", "123456"),
("80908578091", "123456"),
("16178431058", "123456"),
("87082401086", "123456"),
("26226996030", "123456"),
("39336972049", "123456"),
("87882596094", "123456"),
("50939566001", "123456"),
("25853357042", "123456"),
("16178431008", "123456"),
("10901338044", "123456"),
("16491574016", "123456"),
("76963407002", "123456"),
("76930138061", "123456"),
("06025490007", "123456"),
("68398351039", "123456"),
("09574739074", "123456"),
("55964413099", "123456"),
("66377827008", "123456"),
("24124936001", "123456"),
("36913002009", "123456");

INSERT INTO USERS VALUES (default, "45523007846", "David Tolentino", "19981413209", "Av Santo Amaro", "2209", "bela vista 2", "Sobrado", "Artur Nogueira", "SP", "terno.jpeg", default),
(default, "80908578091", "Matheus Eduardo", "19971119582", "Rua Pedro Morais", "315", "Bom Jardim", null, "Artur Nogueira", "SP", "terno.jpeg", default),
(default, "16178431058", "Fabricio Senai", "1999361428", "Rua Fernando Solimoes", "853", "Fert", null, "Jaguariuna", "SP", "terno.jpeg", default),
(default, "87082401086", "Henry Roberto Kauê Rocha", "1999781517", "Rua Paulista", "850", "Cidades", null, "Campina Grande", "PB", "henryRoberto.jpg", default),
(default, "26226996030", "Enrico Diogo José Moura", "1999988242", "Rua Laura Duarte Prazeres", "208", "Campeche", null, "Florianópolis", "SC", "enricoDiogo.jpg", default),
(default, "39336972049", "Fernanda Rebeca Isabel Bernardes", "1999987074", "Rua Mauro Gonçalves", "148", "Jardim Alvorada", null, "Piracicaba", "SP", "fernandaRebeca.jpg", default),
(default, "87882596094", "Isabel Olivia Almada", "1999916660", "Praça Bambúzinho", "196", "Centro", null, "Petrolina", "PE", "isabelOlivia.jpg", default),
(default, "50939566001", "Andreia Luna Lopes", "1999362642", "7ª Travessa José Rodrigues de Oliveira", "893", "Nordeste", null, "Salvador", "BA", "andreiaLuna.jpg", default),
(default, "25853357042", "Martin Enrico Nunes", "1999911713", "Rua do Muricizeiro", "194", "Caçari", null, "Boa Vista", "RR", "terno.jpeg", default),
(default, "16178431008", "Davi Bento Raimundo da Silva", "1999786660", "Rua João Cichon", "199", "Porto das Laranjeiras", null, "Araucária", "PR", "daviBento.jpg", default),
(default, "10901338044", "Edson Gustavo Filipe Aragão", "1999981713", "Rua Bering", "592", "Jóquei Clube", null, "Boa Vista", "RR", "edsonGustavo.jpg", default),
(default, "16491574016", "Lívia Vera Isadora Alves", "1999785052", "Avenida Perimetral", "959", "Jardim Bounganville", null, "Araguaína", "TO", "liviaVera.jpg", default),
(default, "76963407002", "Daiane Lúcia Mendes", "1999782095", "Quadra 18 Conjunto L", "639", "Arapoanga (Planaltina)", null, "Brasília", "DF", "daianeLucia.jpg", default),
(default, "16178431008", "Davi Bento Raimundo da Silva", "1999786660", "Rua João Cichon", "199", "Porto das Laranjeiras", null, "Araucária", "PR", "daviBento.jpg", default),
(default, "76963407002", "Daiane Lúcia Mendes", "1999782095", "Quadra 18 Conjunto L", "639", "Arapoanga (Planaltina)", null, "Brasília", "DF", "daianeLucia.jpg", default),
(default, "16178431008", "Davi Bento Raimundo da Silva", "1999786660", "Rua João Cichon", "199", "Porto das Laranjeiras", null, "Araucária", "PR", "daviBento.jpg", default),
(default, "76963407002", "Daiane Lúcia Mendes", "1999782095", "Quadra 18 Conjunto L", "639", "Arapoanga (Planaltina)", null, "Brasília", "DF", "terno.jpeg", default),
(default, "76930138061", "Aline Isis Aragão", "1999780791", "Quadra 411 Sul Rua 7", "336", "Plano Diretor Sul", null, "Palmas", "TO", "alineIsis.jpg", default),
(default, "06025490007", "Cauã Bernardo Baptista", "1999784404", "Rua Dois", "719", "Cidade Nova", null, "Ananindeua", "PA", "cauaBernardo.jpg", default),
(default, "26226996030", "Enrico Diogo José Moura", "1999988242", "Rua Laura Duarte Prazeres", "208", "Campeche", null, "Florianópolis", "SC", "enricoDiogo.jpg", default),
(default, "68398351039", "Benedito Ricardo Barbosa", "1999981067", "Rua Monsenhor Mateus", "267", "Primavera", null, "Teresina", "PI", "terno.jpeg", default),
(default, "16491574016", "Lívia Vera Isadora Alves", "1999785052", "Avenida Perimetral", "959", "Jardim Bounganville", null, "Araguaína", "TO", "liviaVera.jpg", default),
(default, "66377827008", "Luzia Sabrina Valentina Fernandes", "1999368429", "Chácara Chácara 60", "63", "Setor Habitacional Samambaia (Vicente Pires)", null, "Brasília", "DF", "luziaSabrina.jpg", default),
(default, "09574739074", "Luan Anderson Silveira", "1999913804", "Rua Padre Carlos Weiss", "289", "Santiago", null, "Londrina", "PR", "terno.jpeg", default),
(default, "55964413099", "Heitor Pedro Henrique Raul dos Santos", "1999780057", "Rua Z-2", "188", "Doutor Sílvio Leite", null, "Boa Vista", "RR", "heitorPedro.jpg", default),
(default, "26226996030", "Enrico Diogo José Moura", "1999988242", "Rua Laura Duarte Prazeres", "208", "Campeche", null, "Florianópolis", "SC", "enricoDiogo.jpg", default),
(default, "66377827008", "Luzia Sabrina Valentina Fernandes", "1999368429", "Chácara Chácara 60", "63", "Setor Habitacional Samambaia (Vicente Pires)", null, "Brasília", "DF", "luziaSabrina.jpg", default),
(default, "24124936001", "Noah Gustavo Ian da Costa", "1999911067", "Rua Projetada B-2", "738", "Jacarecica", null, "Maceió", "AL", "terno.jpeg", default),
(default, "36913002009", "Oliver Roberto Paulo Fogaça", "1999783558", "Avenida Getúlio Vargas", "85", "Bosque", null, "Rio Branco", "AC", "terno.jpeg", default);

update users set cidade = "Florianopolis" where cidade = "Florian?polis";
update users set cidade = "Araucaria" where cidade = "Arauc?ria";
update users set nome = "Enrico Diogo Jose Moura" where nome = "Enrico Diogo Jos? Moura";
update users set logradouro = "Rua Joao Cichon" where logradouro = "Rua Jo?o Cichon";
update users set logradouro = "Rua Mauro Goncalves" where logradouro = "Rua Mauro Gon?alves";
update users set logradouro = "7 Travessa Jose Rodrigues de Oliveira" where logradouro = "7? Travessa Jos? Rodrigues de Oliveira";


#insert into livro(descricao_livro, autor_livro_fk) values ('Um estudo sobre a memória RAM', (select codigo_autor from autor where nome_autor = 'Maria José Lopes'));
INSERT INTO EVENTO VALUES
(default, (select concat(logradouro, ", ", cidade, "-", estado) from users where id_users = 1), "LUTA", "-22.571130", "-47.173240", date_add(curdate(), interval 0 week), date_add(date_add(curdate(), interval 0 week), interval 0 day), "09:10:00", true, 1, null, 4),
(default, (select concat(logradouro, ", ", cidade, "-", estado) from users where id_users = 1), "FUTEBOL", "-22.571130", "-47.173240", date_add(curdate(), interval 2 week), date_add(date_add(curdate(), interval 2 week), interval 1 day), "09:10:00", true, 1, null, 2),

(default, (select concat(logradouro, ", ", cidade, "-", estado) from users where id_users = 8), "LUTA", "-11.192640", "-38.003570", date_add(curdate(), interval 5 week), date_add(date_add(curdate(), interval 5 week), interval 0 day), "09:10:00", true, 8, null, 8),

(default, (select concat(logradouro, ", ", cidade, "-", estado) from users where id_users = 6), "FUTEBOL", "-22.760630", "-47.616710", date_add(curdate(), interval 4 week), date_add(date_add(curdate(), interval 4 week), interval 0 day), "09:00:00", true, 6, null, 4),
(default, (select concat(logradouro, ", ", cidade, "-", estado) from users where id_users = 11), "FUTEBOL", "-22.760630", "-47.616710", date_add(curdate(), interval 4 week), date_add(date_add(curdate(), interval 4 week), interval 0 day), "09:00:00", true, 11, null, 2),

(default, (select concat(logradouro, ", ", cidade, "-", estado) from users where id_users = 10), "FUTEBOL", "-25.57906985", "-49.36834717525438", date_add(curdate(), interval 4 week), date_add(date_add(curdate(), interval 4 week), interval 0 day), "09:00:00", true, 10, null, 16),
(default, (select concat(logradouro, ", ", cidade, "-", estado) from users where id_users = 10), "LUTA", "-25.57906985", "-49.36834717525438", date_add(curdate(), interval 4 week), date_add(date_add(curdate(), interval 4 week), interval 0 day), "09:00:00", true, 10, null, 16),

(default, (select concat(logradouro, ", ", cidade, "-", estado) from users where id_users = 5), "FUTEBOL", "-27.134741", "-48.899448", date_add(curdate(), interval 3 week), date_add(date_add(curdate(), interval 3 week), interval 1 day), "09:00:00", true, 5, null, 2);

#INSERT INTO EVENTO VALUES(default, "Avenida Santo Amaro,fff 2209, Artur Nogueira-SP", "LUTA", "23", "23", curdate(), curdate(), curtime(), true, 1, null, 4);
#INSERT INTO EVENTO VALUES(default, "Avenida Santo Amaro, 2209, Artur Nogueira-SP", "FUTEBOL", "21", "23", curdate(), curdate(), curtime(), true, 2, null, 2);

INSERT INTO TEAM VALUES(default, (select nome from users where id_users =  1), 1, 1, true, "LUTA", 1, (select uri from users where id_users =  1), default);
INSERT INTO TEAM VALUES(default, (select nome from users where id_users =  9), 9, 1, true, "LUTA", 2, (select uri from users where id_users =  9), default);
INSERT INTO TEAM VALUES(default, (select nome from users where id_users =  5), 5, 1, true, "LUTA", 3, (select uri from users where id_users =  5), default);
INSERT INTO TEAM VALUES(default, (select nome from users where id_users =  6), 6, 1, true, "LUTA", 4, (select uri from users where id_users =  6), default);

INSERT INTO MATCHES VALUES(default, 1, 4, 1, 1, true, 4, 1);
INSERT INTO MATCHES VALUES(default, 2, 2, 3, 1, true, 3, 2);
INSERT INTO MATCHES VALUES(default, 3, 4, 3, 1, false, 4, 1);

INSERT INTO TEAM VALUES(default, "Scorpion F.C", 1, 5, true, "FUTEBOL", 1, 'scorpion.jpg', default);
INSERT INTO PARTICIPANTS VALUES(1, 5);
INSERT INTO PARTICIPANTS VALUES(5, 5);
INSERT INTO PARTICIPANTS VALUES(9, 5);
INSERT INTO PARTICIPANTS VALUES(7, 5);
INSERT INTO PARTICIPANTS VALUES(11, 5);
INSERT INTO PARTICIPANTS VALUES(10, 5);
INSERT INTO PARTICIPANTS VALUES(20, 5);
INSERT INTO PARTICIPANTS VALUES(13, 5);
INSERT INTO PARTICIPANTS VALUES(17, 5);
INSERT INTO PARTICIPANTS VALUES(16, 5);
INSERT INTO PARTICIPANTS VALUES(14, 5);

INSERT INTO TEAM VALUES(default, "Shark F.C", 9, 5, true, "FUTEBOL", 2, 'shark.jpg', default);
INSERT INTO PARTICIPANTS VALUES(2, 6);
INSERT INTO PARTICIPANTS VALUES(2, 6);
INSERT INTO PARTICIPANTS VALUES(15, 6);
INSERT INTO PARTICIPANTS VALUES(20, 6);
INSERT INTO PARTICIPANTS VALUES(18, 6);
INSERT INTO PARTICIPANTS VALUES(20, 6);

INSERT INTO MATCHES VALUES(default, 1, 5, 6, 2, false, 5, 6);
INSERT INTO MATCHES VALUES(default, 1, 5, 6, 2, false, 5, 6);
INSERT INTO MATCHES VALUES(default, 1, 5, 6, 2, false, 5, 6);
INSERT INTO MATCHES VALUES(default, 1, 5, 6, 2, false, 3, 5);
INSERT INTO MATCHES VALUES(default, 1, 5, 6, 2, false, 6, 5);
INSERT INTO MATCHES VALUES(default, 1, 5, 6, 2, false, 1, 6);
INSERT INTO MATCHES VALUES(default, 1, 5, 6, 2, false, 1, 6);
INSERT INTO MATCHES VALUES(default, 1, 5, 6, 2, false, 4, 6);
INSERT INTO MATCHES VALUES(default, 1, 5, 6, 2, false, 7, 6);
INSERT INTO MATCHES VALUES(default, 1, 5, 6, 2, false, 7, 6);
INSERT INTO MATCHES VALUES(default, 1, 5, 6, 2, false, 24, 6);
INSERT INTO MATCHES VALUES(default, 1, 5, 6, 2, false, 17, 6);

SELECT * FROM login;
SELECT * FROM users;
SELECT * FROM evento;
SELECT * FROM team;
SELECT * FROM matches;
SELECT * FROM participants;