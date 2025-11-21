from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.court import Court
from database import db

courts_bp = Blueprint('courts', __name__)

@courts_bp.route('', methods=['GET'])
@courts_bp.route('/', methods=['GET'])
def get_courts():
    """Obtener todas las pistas - endpoint público"""
    try:
        courts = Court.query.all()
        return jsonify([court.to_dict() for court in courts]), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@courts_bp.route('/<int:court_id>', methods=['GET'])
@jwt_required()
def get_court(court_id):
    """Obtener una pista por ID"""
    try:
        court = Court.query.get(court_id)
        if not court:
            return jsonify({'message': 'Pista no encontrada'}), 404
        return jsonify(court.to_dict()), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@courts_bp.route('/', methods=['POST'])
@jwt_required()
def create_court():
    """Crear una nueva pista (solo admin)"""
    try:
        data = request.get_json()
        
        required_fields = ['nombre', 'ubicacion', 'tipo_superficie']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'El campo {field} es requerido'}), 400
        
        new_court = Court(
            nombre=data['nombre'],
            ubicacion=data['ubicacion'],
            tipo_superficie=data['tipo_superficie'],
            estado=data.get('estado', 'disponible'),
            descripcion=data.get('descripcion', '')
        )
        
        db.session.add(new_court)
        db.session.commit()
        
        return jsonify({
            'message': 'Pista creada exitosamente',
            'court': new_court.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error: {str(e)}'}), 500

@courts_bp.route('/<int:court_id>', methods=['PUT'])
@jwt_required()
def update_court(court_id):
    """Actualizar una pista"""
    try:
        court = Court.query.get(court_id)
        if not court:
            return jsonify({'message': 'Pista no encontrada'}), 404
        
        data = request.get_json()
        
        if 'nombre' in data:
            court.nombre = data['nombre']
        if 'ubicacion' in data:
            court.ubicacion = data['ubicacion']
        if 'tipo_superficie' in data:
            court.tipo_superficie = data['tipo_superficie']
        if 'estado' in data:
            court.estado = data['estado']
        if 'descripcion' in data:
            court.descripcion = data['descripcion']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Pista actualizada exitosamente',
            'court': court.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error: {str(e)}'}), 500

@courts_bp.route('/<int:court_id>', methods=['DELETE'])
@jwt_required()
def delete_court(court_id):
    """Eliminar una pista"""
    try:
        court = Court.query.get(court_id)
        if not court:
            return jsonify({'message': 'Pista no encontrada'}), 404
        
        db.session.delete(court)
        db.session.commit()
        
        return jsonify({'message': 'Pista eliminada exitosamente'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error: {str(e)}'}), 500
