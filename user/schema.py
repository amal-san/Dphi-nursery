import graphene
from graphene_django.types import DjangoObjectType, ObjectType
from .models import User


class UserType(DjangoObjectType):
    class Meta:
        model = User



class Query(ObjectType):
    user = graphene.List(UserType)

    def resolve_user(self,info, **kwargs):
        return User.objects.all()
