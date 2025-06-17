# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS # Import CORS
from datetime import datetime, date # Import date for clearer type hints
import logging # Import logging for better error reporting

# Import db and migrate from our new extensions.py file
from extensions import db, migrate

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)

# Configure your database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///asset_management.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions with the app instance
db.init_app(app) 
migrate.init_app(app, db) # Initialize Flask-Migrate with the app and db
CORS(app) # Enable CORS for all origins

# Import models AFTER db has been initialized with the app.
# This prevents the circular import.
from models import Asset, Category, Location, User 

# Helper function to get or create a Category by name
def get_or_create_category(name, description=None):
    """
    Retrieves an existing Category by name or creates a new one if it doesn't exist.
    Commits the new category to the database if created.
    """
    category = Category.query.filter_by(name=name).first()
    if not category:
        category = Category(name=name, description=description or f"Auto-created category: {name}")
        db.session.add(category)
        db.session.commit() # Commit new category to get its ID
        app.logger.info(f"Created new category: {name}")
    return category

# Helper function to get or create a Location by name
def get_or_create_location(name, address=None):
    """
    Retrieves an existing Location by name or creates a new one if it doesn't exist.
    Commits the new location to the database if created.
    """
    location = Location.query.filter_by(name=name).first()
    if not location:
        location = Location(name=name, address=address or f"Auto-created location: {name}")
        db.session.add(location)
        db.session.commit() # Commit new location to get its ID
        app.logger.info(f"Created new location: {name}")
    return location


# Test route
@app.route('/api/test', methods=['GET'])
def test_api():
    """
    Simple test endpoint to check if the API is running.
    """
    app.logger.info("Test API endpoint hit.")
    return jsonify({'message': 'Welcome to Asset Management System'})

# --- ASSET ROUTES ---
@app.route('/api/assets', methods=['GET'])
def get_assets():
    """
    Retrieves all assets from the database, joining with related Category, 
    Location, and User data to include names in the response.
    """
    try:
        assets = Asset.query.all()
        result = []
        for asset in assets:
            user_name = asset.assigned_user.name if asset.assigned_user else None
            result.append({
                'id': asset.id,
                'asset_code': asset.asset_code,
                'serial_number': asset.serial_number,
                'capital_date': asset.capital_date.isoformat() if asset.capital_date else None,
                'year': asset.year,
                'asset_type': asset.asset_type,
                'asset_description': asset.asset_description,
                'make': asset.make,
                'model': asset.model,
                'status': asset.status,
                'department': asset.department,
                'division': asset.division,
                'plant_code': asset.plant_code,
                'warranty_status': asset.warranty_status,
                'expiry_date': asset.expiry_date.isoformat() if asset.expiry_date else None,
                'category_id': asset.category_id,
                'category_name': asset.category.name if asset.category else None, # Include category name
                'location_id': asset.location_id,
                'location_name': asset.location.name if asset.location else None, # Include location name
                'user_id': asset.user_id,
                'user_name': user_name # Include user name
            })
        app.logger.info(f"Successfully retrieved {len(assets)} assets.")
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"Error retrieving assets: {e}", exc_info=True)
        return jsonify({'error': f"Failed to retrieve assets: {str(e)}"}), 500

# NEW: Route to get a single asset by ID
@app.route('/api/assets/<int:id>', methods=['GET'])
def get_asset(id):
    """
    Retrieves a single asset by its ID, including related Category, 
    Location, and User names. Returns 404 if not found.
    """
    try:
        asset = Asset.query.get_or_404(id)
        user_name = asset.assigned_user.name if asset.assigned_user else None
        asset_data = {
            'id': asset.id,
            'asset_code': asset.asset_code,
            'serial_number': asset.serial_number,
            'capital_date': asset.capital_date.isoformat() if asset.capital_date else None,
            'year': asset.year,
            'asset_type': asset.asset_type,
            'asset_description': asset.asset_description,
            'make': asset.make,
            'model': asset.model,
            'status': asset.status,
            'department': asset.department,
            'division': asset.division,
            'plant_code': asset.plant_code,
            'warranty_status': asset.warranty_status,
            'expiry_date': asset.expiry_date.isoformat() if asset.expiry_date else None,
            'category_id': asset.category_id,
            'category_name': asset.category.name if asset.category else None,
            'location_id': asset.location_id,
            'location_name': asset.location.name if asset.location else None,
            'user_id': asset.user_id,
            'user_name': user_name
        }
        app.logger.info(f"Successfully retrieved asset with ID: {id}")
        return jsonify(asset_data)
    except Exception as e:
        app.logger.error(f"Error retrieving asset {id}: {e}", exc_info=True)
        return jsonify({'error': f"Failed to retrieve asset: {str(e)}"}), 500


@app.route('/api/assets', methods=['POST'])
def add_asset():
    """
    Adds a new asset to the database. Automatically creates Category and Location
    if they don't exist based on provided names. Handles date parsing and validation.
    """
    data = request.json
    try:
        # Get or create Category and Location based on name
        category = get_or_create_category(data['category_name'])
        location = get_or_create_location(data['location_name'])

        # Robust date parsing for capital_date and expiry_date
        capital_date = None
        if data.get('capital_date'):
            try:
                capital_date = datetime.fromisoformat(data['capital_date']).date()
            except ValueError:
                app.logger.warning(f"Invalid capital_date format: {data['capital_date']}")
                return jsonify({'error': 'Invalid capital_date format. Use YYYY-MM-DD.'}), 400

        expiry_date = None
        if data.get('expiry_date'):
            try:
                expiry_date = datetime.fromisoformat(data['expiry_date']).date()
            except ValueError:
                app.logger.warning(f"Invalid expiry_date format: {data['expiry_date']}")
                return jsonify({'error': 'Invalid expiry_date format. Use YYYY-MM-DD.'}), 400

        new_asset = Asset(
            asset_code=data['asset_code'],
            serial_number=data['serial_number'],
            capital_date=capital_date,
            year=data.get('year'),
            asset_type=data.get('asset_type'),
            asset_description=data.get('asset_description'),
            make=data.get('make'),
            model=data.get('model'),
            status=data.get('status', 'Active'),
            department=data.get('department'),
            division=data.get('division'),
            plant_code=data.get('plant_code'),
            warranty_status=data.get('warranty_status', 'In Warranty'),
            expiry_date=expiry_date,
            category_id=category.id, # Use ID from the found/created category
            location_id=location.id, # Use ID from the found/created location
            user_id=data.get('user_id')
        )
        db.session.add(new_asset)
        db.session.commit()
        app.logger.info(f"Successfully added new asset with ID: {new_asset.id}")
        return jsonify({'message': 'Asset added successfully', 'id': new_asset.id}), 201
    except KeyError as e:
        db.session.rollback()
        app.logger.error(f"Missing required field in asset add: {e}", exc_info=True)
        return jsonify({'error': f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Failed to add asset: {e}", exc_info=True)
        return jsonify({'error': f"Failed to add asset: {str(e)}"}), 400


@app.route('/api/assets/<int:id>', methods=['PUT']) # Explicitly ensure PUT is allowed
def update_asset(id):
    """
    Updates an existing asset by its ID. Handles updating category and location
    based on names, robust date parsing, and partial updates.
    """
    asset = Asset.query.get_or_404(id)
    data = request.json
    try:
        # --- Handle category_name and location_name ---
        category_name = data.get('category_name')
        if category_name is None:
            # If category_name is not in payload, try to use existing asset's category name
            category_name = asset.category.name if asset.category else None

        location_name = data.get('location_name')
        if location_name is None:
            # If location_name is not in payload, try to use existing asset's location name
            location_name = asset.location.name if asset.location else None

        # Validate that we have names to work with before getting/creating
        if not category_name:
            app.logger.warning(f"Category name missing for asset update (ID: {id})")
            return jsonify({'error': "Category name is required for asset update."}), 400
        if not location_name:
            app.logger.warning(f"Location name missing for asset update (ID: {id})")
            return jsonify({'error': "Location name is required for asset update."}), 400

        category = get_or_create_category(category_name)
        location = get_or_create_location(location_name)
        
        # Update category and location IDs on the asset
        asset.category_id = category.id
        asset.location_id = location.id

        # Update fields with data from request, or retain existing if not provided
        asset.asset_code = data.get('asset_code', asset.asset_code)
        asset.serial_number = data.get('serial_number', asset.serial_number)
        
        # capital_date
        if 'capital_date' in data: # Check if key exists in payload
            if data['capital_date']: # If it exists and is not empty string
                try:
                    asset.capital_date = datetime.fromisoformat(data['capital_date']).date()
                except ValueError:
                    app.logger.warning(f"Invalid capital_date format for asset {id}: {data['capital_date']}")
                    return jsonify({'error': 'Invalid capital_date format. Use YYYY-MM-DD.'}), 400
            else: # If key exists but value is empty, set to None
                asset.capital_date = None
        # else: retain existing asset.capital_date if 'capital_date' is not in data

        # expiry_date
        if 'expiry_date' in data: # Check if key exists in payload
            if data['expiry_date']: # If it exists and is not empty string
                try:
                    asset.expiry_date = datetime.fromisoformat(data['expiry_date']).date()
                except ValueError:
                    app.logger.warning(f"Invalid expiry_date format for asset {id}: {data['expiry_date']}")
                    return jsonify({'error': 'Invalid expiry_date format. Use YYYY-MM-DD.'}), 400
            else: # If key exists but value is empty, set to None
                asset.expiry_date = None
        # else: retain existing asset.expiry_date if 'expiry_date' is not in data

        asset.year = data.get('year', asset.year)
        asset.asset_type = data.get('asset_type', asset.asset_type)
        asset.asset_description = data.get('asset_description', asset.asset_description)
        asset.make = data.get('make', asset.make)
        asset.model = data.get('model', asset.model)
        asset.status = data.get('status', asset.status) # THIS IS THE FIELD WE ARE MOST LIKELY UPDATING from Scrap page
        asset.department = data.get('department', asset.department)
        asset.division = data.get('division', asset.division)
        asset.plant_code = data.get('plant_code', asset.plant_code)
        asset.warranty_status = data.get('warranty_status', asset.warranty_status)
        asset.user_id = data.get('user_id', asset.user_id)

        db.session.commit()
        app.logger.info(f"Successfully updated asset with ID: {id}")
        return jsonify({'message': 'Asset updated successfully'}), 200

    except KeyError as e:
        db.session.rollback()
        app.logger.error(f"Missing data for field in asset update (ID: {id}): {e}", exc_info=True)
        return jsonify({'error': f"Missing data for field: {str(e)}"}), 400
    except ValueError as e: # Catch specific ValueError from date parsing or name validation
        db.session.rollback()
        app.logger.error(f"Validation error in asset update (ID: {id}): {e}", exc_info=True)
        return jsonify({'error': f"Validation error: {str(e)}"}), 400
    except Exception as e:
        db.session.rollback()
        # Log the full exception for debugging on the server side
        app.logger.error(f"An unexpected error occurred during asset update (ID: {id}): {str(e)}", exc_info=True)
        return jsonify({'error': f"An unexpected error occurred during asset update: {str(e)}"}), 500

@app.route('/api/assets/<int:id>', methods=['DELETE'])
def delete_asset(id):
    """
    Deletes an asset by its ID. Returns 404 if not found.
    """
    asset = Asset.query.get_or_404(id)
    try:
        db.session.delete(asset)
        db.session.commit()
        app.logger.info(f"Successfully deleted asset with ID: {id}")
        return jsonify({'message': 'Asset deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error deleting asset {id}: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 400

# --- CATEGORY ROUTES (Kept for direct category management, though not essential for AssetForm now) ---
@app.route('/api/categories', methods=['GET'])
def get_categories():
    """
    Retrieves all categories from the database.
    """
    try:
        categories = Category.query.all()
        result = [{'id': c.id, 'name': c.name, 'description': c.description} for c in categories]
        app.logger.info(f"Successfully retrieved {len(categories)} categories.")
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"Error retrieving categories: {e}", exc_info=True)
        return jsonify({'error': f"Failed to retrieve categories: {str(e)}"}), 500


@app.route('/api/categories', methods=['POST'])
def add_category():
    """
    Adds a new category to the database.
    """
    data = request.json
    try:
        new_category = Category(name=data['name'], description=data.get('description'))
        db.session.add(new_category)
        db.session.commit()
        app.logger.info(f"Successfully added new category: {new_category.name}")
        return jsonify({'message': 'Category added successfully', 'id': new_category.id}), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Failed to add category: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 400

@app.route('/api/categories/<int:id>', methods=['PUT'])
def update_category(id):
    """
    Updates an existing category by its ID. Returns 404 if not found.
    """
    category = Category.query.get_or_404(id)
    data = request.json
    try:
        category.name = data['name']
        category.description = data.get('description')
        db.session.commit()
        app.logger.info(f"Successfully updated category with ID: {id}")
        return jsonify({'message': 'Category updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error updating category {id}: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 400

@app.route('/api/categories/<int:id>', methods=['DELETE'])
def delete_category(id):
    """
    Deletes a category by its ID. Returns 404 if not found.
    """
    category = Category.query.get_or_404(id)
    try:
        db.session.delete(category)
        db.session.commit()
        app.logger.info(f"Successfully deleted category with ID: {id}")
        return jsonify({'message': 'Category deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error deleting category {id}: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 400


# --- USER ROUTES ---
@app.route('/api/users', methods=['GET'])
def get_users():
    """
    Retrieves all users from the database.
    """
    try:
        users = User.query.all()
        result = []
        for user in users:
            result.append({
                'id': user.id,
                'emp_id': user.emp_id,
                'emp_code': user.emp_code, 
                'name': user.name,
                'email': user.email,
                'role': user.role,
                'department': user.department, 
                'division': user.division, 
                'join_date': user.join_date.isoformat() if user.join_date else None, 
                'status': user.status, 
                'location': user.location, 
                'phone_number': user.phone_number, 
                'designation': user.designation, 
                'reporting_manager': user.reporting_manager 
            })
        app.logger.info(f"Successfully retrieved {len(users)} users.")
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"Error retrieving users: {e}", exc_info=True)
        return jsonify({'error': f"Failed to retrieve users: {str(e)}"}), 500

@app.route('/api/users', methods=['POST'])
def add_user():
    """
    Adds a new user to the database. Handles date parsing and validation.
    """
    data = request.json
    # Robust date parsing for join_date
    join_date = None
    if data.get('join_date'):
        try:
            join_date = datetime.fromisoformat(data['join_date']).date()
        except ValueError:
            app.logger.warning(f"Invalid join_date format for user add: {data['join_date']}")
            return jsonify({'error': 'Invalid join_date format. Use YYYY-MM-DD.'}), 400

    try:
        new_user = User(
            emp_id=data['emp_id'],
            emp_code=data['emp_code'], 
            name=data['name'],
            email=data['email'],
            role=data.get('role', 'Employee'),
            department=data.get('department'),
            division=data.get('division'),
            join_date=join_date,
            status=data.get('status'),
            location=data.get('location'),
            phone_number=data.get('phone_number'),
            designation=data.get('designation'),
            reporting_manager=data.get('reporting_manager')
        )
        db.session.add(new_user)
        db.session.commit()
        app.logger.info(f"Successfully added new user: {new_user.name}")
        return jsonify({'message': 'User added successfully', 'id': new_user.id}), 201
    except KeyError as e:
        db.session.rollback()
        app.logger.error(f"Missing required field in user add: {e}", exc_info=True)
        return jsonify({'error': f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Failed to add user: {e}", exc_info=True)
        return jsonify({'error': f"Failed to add user: {str(e)}"}), 400

@app.route('/api/users/<int:id>', methods=['PUT'])
def update_user(id):
    """
    Updates an existing user by their ID. Handles date parsing and partial updates.
    Returns 404 if user not found.
    """
    user = User.query.get_or_404(id)
    data = request.json
    # Robust date parsing for join_date
    join_date = None
    if 'join_date' in data:
        if data['join_date']:
            try:
                join_date = datetime.fromisoformat(data['join_date']).date()
            except ValueError:
                app.logger.warning(f"Invalid join_date format for user {id}: {data['join_date']}")
                return jsonify({'error': 'Invalid join_date format. Use YYYY-MM-DD.'}), 400
        else:
            join_date = None # If key exists but value is empty, set to None
    else:
        join_date = user.join_date # retain existing if not in payload


    try:
        user.emp_id = data.get('emp_id', user.emp_id)
        user.emp_code = data.get('emp_code', user.emp_code) 
        user.name = data.get('name', user.name)
        user.email = data.get('email', user.email)
        user.role = data.get('role', user.role)
        user.department = data.get('department', user.department)
        user.division = data.get('division', user.division)
        user.join_date = join_date
        user.status = data.get('status', user.status)
        user.location = data.get('location', user.location)
        user.phone_number = data.get('phone_number', user.phone_number)
        user.designation = data.get('designation', user.designation)
        user.reporting_manager = data.get('reporting_manager', user.reporting_manager)
        db.session.commit()
        app.logger.info(f"Successfully updated user with ID: {id}")
        return jsonify({'message': 'User updated successfully'}), 200
    except KeyError as e:
        db.session.rollback()
        app.logger.error(f"Missing data for field in user update (ID: {id}): {e}", exc_info=True)
        return jsonify({'error': f"Missing data for field: {str(e)}"}), 400
    except ValueError as e:
        db.session.rollback()
        app.logger.error(f"Validation error in user update (ID: {id}): {e}", exc_info=True)
        return jsonify({'error': f"Validation error: {str(e)}"}), 400
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"An unexpected error occurred during user update (ID: {id}): {str(e)}", exc_info=True)
        return jsonify({'error': f"An unexpected error occurred during user update: {str(e)}"}), 500

# --- LOCATION ROUTES (Keeping for completeness, though not needed for UI now) ---
@app.route('/api/locations', methods=['GET'])
def get_locations():
    """
    Retrieves all locations from the database.
    """
    try:
        locations = Location.query.all()
        result = [{'id': l.id, 'name': l.name, 'address': l.address} for l in locations]
        app.logger.info(f"Successfully retrieved {len(locations)} locations.")
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"Error retrieving locations: {e}", exc_info=True)
        return jsonify({'error': f"Failed to retrieve locations: {str(e)}"}), 500

@app.route('/api/locations', methods=['POST'])
def add_location():
    """
    Adds a new location to the database.
    """
    data = request.json
    try:
        new_location = Location(name=data['name'], address=data.get('address'))
        db.session.add(new_location)
        db.session.commit()
        app.logger.info(f"Successfully added new location: {new_location.name}")
        return jsonify({'message': 'Location added successfully', 'id': new_location.id}), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Failed to add location: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 400

@app.route('/api/locations/<int:id>', methods=['PUT'])
def update_location(id):
    """
    Updates an existing location by its ID. Returns 404 if not found.
    """
    location = Location.query.get_or_404(id)
    data = request.json
    try:
        location.name = data['name']
        location.address = data.get('address')
        db.session.commit()
        app.logger.info(f"Successfully updated location with ID: {id}")
        return jsonify({'message': 'Location updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error updating location {id}: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 400

@app.route('/api/locations/<int:id>', methods=['DELETE'])
def delete_location(id):
    """
    Deletes a location by its ID. Returns 404 if not found.
    """
    location = Location.query.get_or_404(id)
    try:
        db.session.delete(location)
        db.session.commit()
        app.logger.info(f"Successfully deleted location with ID: {id}")
        return jsonify({'message': 'Location deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error deleting location {id}: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    # This block ensures that the database tables are created when you run app.py directly.
    # It needs to be inside an application context.
    with app.app_context():
        db.create_all() 
        app.logger.info("Database tables checked/created.")
    app.run(debug=True)
