from django.urls import path
from . import views
urlpatterns =[
    path('' , views.index, name='index'),
    path('login/' , views.login , name='login'),
    path('productos/' , views.productos , name='productos'),
    path('register/' , views.register , name='register'),
    path('carro/' , views.carro , name='carro'),
    path('detalleJuego/' , views.detallejuego , name='detalleJuego'),

]