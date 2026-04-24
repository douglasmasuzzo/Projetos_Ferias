import subprocess
import threading
import logging
import time

from core.models import PlayerState
from services.ipc_client import IPCClient
from config.settings import (
    MPV_PATH,
    MPV_PIPE_PATH,
    MPV_WINDOW_GEOMETRY,
    IPC_POLL_INTERVAL,
    IPC_CONNECT_TIMEOUT,
    IPC_CONNECT_RETRY_DELAY,
)

logger = logging.getLogger(__name__)


class PlayerService:
    def __init__(self):
        self._state = PlayerState()
        self._lock = threading.Lock()
        self._process: subprocess.Popen | None = None
        self._ipc = IPCClient(
            pipe_path=MPV_PIPE_PATH,
            connect_timeout=IPC_CONNECT_TIMEOUT,
            retry_delay=IPC_CONNECT_RETRY_DELAY,
        )
        self._monitor_thread: threading.Thread | None = None

    @property
    def state(self) -> PlayerState:
        with self._lock:
            return PlayerState(
                position=self._state.position,
                duration=self._state.duration,
                is_active=self._state.is_active,
            )

    def start(self, search_query: str) -> bool:
        command = [
            MPV_PATH,
            f"ytdl://ytsearch:{search_query}",
            f"--input-ipc-server={MPV_PIPE_PATH}",
            "--force-window=yes",
            "--video=no",
            f"--geometry={MPV_WINDOW_GEOMETRY}",
            "--title=CONTROLE - KARAOKÊ PREMIUM",
            "--ontop=yes",
        ]

        try:
            self._process = subprocess.Popen(
                command,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
        except FileNotFoundError:
            logger.error("MPV não encontrado em: %s", MPV_PATH)
            return False
        except OSError as e:
            logger.error("Erro ao lançar MPV: %s", e)
            return False

        self._monitor_thread = threading.Thread(
            target=self._monitor_loop,
            daemon=True,
            name="ipc-monitor",
        )
        self._monitor_thread.start()
        return True

    def stop(self):
        with self._lock:
            self._state.is_active = False

        self._ipc.disconnect()

        if self._process and self._process.poll() is None:
            self._process.terminate()
            try:
                self._process.wait(timeout=3)
            except subprocess.TimeoutExpired:
                self._process.kill()

    def is_running(self) -> bool:
        return self._process is not None and self._process.poll() is None

    def _monitor_loop(self):
        if not self._ipc.connect():
            logger.error("IPC: Falha ao conectar. Sincronização desativada.")
            return

        logger.debug("IPC: Monitor iniciado.")

        while True:
            with self._lock:
                if not self._state.is_active:
                    break

            if not self.is_running():
                with self._lock:
                    self._state.is_active = False
                break

            pos, dur = self._ipc.get_time_and_duration()

            with self._lock:
                if pos is not None:
                    self._state.position = pos
                if dur is not None:
                    self._state.duration = dur

            time.sleep(IPC_POLL_INTERVAL)

        self._ipc.disconnect()
        logger.debug("IPC: Monitor encerrado.")
