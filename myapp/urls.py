from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('productos/', views.productos, name='productos'),
    path('carro/', views.carro, name='carro'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('agregar-al-carrito/<int:juego_id>/', views.agregar_al_carrito, name='agregar_al_carrito'),
    path('actualizar-carrito/<int:item_id>/', views.actualizar_carrito, name='actualizar_carrito'),
    path('eliminar-del-carrito/<int:item_id>/', views.eliminar_del_carrito, name='eliminar_del_carrito'),
    path('api/videojuegos/', views.api_videojuegos, name='api_videojuegos'),
]
