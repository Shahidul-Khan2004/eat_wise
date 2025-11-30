import os
import sys

# Add the Django project to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend', 'eat_wise'))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eat_wise.settings')

# Optimize Django for serverless
os.environ.setdefault('DJANGO_SETTINGS_SKIP_MIGRATIONS_CHECK', '1')

# Import Django WSGI application
from django.core.wsgi import get_wsgi_application

# Create the application (this will be reused across warm starts)
application = get_wsgi_application()

# Vercel expects 'app' as the handler
app = application
