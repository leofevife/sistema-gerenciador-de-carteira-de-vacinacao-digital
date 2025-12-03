import sqlite3
from werkzeug.security import generate_password_hash

DATABASE = 'database.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as db:
        # Tabela de Usuários para Login/Cadastro
        db.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cpf TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                name TEXT NOT NULL,
                cns TEXT,
                dob TEXT,
                gender TEXT,
                email TEXT,
                phone TEXT
            );
        """)
        
        # Tabela de Vacinas (Exemplo de dados do usuário)
        db.execute("""
            CREATE TABLE IF NOT EXISTS vaccines (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                vaccine_name TEXT NOT NULL,
                dose_number INTEGER NOT NULL,
                date_taken TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id)
            );
        """)
        
        # Inserir um usuário de teste (senha: 123456)
        try:
            db.execute("INSERT INTO users (cpf, password, name, cns, dob, gender, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                       ('12345678900', generate_password_hash('123456'), 'Usuario Teste', '999999999999999', '2000-01-01', 'M', 'teste@teste.com', '(99) 99999-9999'))
            db.commit()
            
            # Inserir vacinas de teste para o usuário (ID 1)
            db.execute("INSERT INTO vaccines (user_id, vaccine_name, dose_number, date_taken) VALUES (?, ?, ?, ?)",
                       (1, 'COVID-19', 1, '2024-01-15'))
            db.execute("INSERT INTO vaccines (user_id, vaccine_name, dose_number, date_taken) VALUES (?, ?, ?, ?)",
                       (1, 'Gripe', 1, '2024-03-01'))
            db.commit()
            
        except sqlite3.IntegrityError:
            # Usuário de teste já existe
            pass

def add_user(cpf, password, name, cns, dob, gender, email, phone):
    hashed_password = generate_password_hash(password)
    with get_db() as db:
        try:
            db.execute("INSERT INTO users (cpf, password, name, cns, dob, gender, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                       (cpf, hashed_password, name, cns, dob, gender, email, phone))
            db.commit()
            return True
        except sqlite3.IntegrityError:
            return False # CPF já cadastrado

def find_user_by_id(user_id):
    with get_db() as db:
        user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        return user

def get_user_vaccines(user_id):
    with get_db() as db:
        vaccines = db.execute("SELECT * FROM vaccines WHERE user_id = ?", (user_id,)).fetchall()
        return [dict(v) for v in vaccines]

def find_user_by_cpf(cpf):
    with get_db() as db:
        user = db.execute("SELECT * FROM users WHERE cpf = ?", (cpf,)).fetchone()
        return user

if __name__ == '__main__':
    init_db()
    print("Banco de dados inicializado com sucesso.")
