FROM python:3.12

ARG SECRET_KEY
ENV SECRET_KEY=$SECRET_KEY
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /app

RUN apt-get update && \
    apt-get install -y libmariadb3 libmariadb-dev nano && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app
RUN pip install --upgrade pip setuptools wheel cffi \
    && pip install -r requirements.txt

COPY . .

# Collect static files during the build process
RUN python manage.py collectstatic --noinput && \
    chmod -R 755 /static && \
    chown -R www-data:www-data /static

EXPOSE 8000

CMD ["gunicorn", "-c", "./gunicorn_config.py", "backend.wsgi:application"]
