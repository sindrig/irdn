FROM python:3.6-alpine

RUN apk update && apk add uwsgi-python

RUN mkdir /code

COPY requirements.txt /code
RUN pip install -r /code/requirements.txt

COPY irdn /code/irdn

EXPOSE 80

cmd ["/usr/local/bin/uwsgi", "--http", ":80", "--wsgi-file", "/code/irdn/irdn/wsgi.py", "--py-autoreload", "1"]
