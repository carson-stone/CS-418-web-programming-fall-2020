import graphene
import graphql_jwt

import figure.schema
import user.schema


class Query(figure.schema.Query, user.schema.Query):
    pass


class Mutation(figure.schema.Mutation, user.schema.Mutation):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
