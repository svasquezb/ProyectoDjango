from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm

# Create your views here.

def login(request):
    return render(request, 'login.html', {
        'form' : UserCreationForm
    })

def index(request):
    return render(request, 'index.html')

def productos(request):
    return render(request, 'productos.html')

def register(request):
    return render(request, 'register.html')

def carro(request):
    return render(request, 'carro.html')

def detallejuego(request):
    return render(request, 'detalleJuego.html')