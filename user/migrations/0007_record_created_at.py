# Generated by Django 3.1.1 on 2020-09-10 04:57

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0006_auto_20200910_0324'),
    ]

    operations = [
        migrations.AddField(
            model_name='record',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]