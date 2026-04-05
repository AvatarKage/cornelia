import time
from datetime import datetime, timezone

from src.cornelia.scripts.config import config

eposh = config["snowflake"]["epoch"]

if isinstance(eposh, (int, float)) or str(eposh).isdigit():
    _epoch = int(eposh)
else:
    _epoch = int(
        datetime.fromisoformat(eposh.replace("Z", "+00:00"))
        .astimezone(timezone.utc)
        .timestamp()
        * 1000
    )

_sequence = 0
_last_timestamp = 0

def generate_snowflake() -> str:
    global _sequence, _last_timestamp

    timestamp = int(time.time() * 1000)

    if timestamp == _last_timestamp:
        _sequence = (_sequence + 1) & 0xFFF
        if _sequence == 0:
            while timestamp <= _last_timestamp:
                timestamp = int(time.time() * 1000)
    else:
        _sequence = 0

    _last_timestamp = timestamp

    return str(
        ((timestamp - _epoch) << 22)
        | (config["snowflake"]["machine"] << 12)
        | _sequence
    )