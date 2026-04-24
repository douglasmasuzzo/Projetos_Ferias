import json
import time
import logging
from typing import Optional

logger = logging.getLogger(__name__)

try:
    import win32file
    import win32pipe
    import pywintypes
    _HAS_WIN32 = True
except ImportError:
    _HAS_WIN32 = False
    logger.warning(
        "pywin32 não encontrado. Usando fallback de IPC. "
        "Para melhor sincronização: pip install pywin32"
    )


class IPCClient:
    def __init__(self, pipe_path: str, connect_timeout: int = 30, retry_delay: float = 0.5):
        self.pipe_path = pipe_path
        self.connect_timeout = connect_timeout
        self.retry_delay = retry_delay
        self._handle = None
        self._file = None

    def connect(self) -> bool:
        import os
        for attempt in range(self.connect_timeout):
            if os.path.exists(self.pipe_path):
                return self._open_connection()
            time.sleep(self.retry_delay)
        logger.error("IPC: Pipe não encontrado após %d tentativas.", self.connect_timeout)
        return False

    def disconnect(self):
        try:
            if _HAS_WIN32 and self._handle:
                win32file.CloseHandle(self._handle)
                self._handle = None
            elif self._file:
                self._file.close()
                self._file = None
        except Exception as e:
            logger.debug("IPC disconnect: %s", e)

    def is_connected(self) -> bool:
        return (self._handle is not None) or (self._file is not None)

    def get_property(self, prop: str) -> Optional[float]:
        command = json.dumps({"command": ["get_property", prop]}) + "\n"
        response = self._send(command)
        if response:
            try:
                data = json.loads(response)
                value = data.get("data")
                if value is not None:
                    return float(value)
            except (json.JSONDecodeError, ValueError) as e:
                logger.debug("IPC parse error para '%s': %s", prop, e)
        return None

    def get_time_and_duration(self) -> tuple[Optional[float], Optional[float]]:
        pos = self.get_property("time-pos")
        dur = self.get_property("duration")
        return pos, dur

    def _open_connection(self) -> bool:
        if _HAS_WIN32:
            return self._open_win32()
        return self._open_fallback()

    def _open_win32(self) -> bool:
        try:
            self._handle = win32file.CreateFile(
                self.pipe_path,
                win32file.GENERIC_READ | win32file.GENERIC_WRITE,
                0,
                None,
                win32file.OPEN_EXISTING,
                0,
                None,
            )
            win32pipe.SetNamedPipeHandleState(
                self._handle,
                win32pipe.PIPE_READMODE_MESSAGE,
                None,
                None,
            )
            logger.debug("IPC: Conectado via win32file.")
            return True
        except pywintypes.error as e:
            logger.error("IPC win32 connect error: %s", e)
            return False

    def _open_fallback(self) -> bool:
        try:
            self._file = open(self.pipe_path, 'r+b', buffering=0)
            logger.debug("IPC: Conectado via fallback (open).")
            return True
        except OSError as e:
            logger.error("IPC fallback connect error: %s", e)
            return False

    def _send(self, message: str) -> Optional[str]:
        if not self.is_connected():
            if not self._open_connection():
                return None

        try:
            if _HAS_WIN32 and self._handle:
                return self._send_win32(message)
            elif self._file:
                return self._send_fallback(message)
        except Exception as e:
            logger.debug("IPC send error: %s — reconectando.", e)
            self.disconnect()
        return None

    def _send_win32(self, message: str) -> Optional[str]:
        win32file.WriteFile(self._handle, message.encode('utf-8'))
        _, data = win32file.ReadFile(self._handle, 4096)
        return data.decode('utf-8').strip()

    def _send_fallback(self, message: str) -> Optional[str]:
        self._file.write(message.encode('utf-8'))
        self._file.flush()
        return self._file.readline().decode('utf-8').strip()
