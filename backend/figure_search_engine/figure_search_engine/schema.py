import graphene

import figure.schema


class Query(figure.schema.Query, graphene.ObjectType):
    pass


class Mutation(figure.schema.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
