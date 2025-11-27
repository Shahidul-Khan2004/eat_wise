import os
import sys

# Add the Django project to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend', 'eat_wise'))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eat_wise.settings')

# Import Django WSGI application
from django.core.wsgi import get_wsgi_application

# Create the application
application = get_wsgi_application()

# Vercel expects 'app' as the handler
app = application
