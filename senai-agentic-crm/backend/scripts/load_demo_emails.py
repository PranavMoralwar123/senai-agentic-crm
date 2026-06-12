import json
import requests

API_URL = "http://127.0.0.1:8000/api/ingest"

JSON_FILE = "email-data-advanced.json"


def main():

    with open(JSON_FILE, "r", encoding="utf-8") as f:
        emails = json.load(f)

    success = 0
    failed = 0

    for email in emails:

        payload = {
            "message_id": email["message_id"],
            "sender": email["sender"],
            "subject": email["subject"],
            "body": email["body"],
            "thread_id": email["thread_id"]
        }

        try:

            response = requests.post(
                API_URL,
                json=payload,
                timeout=30
            )

            if response.status_code == 200:

                success += 1

                print(
                    f"✓ Imported: {email['message_id']}"
                )

            else:

                failed += 1

                print(
                    f"✗ Failed: {email['message_id']}"
                )

                print(response.text)

        except Exception as e:

            failed += 1

            print(
                f"✗ Error: {email['message_id']} -> {e}"
            )

    print("\n========== SUMMARY ==========")

    print(f"Imported: {success}")

    print(f"Failed: {failed}")


if __name__ == "__main__":
    main()