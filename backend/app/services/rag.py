import os
import re
from typing import List, Dict, Tuple
from app.schemas.chat import SourceCitation

class RAGPipeline:
    """
    RAG Pipeline for Cooperative Governance and Legal Documents.
    Parses sections from knowledge corpus, creates index, and retrieves relevant
    clauses with exact section and act metadata.
    """
    def __init__(self, corpus_dir: str = "data/corpus"):
        self.corpus_dir = corpus_dir
        self.documents: List[Dict[str, str]] = []
        self._load_corpus()

    def _load_corpus(self):
        # Resolve path relative to backend root
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        full_corpus_path = os.path.join(base_dir, self.corpus_dir)
        
        if not os.path.exists(full_corpus_path):
            os.makedirs(full_corpus_path, exist_ok=True)
            return

        for fname in os.listdir(full_corpus_path):
            if fname.endswith(".txt") or fname.endswith(".md"):
                fpath = os.path.join(full_corpus_path, fname)
                try:
                    with open(fpath, "r", encoding="utf-8") as f:
                        text = f.read()
                        self._parse_sections(text, fname)
                except Exception as e:
                    print(f"Error loading corpus file {fname}: {e}")

    def _parse_sections(self, text: str, filename: str):
        # Parse DOCUMENT, ACT_OR_SCHEME, SECTION blocks
        act_match = re.search(r"ACT_OR_SCHEME:\s*(.+)", text)
        act_name = act_match.group(1).strip() if act_match else filename

        doc_match = re.search(r"DOCUMENT:\s*(.+)", text)
        doc_name = doc_match.group(1).strip() if doc_match else filename

        sections = re.split(r"SECTION:\s*", text)
        for sec in sections[1:]:
            lines = sec.strip().split("\n")
            section_title = lines[0].strip()
            content = "\n".join(lines[1:]).replace("CONTENT:", "").strip()
            
            self.documents.append({
                "document": doc_name,
                "act_or_scheme": act_name,
                "section": section_title,
                "content": content,
                "full_text": f"{doc_name} {act_name} {section_title} {content}".lower()
            })

    def search(self, query: str, top_k: int = 3) -> Tuple[List[str], List[SourceCitation]]:
        if not self.documents:
            self._load_corpus()

        query_terms = [w.lower() for w in re.findall(r"\w+", query) if len(w) > 2]
        scored_docs = []

        for doc in self.documents:
            score = 0
            doc_text = doc["full_text"]
            for term in query_terms:
                if term in doc_text:
                    # Give higher weight if term appears in section title or act name
                    if term in doc["section"].lower() or term in doc["act_or_scheme"].lower():
                        score += 3
                    else:
                        score += 1
            if score > 0:
                scored_docs.append((score, doc))

        # Sort by relevance score descending
        scored_docs.sort(key=lambda x: x[0], reverse=True)
        top_matches = scored_docs[:top_k] if scored_docs else [(1, d) for d in self.documents[:top_k]]

        context_chunks = []
        citations = []

        for _, doc in top_matches:
            chunk = f"[{doc['act_or_scheme']} - {doc['section']}]\n{doc['content']}"
            context_chunks.append(chunk)
            citations.append(SourceCitation(
                title=doc["document"],
                section=doc["section"],
                excerpt=doc["content"][:220] + "...",
                act_or_scheme=doc["act_or_scheme"]
            ))

        return context_chunks, citations

rag_pipeline = RAGPipeline()
