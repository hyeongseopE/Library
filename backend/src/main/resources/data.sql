INSERT INTO role (id, role_name) VALUES
                                (1, 'admin'),
                                (2, 'user');

INSERT INTO member (
    m_email, password, role_id
) VALUES (
             'admin',
             '{bcrypt}$2a$10$te0WJk0a2umIwJwzMOKV.e.zqH7sWj2Om44vqTVQftpruTpI8Yof6',
             1
);

INSERT INTO book (name, writer, publisher, create_date, price, status)
VALUES ('가 로 시작하는 책', '가가', '가나', '2023-04-20', 12000, 'AVAILABLE'),
       ('나 로 시작하는 책', '나나', '나다', '2023-04-21', 5000, 'AVAILABLE'),
       ('다 로 시작하는 책', '다다', '다라', '2023-03-20', 15000, 'AVAILABLE'),
       ('라 로 시작하는 책', '라라', '라나', '2024-04-20', 17000, 'AVAILABLE'),
       ('신의 탑', 'SIU', '네이버웹툰', '2024-05-01', 9000, 'AVAILABLE'),
       ('픽미 탑', 'SIU', '다음웹툰', '2021-05-01', 7000, 'AVAILABLE'),
       ('너에게 닿기를', '몰라', '투니버스', '2022-11-21', 9000, 'AVAILABLE'),
       ('신의 탑2기', 'SIU', '네이버웹툰', '2024-06-01', 9000, 'AVAILABLE'),
       ('신의 탑3기', 'SIU', '네이버웹툰', '2024-07-01', 9000, 'AVAILABLE'),
       ('신의 탑4기', 'SIU', '네이버웹툰', '2024-08-01', 9000, 'AVAILABLE'),
       ('신의 탑5기', 'SIU', '네이버웹툰', '2025-05-01', 9000, 'AVAILABLE')




