from database import db

class Court(db.Model):
    __tablename__ = 'pistas'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    ubicacion = db.Column(db.String(200), nullable=False)
    tipo_superficie = db.Column(db.String(50), nullable=False)
    estado = db.Column(db.Enum('disponible', 'no_disponible', 'mantenimiento'), 
                       default='disponible', nullable=False)
    descripcion = db.Column(db.Text)
    imagen_url = db.Column(db.String(500))
    
    # Relaciones
    reservas = db.relationship('Booking', backref='pista', lazy=True)
    
    def to_dict(self):
        """Convertir a diccionario"""
        return {
            'id': self.id,
            'nombre': self.nombre,
            'ubicacion': self.ubicacion,
            'tipo_superficie': self.tipo_superficie,
            'estado': self.estado,
            'descripcion': self.descripcion,
            'imagen_url': self.imagen_url or 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800'
        }
    
    def __repr__(self):
        return f'<Court {self.nombre}>'
