import os
from flask import Flask, render_template, request, redirect, url_for, session, flash
from werkzeug.security import check_password_hash
from database import init_db, find_user_by_cpf, add_user, find_user_by_id, get_user_vaccines
import qrcode
from io import BytesIO
from weasyprint import HTML, CSS
from flask import send_file

# Configuração do Flask
app = Flask(__name__, 
            template_folder='../frontend/templates', 
            static_folder='../frontend/static')
app.secret_key = os.urandom(24) # Chave secreta para sessões

# Inicializa o banco de dados
init_db()

# --- Rotas de Autenticação ---

@app.route('/')
def index():
    # Redireciona para a página inicial (dashboard.html)
    return redirect(url_for('dashboard'))

@app.route('/dashboard')
def dashboard():
    # Rota para a página inicial (pública)
    return render_template('dashboard.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        cpf = request.form.get('identificador')
        password = request.form.get('senha')
        
        user = find_user_by_cpf(cpf)
        
        if user and check_password_hash(user['password'], password):
            # Login bem-sucedido
            session['logged_in'] = True
            session['user_id'] = user['id']
            session['user_name'] = user['name']
            flash('Login realizado com sucesso!', 'success')
            return redirect(url_for('profile')) # Redireciona para a página de perfil
        else:
            # Login falhou
            flash('CPF ou senha incorretos.', 'danger')
            return render_template('login.html')
            
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Coleta os dados do formulário
        name = request.form.get('nome')
        cpf = request.form.get('cpf')
        cns = request.form.get('cns')
        dob = request.form.get('data-nascimento')
        gender = request.form.get('sexo')
        email = request.form.get('email')
        phone = request.form.get('telefone')
        password = request.form.get('senha-cadastro')
        confirm_password = request.form.get('confirmar-senha')
        
        if password != confirm_password:
            flash('As senhas não coincidem.', 'danger')
            return render_template('register.html')
            
        if add_user(cpf, password, name, cns, dob, gender, email, phone):
            flash('Cadastro realizado com sucesso! Faça login para acessar.', 'success')
            return redirect(url_for('login'))
        else:
            flash('Erro: CPF já cadastrado.', 'danger')
            return render_template('register.html')
            
    return render_template('register.html')

@app.route('/forgot_password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        # Lógica de recuperação de senha (simulada)
        cpf = request.form.get('identificador')
        user = find_user_by_cpf(cpf)
        
        if user:
            flash('Se o CPF estiver cadastrado, um link de redefinição foi enviado para o seu e-mail.', 'info')
        else:
            # Para segurança, a mensagem é a mesma, mesmo que o usuário não exista
            flash('Se o CPF estiver cadastrado, um link de redefinição foi enviado para o seu e-mail.', 'info')
            
        return redirect(url_for('login'))
        
    return render_template('forgot_password.html')

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    session.pop('user_id', None)
    session.pop('user_name', None)
    flash('Você saiu da sua conta.', 'success')
    return redirect(url_for('dashboard'))

# --- Rotas Protegidas (Requer Login) ---

def login_required(f):
    """Decorator para exigir login em rotas."""
    from functools import wraps
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('logged_in'):
            flash('Você precisa estar logado para acessar esta página.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/profile')
@login_required
def profile():
    user_id = session.get('user_id')
    user = find_user_by_id(user_id)
    
    if user:
        user_data = dict(user)
        # Formatar CPF para exibição (ex: 123.456.789-00)
        user_data['cpf_formatted'] = f"{user_data['cpf'][:3]}.{user_data['cpf'][3:6]}.{user_data['cpf'][6:9]}-{user_data['cpf'][9:]}"
        
        # Formatar data de nascimento (dob)
        if user_data['dob']:
            from datetime import datetime
            user_data['dob_formatted'] = datetime.strptime(user_data['dob'], '%Y-%m-%d').strftime('%d/%m/%Y')
        
        return render_template('profile.html', user=user_data)
    
    flash('Usuário não encontrado.', 'danger')
    return redirect(url_for('login'))

@app.route('/vaccine_card')
@login_required
def vaccine_card():
    user_id = session.get('user_id')
    user = find_user_by_id(user_id)
    
    if user:
        user_data = dict(user)
        user_data['cpf_formatted'] = f"{user_data['cpf'][:3]}.{user_data['cpf'][3:6]}.{user_data['cpf'][6:9]}-{user_data['cpf'][9:]}"
        if user_data['dob']:
            from datetime import datetime
            user_data['dob_formatted'] = datetime.strptime(user_data['dob'], '%Y-%m-%d').strftime('%d/%m/%Y')
            
        vaccines = get_user_vaccines(user_id)
        
        # Formatar datas das vacinas
        from datetime import datetime
        for v in vaccines:
            v['date_formatted'] = datetime.strptime(v['date_taken'], '%Y-%m-%d').strftime('%d/%m/%Y')
            v['status'] = 'Aplicada' # Status fixo por enquanto
        
        return render_template('vaccine_card.html', user=user_data, vaccines=vaccines)
        
    flash('Usuário não encontrado.', 'danger')
    return redirect(url_for('login'))

@app.route('/generate_qr_code/<cpf>')
@login_required
def generate_qr_code(cpf):
    # O conteúdo do QR Code será o CPF do usuário (ou um link seguro para a carteira)
    qr_data = f"ImmunoTrack - CPF: {cpf}"
    
    # Cria o objeto QR Code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_data)
    qr.make(fit=True)
    
    # Cria a imagem do QR Code
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Salva a imagem em um buffer de bytes
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    
    return send_file(buffer, mimetype='image/png', as_attachment=False)

@app.route('/download_vaccine_card')
@login_required
def download_vaccine_card():
    user_id = session.get('user_id')
    user = find_user_by_id(user_id)
    
    if not user:
        flash('Usuário não encontrado.', 'danger')
        return redirect(url_for('login'))
        
    # Renderiza a página da carteira de vacinação para o PDF
    # Reutiliza a lógica de busca de dados do usuário e vacinas
    user_data = dict(user)
    user_data['cpf_formatted'] = f"{user_data['cpf'][:3]}.{user_data['cpf'][3:6]}.{user_data['cpf'][6:9]}-{user_data['cpf'][9:]}"
    if user_data['dob']:
        from datetime import datetime
        user_data['dob_formatted'] = datetime.strptime(user_data['dob'], '%Y-%m-%d').strftime('%d/%m/%Y')
        
        vaccines = get_user_vaccines(user_id)
        
        # Formatar datas das vacinas
        from datetime import datetime
        for v in vaccines:
            v['date_formatted'] = datetime.strptime(v['date_taken'], '%Y-%m-%d').strftime('%d/%m/%Y')
            v['status'] = 'Aplicada' # Status fixo por enquanto
    
    # Renderiza o HTML da carteira de vacinação
    html_content = render_template('vaccine_card.html', user=user_data, vaccines=vaccines, is_pdf=True)
    
    # Converte o HTML para PDF usando WeasyPrint
    pdf_buffer = BytesIO()
    HTML(string=html_content).write_pdf(pdf_buffer)
    pdf_buffer.seek(0)
    
    return send_file(pdf_buffer, 
                     mimetype='application/pdf', 
                     as_attachment=True, 
                     download_name=f"carteira_vacinacao_{user['cpf']}.pdf")

@app.route('/family')
@login_required
def family():
    # Rota para a gestão familiar
    return render_template('family.html')

# Rotas de exemplo que não foram refatoradas, mas mantidas para evitar erros 404
@app.route('/index_mika')
@login_required
def index_mika():
    return render_template('index_mika.html')

@app.route('/index_vitoria')
@login_required
def index_vitoria():
    return render_template('index_vitoria.html')

if __name__ == '__main__':
    # Define o diretório de trabalho para o diretório do backend
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    app.run(debug=True, host='0.0.0.0', port=5000)
