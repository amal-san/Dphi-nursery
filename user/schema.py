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
    user_details = graphene.Field(UserType,username=graphene.String())
    user = graphene.List(UserType)
    record = graphene.List(RecordType)

    def resolve_user_details(self, info, **kwargs):
        username = kwargs.get('username')

        if username is not None:
            return User.objects.get(username=username)

        return None

    def resolve_user(self,info, **kwargs):
        return User.objects.all()
    
    def resolve_record(self,info, **kwargs):
        return Record.objects.all()
