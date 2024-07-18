from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.contrib import messages
from .models import Videojuego, CarritoItem
from .forms import LoginForm, RegisterForm
from django.conf import settings


def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({'success': True, 'message': f'Bienvenido {username}!', 'username': username})
            else:
                return JsonResponse({'success': False, 'message': 'Credenciales inválidas.'})
        else:
            return JsonResponse({'success': False, 'message': 'Formulario inválido.'})
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})

def index(request):
    return render(request, 'index.html')

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

@login_required
def carro(request):
    items = CarritoItem.objects.filter(usuario=request.user)
    total = sum(item.videojuego.precio * item.cantidad for item in items)
    return render(request, 'carro.html', {'items': items, 'total': total})

def productos(request):
    videojuegos = Videojuego.objects.all()
    return render(request, 'productos.html', {'videojuegos': videojuegos})

@login_required
@require_POST
def agregar_al_carrito(request, juego_id):
    juego = get_object_or_404(Videojuego, id=juego_id)
    carrito_item, created = CarritoItem.objects.get_or_create(
        usuario=request.user,
        videojuego=juego
    )
    if not created:
        carrito_item.cantidad += 1
        carrito_item.save()
    return JsonResponse({
        'status': 'success', 
        'message': 'Juego agregado al carrito',
        'item_id': carrito_item.id
    })

@login_required
@require_POST
def actualizar_carrito(request, item_id):
    item = get_object_or_404(CarritoItem, id=item_id, usuario=request.user)
    quantity = int(request.POST.get('quantity', 1))
    if quantity > 0:
        item.cantidad = quantity
        item.save()
    else:
        item.delete()
    return JsonResponse({'status': 'success'})

@login_required
@require_POST
def eliminar_del_carrito(request, item_id):
    item = get_object_or_404(CarritoItem, id=item_id, usuario=request.user)
    item.delete()
    return JsonResponse({'status': 'success'})

def api_videojuegos(request):
    videojuegos = Videojuego.objects.all().values('id', 'nombre', 'descripcion', 'precio', 'stock', 'foto')
    for juego in videojuegos:
        if juego['foto']:
            juego['foto'] = settings.STATIC_URL + 'img/' + juego['foto'].split('/')[-1]
    return JsonResponse(list(videojuegos), safe=False)
