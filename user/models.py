from django.db import models
from django.contrib.auth.models import AbstractUser
from plants.models import Plant



class User(AbstractUser):
    isManager = models.BooleanField(null=True)
    cart = models.ManyToManyField(Plant,related_name="plants_in_cart")
    order_placed = models.ManyToManyField(Plant,related_name="order_placed")
    pass

    def __str__(self):
        return self.username


class Record(models.Model):
    order_user = models.ForeignKey(User,on_delete=models.CASCADE)
    order_plant = models.ForeignKey(Plant,on_delete=models.CASCADE)

    pass

