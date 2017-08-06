from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db

# StackOverflow Function to get table from string
def get_class_by_tablename(tablename):
  """Return class reference mapped to table.

  :param tablename: String with name of table.
  :return: Class reference or None.
  """
  for c in db.Model._decl_class_registry.values():
    if hasattr(c, '__tablename__') and c.__tablename__ == tablename:
      return c

# Security Functions
@jwt_required
def auth_many(search_params={}, **kws):
    print("AUTH MANY FUNC FIRED")
    user_filter = {'name': 'user_id', 'op': 'eq', 'val': get_jwt_identity()}
    if 'filters' in search_params:
        search_params['filters'].append(user_filter)
    else:
        search_params['filters'] = [user_filter]

@jwt_required
def auth_get_single(instance_id=None, **kws):
    print("AUTH GET SINGLE PRE FIRED")
    pass

@jwt_required
def add_pre(data, instance_id=None, **kws):
    print("ADD PRE FIRED")
    data['user_id'] = get_jwt_identity()

@jwt_required
def auth_post(result=None, instance_id=None, **kws):
    print("AUTH GET SINGLE POST FIRED")
    # Token claim
    token_user = get_jwt_identity()

    # Check if this is a User Object
    if 'email' in result:
        if token_user == result['id']:
            return instance_id

    print(result)
    if token_user == result['user_id']:
        return instance_id

    raise ProcessingException(description='Not Authorized',
                              code=401)

@jwt_required
def auth_delete(instance_id, **kws):
    print("AUTH DELETE FIRED")
    # Get resource and token id
    resource = request.url.split('/')[4]
    token_user = get_jwt_identity()

    # Get desired Data
    cur_table = get_class_by_tablename(resource)
    desired_data = cur_table.query.get(instance_id)

    # Check if user is allowed to access this resource
    if desired_data.user_id == token_user:
        return instance_id

    # Reject if we got to this point
    raise ProcessingException(description='Not Authorized',
                              code=401)

# Universal pre/post function definitions
uni_preprocs = dict(POST=[add_pre],
                    GET_SINGLE=[auth_get_single],
                    PUT_SINGLE=[add_pre],
                    DELETE_SINGLE=[auth_delete],
                    GET_MANY=[auth_many],
                    PUT_MANY=[auth_many],
                    DELETE_MANY=[auth_many])

uni_postprocs = dict(GET_SINGLE=[auth_post])
