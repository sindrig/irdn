import datetime
import json
import os
import urllib.request

webhook_url = os.getenv("SLACK_WEBHOOK_URL")
if not webhook_url:
    raise RuntimeError("Missing SLACK_WEBHOOK_URL")


def handler(event, context):
    today_string = datetime.datetime.now().strftime("%Y-%m-%dT00:00:00")
    response = urllib.request.urlopen(
        urllib.request.Request("https://www.skolamatur.is/json/menu/?school=1686")
    )
    data = json.loads(response.read().decode("utf8"))
    print(data)
    for day in data["Days"]:
        if day["Date"] == today_string:
            print("Found day", day)
            blocks = [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": f"*Hádegi*: <https://www.skolamatur.is/rettir/{day['MainCourseSlug']}|{day['MainCourse']}>",
                    },
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": f"*Vegan*: <https://www.skolamatur.is/rettir/{day['SideCourseSlug']}|{day['SideCourse']}>",
                    },
                },
                {
                    "type": "section",
                    "text": {"type": "mrkdwn", "text": f"*Meðlæti*: {day['Extra']}"},
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": f"*Síðdegi*: {day['Afternoon']}",
                    },
                },
            ]
            message = {"text": day["Name"], "blocks": blocks}
            req = urllib.request.Request(
                webhook_url,
                data=json.dumps(message).encode("utf8"),
                headers={"content-type": "application/json"},
            )
            response = urllib.request.urlopen(req)
            break
    else:
        raise RuntimeError("Did not find day " + today_string)


if __name__ == "__main__":
    handler(None, None)
