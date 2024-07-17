from django.urls import path
from . import views
urlpatterns =[
    path('' , views.index, name='index'),
    path('productos/' , views.productos , name='productos'),
    path('carro/' , views.carro , name='carro'),
    path('detalleJuego/' , views.detallejuego , name='detalleJuego'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),

]