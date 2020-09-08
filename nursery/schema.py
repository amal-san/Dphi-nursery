import graphene
import plants.schema
import user.schema

class Query(plants.schema.Query,user.schema.Query, graphene.ObjectType):
    pass

class Mutation(plants.schema.Mutation, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query,mutation=Mutation)