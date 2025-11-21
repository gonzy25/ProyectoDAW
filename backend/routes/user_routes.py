from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from database import db

users_bp = Blueprint('users', __name__)

@users_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    """Obtener perfil de usuario"""
    try:
        current_user = get_jwt_identity()
        if current_user != user_id:
            return jsonify({'message': 'No autorizado'}), 403
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'Usuario no encontrado'}), 404
        
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@users_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    """Actualizar perfil de usuario"""
    try:
        current_user = get_jwt_identity()
        if current_user != user_id:
            return jsonify({'message': 'No autorizado'}), 403
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'Usuario no encontrado'}), 404
        
        data = request.get_json()
        
        if 'nombre' in data:
            user.nombre = data['nombre']
        if 'apellidos' in data:
            user.apellidos = data['apellidos']
        if 'telefono' in data:
            user.telefono = data['telefono']
        if 'password' in data:
            user.set_password(data['password'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Usuario actualizado exitosamente',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error: {str(e)}'}), 500
