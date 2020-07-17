from typing import List, Dict
from psycopg2 import sql
from psycopg2.extras import RealDictCursor
import database_connection


@database_connection.connection_handler
def register_user(cursor: RealDictCursor, email, password) -> list:
    query = f"""
            INSERT INTO users
            (username, password)
            VALUES ('{email}', '{password}')
            """
    cursor.execute(query)

@database_connection.connection_handler
def get_user_info(cursor: RealDictCursor, email) -> list:
    query = f"""
            SELECT *
            FROM users
            WHERE username = '{email}'
            """
    cursor.execute(query)
    return cursor.fetchall()
