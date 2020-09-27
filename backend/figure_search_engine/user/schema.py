from django.contrib.auth import get_user_model

import graphene
from graphene_django import DjangoObjectType


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        email = graphene.String(required=True)
        phone = graphene.String(required=-True)
        password = graphene.String(required=True)
        interest = graphene.String(required=True)

    def mutate(self, info, email, phone, password, interest):
        user = get_user_model()(
            email=email,
            phone=phone,
            password=password,
            interest=interest
        )

        user.set_password(password)
        user.save()

        return CreateUser(user=user)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
