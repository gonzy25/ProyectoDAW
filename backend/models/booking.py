from database import db
from datetime import datetime

class Booking(db.Model):
    __tablename__ = 'reservas'
    
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    pista_id = db.Column(db.Integer, db.ForeignKey('pistas.id'), nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    hora_inicio = db.Column(db.Time, nullable=False)
    duracion = db.Column(db.Integer, nullable=False)  # En minutos
    estado = db.Column(db.Enum('confirmada', 'cancelada', 'completada'), 
                       default='confirmada', nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convertir a diccionario"""
        return {
            'id': self.id,
            'usuario_id': self.usuario_id,
            'pista_id': self.pista_id,
            'fecha': self.fecha.isoformat(),
            'hora_inicio': self.hora_inicio.strftime('%H:%M'),
            'duracion': self.duracion,
            'estado': self.estado,
            'fecha_creacion': self.fecha_creacion.isoformat()
        }
    
    def __repr__(self):
        return f'<Booking {self.id} - User {self.usuario_id} - Court {self.pista_id}>'
