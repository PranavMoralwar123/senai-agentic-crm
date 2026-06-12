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
def get_top_policy(query):

    results = search_documents(query)

    return {
        "source":
            results["metadatas"][0][0]["source"],

        "content":
            results["documents"][0][0]
    }
