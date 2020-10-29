import graphene
from graphene_django import DjangoObjectType
from elasticsearch import Elasticsearch
import uuid

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
        figure = Figure(title=title)
        figure.save()

        return CreateFigure(id=figure.id, title=figure.title)


class Search(graphene.Mutation):
    figures = graphene.List(FigureType)

    class Arguments:
        description = graphene.String()
        object = graphene.String(required=False)
        patent_id = graphene.String(required=False)
        aspect = graphene.String(required=False)

    def mutate(self, info, description, object="", patent_id="", aspect=""):
        es = Elasticsearch()

        body = {
            "query": {
                "bool": {
                    "should": [
                        {"match": {"description": {"query": f"{description}"}}},
                        {"match": {"object": {"query": f"{object}", "boost": 5}}},
                        {"match": {"patentID": {"query": f"{patent_id}", "boost": 10}}},
                        {"match": {"aspect": {"query": f"{aspect}"}}},
                    ]
                }
            },
            "size": 50,
        }

        results = es.search(index="figures", body=body)
        figures = results["hits"]["hits"]

        return Search(
            figures=[
                Figure(
                    patent_id=figure["_source"]["patentID"],
                    object=figure["_source"]["object"],
                )
                for figure in figures
            ]
        )


class Index(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        description = graphene.String(required=True)
        object = graphene.String(required=True)
        patent_id = graphene.String(required=True)
        aspect = graphene.String(required=True)

    def mutate(self, info, description, object, patent_id, aspect):
        es = Elasticsearch()

        body = {
            "description": description,
            "object": object,
            "patentID": patent_id,
            "aspect": aspect,
        }

        try:
            results = es.index(index="figures", id=uuid.uuid4(), body=body)
            return Index(ok=True)

        except:
            return Index(ok=False)


class Mutation(graphene.ObjectType):
    create_figure = CreateFigure.Field()
    search = Search.Field()
    index = Index.Field()
