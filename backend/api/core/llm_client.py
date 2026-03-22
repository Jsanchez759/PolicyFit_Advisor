"""OpenAI-compatible LLM client helpers (OpenRouter)."""
import base64
import json
import re
from pathlib import Path
from typing import Any, Dict

import httpx
from openai import AsyncOpenAI

from api.core.config import settings


def get_openrouter_client(api_key: str | None = None) -> AsyncOpenAI:
    """Create an async OpenAI-compatible client for OpenRouter."""
    return AsyncOpenAI(
        api_key=api_key or settings.OPENROUTER_API_KEY,
        base_url=settings.OPENROUTER_BASE_URL,
    )


def _extract_message_text(content: Any) -> str:
    """Normalize chat message content from OpenRouter responses."""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for chunk in content:
            if isinstance(chunk, dict) and chunk.get("type") == "text":
                parts.append(chunk.get("text", ""))
        return "\n".join(p for p in parts if p).strip()
    return ""


def _safe_json_loads(raw: str) -> Dict[str, Any]:
    """Best-effort JSON parsing for model outputs."""
    text = (raw or "").strip()
    if not text:
        return {}

    # Strip markdown fences if the model ignored strict instructions.
    if text.startswith("```"):
        text = re.sub(r"^```[a-zA-Z0-9_-]*\n?", "", text)
        text = re.sub(r"\n?```$", "", text).strip()

    try:
        parsed = json.loads(text)
        return parsed if isinstance(parsed, dict) else {}
    except json.JSONDecodeError:
        pass

    # Fallback: try first JSON object in free-form content.
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        snippet = text[start : end + 1]
        try:
            parsed = json.loads(snippet)
            return parsed if isinstance(parsed, dict) else {}
        except json.JSONDecodeError:
            return {}

    return {}


async def chat_pdf_json(
    file_path: str,
    prompt: str,
    system_prompt: str = "",
    api_key: str | None = None,
) -> Dict[str, Any]:
    """Ask a question against a PDF using OpenRouter file-parser and return JSON."""
    final_api_key = api_key or settings.OPENROUTER_API_KEY
    if not final_api_key:
        raise ValueError("OPENROUTER_API_KEY is required for PDF parsing")

    pdf_bytes = Path(file_path).read_bytes()
    b64_pdf = base64.b64encode(pdf_bytes).decode("utf-8")
    data_url = f"data:application/pdf;base64,{b64_pdf}"

    user_text = prompt
    if system_prompt:
        user_text = f"SYSTEM INSTRUCTIONS:\n{system_prompt}\n\nTASK:\n{prompt}"

    payload = {
        "model": settings.OPENROUTER_PDF_MODEL,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": user_text},
                    {
                        "type": "file",
                        "file": {
                            "filename": Path(file_path).name,
                            "file_data": data_url,
                        },
                    },
                ],
            }
        ],
        "plugins": [
            {
                "id": "file-parser",
                "pdf": {"engine": settings.OPENROUTER_PDF_ENGINE},
            }
        ],
    }

    headers = {
        "Authorization": f"Bearer {final_api_key}",
        "Content-Type": "application/json",
    }
    async with httpx.AsyncClient(timeout=180.0) as client:
        response = await client.post(
            f"{settings.OPENROUTER_BASE_URL}/chat/completions",
            headers=headers,
            json=payload,
        )
        response.raise_for_status()
        result = response.json()

    choices = result.get("choices", [])
    if not choices:
        return {}

    message = choices[0].get("message", {})
    content = _extract_message_text(message.get("content"))
    return _safe_json_loads(content)


async def chat_json(system_prompt: str, user_prompt: str, api_key: str | None = None) -> Dict[str, Any]:
    """Call chat completions and force JSON object output."""
    client = get_openrouter_client(api_key=api_key)
    response = await client.chat.completions.create(
        model=settings.OPENROUTER_CHAT_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )

    content = response.choices[0].message.content
    text = _extract_message_text(content)
    return _safe_json_loads(text)


async def chat_text(
    system_prompt: str,
    messages: list[dict[str, str]],
    api_key: str | None = None,
) -> str:
    """Call chat completions and return plain assistant text."""
    client = get_openrouter_client(api_key=api_key)
    response = await client.chat.completions.create(
        model=settings.OPENROUTER_CHAT_MODEL,
        messages=[{"role": "system", "content": system_prompt}, *messages],
    )
    content = response.choices[0].message.content
    return _extract_message_text(content).strip()
