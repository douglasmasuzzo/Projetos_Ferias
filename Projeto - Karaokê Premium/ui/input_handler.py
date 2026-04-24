import sys
import logging
from typing import Optional

logger = logging.getLogger(__name__)

try:
    import msvcrt
    _PLATFORM = "windows"
except ImportError:
    msvcrt = None
    _PLATFORM = "unix"

if _PLATFORM == "unix":
    try:
        import tty
        import termios
        _HAS_TERMIOS = True
    except ImportError:
        _HAS_TERMIOS = False
else:
    _HAS_TERMIOS = False


class KeyAction:
    OFFSET_DECREASE = "offset_decrease"
    OFFSET_INCREASE = "offset_increase"
    QUIT = "quit"
    NONE = None


class InputHandler:
    def __enter__(self):
        if _PLATFORM == "unix" and _HAS_TERMIOS:
            self._fd = sys.stdin.fileno()
            self._old_settings = termios.tcgetattr(self._fd)
            tty.setraw(self._fd)
        return self

    def __exit__(self, *args):
        if _PLATFORM == "unix" and _HAS_TERMIOS and hasattr(self, '_old_settings'):
            termios.tcsetattr(self._fd, termios.TCSADRAIN, self._old_settings)

    def poll(self) -> Optional[str]:
        if _PLATFORM == "windows":
            return self._poll_windows()
        return self._poll_unix()

    def _poll_windows(self) -> Optional[str]:
        if not msvcrt or not msvcrt.kbhit():
            return KeyAction.NONE
        key = msvcrt.getch()
        return self._map_key(key)

    def _poll_unix(self) -> Optional[str]:
        if not _HAS_TERMIOS:
            return KeyAction.NONE
        import select
        if select.select([sys.stdin], [], [], 0)[0]:
            key = sys.stdin.read(1).encode()
            return self._map_key(key)
        return KeyAction.NONE

    @staticmethod
    def _map_key(key: bytes) -> Optional[str]:
        mapping = {
            b'[': KeyAction.OFFSET_DECREASE,
            b']': KeyAction.OFFSET_INCREASE,
            b'q': KeyAction.QUIT,
            b'Q': KeyAction.QUIT,
        }
        return mapping.get(key, KeyAction.NONE)
