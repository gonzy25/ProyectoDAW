from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
from functools import wraps

# Cargar variables de entorno
load_dotenv()

# Inicializar Flask
app = Flask(__name__)

# Configuración
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'

# Configuración de base de datos
db_user = os.getenv('DB_USER', 'root')
db_password = os.getenv('DB_PASSWORD', '')
db_host = os.getenv('DB_HOST', 'localhost')
db_port = os.getenv('DB_PORT', '3306')
db_name = os.getenv('DB_NAME', 'acenet_db')

app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar base de datos
from database import db
db.init_app(app)

# Inicializar JWT
jwt = JWTManager(app)

# Manejador de errores JWT
@jwt.invalid_token_loader
def invalid_token_callback(error_string):
    return jsonify({
        'message': 'Token inválido',
        'error': error_string
    }), 422

@jwt.unauthorized_loader
def missing_token_callback(error_string):
    return jsonify({
        'message': 'Token faltante',
        'error': error_string
    }), 401

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({
        'message': 'Token expirado',
        'error': 'token_expired'
    }), 401

# Importar modelos
from models.user import User
from models.court import Court
from models.booking import Booking

# Importar rutas
from routes.auth_routes import auth_bp
from routes.court_routes import courts_bp
from routes.booking_routes import bookings_bp
from routes.user_routes import users_bp

# Configurar CORS manualmente
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = app.make_default_options_response()
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response

@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

# Registrar blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(courts_bp, url_prefix='/api/courts')
app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
app.register_blueprint(users_bp, url_prefix='/api/users')

# Crear tablas si no existen
with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return {
        'message': 'AceNet API - Sistema de gestión de club de pádel',
        'version': '1.0.0',
        'endpoints': {
            'auth': '/api/auth',
            'courts': '/api/courts',
            'bookings': '/api/bookings',
            'users': '/api/users'
        }
    }

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(debug=True, port=port, host='0.0.0.0')
