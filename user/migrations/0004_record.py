# Generated by Django 3.1.1 on 2020-09-08 08:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('plants', '0002_auto_20200908_0517'),
        ('user', '0003_auto_20200908_0528'),
    ]

    operations = [
        migrations.CreateModel(
            name='Record',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_plant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='plants.plant')),
                ('order_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
