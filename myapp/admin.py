from django.contrib import admin
from .models import UsuarioVideojuego, Videojuego, CarritoItem, Pedido, DetallesPedido

admin.site.register(UsuarioVideojuego)
admin.site.register(Videojuego)
admin.site.register(CarritoItem)
admin.site.register(Pedido)
admin.site.register(DetallesPedido)