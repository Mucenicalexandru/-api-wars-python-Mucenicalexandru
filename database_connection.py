import os
import psycopg2
import urllib


urllib.parse.uses_netloc.append('postgres')
url = urllib.parse.urlparse(os.environ.get('DATABASE_URL'))


def get_connection_string():
    user_name = "alex" # os.environ.get('PSQL_USER_NAME')  # export PSQL_USER_NAME=alex
    password = "1234" # os.environ.get('PSQL_PASSWORD')  # export PSQL_PASSWORD=1234
    host = "localhost" #os.environ.get('PSQL_HOST')  # export PSQL_HOST=localhost
    database_name = "apiwars" #os.environ.get('PSQL_DB_NAME')  # export PSQL_DB_NAME=apiwars
    env_variables_defined = user_name and password and host and database_name

    if env_variables_defined:
        return 'postgresql://{user_name}:{password}@{host}/{database_name}'.format(
            user_name=user_name,
            password=password,
            host=host,
            database_name=database_name
        )
    else:
        raise KeyError('Some necessary environment variable(s) are not defined')


def open_database():
    try:
        connection_string = get_connection_string()
        connection = psycopg2.connect(connection_string)
        connection.autocommit = True
    except psycopg2.DatabaseError as exception:
        print('Database connection problem')
        raise exception
    return connection


def connection_handler(function):
    def wrapper(*args, **kwargs):
        connection = open_database()
        # we set the cursor_factory parameter to return with a RealDictCursor cursor (cursor which provide dictionaries)
        dict_cur = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        ret_value = function(dict_cur, *args, **kwargs)
        dict_cur.close()
        connection.close()
        return ret_value

    return wrapper