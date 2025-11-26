#!/bin/bash
python3 -m pip install -r requirements.txt
# Optionally run database migrations
python3 manage.py makemigrations
python3 manage.py migrate