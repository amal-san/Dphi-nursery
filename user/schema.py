import graphene
from graphene_django.types import DjangoObjectType, ObjectType
from .models import User,Record
from plants.models import Plant



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


class UserInput(graphene.InputObjectType):
    username = graphene.String()
    password = graphene.String()


class AddCartInput(graphene.InputObjectType):
    username = graphene.String();
    plant_id = graphene.Int();

class CreateUser(graphene.Mutation):
    class Arguments:
        input = UserInput(required=True)

    ok = graphene.Boolean()
    User = graphene.Field(UserType)

    @staticmethod
    def mutate(root, info, input=None):
        ok = True
        user=User.objects.create_user(input.username, password=input.password)
        user.save()
        return CreateUser(ok=ok, User=user)



class AddtoCart(graphene.Mutation):

    class Arguments:
        input = AddCartInput(required=True)

    ok = graphene.Boolean()
    User = graphene.Field(UserType)

    @staticmethod
    def mutate(root,info, input):
        ok = True
        plant = Plant.objects.get(pk=input.plant_id)
        user = User.objects.get(username=input.username)
        user.cart.add(plant)
        return AddtoCart(ok=ok, User=user)



class OrderPlant(graphene.Mutation):

    class Arguments:
        input = AddCartInput(required=True)

    ok = graphene.Boolean()
    User = graphene.Field(UserType)

    @staticmethod
    def mutate(root,info, input):
        ok = True
        plant = Plant.objects.get(pk=input.plant_id)
        user = User.objects.get(username=input.username)
        user.order_placed.add(plant)
        newRecord = Record(order_user=user,order_plant=plant)
        newRecord.save()
        return OrderPlant(ok=ok, User=user)


class Mutation(graphene.ObjectType):
    add_to_cart = AddtoCart.Field()
    create_user = CreateUser.Field()
    order_plant = OrderPlant.Field()
    
