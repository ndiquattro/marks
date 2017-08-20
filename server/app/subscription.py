from flask import Blueprint, request, jsonify, current_app, redirect
import stripe
from datetime import datetime, timedelta
from app import app, db
from app.models import Subscriptions

# Register blueprint
subscription = Blueprint('subscription', __name__, url_prefix='/subscription')

# Set key
stripe.api_key = app.config['STRIPE_KEY']

@subscription.route('/new', methods=['POST'])
def new():
    # Customer object is populated by Stripe and adds subscription
    try:
        customer = stripe.Customer.create(
            email=request.form['stripeEmail'],
            source=request.form['stripeToken'],
            plan='basic'
        )

        print(customer)

        # Save to Database
        expire = datetime.now() + timedelta(days=16)  # Expire after trial
        print(expire)
        new_sub = Subscriptions(customer['id'], customer['subscriptions']['data'][0]['id'],
                                expire, request.form['user_id'])
        db.session.add(new_sub)
        db.session.commit()

        return redirect('/first_time')
    except Exception as e:
        print(e)
        return redirect('/subscription/error')
