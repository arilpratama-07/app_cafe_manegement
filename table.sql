create table user(
    id int primary key AUTO_INCREMENT,
    nama varchar(250),
    contactNumber varchar(50),
    email varchar(50),
    password varchar(250),
    status varchar(20),
    role varchar(20),
    UNIQUE (email)
);

INSERT INTO user(nama, contactNumber, email, password, status, role)
VALUES ('Admin','085700192678','admin@gmail.com','admin','true','admin');