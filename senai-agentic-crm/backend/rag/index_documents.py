from rag.loader import load_documents
from rag.vector_store import collection


def index_documents():

    docs = load_documents()

    for i, doc in enumerate(docs):

        collection.add(
            ids=[str(i)],
            documents=[doc["content"]],
            metadatas=[
                {
                    "source": doc["filename"]
                }
            ]
        )

    print("Documents indexed")


if __name__ == "__main__":
    index_documents()