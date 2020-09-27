import graphene

import figure.schema
import user.schema


class Query(figure.schema.Query, graphene.ObjectType):
    pass


class Mutation(figure.schema.Mutation, user.schema.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
