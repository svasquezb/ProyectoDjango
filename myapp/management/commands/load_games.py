from django.core.management.base import BaseCommand
from myapp.models import Videojuego
from django.utils.text import slugify

class Command(BaseCommand):
    def handle(self, *args, **options):
        data = [
            {
                "nombre": "The Legend of Zelda: Breath of the Wild",
                "descripcion": "An open-world adventure game where you explore the kingdom of Hyrule.",
                "precio": 5999,
                "stock": 34,
                "foto": "zelda.png"
            },
            {
                "nombre": "Super Mario Odyssey",
                "descripcion": "A platformer game where Mario explores various worlds to save Princess Peach.",
                "precio": 4999,
                "stock": 27,
                "foto": "mario.png"
            },
            {
                "nombre": "Minecraft",
                "descripcion": "A sandbox game where players can build and explore their own worlds.",
                "precio": 2695,
                "stock": 52,
                "foto": "minecraft.png"
            },
            {
                "nombre": "The Witcher 3: Wild Hunt",
                "descripcion": "An open-world RPG where you play as Geralt of Rivia on a quest to find his adopted daughter.",
                "precio": 3999,
                "stock": 19,
                "foto": "witcher.png"
            },
            {
                "nombre": "Red Dead Redemption 2",
                "descripcion": "An open-world game set in the Wild West where you play as Arthur Morgan.",
                "precio": 5999,
                "stock": 22,
                "foto": "red_dead.png"
            },
            {
                "nombre": "Cyberpunk 2077",
                "descripcion": "An open-world RPG set in a dystopian future.",
                "precio": 5999,
                "stock": 15,
                "foto": "cyberpunk.png"
            },
            {
                "nombre": "Fortnite",
                "descripcion": "A battle royale game where players fight to be the last one standing.",
                "precio": 0,
                "stock": 100,
                "foto": "fortnite.png"
            },
            {
                "nombre": "Among Us",
                "descripcion": "A multiplayer game where players work together to complete tasks while impostors try to eliminate them.",
                "precio": 499,
                "stock": 73,
                "foto": "among_us.png"
            },
            {
                "nombre": "Animal Crossing: New Horizons",
                "descripcion": "A life simulation game where players develop their own island.",
                "precio": 5999,
                "stock": 40,
                "foto": "animal_crossing.png"
            },
            {
                "nombre": "Doom Eternal",
                "descripcion": "A first-person shooter where players fight demons in a variety of settings.",
                "precio": 5999,
                "stock": 18,
                "foto": "doom_eternal.png"
            },
            {
                "nombre": "Call of Duty: Modern Warfare",
                "descripcion": "A first-person shooter game set in modern times.",
                "precio": 5999,
                "stock": 30,
                "foto": "cod_mw.png"
            },
            {
                "nombre": "FIFA 21",
                "descripcion": "A soccer simulation game with various modes of play.",
                "precio": 5999,
                "stock": 37,
                "foto": "fifa21.png"
            },
            {
                "nombre": "NBA 2K21",
                "descripcion": "A basketball simulation game with realistic graphics and gameplay.",
                "precio": 5999,
                "stock": 25,
                "foto": "nba2k21.png"
            },
            {
                "nombre": "Grand Theft Auto V",
                "descripcion": "An open-world action-adventure game set in the fictional state of San Andreas.",
                "precio": 2999,
                "stock": 45,
                "foto": "gta_v.png"
            },
            {
                "nombre": "Halo: The Master Chief Collection",
                "descripcion": "A compilation of the Halo series featuring updated graphics and gameplay.",
                "precio": 3999,
                "stock": 28,
                "foto": "halo_mcc.png"
            },
            {
                "nombre": "Resident Evil Village",
                "descripcion": "A survival horror game set in a mysterious village.",
                "precio": 5999,
                "stock": 21,
                "foto": "resident_evil.png"
            },
            {
                "nombre": "Assassin's Creed Valhalla",
                "descripcion": "An open-world game set in the Viking era.",
                "precio": 5999,
                "stock": 33,
                "foto": "ac_valhalla.png"
            },
            {
                "nombre": "Hades",
                "descripcion": "A rogue-like dungeon crawler where players attempt to escape the underworld.",
                "precio": 2499,
                "stock": 50,
                "foto": "hades.png"
            },
            {
                "nombre": "Celeste",
                "descripcion": "A platformer game where players help Madeline climb Celeste Mountain.",
                "precio": 1999,
                "stock": 48,
                "foto": "celeste.png"
            },
            {
                "nombre": "Stardew Valley",
                "descripcion": "A farming simulation game where players manage their own farm.",
                "precio": 1499,
                "stock": 55,
                "foto": "stardew_valley.png"
            }
        ]

        for game_data in data:
            # Asegúrate de que el precio sea un número decimal
            game_data['precio'] = float(game_data['precio'])

            # Genera un slug único
            base_slug = slugify(game_data['nombre'])
            slug = base_slug
            counter = 1
            while Videojuego.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            game_data['slug'] = slug

            Videojuego.objects.create(**game_data)

        self.stdout.write(self.style.SUCCESS('Data loaded successfully'))
