from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required, jwt_refresh_token_required, set_refresh_cookies
from flask_security.recoverable import send_reset_password_instructions, reset_password_token_status, update_password
from flask_security.changeable import change_user_password
from flask_security.confirmable import send_confirmation_instructions, confirm_email_token_status, confirm_user
from sqlalchemy import inspect
from app import user_datastore, db

# Register blueprint
auth = Blueprint('auth', __name__, url_prefix='/auth')

# Convert function
def object_as_dict(obj):
    return {c.key: getattr(obj, c.key) for c in inspect(obj).mapper.column_attrs}

def make_token(user):
    user_dict = object_as_dict(user)
    del user_dict['password']
    return {'access_token': create_access_token(identity=user.id),
            # 'refresh_token': create_refresh_token(identity=user.id),
            'user': user_dict}

@auth.route('/signup', methods=['POST'])
def signup():
    # Get payload
    content = request.get_json()

    # Create new user object
    user = user_datastore.create_user(email=content['email'],
                                      password=content['password'])


    # Add new user to the database
    db.session.commit()

    # Create JWT token and return user info
    ret = make_token(user, refresh=True)

    # Send Confirmation email
    send_confirmation_instructions(user)

    return jsonify(ret), 200

@auth.route('/confirm_email/<string:token>', methods=['POST'])
def confirm_email(token):
    print(token)
    expired, invalid, user = confirm_email_token_status(token)

    if not user or invalid:
        invalid = True

    already_confirmed = user is not None and user.confirmed_at is not None

    if expired and not already_confirmed:
        send_confirmation_instructions(user)

    if invalid or (expired and not already_confirmed):
        return redirect(get_url(_security.confirm_error_view) or
                        url_for('send_confirmation'))

    if user != current_user:
        logout_user()
        login_user(user)

    if confirm_user(user):
        db.session.commit()
        msg = 'EMAIL_CONFIRMED'
    else:
        msg = 'ALREADY_CONFIRMED'


    return redirect(get_url(_security.post_confirm_view) or
                    get_url(_security.post_login_view))

@auth.route('/login', methods=['POST'])
def login():
    # Get payload
    content = request.get_json()

    # Find user
    user = user_datastore.find_user(email=content['email'])

    # Compare Credentials
    if content['email'] == user.email and content['password'] == user.password:
        response = jsonify(make_token(user))
        print(response)
        set_refresh_cookies(response, create_refresh_token(identity=user.id))
        print(response)
        # return jsonify(make_token(user)), 200
        return response, 200

    # Default return
    return "400"

@auth.route('/refresh_token', methods=['POST'])
@jwt_refresh_token_required
def refresh_token():
    user = get_jwt_identity()
    return jsonify(make_token(user)), 200

@auth.route('/forgot_password', methods=['POST'])
def forgot_password():
    content = request.get_json()
    user = user_datastore.find_user(email=content['email'])
    send_reset_password_instructions(user)

    return "200"

""" TODO: Reset Password isn't complete """
@auth.route('/reset_password', methods=['POST'])
def reset_password():
    content = request.get_json()

    # Check Token
    expired, invalid, user = reset_password_token_status(content['reset_token'])

    if invalid:
        return jsonify({'error': 'Invalid Token'})
    if expired:
        send_reset_password_instructions(user)
        return jsonify({'error': 'Expired Token'})

    # Token checks out
    update_password(user, content['newPassword'])

    return jsonify({'Success': True})


@auth.route('/change_password', methods=['POST'])
@jwt_required
def change_password():
    # Get Information
    content = request.get_json()
    token_identity = get_jwt_identity()
    user = user_datastore.find_user(id=token_identity)

    # Change password
    change_user_password(user, content['new'])
    user_datastore.commit()

    return jsonify({'Changed': True})
