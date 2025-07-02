import redis

try:
    r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
    r.ping()  # Try connecting to Redis immediately
    print("✅ Redis connected successfully.")
except redis.exceptions.ConnectionError:
    print("❌ Redis connection failed. Running in degraded mode.")
    r = None  # fallback if you want to handle it elsewhere

