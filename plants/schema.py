import graphene
from graphene_django.types import DjangoObjectType, ObjectType
from .models import Plant
from user.models import User
from django.db.models import Q


class PlantType(DjangoObjectType):
    class Meta:
        model = Plant



class Query(ObjectType):
    otherPlants = graphene.List(PlantType,username=graphene.String())
    plant = graphene.List(PlantType, username=graphene.String())
    plants = graphene.List(PlantType)
    

    def resolve_plant(self, info, **kwargs):
        id = kwargs.get('id')

        if id is not None:
            return Plant.objects.get(pk=id)

        return None

    def resolve_plants(self,info, **kwargs):
        return Plant.objects.all()

    def resolve_otherPlants(self, info, **kwargs ):
        username = kwargs.get('username')
        user = User.objects.get(username=username)

        if username is not None:
            return Plant.objects.filter(~Q(order_placed=user.id) & ~Q(plants_in_cart=user.id))


class PlantInput(graphene.InputObjectType):
    name = graphene.String()
    price = graphene.Int()
    description = graphene.String()
    
class CreatePlant(graphene.Mutation):
    class Arguments:
        name = graphene.String()
        price = graphene.Int()
        description = graphene.String()

    ok = graphene.Boolean()
    plant = graphene.Field(PlantType)

    @staticmethod
    def mutate(root, info, name,price,description):
        ok = True
        plant_instance = Plant(name=name,price=price,description=description)
        plant_instance.save()
        return CreatePlant(ok=ok, plant=plant_instance)

class UpdatePlant(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        input = PlantInput(required=True)

    ok = graphene.Boolean()
    plant = graphene.Field(PlantType)

    @staticmethod
    def mutate(root, info, id, input=None):
        ok = False
        plant_instance = Plant.objects.get(pk=id)
        if plant_instance:
            ok = True
            plant_instance = Plant(name=input.name,price=input.price,description=input.description)
            plant_instance.save()
            return UpdatePlant(ok=ok, plant=plant_instance)
        return UpdatePlant(ok=ok, plant=None)

class Mutation(graphene.ObjectType):
    create_plant = CreatePlant.Field()
    update_plant = UpdatePlant.Field()