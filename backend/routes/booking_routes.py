from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.booking import Booking
from models.court import Court
from datetime import datetime, time
from database import db

bookings_bp = Blueprint('bookings', __name__)

@bookings_bp.route('', methods=['GET'])
@bookings_bp.route('/', methods=['GET'])
@jwt_required()
def get_bookings():
    """Obtener todas las reservas"""
    try:
        bookings = Booking.query.all()
        return jsonify([booking.to_dict() for booking in bookings]), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@bookings_bp.route('/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_bookings(user_id):
    """Obtener reservas de un usuario"""
    try:
        current_user_id = int(get_jwt_identity())
        if current_user_id != user_id:
            return jsonify({'message': 'No autorizado'}), 403
        
        bookings = Booking.query.filter_by(usuario_id=user_id).order_by(Booking.fecha.desc()).all()
        return jsonify([booking.to_dict() for booking in bookings]), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@bookings_bp.route('', methods=['POST'])
@bookings_bp.route('/', methods=['POST'])
@jwt_required()
def create_booking():
    """Crear una nueva reserva"""
    try:
        # Obtener el usuario del token JWT (ahora es string, convertir a int)
        current_user_id = int(get_jwt_identity())
        
        data = request.get_json()
        
        required_fields = ['pista_id', 'fecha', 'hora_inicio', 'duracion']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'El campo {field} es requerido'}), 400
        
        # Verificar que la pista existe y está disponible
        court = Court.query.get(data['pista_id'])
        if not court:
            return jsonify({'message': 'Pista no encontrada'}), 404
        if court.estado != 'disponible':
            return jsonify({'message': 'La pista no está disponible'}), 400
        
        # Convertir fecha y hora
        fecha = datetime.strptime(data['fecha'], '%Y-%m-%d').date()
        hora_inicio = datetime.strptime(data['hora_inicio'], '%H:%M').time()
        duracion = int(data['duracion'])
        
        # Calcular hora de fin de la nueva reserva
        hora_inicio_minutos = hora_inicio.hour * 60 + hora_inicio.minute
        hora_fin_minutos = hora_inicio_minutos + duracion
        
        # Verificar conflictos de reserva con solapamiento
        reservas_del_dia = Booking.query.filter_by(
            pista_id=data['pista_id'],
            fecha=fecha,
            estado='confirmada'
        ).all()
        
        for reserva_existente in reservas_del_dia:
            # Calcular tiempos de la reserva existente
            reserva_inicio_minutos = reserva_existente.hora_inicio.hour * 60 + reserva_existente.hora_inicio.minute
            reserva_fin_minutos = reserva_inicio_minutos + reserva_existente.duracion
            
            # Verificar si hay solapamiento
            # Hay conflicto si:
            # 1. La nueva reserva empieza durante una reserva existente
            # 2. La nueva reserva termina durante una reserva existente
            # 3. La nueva reserva engloba completamente una reserva existente
            if (hora_inicio_minutos < reserva_fin_minutos and hora_fin_minutos > reserva_inicio_minutos):
                # Calcular hora final correctamente
                hora_fin_reserva = reserva_fin_minutos // 60
                minutos_fin_reserva = reserva_fin_minutos % 60
                return jsonify({
                    'message': f'Conflicto de horario: La pista ya está reservada de {reserva_existente.hora_inicio.strftime("%H:%M")} a {hora_fin_reserva:02d}:{minutos_fin_reserva:02d}'
                }), 400
        
        # Crear reserva usando el usuario_id del token JWT
        new_booking = Booking(
            usuario_id=current_user_id,
            pista_id=data['pista_id'],
            fecha=fecha,
            hora_inicio=hora_inicio,
            duracion=data['duracion'],
            estado='confirmada'
        )
        
        db.session.add(new_booking)
        db.session.commit()
        
        return jsonify({
            'message': 'Reserva creada exitosamente',
            'booking': new_booking.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error: {str(e)}'}), 500

@bookings_bp.route('/<int:booking_id>', methods=['PUT'])
@jwt_required()
def update_booking(booking_id):
    """Actualizar una reserva"""
    try:
        booking = Booking.query.get(booking_id)
        if not booking:
            return jsonify({'message': 'Reserva no encontrada'}), 404
        
        current_user_id = int(get_jwt_identity())
        if current_user_id != booking.usuario_id:
            return jsonify({'message': 'No autorizado'}), 403
        
        data = request.get_json()
        
        if 'estado' in data:
            booking.estado = data['estado']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Reserva actualizada exitosamente',
            'booking': booking.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error: {str(e)}'}), 500

@bookings_bp.route('/<int:booking_id>', methods=['DELETE'])
@jwt_required()
def cancel_booking(booking_id):
    """Cancelar una reserva"""
    try:
        booking = Booking.query.get(booking_id)
        if not booking:
            return jsonify({'message': 'Reserva no encontrada'}), 404
        
        current_user_id = int(get_jwt_identity())
        if current_user_id != booking.usuario_id:
            return jsonify({'message': 'No autorizado'}), 403
        
        booking.estado = 'cancelada'
        db.session.commit()
        
        return jsonify({'message': 'Reserva cancelada exitosamente'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error: {str(e)}'}), 500

@bookings_bp.route('/availability', methods=['GET'])
@jwt_required()
def check_availability():
    """Verificar disponibilidad de una pista"""
    try:
        court_id = request.args.get('court_id')
        fecha = request.args.get('date')
        hora = request.args.get('time')
        
        if not all([court_id, fecha, hora]):
            return jsonify({'message': 'Faltan parámetros'}), 400
        
        fecha_obj = datetime.strptime(fecha, '%Y-%m-%d').date()
        hora_obj = datetime.strptime(hora, '%H:%M').time()
        
        booking = Booking.query.filter_by(
            pista_id=court_id,
            fecha=fecha_obj,
            hora_inicio=hora_obj,
            estado='confirmada'
        ).first()
        
        return jsonify({
            'available': booking is None
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500
