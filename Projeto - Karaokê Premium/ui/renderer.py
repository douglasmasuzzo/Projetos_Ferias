import os
import shutil
from core.models import KaraokeSession, PlayerState, SyncState
from core.sync_engine import calcular_progresso


class Color:
    RESET   = "\033[0m"
    BOLD    = "\033[1m"
    DIM     = "\033[90m"
    CYAN    = "\033[1;36m"
    YELLOW  = "\033[1;33m"
    GREEN   = "\033[1;32m"
    MAGENTA = "\033[1;35m"
    BLUE    = "\033[1;34m"


class Renderer:
    def clear(self):
        os.system('cls' if os.name == 'nt' else 'clear')

    @property
    def columns(self) -> int:
        return shutil.get_terminal_size().columns

    def draw_header(self, session: KaraokeSession):
        cols = self.columns
        color = Color.YELLOW if session.is_static_mode else Color.CYAN
        mode_tag = " (MODO ESTÁTICO)" if session.is_static_mode else ""

        print(f"{color}╔" + "═" * (cols - 2) + f"╗{Color.RESET}")
        title = f" 🎤 KARAOKÊ PREMIUM{mode_tag}: {session.title.upper()} - {session.artist.upper()} "
        print(f"{color}║" + title.center(cols - 2) + f"║{Color.RESET}")
        print(f"{color}╠" + "═" * (cols - 2) + f"╣{Color.RESET}")

    def draw_lyrics(self, current_text: str, next_text: str):
        cols = self.columns
        print("\n" * 2)
        print(Color.GREEN + current_text.center(cols) + Color.RESET)
        print("\n" + Color.DIM + f"({next_text})".center(cols) + Color.RESET)
        print("\n" * 2)

    def draw_static_lyrics(self, text: str):
        print("\n" + text + "\n")
        print(Color.YELLOW + "═" * self.columns + Color.RESET)

    def draw_status_bar(self, player: PlayerState, sync: SyncState):
        cols = self.columns
        progress = calcular_progresso(player)

        bar_width = max(cols - 45, 10)
        filled = int(bar_width * progress)
        bar = "█" * filled + "░" * (bar_width - filled)

        time_str = f"{self._fmt_time(player.position)} / {self._fmt_time(player.duration)}"
        offset_str = f" [Sinc: {sync.offset:+.1f}s]" if not sync.is_static_mode else ""
        hint_str = f"  {Color.DIM}[ ] ajustar sinc{Color.RESET}" if not sync.is_static_mode else ""

        print(
            f"\r\033[K   {time_str}  {Color.BLUE}{bar}{Color.RESET}{offset_str}{hint_str}",
            end="",
            flush=True,
        )

    def draw_startup(self):
        self.clear()
        print(Color.MAGENTA + " KARAOKÊ PREMIUM — INICIALIZANDO ".center(60, "=") + Color.RESET)
        print()

    def draw_search_status(self, term: str):
        print(f"{Color.DIM}🔎 Buscando por: '{term}'...{Color.RESET}")

    def draw_lyrics_preview(self, lines: list[str]):
        print(f"\n{Color.GREEN}✅ Letra encontrada!{Color.RESET}")
        print(f"{Color.DIM}Preview:{Color.RESET}\n   > " + "\n   > ".join(lines))

    def draw_error(self, message: str):
        print(f"\n❌ {Color.YELLOW}{message}{Color.RESET}")

    def draw_session_end(self):
        print(f"\n\n{Color.MAGENTA}--- SESSÃO ENCERRADA ---{Color.RESET}")

    @staticmethod
    def _fmt_time(seconds: float) -> str:
        m = int(seconds // 60)
        s = int(seconds % 60)
        return f"{m:02d}:{s:02d}"
