from django.db import models


class Plant(models.Model):
    name = models.CharField(max_length=100,null=False)
    price = models.IntegerField(null=False,blank=False)
    description = models.CharField(max_length=300,blank=False)
    photo = models.ImageField(upload_to='media',max_length=100,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ('name',)
