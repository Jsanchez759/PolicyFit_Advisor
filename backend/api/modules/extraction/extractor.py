"""Policy information extraction using LLM"""
import logging
from typing import Dict, List, Tuple

from api.core.config import settings
from api.core.llm_client import chat_pdf_json

logger = logging.getLogger(__name__)


class PolicyExtractor:
    """Extract structured information from policy documents"""
    
    def __init__(self):
        self.model_name = settings.OPENROUTER_CHAT_MODEL
        self.embedding_model_name = settings.OPENROUTER_EMBEDDING_MODEL
        
    async def extract_policy_info(self, pdf_path: str) -> Dict:
        """
        Extract policy information from document text
        
        Args:
            pdf_path: Path to policy PDF
            
        Returns:
            Structured policy information
        """
        policy_type = await self.extract_policy_type(pdf_path)
        coverage_types = await self.extract_coverage_types(pdf_path)
        limits, deductibles = await self.extract_limits_and_deductibles(pdf_path)
        exclusions = await self.extract_exclusions(pdf_path)
        dates = await self.extract_policy_dates(pdf_path)

        return {
            "policy_type": policy_type,
            "coverage_types": coverage_types,
            "coverage_limits": limits,
            "deductibles": deductibles,
            "exclusions": exclusions,
            "effective_date": dates.get("effective_date"),
            "expiration_date": dates.get("expiration_date"),
        }

    async def _ask_pdf_json(self, pdf_path: str, prompt: str) -> Dict:
        if not settings.OPENROUTER_API_KEY:
            logger.warning("OPENROUTER_API_KEY is not configured; returning fallback extraction")
            return {}
        try:
            return await chat_pdf_json(
                file_path=pdf_path,
                prompt=prompt,
                system_prompt="Return strictly valid JSON. No markdown.",
            )
        except Exception:
            logger.exception("PDF extraction call failed")
            return {}

    async def extract_policy_type(self, pdf_path: str) -> str:
        parsed = await self._ask_pdf_json(
            pdf_path,
            "Extract policy type. Return JSON: {\"policy_type\": \"...\"}. Use 'unknown' if missing.",
        )
        return str(parsed.get("policy_type", "unknown"))
    
    async def extract_coverage_types(self, pdf_path: str) -> List[str]:
        """
        Extract covered insurance types from policy
        
        Args:
            pdf_path: Path to policy PDF
            
        Returns:
            List of coverage types
        """
        parsed = await self._ask_pdf_json(
            pdf_path,
            "Extract all coverage types listed in the policy. Return JSON: {\"coverage_types\": [\"...\"]}.",
        )
        return parsed.get("coverage_types", []) or []
    
    async def extract_limits_and_deductibles(self, pdf_path: str) -> Tuple[Dict, Dict]:
        """
        Extract coverage limits and deductibles
        
        Args:
            pdf_path: Path to policy PDF
            
        Returns:
            Tuple of (limits_dict, deductibles_dict)
        """
        parsed = await self._ask_pdf_json(
            pdf_path,
            "Extract coverage limits and deductibles. Return JSON: "
            "{\"coverage_limits\": {...}, \"deductibles\": {...}}."
            "If unknown, use empty objects.",
        )
        return parsed.get("coverage_limits", {}) or {}, parsed.get("deductibles", {}) or {}
    
    async def extract_exclusions(self, pdf_path: str) -> List[str]:
        """
        Extract policy exclusions
        
        Args:
            pdf_path: Path to policy PDF
            
        Returns:
            List of exclusions
        """
        parsed = await self._ask_pdf_json(
            pdf_path,
            "Extract policy exclusions. Return JSON: {\"exclusions\": [\"...\"]}. "
            "If none are found, return an empty list.",
        )
        return parsed.get("exclusions", []) or []

    async def extract_policy_dates(self, pdf_path: str) -> Dict:
        parsed = await self._ask_pdf_json(
            pdf_path,
            "Extract effective and expiration dates. Return JSON: "
            "{\"effective_date\": \"YYYY-MM-DD or null\", \"expiration_date\": \"YYYY-MM-DD or null\"}.",
        )
        return {
            "effective_date": parsed.get("effective_date"),
            "expiration_date": parsed.get("expiration_date"),
        }
