from django.urls import path
from . import views

urlpatterns = [
    path('', views.path_finding, name='path-finding')
]
