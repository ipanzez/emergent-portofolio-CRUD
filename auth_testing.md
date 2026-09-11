# Auth Testing Playbook

Credentials: username `admin` / password `Admin@12345` (see /app/memory/test_credentials.md).

## API
```
curl -c cookies.txt -X POST http://localhost:8001/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"Admin@12345"}'
cat cookies.txt   # expect access_token + refresh_token (HttpOnly)
curl -b cookies.txt http://localhost:8001/api/auth/me
curl -b cookies.txt http://localhost:8001/api/admin/dashboard
curl http://localhost:8001/api/admin/dashboard   # expect 401
```
Wrong password 5x → 429 lockout for 15 min (per ip:username).

## Mongo
```
mongosh; use test_database; db.admin_users.findOne()   # password_hash starts with $2b$
```
