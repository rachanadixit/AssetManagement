# backend/models.py

# Import db from extensions.py, where it is initialized
# This avoids the circular import by separating the db instance from the app object.
from extensions import db
from datetime import datetime

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.String(255))
    assets = db.relationship('Asset', backref='category', lazy=True)

    def __repr__(self):
        return f"<Category {self.name}>"

class Location(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    address = db.Column(db.String(255))
    assets = db.relationship('Asset', backref='location', lazy=True)

    def __repr__(self):
        return f"<Location {self.name}>"

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    emp_id = db.Column(db.String(50), unique=True, nullable=False)
    emp_code = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(50), default='Employee')
    department = db.Column(db.String(100))
    division = db.Column(db.String(100))
    join_date = db.Column(db.Date)
    status = db.Column(db.String(50))
    location = db.Column(db.String(100))
    phone_number = db.Column(db.String(20))
    designation = db.Column(db.String(100))
    reporting_manager = db.Column(db.String(100))
    assets_assigned = db.relationship('Asset', backref='assigned_user', lazy=True)

    def __repr__(self):
        return f"<User {self.name} ({self.emp_id})>"

class Asset(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    asset_code = db.Column(db.String(100), unique=True, nullable=False)
    serial_number = db.Column(db.String(100), unique=True, nullable=False)
    capital_date = db.Column(db.Date)
    year = db.Column(db.Integer)
    asset_type = db.Column(db.String(100))
    asset_description = db.Column(db.String(255))
    make = db.Column(db.String(100))
    model = db.Column(db.String(100))
    status = db.Column(db.String(50), default='Active') # e.g., Active, In Repair, Scrapped, Disposed
    department = db.Column(db.String(100))
    division = db.Column(db.String(100))
    plant_code = db.Column(db.String(50))
    warranty_status = db.Column(db.String(50), default='In Warranty') # e.g., In Warranty, Expired
    expiry_date = db.Column(db.Date)

    # Foreign Keys
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey('location.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True) # Nullable if unassigned

    def __repr__(self):
        return f"<Asset {self.asset_code}>"
