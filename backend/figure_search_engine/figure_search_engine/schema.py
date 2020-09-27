import graphene

import figure.schema
import user.schema


class Query(figure.schema.Query, user.schema.Query):
    pass


class Mutation(figure.schema.Mutation, user.schema.Mutation):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
