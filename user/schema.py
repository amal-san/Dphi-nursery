import graphene
from graphene_django.types import DjangoObjectType, ObjectType
from .models import User,Record


class UserType(DjangoObjectType):
    class Meta:
        model = User


class RecordType(DjangoObjectType):
    class Meta:
        model = Record



class Query(ObjectType):
    user = graphene.List(UserType)
    record = graphene.List(RecordType)

    def resolve_user(self,info, **kwargs):
        return User.objects.all()
    
    def resolve_record(self,info, **kwargs):
        return Record.objects.all()
