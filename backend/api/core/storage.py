"""SQLite persistence helpers for PolicyFit data."""
import json
import sqlite3
from pathlib import Path
from typing import Any

from api.core.config import settings


def _db_path() -> str:
    url = settings.DATABASE_URL
    if url.startswith("sqlite:///"):
        return url.replace("sqlite:///", "", 1)
    return "./policyfit.db"


def _connect() -> sqlite3.Connection:
    path = _db_path()
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with _connect() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS businesses (
                id TEXT PRIMARY KEY,
                data_json TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS policies (
                policy_id TEXT PRIMARY KEY,
                filename TEXT NOT NULL,
                file_path TEXT NOT NULL,
                status TEXT NOT NULL,
                processing_json TEXT NOT NULL,
                extraction_json TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS analyses (
                analysis_id TEXT PRIMARY KEY,
                business_id TEXT NOT NULL,
                policy_id TEXT NOT NULL,
                coverage_gaps_json TEXT NOT NULL,
                recommendations_json TEXT NOT NULL,
                overall_risk_score REAL NOT NULL,
                summary TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS analysis_chats (
                analysis_id TEXT PRIMARY KEY,
                messages_json TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )


def create_business_record(record: dict[str, Any]) -> None:
    with _connect() as conn:
        conn.execute(
            "INSERT INTO businesses (id, data_json, created_at, updated_at) VALUES (?, ?, ?, ?)",
            (record["id"], json.dumps(record), record["created_at"], record["updated_at"]),
        )


def list_business_records() -> list[dict[str, Any]]:
    with _connect() as conn:
        rows = conn.execute("SELECT data_json FROM businesses ORDER BY created_at DESC").fetchall()
    return [json.loads(r["data_json"]) for r in rows]


def get_business_record(business_id: str) -> dict[str, Any] | None:
    with _connect() as conn:
        row = conn.execute("SELECT data_json FROM businesses WHERE id = ?", (business_id,)).fetchone()
    return json.loads(row["data_json"]) if row else None


def update_business_record(record: dict[str, Any]) -> None:
    with _connect() as conn:
        conn.execute(
            "UPDATE businesses SET data_json = ?, updated_at = ? WHERE id = ?",
            (json.dumps(record), record["updated_at"], record["id"]),
        )


def delete_business_record(business_id: str) -> None:
    with _connect() as conn:
        conn.execute("DELETE FROM businesses WHERE id = ?", (business_id,))


def create_policy_record(record: dict[str, Any]) -> None:
    with _connect() as conn:
        conn.execute(
            """
            INSERT INTO policies (
                policy_id, filename, file_path, status, processing_json, extraction_json, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                record["policy_id"],
                record["filename"],
                record["file_path"],
                record["status"],
                json.dumps(record.get("processing", {})),
                json.dumps(record.get("extraction", {})),
                record["created_at"],
                record["updated_at"],
            ),
        )


def list_policy_records() -> list[dict[str, Any]]:
    with _connect() as conn:
        rows = conn.execute("SELECT * FROM policies ORDER BY created_at DESC").fetchall()
    return [_policy_row_to_dict(r) for r in rows]


def get_policy_record(policy_id: str) -> dict[str, Any] | None:
    with _connect() as conn:
        row = conn.execute("SELECT * FROM policies WHERE policy_id = ?", (policy_id,)).fetchone()
    return _policy_row_to_dict(row) if row else None


def delete_policy_record(policy_id: str) -> None:
    with _connect() as conn:
        conn.execute("DELETE FROM policies WHERE policy_id = ?", (policy_id,))


def _policy_row_to_dict(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "policy_id": row["policy_id"],
        "filename": row["filename"],
        "file_path": row["file_path"],
        "status": row["status"],
        "processing": json.loads(row["processing_json"]),
        "extraction": json.loads(row["extraction_json"]),
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
    }


def create_analysis_record(record: dict[str, Any]) -> None:
    with _connect() as conn:
        conn.execute(
            """
            INSERT INTO analyses (
                analysis_id, business_id, policy_id, coverage_gaps_json,
                recommendations_json, overall_risk_score, summary, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                record["analysis_id"],
                record["business_id"],
                record["policy_id"],
                json.dumps(record.get("coverage_gaps", [])),
                json.dumps(record.get("recommendations", [])),
                float(record.get("overall_risk_score", 0.0)),
                record.get("summary", ""),
                record["created_at"],
                record["updated_at"],
            ),
        )


def list_analysis_records() -> list[dict[str, Any]]:
    with _connect() as conn:
        rows = conn.execute("SELECT * FROM analyses ORDER BY created_at DESC").fetchall()
    return [_analysis_row_to_dict(r) for r in rows]


def get_analysis_record(analysis_id: str) -> dict[str, Any] | None:
    with _connect() as conn:
        row = conn.execute("SELECT * FROM analyses WHERE analysis_id = ?", (analysis_id,)).fetchone()
    return _analysis_row_to_dict(row) if row else None


def delete_analysis_record(analysis_id: str) -> None:
    with _connect() as conn:
        conn.execute("DELETE FROM analyses WHERE analysis_id = ?", (analysis_id,))


def _analysis_row_to_dict(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "analysis_id": row["analysis_id"],
        "business_id": row["business_id"],
        "policy_id": row["policy_id"],
        "coverage_gaps": json.loads(row["coverage_gaps_json"]),
        "recommendations": json.loads(row["recommendations_json"]),
        "overall_risk_score": row["overall_risk_score"],
        "summary": row["summary"],
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
    }


def get_analysis_chat_messages(analysis_id: str) -> list[dict[str, Any]]:
    with _connect() as conn:
        row = conn.execute(
            "SELECT messages_json FROM analysis_chats WHERE analysis_id = ?",
            (analysis_id,),
        ).fetchone()
    if not row:
        return []
    return json.loads(row["messages_json"])


def save_analysis_chat_messages(analysis_id: str, messages: list[dict[str, Any]], updated_at: str) -> None:
    with _connect() as conn:
        conn.execute(
            """
            INSERT INTO analysis_chats (analysis_id, messages_json, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(analysis_id)
            DO UPDATE SET messages_json = excluded.messages_json, updated_at = excluded.updated_at
            """,
            (analysis_id, json.dumps(messages), updated_at),
        )
