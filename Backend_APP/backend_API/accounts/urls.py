from django.urls import path
from . import views
from .views import list_user_files

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.user_login, name='login'),
    path('upload_csv/', views.upload_csv, name='upload_csv'),
    path('get_data/', views.get_data, name='get_data'),
    path('list_user_files/', list_user_files, name='list_user_files')
]
