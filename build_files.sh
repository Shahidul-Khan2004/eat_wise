#!/bin/bash
# Install dependencies
pip install -r requirements.txt

# Run migrations on Supabase database
cd backend/eat_wise && python3.9 manage.py migrate --noinput