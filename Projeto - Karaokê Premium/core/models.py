from dataclasses import dataclass, field
from typing import Optional


@dataclass
class LyricLine:
    timestamp: float
    text: str


@dataclass
class PlayerState:
    position: float = 0.0
    duration: float = 0.0
    is_active: bool = True


@dataclass
class SyncState:
    offset: float = 0.0
    current_index: int = -1
    is_static_mode: bool = False


@dataclass
class KaraokeSession:
    artist: str
    title: str
    lyrics: list[LyricLine] = field(default_factory=list)
    static_text: str = ""
    player_state: PlayerState = field(default_factory=PlayerState)
    sync_state: SyncState = field(default_factory=SyncState)

    @property
    def is_static_mode(self) -> bool:
        return len(self.lyrics) == 0

    @property
    def search_query_audio(self) -> str:
        return f"{self.artist} {self.title} official audio"
