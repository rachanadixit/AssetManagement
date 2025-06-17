# backend/extensions.py
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# These are initialized without an app here.
# They will be initialized with the app later in app.py using .init_app()
db = SQLAlchemy()
migrate = Migrate()
