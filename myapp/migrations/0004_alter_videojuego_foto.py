# Generated by Django 5.0.7 on 2024-07-18 04:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0003_alter_videojuego_foto'),
    ]

    operations = [
        migrations.AlterField(
            model_name='videojuego',
            name='foto',
            field=models.ImageField(blank=True, null=True, upload_to='myapp/static/img/'),
        ),
    ]