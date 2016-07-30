FROM python:2.7.12-wheezy

WORKDIR /src

COPY . /src

RUN pip install tox
RUN tox -e flake8