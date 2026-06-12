from rag.vector_store import collection


def search_documents(query: str):

    results = collection.query(
        query_texts=[query],
        n_results=3
    )

    return results


if __name__ == "__main__":

    result = search_documents(
        "refund policy"
    )

    print(result)