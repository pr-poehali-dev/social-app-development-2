import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p40952377_social_app_developme")

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def make_token() -> str:
    return secrets.token_hex(32)


def handler(event: dict, context) -> dict:
    """Авторизация: регистрация, вход, выход, получение текущего пользователя"""

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "me")
    headers = event.get("headers") or {}

    # GET ?action=me — получить текущего пользователя по токену
    if method == "GET" and action == "me":
        token = headers.get("x-auth-token") or headers.get("X-Auth-Token", "")
        if not token:
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Нет токена"})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"""
            SELECT u.id, u.username, u.email, u.display_name, u.bio, u.avatar_url,
                   u.followers_count, u.following_count, u.posts_count, u.created_at
            FROM {SCHEMA}.sessions s
            JOIN {SCHEMA}.users u ON u.id = s.user_id
            WHERE s.token = %s AND s.expires_at > NOW()
            """,
            (token,)
        )
        row = cur.fetchone()
        conn.close()

        if not row:
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия истекла"})}

        return {
            "statusCode": 200,
            "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps({
                "id": row[0], "username": row[1], "email": row[2],
                "display_name": row[3], "bio": row[4], "avatar_url": row[5],
                "followers_count": row[6], "following_count": row[7],
                "posts_count": row[8],
            })
        }

    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    # POST ?action=register — регистрация
    if method == "POST" and action == "register":
        username = (body.get("username") or "").strip()
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""
        display_name = (body.get("display_name") or username).strip()

        if not username or not email or not password:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Заполните все поля"})}
        if len(password) < 6:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Пароль минимум 6 символов"})}
        if len(username) < 3:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Имя пользователя минимум 3 символа"})}

        conn = get_conn()
        cur = conn.cursor()

        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s OR username = %s", (email, username))
        if cur.fetchone():
            conn.close()
            return {"statusCode": 409, "headers": CORS, "body": json.dumps({"error": "Пользователь с таким email или именем уже существует"})}

        pwd_hash = hash_password(password)
        cur.execute(
            f"INSERT INTO {SCHEMA}.users (username, email, password_hash, display_name) VALUES (%s, %s, %s, %s) RETURNING id",
            (username, email, pwd_hash, display_name)
        )
        user_id = cur.fetchone()[0]

        token = make_token()
        cur.execute(
            f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)",
            (user_id, token)
        )
        conn.commit()
        conn.close()

        return {
            "statusCode": 201,
            "headers": CORS,
            "body": json.dumps({
                "token": token,
                "user": {
                    "id": user_id, "username": username, "email": email,
                    "display_name": display_name, "bio": "", "avatar_url": "",
                    "followers_count": 0, "following_count": 0, "posts_count": 0,
                }
            })
        }

    # POST ?action=login — вход
    if method == "POST" and action == "login":
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not email or not password:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Введите email и пароль"})}

        conn = get_conn()
        cur = conn.cursor()
        pwd_hash = hash_password(password)
        cur.execute(
            f"""
            SELECT id, username, email, display_name, bio, avatar_url,
                   followers_count, following_count, posts_count
            FROM {SCHEMA}.users
            WHERE email = %s AND password_hash = %s
            """,
            (email, pwd_hash)
        )
        row = cur.fetchone()
        if not row:
            conn.close()
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Неверный email или пароль"})}

        token = make_token()
        cur.execute(f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)", (row[0], token))
        conn.commit()
        conn.close()

        return {
            "statusCode": 200,
            "headers": CORS,
            "body": json.dumps({
                "token": token,
                "user": {
                    "id": row[0], "username": row[1], "email": row[2],
                    "display_name": row[3], "bio": row[4], "avatar_url": row[5],
                    "followers_count": row[6], "following_count": row[7],
                    "posts_count": row[8],
                }
            })
        }

    # DELETE ?action=logout — выход
    if method == "DELETE" and action == "logout":
        token = headers.get("x-auth-token") or headers.get("X-Auth-Token", "")
        if token:
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(f"UPDATE {SCHEMA}.sessions SET expires_at = NOW() WHERE token = %s", (token,))
            conn.commit()
            conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Not found"})}