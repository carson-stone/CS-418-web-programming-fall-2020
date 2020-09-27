import graphene
from graphene_django import DjangoObjectType

from .models import Figure


class FigureType(DjangoObjectType):
    class Meta:
        model = Figure


class Query(graphene.ObjectType):
    figures = graphene.List(FigureType)

    def resolve_figures(self, info, **kwargs):
        return Figure.objects.all()


class CreateFigure(graphene.Mutation):
    id = graphene.Int()
    title = graphene.String()

    class Arguments:
        title = graphene.String()

    def mutate(self, info, title):
        # === this is how authentication would be used to secure the API ===
        # if info.context.user.is_anonymous:
        #     raise Exception('unauthenticated')

        figure = Figure(title=title)
        figure.save()

        return CreateFigure(id=figure.id, title=figure.title)


class Mutation(graphene.ObjectType):
    create_figure = CreateFigure.Field()
