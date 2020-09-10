import graphene
import graphql_jwt
import plants.schema
import user.schema

class Query(plants.schema.Query,user.schema.Query, graphene.ObjectType):
    pass

class Mutation(plants.schema.Mutation, user.schema.Mutation, graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    pass

schema = graphene.Schema(query=Query,mutation=Mutation)