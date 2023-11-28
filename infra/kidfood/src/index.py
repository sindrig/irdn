import asyncio
import datetime
import itertools
import json
import os
import urllib.request

import bs4
import httpx

webhook_url = os.getenv("SLACK_WEBHOOK_URL")
if not webhook_url:
    raise RuntimeError("Missing SLACK_WEBHOOK_URL")


def text_section(text):
    return {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": text,
        },
    }


async def furuskogur(d: datetime.datetime):
    today_string = d.strftime("%Y-%m-%dT00:00:00")

    async with httpx.AsyncClient() as client:
        r = await client.get(
            "https://www.skolamatur.is/json/menu/?school=1686",
        )
        r.raise_for_status()
        data = r.json()
    print(data)
    for day in data["Days"]:
        if day["Date"] == today_string:
            print("Found day", day)
            return [
                {
                    "type": "header",
                    "text": {
                        "type": "plain_text",
                        "text": "Furuskógur",
                    },
                },
                text_section(
                    f"*Hádegi*: <https://www.skolamatur.is/rettir/{day['MainCourseSlug']}|{day['MainCourse']}>",
                ),
                text_section(
                    f"*Vegan*: <https://www.skolamatur.is/rettir/{day['SideCourseSlug']}|{day['SideCourse']}>"
                ),
                text_section(f"*Meðlæti*: {day['Extra']}"),
                text_section(f"*Síðdegi*: {day['Afternoon']}"),
            ]
    else:
        return [text_section("Could not find menu for furuskogur")]


months = [
    "Janúar",
    "Febrúar",
    "Mars",
    "Apríl",
    "Maí",
    "Júní",
    "Júlí",
    "Ágúst",
    "September",
    "Október",
    "Nóvember",
    "Desember",
]


async def fossvogsskoli(d: datetime.datetime):
    async with httpx.AsyncClient() as client:
        r = await client.get(
            "https://www.herinn.is/is/matsedill",
        )
        r.raise_for_status()
        soup = bs4.BeautifulSoup(r.text, features="html.parser")
    entry = soup.find("div", {"class": "entryContent"})
    if not entry:
        return [text_section("Could not find entry for fossvogsskoli")]
    exp_header = f"{d.day}. {months[d.month - 1]}".upper()
    found = False
    blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "Fossvogsskóli",
            },
        },
    ]
    for line in entry.text.splitlines():
        if exp_header in line:
            found = True
        elif found:
            if line.strip():
                blocks.append(text_section(line.strip()))
            else:
                break

    return blocks


async def divider():
    return [{"type": "divider"}]


async def main():
    today = datetime.datetime.now()

    # message = {"text": day["Name"], "blocks": furuskogur(today)}
    parts = await asyncio.gather(furuskogur(today), divider(), fossvogsskoli(today))
    message = {"blocks": list(itertools.chain(*parts))}
    req = urllib.request.Request(
        webhook_url,
        data=json.dumps(message).encode("utf8"),
        headers={"content-type": "application/json"},
    )
    urllib.request.urlopen(req)

    # {"type": "divider"},
    # {
    #     "type": "header",
    #     "text": {
    #         "type": "plain_text",
    #         "text": "Fossvogsskóli",
    #     },
    # },


def handler(event, context):
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
    loop.run_until_complete(main())


if __name__ == "__main__":
    handler(None, None)
