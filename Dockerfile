FROM python:3.6-alpine

RUN apk update && apk add python3-dev build-base linux-headers pcre-dev bash
RUN pip install uwsgi

RUN mkdir /code

COPY requirements.txt /code
RUN pip install -r /code/requirements.txt

COPY irdn /code

EXPOSE 80

WORKDIR /code

cmd ["/usr/local/bin/uwsgi", "--http", ":80", "--wsgi-file", "/code/irdn/wsgi.py", "--py-autoreload", "1"]
