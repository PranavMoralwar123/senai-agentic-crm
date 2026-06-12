from pathlib import Path


def load_documents():

    kb_path = Path("../knowledge_base")

    documents = []

    for file in kb_path.glob("*.md"):

        with open(file, "r", encoding="utf-8") as f:

            content = f.read()

            documents.append(
                {
                    "filename": file.name,
                    "content": content
                }
            )

    return documents


if __name__ == "__main__":

    docs = load_documents()

    for doc in docs:
        print(doc["filename"])