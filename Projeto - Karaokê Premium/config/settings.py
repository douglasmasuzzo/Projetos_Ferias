import os
from dotenv import load_dotenv

load_dotenv()

MPV_PATH: str = (
    os.getenv("MPV_PATH", r"C:\Users\masuz\AppData\Local\Programs\mpv.net\mpvnet.exe")
    .strip('"')
    .strip("'")
)

MPV_PIPE_PATH: str = r"\\.\pipe\mpv-karaoke"
MPV_WINDOW_GEOMETRY: str = "500x300"

IPC_POLL_INTERVAL: float = 0.08
IPC_CONNECT_TIMEOUT: int  = 30
IPC_CONNECT_RETRY_DELAY: float = 0.5

SYNC_OFFSET_STEP: float   = 0.3
DISPLAY_REFRESH: float    = 0.15
IPC_LATENCY_COMPENSATION: float = 0.15

LRC_MIN_LENGTH: int = 100
LRC_SEARCH_TERMS_TEMPLATE: list[str] = [
    "{artist} {title}",
    "{title} {artist}",
    "{artist} {title} official",
    "{artist} {title} lyrics",
]
