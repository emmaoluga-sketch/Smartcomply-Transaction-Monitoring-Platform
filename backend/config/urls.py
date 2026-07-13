from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from django_prometheus import exports
from django.http import HttpResponse

# Health check
def health_check(request):
    return HttpResponse("OK", status=200)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/', include('apps.customers.urls')),
    path('api/v1/', include('apps.transactions.urls')),
    path('api/v1/', include('apps.rules.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('metrics/', exports.ExportToDjangoView, name='prometheus-metrics'),
    path('health/', health_check, name='health-check'),
]