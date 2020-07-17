import bcrypt
from datetime import datetime, timedelta


def hash_password(plain_text_password):
    # By using bcrypt, the salt is saved into the hash itself
    hashed_bytes = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt())
    return hashed_bytes.decode('utf-8')


def verify_password(plain_text_password, hashed_password):
    hashed_bytes_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_bytes_password)


def get_submission_time():
    current_time = datetime.now()
    timestamp = current_time.timestamp()
    dt = (datetime.fromtimestamp(timestamp) - timedelta(hours=0)).strftime('%Y-%m-%d %H:%M:%S')
    return dt
