from django.http import JsonResponse
from django.shortcuts import render,redirect
from django.contrib.auth import login, authenticate, logout
from .models import Videojuego 
from .forms import LoginForm, RegisterForm
from django.contrib import messages



def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({'success': True, 'message': f'Bienvenido {username}!'})
            else:
                return JsonResponse({'success': False, 'message': 'Credenciales inválidas.'})
        else:
            return JsonResponse({'success': False, 'message': 'Formulario inválido.'})
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})

def index(request):
    return render(request, 'index.html')

def productos(request):
    videojuegos = Videojuego.objects.all()
    return render(request, 'productos.html', {'videojuegos': videojuegos})

def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return JsonResponse({'success': True, 'message': 'Registro exitoso.'})
        else:
            errors = dict(form.errors.items())
            return JsonResponse({'success': False, 'errors': errors})
    else:
        form = RegisterForm()
    return render(request, 'register.html', {'form': form})
        

def logout_view(request):
    logout(request)
    messages.success(request, 'Has cerrado sesión exitosamente.')
    return redirect('index')

def carro(request):
    return render(request, 'carro.html')

def detallejuego(request):
    return render(request, 'detalleJuego.html')

