from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user import User
from database import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Registrar un nuevo usuario"""
    try:
        data = request.get_json()
        
        # Validar datos
        required_fields = ['nombre', 'apellidos', 'email', 'telefono', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'El campo {field} es requerido'}), 400
        
        # Verificar si el email ya existe
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'El email ya está registrado'}), 400
        
        # Crear nuevo usuario
        new_user = User(
            nombre=data['nombre'],
            apellidos=data['apellidos'],
            email=data['email'],
            telefono=data['telefono']
        )
        new_user.set_password(data['password'])
        
        db.session.add(new_user)
        db.session.commit()
        
        # Crear token JWT (identity debe ser string)
        access_token = create_access_token(identity=str(new_user.id))
        
        return jsonify({
            'message': 'Usuario registrado exitosamente',
            'token': access_token,
            'user': new_user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error al registrar usuario: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Iniciar sesión"""
    try:
        data = request.get_json()
        
        # Validar datos
        if not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Email y contraseña son requeridos'}), 400
        
        # Buscar usuario
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'message': 'Credenciales inválidas'}), 401
        
        if not user.activo:
            return jsonify({'message': 'Usuario inactivo'}), 401
        
        # Crear token JWT (identity debe ser string)
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Login exitoso',
            'token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error al iniciar sesión: {str(e)}'}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Obtener usuario actual"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'Usuario no encontrado'}), 404
        
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500
