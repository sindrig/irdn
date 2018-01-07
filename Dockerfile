FROM python:3.6-alpine

RUN apk update && apk add python3-dev build-base linux-headers pcre-dev bash supervisor nginx nodejs

RUN mkdir /code
RUN mkdir /var/log/supervisor

COPY requirements.txt /code
RUN pip install -r /code/requirements.txt
RUN pip install uwsgi


COPY nginx.conf uwsgi_params /etc/nginx/
COPY supervisor-app.ini /etc/supervisor.d/
COPY supervisord.conf /etc/

COPY irdn /code

EXPOSE 80
EXPOSE 3000

WORKDIR /code

CMD ["supervisord", "-n"]
