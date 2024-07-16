from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm
from .models import Videojuego 

# Create your views here.

def login(request):
    return render(request, 'login.html', {
        'form' : UserCreationForm
    })

def index(request):
    return render(request, 'index.html')

def productos(request):
    videojuegos = Videojuego.objects.all()
    return render(request, 'productos.html', {'videojuegos': videojuegos})

def register(request):
    return render(request, 'register.html')

def carro(request):
    return render(request, 'carro.html')

def detallejuego(request):
    return render(request, 'detalleJuego.html')

