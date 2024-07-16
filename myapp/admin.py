from django.contrib import admin
from .models import Usuario, Categoria, Videojuego, Carrito, ItemCarrito, Orden, ItemOrden

# Register your models here.
admin.site.register(Usuario)
admin.site.register(Categoria)
admin.site.register(Videojuego)
admin.site.register(Carrito)
admin.site.register(ItemCarrito)
admin.site.register(Orden)
admin.site.register(ItemOrden)